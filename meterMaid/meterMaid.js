// meterMaid is designed to poll Honeywell wifi thermostats for current settings and readings.  It utilizes an older API to access the thermostats and their settings and readings in a database for later use.

// program structure....
// 1.  get the userid and password for logging into the Honeywell platform.
// 2.  use the API to request all locations and current reading for each location.  The current Honeywell API returns XML.
// 3.  parse through the XML and construct valid database records for insertion into the target database tables.
// 4.  insert the validated rows into the target tables.
// 5.  insert an entry in the activity log to record the polling activity.

var mysql = require('mysql');

// Get user id and password.....// TODO: encrypt/decrypt for security
var fsIdPass = require('fs');
var idPassRecord = '';

// Use synchronous read as we really can't do anything else until we have the userId and password....
idPassRecord = fsIdPass.readFileSync('myThermostats.txt', 'utf8');

var userIdPass = idPassRecord.split("|");
var trimmedUserPass = userIdPass[1].trim();

// Now format then make the request for a sessionId....using curl
var curlRequest = `curl -s -k -X 'POST' -H 'Content-Type: application/x-www-form-urlencoded' -H 'User-Agent: Apache-HttpClient/UNAVAILABLE (java 1.4)' --data-binary $'ApplicationID=a0c7a795-ff44-4bcd-9a99-420fac57ff04&ApplicationVersion=2&Username=${userIdPass[0]}&UiLanguage=English&Password=${trimmedUserPass}' 'https://tccna.honeywell.com/ws/MobileV2.asmx/AuthenticateUserLogin'`

// need to ask the OS to exec the curl command for us...
var util = require('util');
var exec = require('child_process').exec;
var parseString = require('xml2js').parseString;

var command = curlRequest;
var xmlResponse = "";

//stdout is the response from the OS.  In this case it will be XML.
child = exec(command, function(error, xmlResponse, stderr){
  console.log("AuthenticateUserLogin...")
  // console.log('stdout: ' + xmlResponse);
  console.log('stderr: ' + stderr);

  if(error !== null) {
    console.log('exec error: ' + error);
  };

  var sessionID = '';

  parseString(xmlResponse, function (error, result) {
      console.log("parsing");
      // console.log(result);
      console.log(error);
      sessionID = result.AuthenticateLoginResult.SessionID;
  });

// Now use the sessionID to poll this user's account and get readings for all thermostats....
  curlRequest = `curl -H "Accept: application/xml" -H "Content-Type: application/xml" -X GET 'https://tccna.honeywell.com//ws/MobileV2.asmx/GetLocations?sessionID=${sessionID}'`;

  command = curlRequest;
  child = exec(command, function(error, xmlResponse, stderr){
    console.log("GetLocations...")
    // console.log('stdout: ' + xmlResponse);
    console.log('stderr: ' + stderr);

    if(error !== null) {
      console.log('exec error: ' + error);
    };

    saveReadings(xmlResponse);

  });  // curl for GetLocations

  // logoff the session with Honeywell
  curlRequest = `curl -H "Accept: application/xml" -H "Content-Type: application/xml" -X GET 'https://tccna.honeywell.com//ws/MobileV2.asmx/LogOff?sessionID=${sessionID}'`;

  command = curlRequest;
  child = exec(command, function(error, xmlResponse, stderr){
    console.log ("LogOff...")
    // console.log('stdout: ' + xmlResponse);
    console.log('stderr: ' + stderr);

    if(error !== null) {
      console.log('exec error: ' + error);
    };

  });  // curl for Logoff
}); // curl for sessionID

function saveReadings(userLocationData) {
  console.log(`saveReadings...${userLocationData}`);

  parseString(userLocationData, function (error, result) {
      console.log("parsing userLocationData...");
      // console.log(result);
      var theData = result.GetLocationsResult.Locations[0].LocationInfo[0].Thermostats[0].ThermostatInfo[0].UI[0]
      console.log(theData.DispTemperature);
      console.log(error);
  });

}

// simple connect test.....PASSED!
// var mysql = require('mysql');
//
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'meterMiser'
// });
//
// connection.connect();
//
// connection.query('SELECT * from Users', function (err, rows, fields) {
//   if (err) throw err
//
//   console.log(rows[0]);
// });
//
// connection.end();

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
console.log(idPassRecord);

var userIdPass = idPassRecord.split("|");
var trimmedUserPass = userIdPass[1].trim();

console.log(trimmedUserPass);

// Now format then make the request for a sessionId....using curl
var curlRequest = `curl -s -k -X 'POST' -H 'Content-Type: application/x-www-form-urlencoded' -H 'User-Agent: Apache-HttpClient/UNAVAILABLE (java 1.4)' --data-binary $'ApplicationID=a0c7a795-ff44-4bcd-9a99-420fac57ff04&ApplicationVersion=2&Username=yankeesoccernut@gmail.com&UiLanguage=English&Password=f3mJsb29AVYe' 'https://tccna.honeywell.com/ws/MobileV2.asmx/AuthenticateUserLogin'`

// need to ask the OS to exec the curl command for us...
var util = require('util');
var exec = require('child_process').exec;

var command = curlRequest;
var xmlResponse = "";

//stdout is the response from the OS.  In this case it will be XML.
child = exec(command, function(error, xmlResponse, stderr){
  console.log('stdout: ' + xmlResponse);
  console.log('stderr: ' + stderr);

  if(error !== null) {
    console.log('exec error: ' + error);
  }
  var parseString = require('xml2js').parseString;
  parseString(xmlResponse, function (error, result) {
      console.log("parsing");
      console.log(result);
      console.log(error);
      console.log(`SessionID:  ${result.AuthenticateLoginResult.SessionID}`);
  });
});

// parse the XML and get the Session ID...we'll use this for subsequent requests
// var request = require('request');
// var returnedHTMLBody = '';
// var baseURL = 'https://tccna.honeywell.com/ws/MobileV2.asmx?AuthenticateUserLogin';
//
// var applicationId = 'a0c7a795-ff44-4bcd-9a99-420fac57ff04';
// var applicationVersion = '2';
// var language = 'English';
//
// var targetURL = `${baseURL}&ApplicationID=${applicationId}&ApplicationVersion=${applicationVersion}&UiLanguage=&${language}&Username=${userIdPass[0]}&Password=${trimmedUserPass}`;
//
// console.log(targetURL);
//
//
// request({
//     url: `${baseURL}&ApplicationID=${applicationId}&ApplicationVersion=${applicationVersion}&UiLanguage=&${language}&Username=${userIdPass[0]}&Password=${trimmedUserPass}`,
//     method: "POST",
//     headers: {
//         "Host": "tccna.honeywell.com",
//         "User-Agent": "Apache-HttpClient/UNAVAILABLE (java 1.4)",
//         "content-type": "application/x-www-form-urlencoded",
//     },
//     body: returnedHTMLBody
// }, function (error, response, body){
//     console.log(error);
//     console.log(response);
// });






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

// meterMaid is designed to poll Honeywell wifi thermostats for current settings and readings.  It utilizes an older API to access the thermostats and their settings and readings in a database for later use.

// program structure....
// 1.  get the userid and password for logging into the Honeywell platform.
// 2.  use the API to request all locations and current reading for each location.  The current Honeywell API returns XML.
// 3.  parse through the XML and construct valid database records for insertion into the target database tables.
// 4.  insert the validated rows into the target tables.
// 5.  insert an entry in the activity log to record the polling activity.

// Get user id and password.....// TODO: encrypt/decrypt for security
var fsIdPass = require('fs');
var idPassRecord = '';

// Use synchronous read as we really can't do anything else until we have the userId and password....
idPassRecord = fsIdPass.readFileSync('myThermostats.txt', 'utf8');
console.log(idPassRecord);

var userIdPass = idPassRecord.split("|");
var trimmedUserPass = userIdPass[1].trim();

console.log(trimmedUserPass);

// Now format then make the request....
var request = require('request');
var returnedHTMLBody = '';
var baseURL = 'https://tccna.honeywell.com/ws/MobileV2.asmx?AuthenticateUserLogin';

var applicationId = 'a0c7a795-ff44-4bcd-9a99-420fac57ff04';
var applicationVersion = '2';
var language = 'English';

var targetURL = `${baseURL}&ApplicationID=${applicationId}&ApplicationVersion=${applicationVersion}&UiLanguage=&${language}&Username=${userIdPass[0]}&Password=${trimmedUserPass}`;

console.log(targetURL);


request({
    url: `${baseURL}&ApplicationID=${applicationId}&ApplicationVersion=${applicationVersion}&UiLanguage=&${language}&Username=${userIdPass[0]}&Password=${trimmedUserPass}`,
    method: "POST",
    headers: {
        "Host": "tccna.honeywell.com",
        "User-Agent": "Apache-HttpClient/UNAVAILABLE (java 1.4)",
        "content-type": "application/x-www-form-urlencoded",
    },
    body: returnedHTMLBody
}, function (error, response, body){
    console.log(error);
    console.log(response);
});






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

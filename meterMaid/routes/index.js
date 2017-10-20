var express = require('express');
var router = express.Router();
var request = require('request');


function hasQueryString(req) {

  if (Object.keys(req.query).length == 0) {
    return false;
  }

  return true;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/meterMiser', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

router.get('/Users', function(req, res, next) {

  var mysql = require('mysql');

  // open up the database connection...
  var dbConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'meterMiser'
  });
  dbConnection.connect();

  var selectUsersSQL = '';

  if (hasQueryString(req)) {
    selectUsersSQL = `SELECT * FROM Users WHERE email = ${(req.query.email)}`;
  } else {
    selectUsersSQL = `SELECT * FROM Users`;
  };


  dbConnection.query(selectUsersSQL, function (err, result) {
    if (err){
      console.log(err);
    } else {
    console.log("Locations record selected");
    }
    res.send(result);

    // Close the database connection...
    dbConnection.end();

  });
});

router.get('/Locations', function(req, res, next) {
  // See if any parameters passed in with a query..../?parm1=val&parm2
  // Only valid one here is a locationId

  var selectLocationsSQL = '';

  if (hasQueryString(req)) {
    selectLocationsSQL = `SELECT * FROM Locations WHERE locationId = ${parseInt(req.query.locationId)}`;
  } else {
    selectLocationsSQL = `SELECT * FROM Locations`;
  };

  var mysql = require('mysql');

  // open up the database connection...
  var dbConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'meterMiser'
  });
  dbConnection.connect();

  dbConnection.query(selectLocationsSQL, function (err, result) {
    if (err){
      console.log(err);
    } else {
    console.log("Locations record selected");
    }
    res.send(result);

    // Close the database connection...
    dbConnection.end();
  });
});

router.get('/Thermostats', function(req, res, next) {
  // Supports all thermostats for user,  all thermostats for user for a location, or a specific thermostat for the user

  if (hasQueryString(req)) {
    var thermostatId = parseInt(req.query.thermostatId);
    var locationId = parseInt(req.query.locationId);
    if ((thermostatId > 0) && (locationId > 0)){
      console.log("WAT? One or the other, not both")
    } else if (thermostatId > 0) {
      selectThermostatsSQL = `SELECT * FROM Thermostats WHERE thermostatId = ${parseInt(req.query.thermostatId)}`;
    } else if (locationId > 0) {
      selectThermostatsSQL = `SELECT * FROM Thermostats WHERE locationId = ${parseInt(req.query.locationId)}`;
    } else {
      console.log("WAT? Query string doesn't make sense")
    };
  } else {
    var selectThermostatsSQL = `SELECT * FROM Thermostats`;
  };

  var mysql = require('mysql');

  // open up the database connection...
  var dbConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'meterMiser'
  });
  dbConnection.connect();

  // Send the SQL...
  dbConnection.query(selectThermostatsSQL, function (err, result) {
    if (err){
      console.log(err);
    } else {
    console.log("Thermostat record selected");
    }
    res.send(result);

    // Close the database connection...
    dbConnection.end();

  });
});


router.get('/Readings', function(req, res, next) {
  // Supports All Readings, Readings for a Thermostat across ALL time
  // Also supports All Readings, Readings for a Thermostat BETWEEN Start and End Dates (Inclusive).  Dates come in Gregorian Format - 'CCYY-MM-DD'
  var thermostatId = 0;
  var startDate = '';
  var endDate = '';

  if (hasQueryString(req)) {
    var thermostatId = parseInt(req.query.thermostatId);
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;

    if ((thermostatId > 0) && (startDate > '') && (endDate > '')){
      console.log("Specific query with all query string properties...")
      selectReadingsSQL = `SELECT * FROM Readings WHERE thermostatId = ${thermostatId} AND thermCreated >= ${startDate} AND thermCreated <= ${endDate}`;
    } else if ((startDate > '') && (endDate > '')) {
      selectReadingsSQL = `SELECT * FROM Readings WHERE thermCreated >= ${startDate} AND thermCreated <= ${endDate}`;
    } else if ((startDate > '') || (endDate > '')) {  // query string incorrect
      console.log("Unsupported query string combination for Readings table");
    } else if (thermostatId > 0) {
      selectReadingsSQL = `SELECT * FROM Readings WHERE thermostatId = ${thermostatId}`;
    } else {
      console.log("WAT? Unsupported query string");
    };
  } else {
    var selectReadingsSQL = `SELECT * FROM Readings`;
  };

  var mysql = require('mysql');

  // open up the database connection...
  var dbConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'meterMiser'
  });
  dbConnection.connect();

  dbConnection.query(selectReadingsSQL, function (err, result) {
    if (err){
      console.log(err);
    } else {
    console.log("Locations record selected");
    }
    res.send(result);

    // Close the database connection...
    dbConnection.end();

  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var request = require('request');

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
    password : '',
    database : 'meterMiser'
  });
  dbConnection.connect();

  var selectLocationsSQL = `SELECT * FROM Users`;

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

router.get('/Locations', function(req, res, next) {
  // let's test out a query of Locations table.....

  console.log("hit /meterMiser route");
  var mysql = require('mysql');

  // open up the database connection...
  var dbConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'meterMiser'
  });
  dbConnection.connect();

  var selectLocationsSQL = `SELECT * FROM Locations`;

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
  // let's test out a query of Locations table.....

  console.log("hit /meterMiser route");
  var mysql = require('mysql');

  // open up the database connection...
  var dbConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'meterMiser'
  });
  dbConnection.connect();

  var selectLocationsSQL = `SELECT * FROM Thermostats`;

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


router.get('/Readings', function(req, res, next) {
  // let's test out a query of Locations table.....

  console.log("hit /meterMiser route");
  var mysql = require('mysql');

  // open up the database connection...
  var dbConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'meterMiser'
  });
  dbConnection.connect();

  var selectLocationsSQL = `SELECT * FROM Readings`;

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



module.exports = router;

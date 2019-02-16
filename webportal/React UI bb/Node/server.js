// using the express framework 
var express = require("express"); 
var app = express();

// using the filesystem
var fs = require("fs")

// using mysql
var mysql = require('mysql');

// allow connections
var pool = mysql.createPool({
    connectionLimit : 100, // important
    host     : 'localhost', // port 3306
    user     : 'root',
    password : 'BoatsnHoes', // BoatsnHoes
    database : 'University',
    debug    :  false,
});

/*
var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};
*/

app.get("/username/:username", function(req, res) {
  var q = 
    "SELECT A.username " +
    "FROM Account A " +
    "WHERE A.username = '" + req.params.username + "'";
  pool.query(q, function (error, results, fields) {
    if (error)
      res.json(error);
    res.json(results);
  });
})

app.get("/email/:email", function(req, res) {
  var q = 
    "SELECT A.email " +
    "FROM Account A " +
    "WHERE A.email = '" + req.params.email + "'";
  pool.query(q, function (error, results, fields) {
    if (error)
      res.json(error);
    res.json(results);
  });
})

app.get("/person/:id", function(req, res) {
  var q = 
    "SELECT A.firstname, A.lastname " +
    "FROM Account A " +
    "WHERE A.id = '" + req.params.id + "'";
  pool.query(q, function (error, results, fields) {
    if (error)
      res.json(error);
    res.json(results);
  });
})

app.get("/login/:username/:password", function(req, res) {
  var q = 
    "SELECT A.id, A.firstname, A.email, P.title " +
    "FROM Account A, Permission P " +
    "WHERE " +
      "A.username = '" + req.params.username + "' AND " +
      "A.password = '" + req.params.password + "' AND " +
      "A.permission = P.id";
	pool.query(q, function (error, results, fields) {
    if (error)
      res.json(error);
    res.json(results);
  });
})

// get courses by teacher id
app.get("/teachingList/:id", function(req, res) {
  var q =
    "SELECT C.id, S.code, S.name, S.description, C.directory, C.year, C.semester " +
    "FROM Course C " +
    "JOIN Subject S ON C.code = S.code " + 
    "WHERE C.instructor = '" + req.params.id + "'";
  pool.query(q, function (error, results, fields) {
    if (error)
      res.json(error);
    res.json(results);
  });
})

// get courses by student id
app.get("/enrolledList/:id", function(req, res) {
  var q =
    "SELECT C.id, S.code, S.name, S.description, C.instructor, C.directory, C.year, C.semester " +
    "FROM Enrollment E " +
    "JOIN Course C ON E.course = C.id " +
    "JOIN Subject S ON C.code = S.code " + 
    "WHERE sid = '" + req.params.id + "'";
  pool.query(q, function (error, results, fields) {
    if (error)
      res.json(error);
    res.json(results);
  });
})

// get assignments by course
app.get("/assigned/:course", function(req, res) {
  var q = 
    "SELECT A.id, A.course, A.name, A.pdf, A.template " +
    "FROM Assignment A " +
    "WHERE A.course = '" + req.params.course + "'";
  pool.query(q, function (error, results, fields) {
    if (error)
      res.json(error);
    res.json(results);
  });
})

// get one submitted assignment by student id and assignment id
app.get("/submitted/student/:sid/assignment/:aid", function(req, res) {
  var q = 
    "SELECT S.course, S.assignment, S.submit_time " +
    "FROM Submission S " +
    "WHERE " +
      "S.id = '" + req.params.sid + "' AND " +
      "S.assignment = '" + req.params.aid + "'";
  pool.query(q, function (error, results, fields) {
    if (error)
      res.json(error);
    res.json(results);
  });
})

// get all submitted assignments by assignment id
app.get("/submitted/assignment/:id", function(req, res) {
  var q = 
    "SELECT S.id, S.zip " +
    "FROM Submission S " +
    "WHERE S.assignment = '" + req.params.id + "'";
  pool.query(q, function (error, results, fields) {
    if (error)
      res.json(error);
    res.json(results);
  });
})

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("listening at http://%s:%s", host, port)
})
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
})-- TODO
--	- default database name (default_database_name)
--  - password encryption algorithm -> setup table for credential (depends on columns)
--  - primary key for accounts table


-- Create Database & Tables if they don't exist
CREATE DATABASE IF NOT EXISTS University;
USE University;

-- Delete all tables if they exist
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Permission;
DROP TABLE IF EXISTS Account;
DROP TABLE IF EXISTS Subject;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS Enrollment;
DROP TABLE IF EXISTS Assignment;
DROP TABLE IF EXISTS Submission;

SET FOREIGN_KEY_CHECKS = 1;

-- Create Tables
CREATE TABLE Permission (
	id 			INT UNSIGNED NOT NULL,
	title		VARCHAR(32) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE Account (
	id			VARCHAR(12) NOT NULL,
	permission	INT UNSIGNED NOT NULL,
	firstname   VARCHAR(32) NOT NULL,		
	lastname	VARCHAR(32) NOT NULL,
	username    VARCHAR(255) NOT NULL UNIQUE,	
	email		VARCHAR(255) NOT NULL,
	password	VARCHAR(1024) NOT NULL,				-- TODO - Set length
	salt		VARCHAR(256) NOT NULL,				-- TODO - Set length
	PRIMARY KEY (id),
	FOREIGN KEY (permission) REFERENCES Permission (id) 
);

CREATE TABLE Subject (
	code		VARCHAR(12) NOT NULL,
	name		VARCHAR(255) NOT NULL,
	description	VARCHAR(1024) NOT NULL,
	PRIMARY KEY (code)
);

CREATE TABLE Course (
	id			INT UNSIGNED AUTO_INCREMENT,
	code		VARCHAR(12) NOT NULL,
	instructor	VARCHAR(12) NOT NULL,
	directory	VARCHAR(255) NOT NULL,
	year 		YEAR NOT NULL,
	semester 	VARCHAR(12) NOT NULL,

	-- Should we section? or start & end dates?
	
	PRIMARY KEY (id),
	FOREIGN KEY (code) REFERENCES Subject (code),
	FOREIGN KEY (instructor) REFERENCES Account (id)
);

CREATE TABLE Enrollment (
	sid			VARCHAR(12) NOT NULL,
	course		INT UNSIGNED NOT NULL,
	
	-- Enrollment date?
	
	PRIMARY KEY (sid, course),
	FOREIGN KEY (sid) REFERENCES Account (id),
	FOREIGN KEY (course) REFERENCES Course (id)	
);

CREATE TABLE Assignment (
	id			INT UNSIGNED AUTO_INCREMENT,
	course		INT UNSIGNED NOT NULL,
	name		VARCHAR(45) NOT NULL,
	pdf			VARCHAR(255) NOT NULL,
	template	VARCHAR(255) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (course) REFERENCES Course (id)
);

CREATE TABLE Submission (
	id			VARCHAR(12) NOT NULL,
	course		INT UNSIGNED NOT NULL,
	assignment	INT UNSIGNED NOT NULL,
	zip			VARCHAR(255) NOT NULL,
	submit_time	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id, course, assignment),
	FOREIGN KEY (id) REFERENCES Account (id),
	FOREIGN KEY (assignment) REFERENCES Assignment (id)
);

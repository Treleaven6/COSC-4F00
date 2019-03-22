-- TODO
--	- default database name (default_database_name)
--  - password encryption algorithm -> setup table for credential (depends on columns)
--  - primary key for accounts table


-- Create Database & Tables if they don't exist
-- CREATE DATABASE IF NOT EXISTS University;
-- USE University;

-- Delete all tables if they exist
-- SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Permission CASCADE;
DROP TABLE IF EXISTS Account CASCADE;
DROP TABLE IF EXISTS Subject CASCADE;
DROP TABLE IF EXISTS Course CASCADE;
DROP TABLE IF EXISTS Enrollment CASCADE;
DROP TABLE IF EXISTS Assignment CASCADE;
DROP TABLE IF EXISTS Submission CASCADE;
DROP TABLE IF EXISTS ReportRequest CASCADE;
DROP TABLE IF EXISTS ReportReturn CASCADE;

-- SET FOREIGN_KEY_CHECKS = 1;

-- Create Tables
CREATE TABLE Permission (
	id 			INT NOT NULL,
	title		VARCHAR(32) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE Account (
	id			VARCHAR(12) NOT NULL,
	permission	INT NOT NULL,
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
	id			SERIAL,
	code		VARCHAR(12) NOT NULL,
	instructor	VARCHAR(12) NOT NULL,
	year 		INTEGER NOT NULL,
	semester 	VARCHAR(12) NOT NULL,
	
	PRIMARY KEY (id),
	FOREIGN KEY (code) REFERENCES Subject (code),
	FOREIGN KEY (instructor) REFERENCES Account (id)
);

CREATE TABLE Enrollment (
	sid			VARCHAR(12) NOT NULL,
	course		INT NOT NULL,
	
	PRIMARY KEY (sid, course),
	FOREIGN KEY (sid) REFERENCES Account (id),
	FOREIGN KEY (course) REFERENCES Course (id)	
);

CREATE TABLE Assignment (
	id			SERIAL,
	course		INT NOT NULL,
	name		VARCHAR(64) NOT NULL,
	pdf			VARCHAR(128),
	template 	VARCHAR(128),
	closing		TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (course) REFERENCES Course (id)
);

CREATE TABLE Submission (
	id			VARCHAR(12) NOT NULL, -- student id
	course		INT NOT NULL, -- course id
	assignment	INT NOT NULL, -- assignment id
	zip			VARCHAR(255) NOT NULL,
	submit_time	TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
	PRIMARY KEY (id, course, assignment),
	FOREIGN KEY (id) REFERENCES Account (id),
	FOREIGN KEY (course) REFERENCES Course (id),
	FOREIGN KEY (assignment) REFERENCES Assignment (id)
);

CREATE TABLE ReportRequest (
	id 			SERIAL,
	course		INT NOT NULL, -- course id
	assignment	INT, -- assignment id
	submit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
	PRIMARY KEY (id),
	FOREIGN KEY (course) REFERENCES Course (id)
);

CREATE TABLE ReportReturn (
	id 			SERIAL,
	rid			INT NOT NULL, -- request id
	course		INT NOT NULL, -- course id
	assignment	INT, -- assignment id
	submit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
	PRIMARY KEY (id),
	FOREIGN KEY (rid) REFERENCES ReportRequest (id)
);

GRANT ALL PRIVILEGES ON TABLE Permission TO c4f00g03;
GRANT ALL PRIVILEGES ON TABLE Account TO c4f00g03;
GRANT ALL PRIVILEGES ON TABLE Subject TO c4f00g03;
GRANT ALL PRIVILEGES ON TABLE Course TO c4f00g03;
GRANT ALL PRIVILEGES ON TABLE Enrollment TO c4f00g03;
GRANT ALL PRIVILEGES ON TABLE Assignment TO c4f00g03;
GRANT ALL PRIVILEGES ON TABLE Submission TO c4f00g03;
GRANT ALL PRIVILEGES ON TABLE ReportRequest TO c4f00g03;
GRANT ALL PRIVILEGES ON TABLE ReportReturn TO c4f00g03;

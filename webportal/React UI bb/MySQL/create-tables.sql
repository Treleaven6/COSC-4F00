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
DROP TABLE IF EXISTS FakeID CASCADE;

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
	FOREIGN KEY (code) REFERENCES Subject (code)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (instructor) REFERENCES Account (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE Enrollment (
	sid			VARCHAR(12) NOT NULL,
	course		INT NOT NULL,
	
	PRIMARY KEY (sid, course),
	FOREIGN KEY (sid) REFERENCES Account (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (course) REFERENCES Course (id)	
		ON DELETE CASCADE
		ON UPDATE CASCADE
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
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE Submission (
	id			VARCHAR(12) NOT NULL, -- student id
	course		INT NOT NULL, -- course id
	assignment	INT NOT NULL, -- assignment id
	submit_time	TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
	PRIMARY KEY (id, course, assignment),
	FOREIGN KEY (id) REFERENCES Account (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (course) REFERENCES Course (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (assignment) REFERENCES Assignment (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE ReportRequest (
	id 			SERIAL,
	course		INT NOT NULL, -- course id
	assignment	INT, -- assignment id
	submit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
	PRIMARY KEY (id),
	FOREIGN KEY (course) REFERENCES Course (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE ReportReturn (
	id 			SERIAL,
	rid			INT NOT NULL, -- request id
	submit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
	PRIMARY KEY (id),
	FOREIGN KEY (rid) REFERENCES ReportRequest (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE FakeID (
	actual	VARCHAR(12),
	fake 	VARCHAR(12) NOT NULL,
	PRIMARY KEY (actual),
	FOREIGN KEY (actual) REFERENCES Account (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
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
GRANT ALL PRIVILEGES ON TABLE FakeID TO c4f00g03;

GRANT USAGE, SELECT ON SEQUENCE course_id_seq TO c4f00g03;
GRANT USAGE, SELECT ON SEQUENCE assignment_id_seq TO c4f00g03;
GRANT USAGE, SELECT ON SEQUENCE reportrequest_id_seq TO c4f00g03;

INSERT INTO Permission (id, title)
VALUES (0, 'admin');

INSERT INTO Permission (id, title)
VALUES (1, 'teacher');

INSERT INTO Permission (id, title)
VALUES (2, 'student');

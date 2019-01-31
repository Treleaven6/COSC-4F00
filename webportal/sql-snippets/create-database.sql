
-- TODO
--	- default database name (default_database_name)
--  - password encryption algorithm -> setup table for credential (depends on columns)
--  - primary key for accounts table


-- Create Database & Tables if they don't exist
CREATE DATABASE IF NOT EXISTS default_database_name;
USE default_database_name;

-- Delete all tables if they exist
SET FOREIGN_KEY_CHECKS = 0;

DELETE TABLE IF EXISTS Permission;
DELETE TABLE IF EXISTS Account;
DELETE TABLE IF EXISTS Subject;
DELETE TABLE IF EXISTS Course;
DELETE TABLE IF EXISTS Enrollment;

SET FOREIGN_KEY_CHECKS = 1;

-- Create Tables
CREATE TABLE EXISTS Permission {
	id 			INT UNSIGNED AUTO_INCREMENT,
	title		VARCHAR(32)
}

CREATE TABLE Account {
	id			VARCHAR(12) NOT NULL,
	name		VARCHAR(32) NOT NULL,		
	fullname	VARCHAR(255) NOT NULL,		
	email		VARCHAR(255) NOT NULL,
	password	VARCHAR() NOT NULL,				-- TODO - Set length
	salt		VARCHAR() NOT NULL,				-- TODO - Set length
	PRIMARY KEY (university_id),
	FOREIGN KEY (permission_id) REFERENCES Permission (id) 
};

CREATE TABLE Subject {
	code		VARCHAR(12) NOT NULL,
	name		VARCHAR(255) NOT NULL,
	description	VARCHAR(500) NOT NULL,
	PRIMARY KEY (course_code)
};

CREATE TABLE Course {
	id			INT UNSIGNED AUTO_INCREMENT
	code		VARCHAR(12) NOT NULL,
	instructor	VARCHAR(12) NOT NULL,
	directory	VARCHAR(255) NOT NULL,
	
	-- Should we add year? semester? section? or start & end dates?
	
	PRIMARY KEY (id),
	FOREIGN KEY (code) REFERENCES Subject (code),
	FOREIGN KEY (instructor) REFERENCES Account (id)
};

CREATE TABLE Enrollment {
	sid			VARCHAR(12) NOT NULL,
	course		VARCHAR(12) NOT NULL,
	
	-- Enrollment date?
	
	PRIMARY KEY (sid, course_code),
	FOREIGN KEY sid REFERENCES Account (id),
	FOREIGN KEY course REFERENCES Course (id)	
};

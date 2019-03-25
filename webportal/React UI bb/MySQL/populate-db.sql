-- USE University;

-- a bunch of dummy data for testing
-- can use login/password t/t for teacher and s/s for student

INSERT INTO Permission (id, title)
VALUES (0, 'admin');

INSERT INTO Permission (id, title)
VALUES (1, 'teacher');

INSERT INTO Permission (id, title)
VALUES (2, 'student');

INSERT INTO Account (id, permission, firstname, lastname, username, email, password, salt)
VALUES ('123456', 1, 'Indiana', 'Jones', 't', 'ijones@brocku.ca', 't', 'arabian');

INSERT INTO Account (id, permission, firstname, lastname, username, email, password, salt)
VALUES ('121212', 1, 'Rupert', 'Giles', 'Giles', 'rgiles@brocku.ca', 'in_the_whiteroom', 'moroccan');

INSERT INTO Account (id, permission, firstname, lastname, username, email, password, salt)
VALUES ('999888', 2, 'Troy', 'Barnes', 's', 'tbarnes@brocku.ca', 's', 'egyptian');

INSERT INTO Account (id, permission, firstname, lastname, username, email, password, salt)
VALUES ('987987', 2, 'Abed', 'Nadir', 'StudyPoison', 'anadir@brocku.ca', 'cool_cool_cool', 'chinese');

INSERT INTO Subject (code, name, description)
VALUES ('MATH2P98', 'Applied Statistics', 'We do math.');

INSERT INTO Subject (code, name, description)
VALUES ('COSC4F00', 'Project Engineering', 'We plan shit.');

INSERT INTO Course (code, instructor, year, semester)
VALUES ('MATH2P98', '123456', 2019, 'winter');

INSERT INTO Course (code, instructor, year, semester)
VALUES ('MATH2P98', '123456', 2018, 'fall');

INSERT INTO Course (code, instructor, year, semester)
VALUES ('COSC4F00', '121212', 2019, 'winter');

INSERT INTO Enrollment (sid, course)
VALUES ('999888', 1);

INSERT INTO Enrollment (sid, course)
VALUES ('999888', 3);

INSERT INTO Enrollment (sid, course)
VALUES ('987987', 1);

INSERT INTO Assignment (course, name)
VALUES (1, 'First assignment');

INSERT INTO Assignment (course, name)
VALUES (1, 'Second assignment');

INSERT INTO Assignment (course, name, closing)
VALUES (1, 'Third assignment', CURRENT_TIMESTAMP(0));

INSERT INTO Assignment (course, name)
VALUES (2, 'Batmobile assignment');

INSERT INTO Assignment (course, name, closing)
VALUES (1, 'Fourth Assignment', '2021-03-15 17:13:40');

INSERT INTO Submission (id, course, assignment, zip, submit_time)
VALUES ('999888', 1, 1, 'it out and zip it up', CURRENT_TIMESTAMP(0));

INSERT INTO Submission (id, course, assignment, zip, submit_time)
VALUES ('987987', 1, 2, 'doesnt exist', CURRENT_TIMESTAMP(0));

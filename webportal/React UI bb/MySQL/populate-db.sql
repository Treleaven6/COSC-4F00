USE University;

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

INSERT INTO Course (code, instructor, directory, year, semester)
VALUES ('MATH2P98', '123456', 'math', 2019, 'winter');

INSERT INTO Course (code, instructor, directory, year, semester)
VALUES ('MATH2P98', '123456', 'math18', '2018', 'fall');

INSERT INTO Course (code, instructor, directory, year, semester)
VALUES ('COSC4F00', '121212', 'cosc', '2019', 'winter');

INSERT INTO Enrollment (sid, course)
VALUES ('999888', 1);

INSERT INTO Enrollment (sid, course)
VALUES ('999888', 3);

INSERT INTO Enrollment (sid, course)
VALUES ('987987', 1);

INSERT INTO Assignment (course, name, pdf, template)
VALUES (1, 'First assignment', 'a pdf path', 'a template path');

INSERT INTO Assignment (course, name, pdf, template)
VALUES (1, 'Second assignment', 'another pdf', 'another template');

INSERT INTO Assignment (course, name, pdf, template)
VALUES (2, 'Batmobile assignment', 'more pdf', 'holy template');

INSERT INTO Submission (id, course, assignment, zip, submit_time)
VALUES ('999888', 1, 1, "it out and zip it up", CURRENT_TIMESTAMP);

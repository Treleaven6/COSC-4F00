import sys
import json
import mysql.connector
from mysql.connector import errorcode
from mysql.connector import FieldType

# run "mkdir bin"
# 
# add below to .bashrc
# PYTHONPATH=$PYTHONPATH:$HOME/bin
# export PYTHONPATH
# 
# log out then back in
# 
# sftp the mysql-conn...tar.gz into bin
# 
# run "tar -xvzf mysql-conn...tar.gz"
# 
# cd into the new directory
# 
# run "python setup.py install --user"
#
# visit below for some example python code:
# https://dev.mysql.com/doc/connector-python/en/connector-python-examples.html

cmd = sys.argv
if len(cmd) < 2:
	print("Error: no argument")
	quit()

cmd = cmd[1].split(".php/")
if not len(cmd) == 2:
	print("Error: URI is too short") 
	quit()

cmd = cmd[1].split("/");

try:
	cnx = mysql.connector.connect(user='root', password='BoatsnHoes', host='localhost', database='University')
except mysql.connector.Error as err:
  if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
    print("bad username / password")
  elif err.errno == errorcode.ER_BAD_DB_ERROR:
    print("bad database")
  else:
    print(err)

# not sure if necessary
cnx.autocommit = True
cursor = cnx.cursor()

# execute query, format response into an array of dictionaries
def exec_and_parse(query):
	cursor.execute(query)
	out = []
	while True:
		row = cursor.fetchone()
		if not row:
			break
		tmp = {}
		for (desc, val) in zip(cursor.description, row):
			if FieldType.get_info(desc[1]) == 'TIMESTAMP':
				val = str(val)
			tmp[desc[0]] = val
		out.append(tmp)
	return(out)

if cmd[0] == 'person':
	# get firstname, lastname associated with id
	# used to get the professors name when a student goes to a course page
	query = ("SELECT A.firstname, A.lastname " +
    		 "FROM Account A " +
    		 "WHERE A.id = '" + cmd[1] + "'")
elif cmd[0] == 'login':
	# get id, firstname, email, and permission based on username and password
	# used when logging in: if nothing returned, can't log in
	query = ("SELECT A.id, A.firstname, A.email, P.title " +
			 "FROM Account A, Permission P " +
	         "WHERE " +
      			"A.username = '" + cmd[1] + "' AND " +
      			"A.password = '" + cmd[2] + "' AND " +
      			"A.permission = P.id")
elif cmd[0] == 'teaching':
	# get a list of courses that a professor is teaching
	# used as soon as a teacher logs in
	query = ("SELECT C.id, S.code, S.name, S.description, C.directory, C.year, C.semester " +
    		 "FROM Course C " +
    		 "JOIN Subject S ON C.code = S.code " + 
    		 "WHERE C.instructor = '" + cmd[1] + "'")
elif cmd[0] == 'enrolled':
	# get a list of courses that a student is enrolled in
	# used as soon as a student logs in
	query = ("SELECT C.id, S.code, S.name, S.description, C.instructor, C.directory, C.year, C.semester " +
    		 "FROM Enrollment E " +
    		 "JOIN Course C ON E.course = C.id " +
    		 "JOIN Subject S ON C.code = S.code " + 
    		 "WHERE sid = '" + cmd[1] + "'")
elif cmd[0] == 'assigned':
	# get all assigned assignments per course
	# used as soon as a teacher or student logs in
	query = ("SELECT A.id, A.course, A.name, A.pdf, A.template " +
    		 "FROM Assignment A " +
    	 	 "WHERE A.course = '" + cmd[1] + "'")
elif cmd[0] == 'submitted' and cmd[1] == 'student':
	# determine if this student has submitted to an assigned assignment
	# used when a student clicks on an assignment 
	query = ("SELECT S.course, S.assignment, S.submit_time " +
    	     "FROM Submission S " +
    	     "WHERE " +
      	     "S.id = '" + cmd[2] + "' AND " +
      		 "S.assignment = '" + cmd[4] + "'")
elif cmd[0] == 'submitted' and cmd[1] == 'assignment':
	# get all submissions to an assignment
	# used when a teacher is going to check for plagiarism
	# also join to get student name?
	query = ("SELECT S.id, S.zip " +
    		 "FROM Submission S " +
    		 "WHERE S.assignment = '" + cmd[2] + "'")

if query:
	print(json.dumps(exec_and_parse(query)))
cnx.close()




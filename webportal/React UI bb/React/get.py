import sys
import json
import urllib
import os
import datetime
import psycopg2

# TODO: scripts for creating accounts, creating courses, and enrolling

# psql

# this is pretty awful, as there is no caching and it
# opens a new connection to the database on every api
# call, but it's what we got

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
	print(json.dumps("no argument"))
	quit()

cmd = cmd[1].split(".php/")
if not len(cmd) == 2:
	print(json.dumps("URI is too short or does not call .php"))
	quit()

cmd = urllib.unquote(cmd[1])
cmd = cmd.split("/")

cnx = None
try:
  #cnx = mysql.connector.connect(user='root', password='BoatsnHoes', host='localhost', database='University')
  cnx = psycopg2.connect(host="localhost", database="c4f00g03", user="c4f00g03", password="j4g6x7b3")
except mysql.connector.Error as err:
  if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
    print(json.dumps("bad username / password"))
  elif err.errno == errorcode.ER_BAD_DB_ERROR:
    print(json.dumps("bad database"))
  else:
  	print(json.dumps("check DB connection"))
  if cnx is not None:
    cnx.close()
  quit() 

# not sure if necessary
#cnx.autocommit = True
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
			if isinstance(val, datetime.datetime):
				val = str(val)
			tmp[desc[0]] = val
		out.append(tmp)
	return(out)

query = False
if cmd[0] == 'email':
	# api.php/email/<email>
	# get email if exists
	# used when forgot password
	query = ("SELECT A.email " +
    		 "FROM Account A " +
    		 "WHERE A.email = '" + cmd[1] + "'")
elif cmd[0] == 'person':
	# api.php/person/<account id>
	# get firstname, lastname associated with id
	# used to get the professors name when a student goes to a course page
	query = ("SELECT A.firstname, A.lastname " +
    		 "FROM Account A " +
    		 "WHERE A.id = '" + cmd[1] + "'")
elif cmd[0] == 'login':
	# api.php/login/<username>/<password>
	# get id, firstname, email, and permission based on username and password
	# used when logging in: if nothing returned, can't log in
	query = ("SELECT A.id, A.firstname, A.email, P.title " +
			 "FROM Account A, Permission P " +
	         "WHERE " +
      			"A.username = '" + cmd[1] + "' AND " +
      			"A.password = '" + cmd[2] + "' AND " +
      			"A.permission = P.id")
elif cmd[0] == 'teaching':
	# api.php/teaching/<account id>
	# get a list of courses that a professor is teaching
	# used as soon as a teacher logs in
	query = ("SELECT C.id, S.code, S.name, S.description, C.year, C.semester " +
    		 "FROM Course C " +
    		 "JOIN Subject S ON C.code = S.code " + 
    		 "WHERE C.instructor = '" + cmd[1] + "'")
elif cmd[0] == 'taking':
	# api.php/taking/<account id>
	# get a list of courses that a student is enrolled in
	# used as soon as a student logs in
	query = ("SELECT C.id, S.code, S.name, S.description, C.instructor, C.year, C.semester " +
    		 "FROM Enrollment E " +
    		 "JOIN Course C ON E.course = C.id " +
    		 "JOIN Subject S ON C.code = S.code " + 
    		 "WHERE sid = '" + cmd[1] + "'")
elif cmd[0] == 'enrolled':
	# api.php/enrolled/<course id>
	# return a list of students that are enrolled in a course
	query = ("SELECT A.id, A.firstname, A.lastname " +
			 "FROM Account A, Enrollment E " +
			 "WHERE E.sid = A.id AND E.course = " + cmd[1])
elif cmd[0] == 'assigned':
	# api.php/assigned/<course id>
	# get all assigned assignments per course
	# used as soon as a teacher or student logs in
	query = ("SELECT A.id, A.course, A.name, A.pdf, A.template, A.closing " +
    		 "FROM Assignment A " +
    	 	 "WHERE A.course = '" + cmd[1] + "'")
elif cmd[0] == 'submitted' and cmd[1] == 'student':
	# api.php/submitted/student/<account id>/assignment/<assignment id>
	# determine if this student has submitted to an assigned assignment
	# used when a student clicks on an assignment 
	query = ("SELECT S.course, S.assignment, S.submit_time " +
    	     "FROM Submission S " +
    	     "WHERE " +
      	     "S.id = '" + cmd[2] + "' AND " +
      		 "S.assignment = '" + cmd[4] + "'")
elif cmd[0] == 'submitted' and cmd[1] == 'assignment':
	# api.php/submitted/assignment/<assignment id>
	# get all submissions to an assignment
	# used when a teacher is going to check for plagiarism
	query = ("SELECT S.id, S.zip, A.firstname, A.lastname " +
    		 "FROM Submission S, Account A " +
    		 "WHERE S.assignment = '" + cmd[2] + "' AND S.id = A.id")
elif cmd[0] == 'excluded':
	#out = ["made it"]
	#print(json.dumps(out))
	#print(os.listdir(os.path.dirname(os.path.realpath(__file__))))
	cwd = os.path.dirname(os.path.realpath(__file__))
	exclude_path = os.path.join(cwd, "uploads", cmd[1], cmd[2], "exclude")
	if (os.path.isdir(exclude_path)):
		print(json.dumps(os.listdir(exclude_path)))
	else:
		print("[]")
	quit()
elif cmd[0] == 'included':
	cwd = os.path.dirname(os.path.realpath(__file__))
	include_path = os.path.join(cwd, "uploads", cmd[1], cmd[2], "include")
	if (os.path.isdir(include_path)):
		print(json.dumps(os.listdir(include_path)))
	else:
		print("[]")
	quit()

if query:
	print(json.dumps(exec_and_parse(query)))
cnx.close()




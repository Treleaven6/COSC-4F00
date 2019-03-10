import sys
import json
import time    

import mysql.connector
from mysql.connector import errorcode
from mysql.connector import FieldType

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

# more necessary here I think
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

if cmd[0] == 'upload':
	zip_file = "a zip file name" # or path??
	now = time.strftime('%Y-%m-%d %H:%M:%S')
	query = ("INSERT INTO Submission (id, course, assignment, zip, submit_time) " +
		    "VALUES (" +
		    "'" + cmd[3] + "', " +
		    cmd[1] + ", " +
		    cmd[2] + ", " +
		    "'" + zip_file + "', " +
		    "'" + now + "'" +
		    ") " +
		    "ON DUPLICATE KEY UPDATE " +
		    "zip = '" + zip_file + "', " +
		    "submit_time = '" + now + "'")

if query:
	print(json.dumps(exec_and_parse(query)))
cnx.close()


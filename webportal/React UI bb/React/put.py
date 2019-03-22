import sys
import json
import urllib
import os
import psycopg2
import datetime
#import mysql.connector
#from mysql.connector import errorcode
#from mysql.connector import FieldType

# SWITCH TO POSTGRES

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

cursor = cnx.cursor()

# execute query, format response into an array of dictionaries
def exec_and_parse(query):
	cursor.execute(query)
	cnx.commit()
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
if cmd[0] == 'newass':
	if (cmd[3] == ""):
		query = ("INSERT INTO Assignment (course, name) " +
    		 "VALUES (" + cmd[1] + ", '" + cmd[2] + "')")
	else:
		query = ("INSERT INTO Assignment (course, name, closing) " +
    		 "VALUES (" + cmd[1] + ", '" + cmd[2] + "', '" + cmd[3] + "')")

if query:
	print(json.dumps(exec_and_parse(query)))
cnx.close()




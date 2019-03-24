import sys
import json
import urllib
import os
import psycopg2
import datetime
import db
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

cnx = db.get_connection()
cursor = cnx.cursor()

query = False
if cmd[0] == 'newass':
	if (cmd[3] == ""):
		query = ("INSERT INTO Assignment (course, name) " +
    		 "VALUES (" + cmd[1] + ", '" + cmd[2] + "')")
	else:
		query = ("INSERT INTO Assignment (course, name, closing) " +
    		 "VALUES (" + cmd[1] + ", '" + cmd[2] + "', '" + cmd[3] + "')")

if query:
	print(json.dumps(db.exec_and_parse(cursor, cnx, query)))
cnx.close()




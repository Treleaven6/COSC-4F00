import sys
import json
import time 
import zipfile  
import os 
import shutil
import urllib
import psycopg2
import datetime
import db

#import mysql.connector
#from mysql.connector import errorcode
#from mysql.connector import FieldType

cmd = sys.argv
if len(cmd) < 2:
	print("Error: no argument")
	quit()

cmd = cmd[1].split(".php/")
if not len(cmd) == 2:
	print("Error: URI is too short or does not call .php") 
	quit()

cmd = urllib.unquote(cmd[1])
cmd = cmd.split("/");

cnx = None
try:
  #cnx = mysql.connector.connect(user='root', password='BoatsnHoes', host='localhost', database='University')
  cnx = psycopg2.connect(host="localhost", database="c4f00g03", user="c4f00g03", password="j4g6x7b3")
except psycopg2.OperationalError as err:
  print(json.dumps("check DB connection"))
  if cnx is not None:
    cnx.close()
  quit() 

cnx = db.get_connection()
cursor = cnx.cursor()

query = False
if cmd[0] == 'upload':
	# "./api.php/upload/<course id>/<assignment id>/<account id>;
	zip_file = "a path" # or path??
	now = time.strftime('%Y-%m-%d %H:%M:%S')
	query = ("INSERT INTO Submission (id, course, assignment, zip, submit_time) " +
		    "VALUES (" +
		    "'" + cmd[3] + "', " +
		    cmd[1] + ", " +
		    cmd[2] + ", " +
		    "'" + zip_file + "', " +
		    "'" + now + "'" +
		    ") " +
		    "ON CONFLICT (id, course, assignment) DO UPDATE SET " +
		    "zip = '" + zip_file + "', " +
		    "submit_time = '" + now + "'")
elif cmd[0] == 'send':
	# "./api.php/send/<course id>/<assignment id>;
	# zip everything up
	name = "./uploads/zips/c" + cmd[1] + "a" + cmd[2]
	path = "./uploads/" + cmd[1] + "/" + cmd[2] + "/"
	shutil.make_archive(name, 'zip', path)
	# log it in the database
	query = ("INSERT INTO ReportRequest (course, assignment) " +
		    "VALUES (" +
		    "'" + cmd[1] + "', " +
		    "'" + cmd[2] + "')")
elif cmd[0] == 'upass':
	# api.php/upass/<assignment id>/<updated assignment name>/<updated assignment closing date>
	# updates an assignment name and / or closing date
	query = ("UPDATE Assignment SET name = '" + cmd[2] + "', closing = '" + cmd[3] + "' WHERE id = " + cmd[1])
elif cmd[0] == 'delass':
	# api.php/delass/<assignment id>
	# deletes an assignment
	query = ("DELETE FROM Assignment WHERE id = " + cmd[1])
elif cmd[0] == 'password':
	# api.php/password/<account id>/<new password>
	# updates a password
	query = ("UPDATE Account SET password = '" + cmd[2] + "' WHERE id = '" + cmd[1] + "'")
	
if query:
	print(json.dumps(db.exec_and_parse(cursor, cnx, query)))
cnx.close()

if cmd[0] == 'upload':
	folder = "./uploads/" + cmd[1] + "/" + cmd[2] + "/" + cmd[3]
	print(folder);
	# https://stackoverflow.com/questions/3451111/unzipping-files-in-python
	zip_ref = zipfile.ZipFile(folder + "/" + cmd[3] + ".zip", 'r')
	zip_ref.extractall(folder)
	zip_ref.close()
	# remove original zip file
	os.remove(folder + "/" + cmd[3] + ".zip")
	# remove pesky macos folders
	if os.path.isdir(folder + "/" + "__MACOSX"):
		shutil.rmtree(folder + "/" + "__MACOSX")
elif cmd[0] == 'send':
	# send zip to algo server
	fake = 1



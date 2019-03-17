import sys
import json
import time 
import zipfile  
import os 
import shutil
import urllib
import psycopg2

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

# teachers need the option to upload pdf instructions, code templates (to be excluded), and other code to include in plagiarism

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
		    "ON DUPLICATE KEY UPDATE " +
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
	query = ("UPDATE Assignment SET name = '" + cmd[2] + "', closing = '" + cmd[3] + "' WHERE id = " + cmd[1])
elif cmd[0] == 'delass':
	query = ("DELETE FROM Assignment WHERE id = " + cmd[1])
	
if query:
	print(json.dumps(exec_and_parse(query)))
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
	# remove hidden files and folders?
elif cmd[0] == 'send':
	# send zip to algo server
	fake = 1



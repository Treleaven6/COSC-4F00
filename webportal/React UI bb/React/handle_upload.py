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
import traceback
import re

# Anonymizes a student's upload

# validate URL parameters
cmd = sys.argv
if len(cmd) < 2:
	print(json.dumps("Error: no argument"))
	quit()

fake = cmd[2]
cmd = cmd[1].split(".php/")
if not len(cmd) == 2:
	print(json.dumps("Error: URI is too short or does not call .php"))
	quit()

cmd = urllib.unquote(cmd[1])
cmd = cmd.split("/");

# connect to the db
cnx = db.get_connection()
cursor = cnx.cursor()

# to nuke files already uploaded
# https://stackoverflow.com/questions/13118029/deleting-folders-in-python-recursively
def deltree(target):
	for d in os.listdir(target):
		path = os.path.join(target, d)
		if os.path.isdir(path):
			deltree(path)
			# OSError: [Errno 13] Permission denied
			#os.rmdir(path)
		elif not path.endswith(".zip"):
			os.remove(path)

# "./api.php/upload/<course id>/<assignment id>/<account id>;

# log to db
now = time.strftime('%Y-%m-%d %H:%M:%S')
query = ("UPDATE Submission " +
		 "SET submit_time = '" + now + "' WHERE id = '" + cmd[3] + "' AND course = " + cmd[1] + " AND assignment = " + cmd[2])
success, _ = db.exec_and_parse(cursor, cnx, query)
if not success:
	query = ("INSERT INTO Submission (id, course, assignment, submit_time) " +
		     "VALUES (" +
		     "'" + cmd[3] + "', " +
		     cmd[1] + ", " +
		     cmd[2] + ", " +
		     "'" + now + "'" +
		     ")")
	success, _ = db.exec_and_parse(cursor, cnx, query)

# make path
folder = os.path.join(".", "uploads", cmd[1], cmd[2], "target", fake)

# clear old submission
deltree(folder)

# unzip
# https://stackoverflow.com/questions/3451111/unzipping-files-in-python
zip_ref = zipfile.ZipFile(os.path.join(folder, fake + ".zip"), 'r')
zip_ref.extractall(folder)
zip_ref.close()

# remove original zip file
os.remove(os.path.join(folder, fake + ".zip"))	

# get account info for people at the school
def get_accounts():
	cnx = db.get_connection()
	cursor = cnx.cursor()
	query = "SELECT A.id, A.firstname, A.lastname FROM Account A"
	out = []
	try:
		cursor.execute(query)
	except:
		return(out)	
	if not cursor.description:
		return(out)
	while True:
		row = cursor.fetchone()
		if not row:
			break
		out.append(row)
	cnx.close()
	return out

accounts = get_accounts()
ids = [a[0] for a in accounts]
firstnames = [a[1] for a in accounts]
lastnames = [a[2] for a in accounts]

# replace instances with a hash
def strip_line(line):
	for id, first, last in zip(ids, firstnames, lastnames):
		# prepended with some <alpha> in case they are variables
		# similarly, [1:] is used to avoid negative numbers
		line = re.sub(id, str(hash(id))[1:], line)
		line = re.sub(first, "first" + str(hash(first))[1:], line)
		line = re.sub(last, "last" + str(hash(last))[1:], line)
	return line

# read a file line by line into a new file
def strip_file(path, name):
	f_path = os.path.join(path, name)
	if not os.path.isfile(f_path):
		return
	tmp_path = os.path.join(path, name + '.tmp')
	with open(f_path, "r+") as f:
		with open(tmp_path, "w+") as tmp:
			for line in f:
				tmp.write(strip_line(line))
	shutil.move(tmp_path, f_path)

# recursively check everything in the unzipped dir
def recur(base):
	if not os.path.isdir(base):
		return
	sub_nodes = os.listdir(base)
	for n in sub_nodes:
		path = os.path.join(base, n)
		if os.path.isdir(path):
			recur(path)
		elif n == '.DS_Store':
			os.remove(path)
		elif not n.endswith('.tmp'):
			strip_file(base, n)

base_dir = os.path.dirname(os.path.realpath(__file__))
base_dir = os.path.join(base_dir, "uploads", cmd[1], cmd[2], "target", fake)
recur(base_dir)

cnx.close()
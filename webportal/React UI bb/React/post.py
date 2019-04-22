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
import socket
import base64
import binascii
import parser

# Handles file uploads, password changes, and info edits

# CHANGE 'localhost' TO '139.57.100.6'

# validate URL params
cmd = sys.argv
if len(cmd) < 2:
	print(json.dumps("Error: no argument"))
	quit()

cmd = cmd[1].split(".php/")
if not len(cmd) == 2:
	print(json.dumps("Error: URI is too short or does not call .php"))
	quit()

cmd = urllib.unquote(cmd[1])
cmd = cmd.split("/");

# get db connection
cnx = db.get_connection()
cursor = cnx.cursor()

# recursively delete files in a directory
def deltree(target):
	for d in os.listdir(target):
		path = os.path.join(target, d)
		if os.path.isdir(path):
			deltree(path)
			# OSError: [Errno 13] Permission denied
			#os.rmdir(path)
		elif not path.endswith(".zip"):
			os.remove(path)

# determine if a directory has a file somewhere in it
def isEmpty (start):
	deeper = []
	for d in os.listdir(start):
		if os.path.isdir(os.path.join(start, d)):
			deeper.append(d)
		else:
			return False
	for d in deeper:
		if not isEmpty(os.path.join(start, d)):
			return False
	return True

# This script does not have permission to delete directories,
# so the above two functions form a workaround

# recursively zip a directory
# https://stackoverflow.com/questions/1855095/how-to-create-a-zip-archive-of-a-directory
def zipdir(path, ziph):
	for root, dirs, files in os.walk(path):
		for file in files:
			if file.endswith(".java") or file.endswith(".cpp") or file.endswith(".hpp") or file.endswith(".c") or file.endswith(".h"):
				absname = os.path.join(root, file)
				# adjust arcname if want a containing folder
				arcname = absname[len(path):]
				ziph.write(absname, arcname)

query = False
if cmd[0] == 'newass':
	# api.php/newass/<course id>/<assignment name>/<due date>
	# used when a teacher creates a new assignment
	# the due date argument is optional
	if (cmd[3] == ""):
		query = ("INSERT INTO Assignment (course, name) " +
    		 "VALUES (" + cmd[1] + ", '" + cmd[2] + "')")
	else:
		query = ("INSERT INTO Assignment (course, name, closing) " +
    		 "VALUES (" + cmd[1] + ", '" + cmd[2] + "', '" + cmd[3] + "')")
elif cmd[0] == 'upass':
	# api.php/upass/<assignment id>/<updated assignment name>/<updated assignment closing date>
	# updates an assignment name and / or closing date
	if cmd[3] == "":
		query = ("UPDATE Assignment SET name = '" + cmd[2] + "', closing = NULL WHERE id = " + cmd[1])
	else:
		query = ("UPDATE Assignment SET name = '" + cmd[2] + "', closing = '" + cmd[3] + "' WHERE id = " + cmd[1])
elif cmd[0] == 'delass':
	# api.php/delass/<assignment id>
	# deletes an assignment
	query = ("DELETE FROM Assignment WHERE id = " + cmd[1])
elif cmd[0] == 'password':
	# api.php/password/<account id>/<new password>
	# updates a password
	query = ("UPDATE Account SET password = '" + cmd[2] + "' WHERE id = '" + cmd[1] + "'")

# execute the query
if query:
	success, records = db.exec_and_parse(cursor, cnx, query)
	print(json.dumps(records))

if cmd[0] == 'send':
	# "./api.php/send/<course id>/<assignment id>;
	# used when a plagiarism report is requested
	# zips up all the necessary files, sends them to MOCD, gets a response
	
	# make paths
	dest_path = os.path.join(".", "requests")
	if not os.path.isdir(dest_path):
		os.makedirs(dest_path)
	src_path = os.path.join(".", "uploads", cmd[1], cmd[2])
	if not os.path.isdir(src_path):
		print(json.dumps("no good"))
		quit()
	
	# log it in the database
	query = ("INSERT INTO ReportRequest (course, assignment) " +
		    "VALUES (" +
		    "'" + cmd[1] + "', " +
		    "'" + cmd[2] + "')")
	#success, records = db.exec_and_parse(cursor, cnx, query)
	query = "SELECT currval('reportrequest_id_seq')"
	#success, records = db.exec_and_parse(cursor, cnx, query)
	#rid = records[0]['currval']
	rid = "17"
	
	# create unique zip name
	zip_name = "c" + cmd[1] + "a" + cmd[2] + "r" + str(rid) + ".zip"
	dest_path = os.path.join(dest_path, zip_name)
	
	# zip everything up
	try:
		zipf = zipfile.ZipFile(dest_path, 'w', zipfile.ZIP_DEFLATED)
		zipdir(src_path, zipf)
		zipf.close()
	except:
		print(json.dumps(traceback.format_exc()))
		quit()

	# WARNING: EXTREME KLUDGE
	# fix a bug in MOCD where it doesn't overwrite old files
	tmp_dir_hack = "/home/std/group/c4f00g03/c4a6r17"
	if os.path.isdir(tmp_dir_hack):
		deltree(tmp_dir_hack)

	# send to the algo server
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	try:
		s.connect(('139.57.100.6', 1234)) # the same port as used by the server
		msg = bytes(dest_path)
		size = ("0000" + str(len(msg)))[-4:]
		# send length of next message
		s.sendall(size)
		# send the name of the zip
		s.sendall(msg)
		f = open(dest_path, "rb")
		msg = urllib.quote(base64.b64encode(f.read()))
		# can only handle up to a trillion bytes, but thats ~ 1 gb
		size = ("000000000000" + str(len(msg)))[-12:]
		f.close()
		# send length of the next message
		s.sendall(size)
		# send the message (data)
		s.sendall(msg)

		#s.settimeout(2)
		data = s.recv(8)
		file_length = 0
		try:	
			# get length of content
			file_length = long(binascii.hexlify(data), 16)
		except:
			print(json.dumps(traceback.format_exc()))
			s.close()
			quit()

		# get content
		# read 1024 bytes at a time?
		contents = s.recv(file_length)
		# convert content to a JSON object and print
		print(json.dumps(parser.parse_to_object(contents)))
	except:
		print(json.dumps(traceback.format_exc()))
	finally:
		s.close()
elif cmd[0] == 'exportass':
	# api.php/exportass/<course id>/<assignment id>
	# used when a teacher wishes to export an assignment
	# zips it up, puts on a nice label, creates a download link
	
	# get path
	src = os.path.join(".", "uploads", cmd[1], cmd[2], "target")
	if not os.path.isdir(src):
		print(json.dumps("nothing to export"))
		quit()
	# create zip
	zip_name = "c" + cmd[1] + "a" + cmd[2] + ".zip"
	zip_path = os.path.join(".", "exports", zip_name)
	zipf = zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED)
	zipdir(src, zipf)
	zipf.close()
	# return download link
	print(json.dumps(zip_path))
elif cmd[0] == 'includezip':
	# api.php/includezip/<course id>/<assignment id>/<zip file name>
	# used when a teacher uploads a zip to include 
	# extracts it to the appropriate directory
	# must be an exported assignment
	
	# get path
	zip_path = os.path.join(".", "uploads", cmd[1], cmd[2], "repository", cmd[3])
	# extract
	try:
		zip_ref = zipfile.ZipFile(zip_path, 'r')
		zip_ref.extractall(zip_path)
		zip_ref.close()
	except:
		print(json.dumps(traceback.format_exc()))
		quit()
	# remove original zip file
	os.remove(zip_path)	
	# DELETE ALL FILES IN THE ZIP PATH
	# JUST IN CASE THEY UPLOADED A BAD ZIP?
	print(json.dumps(True))

cnx.close()


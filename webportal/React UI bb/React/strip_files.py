# anonymize 
import sys
import json
import os
import db
import psycopg2
import re
import shutil
import urllib

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

course_id = cmd[1]
assignment_id = cmd[2]
account_id = cmd[3]

base_dir = os.path.dirname(os.path.realpath(__file__))
base_dir = os.path.join(base_dir, "uploads", course_id, assignment_id, account_id)

if not os.path.isdir(base_dir):
	print(json.dumps("bad directory"))
	quit()

def get_accounts():
	cnx = db.get_connection()
	cursor = cnx.cursor()
	result = cursor.execute("SELECT A.id, A.firstname, A.lastname FROM Account A")
	out = []
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

def strip_line(line):
	for id, first, last in zip(ids, firstnames, lastnames):
		# prepended with some <alpha> in case they are variables
		# similarly, [1:] is used to avoid negative numbers
		line = re.sub(id, "id" + str(hash(id))[1:], line)
		line = re.sub(first, "first" + str(hash(first))[1:], line)
		line = re.sub(last, "last" + str(hash(last))[1:], line)
	return line

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

def recur(base):
	if not os.path.isdir(base):
		return
	sub_nodes = os.listdir(base)
	for n in sub_nodes:
		path = os.path.join(base, n)
		if os.path.isdir(path):
			resursive_strip(path)
		elif n == '.DS_Store':
			os.remove(path)
		elif not n.endswith('.tmp'):
			strip_file(base, n)

recur(base_dir)
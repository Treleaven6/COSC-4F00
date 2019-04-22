import sys
import json
import zipfile  
import os 
import shutil
import urllib
import traceback

# Used to handle testing

# validate URL parameters
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

cmd[3] = urllib.unquote(cmd[3])

# used to nuke files already uploaded
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

# extract zip to a special folder
def extract_zip(input_zip, folder):
	if not os.path.exists(input_zip) or os.path.isdir(input_zip):
		return
	input_zip = zipfile.ZipFile(input_zip, 'r')
	for name in input_zip.namelist():
		sections = name.split(os.sep)
		if '__MACOSX' in sections or len(sections) <= 1 or sections[-1].startswith('.'):
			continue
		if name.endswith(os.sep):
			#sections[0] = folder
			dir_path = os.path.join(*sections)
			dir_path = os.path.join(folder, dir_path)
			if not os.path.isdir(dir_path):
				os.makedirs(dir_path)
		else:
			#sections[0] = folder
			file_path = os.path.join(*(sections[:-1]))
			file_path = os.path.join(folder, file_path)
			if not os.path.exists(file_path):
				os.makedirs(file_path)
			file_path = os.path.join(file_path, sections[-1])
			with open(file_path, 'w+') as f:
				f.write(input_zip.read(name))

try:
	#dest_path = os.path.join(".", "uploads", cmd[1], cmd[2], "target")
	dest_path = os.path.join(".", "uploads", cmd[1], cmd[2])
	deltree(dest_path)
	zip_path = os.path.join(".", "uploads", cmd[1], cmd[2], cmd[3] + ".zip")
	extract_zip(zip_path, dest_path)
	os.remove(zip_path)
except:
	print(json.dumps(traceback.format_exc()))
	quit()

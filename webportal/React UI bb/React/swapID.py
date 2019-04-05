import sys
import json
import os
import urllib
import psycopg2
import string
import random
import db

cmd = sys.argv
if len(cmd) < 2:
    print(json.dumps("no argument"))
    quit()

cmd = cmd[1].split(".php/")
if not len(cmd) == 2:
    print(json.dumps("URI is too short or does not call .php"))
    quit()

def randomString(size=6, chars=string.ascii_uppercase + string.digits):
    #Generate a random string of fixed length 6
    return ''.join(random.choice(chars) for _ in range(size))

cmd = urllib.unquote(cmd[1])
cmd = cmd.split("/")

cnx = db.get_connection()
cursor = cnx.cursor()

query = ("SELECT FID.actual, FID.fake FROM FakeID FID WHERE FID.actual = '" + cmd[3] + "'")
success, records = db.exec_and_parse(cursor, cnx, query)
fake = None
if len(records) >= 1:
    fake = records[0]['fake']
else:
    fake = randomString(6)
    query = ("INSERT INTO FakeID (actual, fake) VALUES ('" + cmd[3] + "', '" + fake + "')")
    success, records = db.exec_and_parse(cursor, cnx, query)

print(fake)
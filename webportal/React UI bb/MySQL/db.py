import psycopg2
import json
import datetime

def get_connection():
  try:
    cnx = psycopg2.connect(host="localhost", database="c4f00g03", user="c4f00g03", password="j4g6x7b3")
    return cnx
  except psycopg2.OperationalError as err:
    print(json.dumps("check DB connection"))
    if cnx is not None:
      cnx.close()
    quit() 

# execute query, format response into an array of dictionaries
def exec_and_parse(cursor, cnx, query):
	out = []
	try:
		cursor.execute(query)
		cnx.commit()
	except psycopg2.Error as err:
		print(err)
		return(False, out)
	if not cursor.description:
		if cursor.rowcount > 0:
			return(True, out)
		else:
			return(False, out)
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
	return(True, out)


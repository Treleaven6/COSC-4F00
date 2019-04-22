import json
import StringIO

# Used to parse the response from MOCD into an object
def parse_to_object (contents):
	#f = open("result.txt", 'r')
	f = StringIO.StringIO(contents)

	# default object
	out = {}

	# state for the FSM
	pre_tabs = 99
	cur_tabs = 0

	# line numbers fr debugging
	i = 0

	# data to go in the out object
	top_stud = None
	top_file = None
	bot_stud = None
	grade = None

	# FSM
	while True:
		line = f.readline()
		if not line:
			break

		i += 1

		# get tabs on LHS
		cur_tabs = len(line.rstrip()) - len(line.strip())

		if cur_tabs == 0 and not line.isspace():
			top_stud = line.strip()
			out[top_stud] = {}
		elif cur_tabs == 1:
			top_file = line.strip()
			out[top_stud][top_file] = {}
		elif cur_tabs == 2:
			tmp = line.strip().split()
			bot_stud = tmp[0] + "_" + tmp[1]
			out[top_stud][top_file][bot_stud] = {}
			out[top_stud][top_file][bot_stud]["lines"] = []
		elif pre_tabs == 2 and cur_tabs == 3:
			grade = line.strip().split()[1]
			out[top_stud][top_file][bot_stud]["grade"] = grade
		elif pre_tabs == 3 and cur_tabs == 3:
			out[top_stud][top_file][bot_stud]["lines"].append(line.strip())

		pre_tabs = cur_tabs

	f.close()

	return out

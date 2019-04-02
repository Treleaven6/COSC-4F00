/* Liam Marcassa, 5893474 */

#include <iostream>
#include <sys/stat.h>
#include <fstream>

/* Liam Marcassa, 5893474 */

#include <iostream>
#include <sys/stat.h>
#include <fstream>

// THIS FUNCTION IS THE SAME BUT SIGNATURE HAS CHANGED
inline bool exists_test3 (const std::string& name, int x) {
  struct stat buffer;   
  return (stat (name.c_str(), &buffer) == 0); 
}

// Contains the entire graph
class DirectedGraph {
private:
	// An adjacency matrix, in the form edges[from][to]
	bool edges[20][20];
	// Vertex labels
	std::string labels[20];
	// the actual number of vertices 
	int vertices;

	// THIS FUNCTION IS EXACT SAME
	bool topo_recur (bool *visited, int *indegrees, int* results, int results_index) {
		int chosen = 0;
		// success if every vertex has been visited
		while (visited[chosen]) {
			chosen++;
			if (chosen >= vertices)
				return true;
		}

		chosen = 0;
		// failure if no univisted vertex has indegree zero
		while (visited[chosen] || indegrees[chosen] != 0) {
			chosen++;
			if (chosen >= vertices)
				return false;
		}

		// mark visited, save, decrement adjacent
		visited[chosen] = true;
		results[results_index++] = chosen;
		for (int j = 0; j < vertices; j++)
			if (edges[chosen][j])
				indegrees[j] = indegrees[j] - 1;

		// recurse
		return topo_recur(visited, indegrees, results, results_index);
	}

public:
	// THIS FUNCTION IS SAME BUT IN A DIFFERENT ORDER
	bool read_file (std::ifstream& f) {
		f>>vertices;
		if (f.eof() || f.fail() || f.bad())
			return false;

		int lim, from, to;
		f>>lim;
		if (f.eof() || f.fail() || f.bad())
			return false;

		for (int i = 0; i < 20; i++)
			for (int j = 0; j < 20; j++)
				edges[i][j] = false;

		// read labels, all happen to be 8 characters long
		char char_arr[9];
		char_arr[8] = '\0';
		for (int i = 0; i < vertices; i++) {
			for (int c = 0; c < 8; c++) {
				f>>char_arr[c];
				if (f.eof() || f.fail() || f.bad())
					return false;
			}
			labels[i] = std::string(char_arr);
		}

		// read edges
		for (int i = 0; i < lim; i++) {
			f>>from>>to;
			if ((f.eof() || f.fail() || f.bad()) && i != lim-1)
				return false;
			edges[from][to] = true;
		}

		return true;
	}

	// for pretty printing
	friend std::ostream & operator<<(std::ostream &os, const DirectedGraph &ug);

	// THIS FUNCTION HAS SAME SIGNATURE BUT IS COMPLETELY DIFFERENT
	void topo_sort () {
		std::cout<<"not the same";
		// do nothing
		
		for (int x = 0; x < 10; x++) {
			std::cout<<x;
		}
	}

	// THIS FUNCTION IS BRAND NEW
	void another_func () {
		std::cout<<"new";
	}
};

// THIS FUNCTION IS A SHELL
std::ostream & operator<<(std::ostream &os, const DirectedGraph &dg) {
	return os;
}

// THIS IS ALMOST EXACT SAME
int main () {
	// get file name
	std::string file_name;
	std::cout<<"Graph filename: ";
	std::cin>>file_name;
	std::cin.clear();
	std::cin.ignore(100, '\n');
	std::cout<<"Using "<<file_name<<std::endl;
	
	// make sure file exists
	if (!exists_test3(file_name, 0)) {
		std::cout<<"Could not find "<<file_name<<std::endl;
		return 1;
	}

	// create graph from file
	std::ifstream f;
	f.open(file_name);
	std::cout<<"File loaded."<<std::endl<<std::endl;
	DirectedGraph dg;
	if (dg.read_file(f)) {
		std::cout<<"Loaded graph."<<std::endl;
		f.close();
	} else {
		std::cout<<"Failed to load graph."<<std::endl;
		f.close();
		return 1;
	}

	// print graph
	std::cout<<dg<<std::endl;

	dg.another_func();
	
	// perform and display topological sort
	dg.topo_sort();
	
	return 0;
}

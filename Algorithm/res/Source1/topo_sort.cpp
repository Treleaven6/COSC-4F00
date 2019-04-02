/* Liam Marcassa, 5893474 */

#include <iostream>
#include <sys/stat.h>
#include <fstream>

// https://stackoverflow.com/questions/12774207/fastest-way-to-check-if-a-file-exist-using-standard-c-c11-c
inline bool exists_test3 (const std::string& name) {
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

	// implements the topological sort algorithm outlined in the assignment
	// results are saved so they can be printed later
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
	// read from file, populate member variables
	bool read_file (std::ifstream& f) {
		f>>vertices;
		if (f.eof() || f.fail() || f.bad())
			return false;

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


		for (int i = 0; i < 20; i++)
			for (int j = 0; j < 20; j++)
				edges[i][j] = false;

		int lim, from, to;
		f>>lim;
		if (f.eof() || f.fail() || f.bad())
			return false;

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

	// entrance to recursive topological sort
	void topo_sort () {
		// init empty
		bool visited[vertices];
		for (int i = 0; i < vertices; i++)
			visited[i] = false;

		// count indegrees
		int indegrees[vertices];
		for (int i = 0; i < vertices; i++)
			indegrees[i] = 0;
		for (int i = 0; i < vertices; i++)
			for (int j = 0; j < vertices; j++)
				if (edges[j][i])
					indegrees[i] = indegrees[i] + 1;

		// for the return data
		int results[vertices];

		// report results
		if (topo_recur(visited, indegrees, results, 0)) {
			std::cout<<"Topological Sort found!"<<std::endl;
			for (int i = 0; i < vertices; i++)
				std::cout<<" "<<labels[results[i]];
			std::cout<<std::endl;
		} else {
			std::cout<<"Cyclic dependencies; no topological sort possible."<<std::endl;
		}
	}
};

// pretty print a graph
std::ostream & operator<<(std::ostream &os, const DirectedGraph &dg) {
	// list vertex labels
	os<<"Vertices:"<<std::endl;
	for (int i = 0; i < dg.vertices-1; i++)
		os<<"["<<i<<":"<<dg.labels[i]<<"], ";
	os<<"["<<dg.vertices-1<<":"<<dg.labels[dg.vertices-1]<<"]"<<std::endl<<std::endl;

	// list edges per vertex
	os<<"Edges:"<<std::endl;
	for (int i = 0; i < dg.vertices; i++) {
		os<<dg.labels[i]<<" -> ";
		bool first = true;
		for (int j = 0; j < dg.vertices; j++) {
			if (dg.edges[i][j]) {
				if (first) {
					os<<dg.labels[j];
					first = false;
				} else {
					os<<","<<dg.labels[j];
				}
			}
		}
		os<<std::endl;
	}

	return os;
}

int main () {
	// get file name
	std::string file_name;
	std::cout<<"Graph filename: ";
	std::cin>>file_name;
	std::cin.clear();
	std::cin.ignore(100, '\n');
	std::cout<<"Using "<<file_name<<std::endl;
	
	// make sure file exists
	if (!exists_test3(file_name)) {
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
	
	// perform and display topological sort
	dg.topo_sort();
	
	return 0;
}
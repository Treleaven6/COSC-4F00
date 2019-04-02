#include "Set.h"
#include <sstream>

// Helpful for immutable types
Set::Set(const bool elements[255], int capacity) {
	for (int i = 0; i < capacity; i++) this->elements[i] = elements[i];
	for (int i = capacity; i < 255; i++) this->elements[i] = false;
	this->capacity = capacity;
}

Set::Set() {
	for (int i = 0; i < 255; i++) elements[i] = false;
	capacity = 0;
}

Set::Set(short capacity) {
	for (int i = 0; i < capacity; i++) elements[i] = true;
	for (int i = capacity; i < 255; i++) elements[i] = false;
	this->capacity = capacity;
}

// Union
Set Set::operator+(const Set &other) const {
	bool tmp[255];
	for (int i = 0; i < 255; i++) {
		tmp[i] = elements[i] | other[i];
	}
	return Set(tmp, (other.getCapacity()>capacity)?other.getCapacity():capacity);
}

// Technically union; effectively 'add element'
Set Set::operator+(const int &other) const {
	bool tmp[255];
	for (int i = 0; i < capacity; i++) tmp[i] = elements[i];
	for (int i = capacity; i < 255; i++) tmp[i] = false;
	tmp[other] = true;
	return Set(tmp, (other+1>capacity)?other+1:capacity);
}

// Difference
Set Set::operator-(const Set &other) const {
	bool tmp[255];
	for (int i = 0; i < capacity; i++) tmp[i] = (elements[i])?!other[i]:false;
	return Set(tmp, capacity);
}

// Effectively 'remove element if present'
Set Set::operator-(const int &other) const {
	if (other >= capacity) return Set(elements, capacity);
	bool tmp[255];
	for (int i = 0; i < capacity; i++) tmp[i] = elements[i];
	tmp[other] = false;
	return Set(tmp, capacity);
}

// Intersection
Set Set::operator^(const Set &other) const { //Intersection
	bool tmp[255];
	for (int i = 0; i < 255; i++) tmp[i] = elements[i] & other[i];
	return Set(tmp, (other.getCapacity()>capacity)?other.getCapacity():capacity);
}

// Intersection with element
Set Set::operator^(const int &other) const {
	bool tmp[255];
	for (int i = 0; i < 255; i++) tmp[i] = false;
	tmp[other] = elements[other];
	return Set(tmp, (other+1>capacity)?other+1:capacity);
}

// Complement
Set Set::operator~() const {
	bool tmp[255];
	for (int i = 0; i < capacity; i++) tmp[i] = !elements[i];
	return Set(tmp, capacity);
}

// Set of universe
Set Set::operator+() const {
	return Set(capacity);
}

// Empty set (with same capacity, of course)
Set Set::operator-() const {
	bool tmp[255];
	for (int i = 0; i < 255; i++) tmp[i] = false;
	return Set(tmp, capacity);
}

// Subset
bool Set::operator<=(const Set &other) const {
	for (int i = 0; i < 255; i++)
		if (elements[i] && !other[i])
			return false;
	return true;
}

// Strict subset
bool Set::operator<(const Set &other) const {
	bool strict = false;
	for (int i = 0; i < 255; i++) {
		if (elements[i] && !other[i]) {
			return false;
		} else if (!strict && elements[i] != other[i]) {
			strict = true;
		}
	}
	return strict;
}

// Superset
bool Set::operator>=(const Set &other) const {
	for (int i = 0; i < 255; i++)
		if (other[i] && !elements[i])
			return false;
	return true;
}

// Strict superset
bool Set::operator>(const Set &other) const {
	bool strict = false;
	for (int i = 0; i < 255; i++) {
		if (other[i] && !elements[i]) {
			return false;
		} else if (!strict && elements[i] != other[i]) {
			strict = true;
		}
	}
	return strict;
}

// Test for set equality
bool Set::operator==(const Set &other) const {
	for (int i = 0; i < 255; i++)
		if (elements[i] != other[i])
			return false;
	return true;
}

// Test for set inequality
bool Set::operator!=(const Set &other) const {
	return !((*this)==other);
}

// Test for empty set
bool Set::operator!() const {
	for (int i = 0; i < 255; i++)
		if (elements[i])
			return false;
	return true;
}

// Cardinality of set. i.e. |Set|
int Set::operator()() const {
	int out = 0;
	for (int i = 0; i < capacity; i++)
		if (elements[i])
			out++;
	return out;
}

// Test for 'is element of'
bool Set::operator[](const int &pos) const {
	return elements[pos];
}

std::ostream& operator<<(std::ostream &out, const Set &set) {
	out<<'{';
	int r = 0;
	int i = 1;
	int lim = set();
	if (lim > 0) {
		while (i < lim) {
			if (set.elements[r]) {
				out<<r<<',';
				i++;
			}
			r++;
		}
		while (true) {
			if (set.elements[r]) {
				out<<r;
				break;
			}
			r++;
		}
	}
	out<<'}';
	return out;
}

std::istream& operator>>(std::istream &in, Set &set) {
	bool arr[255];
	int cap=set.capacity;
	char open;
	in>>open;
	if (in.fail() || open!='{') {
		in.setstate(std::ios::failbit);
		return in;
	}
	for (int i=0;i<cap;i++)
		arr[i]=false;
	std::string buff;
	std::getline(in,buff,'}');
	std::stringstream ss(buff);
	std::string field;
	while (true) {
		std::getline(ss,field,',');
	if (ss.fail()) break;
		int el;
		std::stringstream se(field);
		se>>el;
		if (el>=0&&el<cap)
			arr[el]=true;
	}
	set=Set(arr,cap);
	return in;
}

// Cardinality of universe. i.e. |Universe| (or just 'capacity')
int Set::getCapacity() const {
	return capacity;
}
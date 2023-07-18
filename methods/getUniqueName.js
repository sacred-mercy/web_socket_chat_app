function getUniqueName(name, set) {
	// check if name is already in the set
	console.log("name: ", name);
	if (set.has(name)) {
		// if it is, add a random number to the end of the name
		name = name + Math.floor(Math.random() * 10000);
		// check if the new name is in the set
		if (set.has(name)) {
			// if it is, recursively call getUniqueName until a unique name is found
			getUniqueName(name, set);
		} else {
			// if it is not, return the new name
			return name;
		}
	} else {
		// if the name is not in the set, return the name
		return name;
	}
}

module.exports = getUniqueName;

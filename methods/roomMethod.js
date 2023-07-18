const express = require("express");
const fs = require("fs");
const getUniqueName = require("./getUniqueName");

function getRooms() {
	return new Promise((resolve, reject) => {
		fs.readFile("./db/roomDB.json", (err, data) => {
			if (err) throw err;
			let rooms = JSON.parse(data);
			resolve(rooms);
		});
	});
}

function createRoom(name) {
	return new Promise((resolve, reject) => {
		getRooms().then((rooms) => {
			name = getUniqueName(name, new Set(rooms));
			rooms.push(name);
			fs.writeFile("./db/roomDB.json", JSON.stringify(rooms), (err) => {
				if (err) throw err;
				resolve(name);
			});
		});
	});
}

module.exports = {
	getRooms,
	createRoom,
};

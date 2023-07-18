const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const XMLHttpRequest = require("xhr2");
const port = 3000;

app.use(express.static("public"));
app.set("views", "./views");

// import methods
const getRandomName = require("./methods/getRandomName");
const getUniqueName = require("./methods/getUniqueName");

// import router
const roomRouter = require("./router/room");

// use router
app.use("/room", roomRouter);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("index", {
		roomName: "Global",
	});
});

// hashSet to store online users unique names
let onlineUsers = new Set();

let roomName = " f f f f";

io.on("connection", (socket) => {
	// get random name
	let name = getRandomName();

	// get unique name
	name = getUniqueName(name, onlineUsers);
	onlineUsers.add(name);

	// send user name to client
	io.to(socket.id).emit("userName", name);

	// ask room name from client
	io.to(socket.id).emit("roomName", roomName);

	socket.on("join room", async (newRoomName) => {
		socket.leave(roomName);
		// socket.to(roomName).emit("connectionMsz", `${name} left the chat`);
		socket.join(newRoomName);
		roomName = newRoomName;

		socket.to(roomName).emit("connectionMsz", `${name} joined the chat`);

		// send online users count in that room
		let onlineUsersCount = await io.in(roomName).fetchSockets();
		io.in(roomName).emit("onlineUsers", onlineUsersCount.length);
	});

	socket.on("disconnect", async function () {
		socket.to(roomName).emit("connectionMsz", `${name} left the chat`);
		io.in(roomName).emit("onlineUsers", await io.in(roomName).fetchSockets());
	});

	socket.on("typing", (msg) => {
		if (msg != "") {
			socket.broadcast.emit("typing", `${name} is typing...`);
		} else {
			socket.broadcast.emit("typing", "");
		}
	});

	socket.on("chat message", (msg) => {
		let reply = {
			name: name,
			msg: msg.msg,
		};
		socket.in(msg.roomName).emit("chat message", reply);
	});
});

http.listen(port, () => {
	console.log(`running at http://localhost:${port}/`);
});

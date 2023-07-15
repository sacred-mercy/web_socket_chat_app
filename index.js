const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const XMLHttpRequest = require("xhr2");
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "https://names.drycodes.com/1?nameOptions=boy_names");
	xhr.send();
	xhr.onload = function () {
		let name = JSON.parse(xhr.response);
		name = name[0].split("_");

		socket.broadcast.emit("connectionMsz", `${name[0]} joined the chat`);

		socket.on("disconnect", function () {
			socket.broadcast.emit("connectionMsz", `${name[0]} left the chat`);
		});

		socket.on("typing", (msg) => {
			if (msg != ""){
				socket.broadcast.emit("typing", `${name[0]} is typing...`);
			} else {
				socket.broadcast.emit("typing", "");
			}
		});

		socket.on("chat message", (msg) => {
			msg = `${name[0]}: ${msg}`;
			socket.broadcast.emit("chat message", msg);
		});

		socket.on("getOnlineUsers", () => {
			socket.emit("onlineUsers", io.engine.clientsCount);
		});
	};
});

http.listen(port, () => {
	console.log(`Socket.IO server running at http://localhost:${port}/`);
});

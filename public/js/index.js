let socket = io();

let messages = document.getElementById("messages");
let typing = document.getElementById("typing");
let form = document.getElementById("form");
let input = document.getElementById("input");
let joinedAndLeft = document.getElementById("joinedAndLeft");
let receivedMsg = document.getElementById("receivedMsg");
let sentMsg = document.getElementById("sentMsg");
joinedAndLeft.remove();
receivedMsg.remove();
sentMsg.remove();
receivedMsg.classList.remove("hidden");
sentMsg.classList.remove("hidden");

// join room
let roomName = document.getElementById("roomName").innerText;

socket.on("roomName", () => {
	socket.emit("join room", roomName);
	console.log("roomName: ", roomName);
});

socket.on("userName", (name) => {
	document.getElementById("userName").innerText = name;
});

form.addEventListener("submit", function (e) {
	e.preventDefault();
	if (input.value) {
		let msg = {
			msg: input.value,
			roomName: roomName,
		};
		input.value = "";
		let item = sentMsg.cloneNode(true);
		item.innerText = msg.msg;
		messages.appendChild(item);
		window.scrollTo(0, document.body.scrollHeight);
		socket.emit("chat message", msg);
	}
});

function inputTyping() {
	let msg = input.value;
	msg = msg.trim();
	if (msg != "") {
		socket.emit("typing", "typing...");
	} else {
		socket.emit("typing", "");
	}
}

socket.on("typing", function (msg) {
	if (msg == "") {
		typing.innerText = "";
		return;
	}
	typing.innerText = msg;
	typing.style.color = "red";
	window.scrollTo(0, document.body.scrollHeight);
});

socket.on("connectionMsz", function (msg) {
	let item = joinedAndLeft.cloneNode(true);
	item.innerText = msg;
	messages.appendChild(item);
	window.scrollTo(0, document.body.scrollHeight);
});

socket.on("chat message", function (msg) {
	let item = receivedMsg.cloneNode(true);
	item.querySelector(".senderName").innerText = msg.name;
	item.querySelector(".msg").innerText = msg.msg;
	messages.appendChild(item);
	window.scrollTo(0, document.body.scrollHeight);
});

socket.on("onlineUsers", function (msg) {
	let item = document.getElementById("onlineUsersCount");
	item.innerText = msg;
});

const express = require("express");
const router = express.Router();

const { getRooms, createRoom } = require("../methods/roomMethod");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router
	.route("/create")
	.get((req, res) => res.render("createRoom"))
	.post((req, res) => {
		const { roomName } = req.body;
		createRoom(roomName).then((roomName) => {
			res.redirect(`/room/${roomName}`);
		});
	});

router
	.route("/join")
	.get((req, res) => res.render("joinRoom"))
	.post((req, res) => {
		const { roomName } = req.body;
		getRooms().then((rooms) => {
			if (rooms.includes(roomName)) {
				res.redirect(`/room/${roomName}`);
			} else {
				res.render("joinRoom", { error: "Room not found" });
			}
		});
	});

router.route("/:roomName").get((req, res) => {
	const { roomName } = req.params;
	getRooms().then((rooms) => {
		if (rooms.includes(roomName)) {
			res.render("index", { roomName });
		} else {
			res.render("joinRoom", { error: "Room not found" });
		}
	});
});

module.exports = router;

const express = require("express");
const sessionController = require("../Controllers/session.controller");
const auth = require("../middlewares/auth");
const deanAuth = require("../middlewares/deanAuth");
const router = express.Router();

//api/session/freeSessions
router.get("/freeSessions", auth(), sessionController.getFreeSessions);

//api/session/bookSession
router.post("/bookSession", auth(), sessionController.bookSession);

//api/session/pendingSession
router.get("/pendingSession", deanAuth(), sessionController.pendingSession);

//api/session/updateSession
router.put("/updateSession", deanAuth(), sessionController.updateSession);

module.exports = router;

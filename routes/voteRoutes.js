const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");

// Q8 Cast Vote
router.post("/", voteController.castVote);

module.exports = router;

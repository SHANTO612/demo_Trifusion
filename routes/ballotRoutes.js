const express = require("express");
const router = express.Router();
const ballotController = require("../controllers/ballotController");


// Q16 Encrypted Ballot
router.post("/encrypted", ballotController.encryptedBallot);

// Q19 Ranked-Choice Ballot
router.post("/ranked", ballotController.rankedBallot);

module.exports = router;

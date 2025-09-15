const express = require("express");
const router = express.Router();
const resultsController = require("../controllers/resultsController");

// Q11 Leaderboard
router.get("/", resultsController.getResults);
// Q12 Winner
router.get("/winner", resultsController.getWinners);
// Q17 Homomorphic Tally
router.post("/homomorphic", resultsController.homomorphicTally);

module.exports = router;

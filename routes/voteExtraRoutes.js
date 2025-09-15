const express = require("express");
const router = express.Router();
const voteExtraController = require("../controllers/voteExtraController");

// Q13 Vote Timeline
router.get("/timeline", voteExtraController.voteTimeline);
// Q14 Weighted Vote
router.post("/weighted", voteExtraController.weightedVote);
// Q15 Vote Range
router.get("/range", voteExtraController.voteRange);

module.exports = router;

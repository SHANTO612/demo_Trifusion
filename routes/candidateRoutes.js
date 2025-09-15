const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

// Q6 Register Candidate
router.post("/", candidateController.registerCandidate);


// Q7 List Candidates (with optional party filter)
router.get("/", candidateController.listCandidates);

// Q9 Get Candidate Votes
const voteController = require("../controllers/voteController");
router.get("/:candidate_id/votes", voteController.getCandidateVotes);

module.exports = router;

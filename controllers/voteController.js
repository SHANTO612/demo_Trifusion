const { votes, voters, candidates } = require("../models/schema");
const { eq } = require("drizzle-orm");
const { db } = require("../models/db");

// Q8 Cast Vote
exports.castVote = async (req, res) => {
  const { voter_id, candidate_id } = req.body;
  // Check if voter has already voted
  const voter = db.select().from(voters).where(eq(voters.voter_id, voter_id)).get();
  if (!voter) return res.status(404).json({ message: `voter with id: ${voter_id} not found` });
  if (voter.has_voted) {
    return res.status(423).json({ message: `voter with id: ${voter_id} has already voted` });
  }
  // Insert vote with explicit ISO timestamp
  const cast_at = new Date().toISOString();
  const result = db.insert(votes).values({ voter_id, candidate_id, cast_at }).run();
  // Mark voter as has_voted
  db.update(voters).set({ has_voted: 1 }).where(eq(voters.voter_id, voter_id)).run();
  // Get inserted vote
  const vote = db.select().from(votes).where(eq(votes.vote_id, result.lastInsertRowid)).get();
  // Format timestamp as 'YYYY-MM-DDTHH:mm:ssZ', fallback to original if invalid
  let timestamp = vote.cast_at;
  let formatted = timestamp;
  if (timestamp) {
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) {
      formatted = d.toISOString().replace(/\.\d{3}Z$/, 'Z');
    }
  }
  res.status(228).json({
    vote_id: vote.vote_id,
    voter_id: vote.voter_id,
    candidate_id: vote.candidate_id,
    timestamp: formatted
  });
};

// Q9 Get Candidate Votes
exports.getCandidateVotes = async (req, res) => {
  const { candidate_id } = req.params;
  const count = db.select().from(votes).where(eq(votes.candidate_id, candidate_id)).all().length;
  res.status(229).json({ candidate_id: Number(candidate_id), votes: count });
};

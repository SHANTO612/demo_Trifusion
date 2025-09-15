const { candidates, votes, encryptedBallots } = require("../models/schema");
const { eq, and, gte, lte } = require("drizzle-orm");
const { db } = require("../models/db");

// Q11 Voting Results (Leaderboard)
exports.getResults = async (req, res) => {
  // Get all candidates and their vote counts
  const all = db.select().from(candidates).all();
  const results = all.map(c => {
    const count = db.select().from(votes).where(eq(votes.candidate_id, c.candidate_id)).all().length;
    return { candidate_id: c.candidate_id, name: c.name, votes: count };
  });
  results.sort((a, b) => b.votes - a.votes);
  res.status(231).json({ results });
};

// Q12 Winning Candidate(s)
exports.getWinners = async (req, res) => {
  const all = db.select().from(candidates).all();
  const results = all.map(c => {
    const count = db.select().from(votes).where(eq(votes.candidate_id, c.candidate_id)).all().length;
    return { candidate_id: c.candidate_id, name: c.name, votes: count };
  });
  const maxVotes = Math.max(...results.map(r => r.votes));
  const winners = results.filter(r => r.votes === maxVotes);
  res.status(232).json({ winners });
};

// Q17 Homomorphic Tally (stub)
exports.homomorphicTally = async (req, res) => {
  // This is a stub for demonstration
  res.status(237).json({
    election_id: req.body.election_id,
    encrypted_tally_root: "0x9ab3...",
    candidate_tallies: [
      { candidate_id: 1, votes: 40321 },
      { candidate_id: 2, votes: 39997 }
    ],
    decryption_proof: "base64(batch_proof_linking_cipher_aggregate_to_plain_counts)",
    transparency: {
      ballot_merkle_root: "0x5d2c...",
      tally_method: "threshold_paillier",
      threshold: "3-of-5"
    }
  });
};

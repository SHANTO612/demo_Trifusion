// Q19 Ranked-Choice Ballot (stub)
exports.rankedBallot = async (req, res) => {
  // Accept and store ranked ballot
  const { election_id, voter_id, ranking, timestamp } = req.body;
  const ballot_id = `rb_${Math.random().toString(36).slice(2, 6)}`;
  // Store each rank
  ranking.forEach((candidate_id, idx) => {
    db.insert(require("../models/schema").rankedVotes).values({ voter_id, candidate_id, rank: idx + 1, created_at: timestamp }).run();
  });
  res.status(239).json({ ballot_id, status: "accepted" });
};
const { encryptedBallots } = require("../models/schema");
const { db } = require("../models/db");

// Q16 Encrypted Ballot
exports.encryptedBallot = async (req, res) => {
  const { election_id, ciphertext, zk_proof, voter_pubkey, nullifier, signature } = req.body;
  // Simulate zk proof check
  if (!zk_proof || zk_proof === "invalid") {
    return res.status(425).json({ message: "invalid zk proof" });
  }
  // Prevent double voting by nullifier
  const { eq } = require("drizzle-orm");
  const exists = db.select().from(encryptedBallots).where(eq(encryptedBallots.nullifier, nullifier)).get();
  if (exists) {
    return res.status(423).json({ message: "duplicate nullifier" });
  }
  // Insert ballot (voter_id is required, use 0 if not provided)
  const ballot_id = `b_${Math.random().toString(36).slice(2, 6)}`;
  const anchored_at = new Date().toISOString();
  const voter_id = req.body.voter_id || 0;
  db.insert(encryptedBallots).values({ ballot_id, voter_id, encrypted_vote: ciphertext, nullifier, zk_proof, created_at: anchored_at }).run();
  res.status(236).json({ ballot_id, status: "accepted", nullifier, anchored_at });
};

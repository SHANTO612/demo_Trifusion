const { votes, voters } = require("../models/schema");
const { eq, and, gte, lte } = require("drizzle-orm");
const { db } = require("../models/db");

// Q13 Vote Timeline
exports.voteTimeline = async (req, res) => {
  const candidate_id = req.query.candidate_id;
  if (!candidate_id) return res.status(400).json({ message: "candidate_id required" });
  const timeline = db.select().from(votes).where(eq(votes.candidate_id, candidate_id)).all()
    .map(v => {
      let timestamp = v.cast_at;
      let formatted = timestamp;
      if (timestamp) {
        const d = new Date(timestamp);
        if (!isNaN(d.getTime())) {
          formatted = d.toISOString().replace(/\.\d{3}Z$/, 'Z');
        }
      }
      return { vote_id: v.vote_id, timestamp: formatted };
    });
  res.status(233).json({ candidate_id: Number(candidate_id), timeline });
};

// Q14 Conditional Vote Weight
exports.weightedVote = async (req, res) => {
  const { voter_id, candidate_id } = req.body;
  const voter = db.select().from(voters).where(eq(voters.voter_id, voter_id)).get();
  if (!voter) return res.status(404).json({ message: `voter with id: ${voter_id} not found` });
  if (voter.has_voted) return res.status(423).json({ message: `voter with id: ${voter_id} has already voted` });
  const weight = voter.profile_complete ? 2 : 1;
  const result = db.insert(votes).values({ voter_id, candidate_id, weight }).run();
  db.update(voters).set({ has_voted: 1 }).where(eq(voters.voter_id, voter_id)).run();
  const vote = db.select().from(votes).where(eq(votes.vote_id, result.lastInsertRowid)).get();
  res.status(234).json({ vote_id: vote.vote_id, voter_id, candidate_id, weight });
};

// Q15 Range Vote Queries
exports.voteRange = async (req, res) => {
  const { candidate_id, from, to } = req.query;
  if (!candidate_id || !from || !to) return res.status(400).json({ message: "candidate_id, from, to required" });
  if (from > to) return res.status(424).json({ message: "invalid interval: from > to" });
  const votesInRange = db.select().from(votes)
    .where(and(eq(votes.candidate_id, candidate_id), gte(votes.cast_at, from), lte(votes.cast_at, to))).all();
  res.status(235).json({ candidate_id: Number(candidate_id), from, to, votes_gained: votesInRange.length });
};

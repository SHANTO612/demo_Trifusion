const { candidates } = require("../models/schema");
const { eq } = require("drizzle-orm");
const { db } = require("../models/db");

// Q6 Register Candidate
exports.registerCandidate = async (req, res) => {
  const { candidate_id, name, party } = req.body;
  // Insert candidate with 0 votes
  db.insert(candidates).values({ candidate_id, name, party }).run();
  res.status(226).json({ candidate_id, name, party, votes: 0 });
};

// Q7 List Candidates
exports.listCandidates = async (req, res) => {
  let all;
  if (req.query.party) {
    all = db.select().from(candidates).where(eq(candidates.party, req.query.party)).all();
    const filtered = all.map(({ candidate_id, name, party }) => ({ candidate_id, name, party }));
    return res.status(230).json({ candidates: filtered });
  } else {
    all = db.select().from(candidates).all();
    const filtered = all.map(({ candidate_id, name, party }) => ({ candidate_id, name, party }));
    res.status(227).json({ candidates: filtered });
  }
};

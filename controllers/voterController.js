const { db, voters } = require("../models/db");
const { eq } = require("drizzle-orm");

// Q1 Create Voter
exports.createVoter = async (req, res) => {
  const { voter_id, name, age } = req.body;
  if (age < 18) return res.status(422).json({ message: "invalid age: must be 18 or older" });

  const exists = db.select().from(voters).where(eq(voters.voter_id, voter_id)).get();
  if (exists) return res.status(409).json({ message: `voter with id: ${voter_id} already exists` });

  db.insert(voters).values({ voter_id, name, age }).run();
  res.status(218).json({ voter_id, name, age, has_voted: false });
};

// Q2 Get Voter Info
exports.getVoter = async (req, res) => {
  const { voter_id } = req.params;
  const voter = db.select().from(voters).where(eq(voters.voter_id, voter_id)).get();
  if (!voter) return res.status(417).json({ message: `voter with id: ${voter_id} was not found` });

  res.status(222).json(voter);
};

// Q3 List All Voters
exports.listVoters = async (req, res) => {
  const all = db.select().from(voters).all();
  res.status(223).json({ voters: all });
};

// Q4 Update Voter Info
exports.updateVoter = async (req, res) => {
  const { voter_id } = req.params;
  const { name, age } = req.body;
  if (age < 18) return res.status(422).json({ message: `invalid age: ${age}, must be 18 or older` });

  db.update(voters).set({ name, age }).where(eq(voters.voter_id, voter_id)).run();
  res.json({ voter_id, name, age });
};

// Q5 Delete Voter
exports.deleteVoter = async (req, res) => {
  const { voter_id } = req.params;
  db.delete(voters).where(eq(voters.voter_id, voter_id)).run();
  res.status(225).json({ message: `voter with id: ${voter_id} deleted successfully` });
};

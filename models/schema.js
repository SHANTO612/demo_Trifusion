const { sqliteTable, integer, text, real } = require("drizzle-orm/sqlite-core");

// Voters
const voters = sqliteTable("voters", {
  voter_id: integer("voter_id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  has_voted: integer("has_voted").notNull().default(0),
  profile_complete: integer("profile_complete").notNull().default(0)
});

// Candidates
const candidates = sqliteTable("candidates", {
  candidate_id: integer("candidate_id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  party: text("party"),
  created_at: text("created_at").default("CURRENT_TIMESTAMP")
});

// Votes
const votes = sqliteTable("votes", {
  vote_id: integer("vote_id").primaryKey({ autoIncrement: true }),
  voter_id: integer("voter_id").notNull(),
  candidate_id: integer("candidate_id").notNull(),
  weight: real("weight").notNull().default(1.0),
  cast_at: text("cast_at").default("CURRENT_TIMESTAMP")
});

// Ranked-choice ballots
const rankedVotes = sqliteTable("ranked_votes", {
  ranked_vote_id: integer("ranked_vote_id").primaryKey({ autoIncrement: true }),
  voter_id: integer("voter_id").notNull(),
  candidate_id: integer("candidate_id").notNull(),
  rank: integer("rank").notNull(),
  created_at: text("created_at").default("CURRENT_TIMESTAMP")
});

// Encrypted ballots
const encryptedBallots = sqliteTable("encrypted_ballots", {
  ballot_id: text("ballot_id").primaryKey(),
  voter_id: integer("voter_id").notNull(),
  encrypted_vote: text("encrypted_vote").notNull(),
  nullifier: text("nullifier").unique().notNull(),
  zk_proof: text("zk_proof").notNull(),
  created_at: text("created_at").default("CURRENT_TIMESTAMP")
});

// Audits
const auditLogs = sqliteTable("audit_logs", {
  audit_id: integer("audit_id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  details: text("details"),
  created_at: text("created_at").default("CURRENT_TIMESTAMP")
});

module.exports = { voters, candidates, votes, rankedVotes, encryptedBallots, auditLogs };

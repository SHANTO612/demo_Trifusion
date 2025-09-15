
const Database = require("better-sqlite3");
const { drizzle } = require("drizzle-orm/better-sqlite3");
const { voters, candidates, votes, rankedVotes, encryptedBallots, auditLogs } = require("./schema");

const sqliteDb = new Database("./data/voting.db");

// Migration: Create tables if they do not exist
sqliteDb.exec(`
CREATE TABLE IF NOT EXISTS voters (
	voter_id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	age INTEGER NOT NULL,
	has_voted INTEGER NOT NULL DEFAULT 0,
	profile_complete INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS candidates (
	candidate_id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	party TEXT,
	created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS votes (
	vote_id INTEGER PRIMARY KEY AUTOINCREMENT,
	voter_id INTEGER NOT NULL,
	candidate_id INTEGER NOT NULL,
	weight REAL NOT NULL DEFAULT 1.0,
	cast_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS ranked_votes (
	ranked_vote_id INTEGER PRIMARY KEY AUTOINCREMENT,
	voter_id INTEGER NOT NULL,
	candidate_id INTEGER NOT NULL,
	rank INTEGER NOT NULL,
	created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS encrypted_ballots (
	ballot_id TEXT PRIMARY KEY,
	voter_id INTEGER NOT NULL,
	encrypted_vote TEXT NOT NULL,
	nullifier TEXT UNIQUE NOT NULL,
	zk_proof TEXT NOT NULL,
	created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS audit_logs (
	audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
	action TEXT NOT NULL,
	details TEXT,
	created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

const db = drizzle(sqliteDb);

module.exports = { db, voters, candidates, votes, rankedVotes, encryptedBallots, auditLogs };

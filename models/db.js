// const Database = require("better-sqlite3");
// const { drizzle } = require("drizzle-orm/better-sqlite3");
// const { members, books, transactions, reservations } = require("./schema");



// const sqliteDb = new Database("./data/trifusion.db");
// const db = drizzle(sqliteDb);

// // Initialize tables if they don't exist
// sqliteDb.exec(`
//   CREATE TABLE IF NOT EXISTS members (
//     member_id INTEGER PRIMARY KEY,
//     name TEXT NOT NULL,
//     age INTEGER NOT NULL,
//     has_borrowed BOOLEAN NOT NULL DEFAULT 0
//   );
//   CREATE TABLE IF NOT EXISTS books (
//     book_id INTEGER PRIMARY KEY,
//     title TEXT NOT NULL,
//     author TEXT NOT NULL,
//     is_available BOOLEAN NOT NULL DEFAULT 1
//   );
//   CREATE TABLE IF NOT EXISTS transactions (
//     transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
//     member_id INTEGER NOT NULL,
//     book_id INTEGER NOT NULL,
//     borrowed_at TEXT NOT NULL,
//     returned_at TEXT,
//     status TEXT NOT NULL,
//     FOREIGN KEY (member_id) REFERENCES members(member_id),
//     FOREIGN KEY (book_id) REFERENCES books(book_id)
//   );
//   CREATE TABLE IF NOT EXISTS reservations (
//     reservation_id TEXT PRIMARY KEY,
//     member_id INTEGER NOT NULL,
//     book_id INTEGER NOT NULL,
//     created_at TEXT NOT NULL,
//     expires_at TEXT NOT NULL,
//     reservation_status TEXT NOT NULL,
//     queue_position INTEGER NOT NULL,
//     priority_score REAL NOT NULL,
//     reservation_type TEXT NOT NULL,
//     fee_paid REAL NOT NULL,
//     FOREIGN KEY (member_id) REFERENCES members(member_id),
//     FOREIGN KEY (book_id) REFERENCES books(book_id)
//   );
// `);

// module.exports = { db, members, books, transactions, reservations };

const Database = require("better-sqlite3");
const { drizzle } = require("drizzle-orm/better-sqlite3");
const { members, books, transactions, reservations } = require("./schema");

const sqliteDb = new Database("./data/trifusion.db");
const db = drizzle(sqliteDb);

// Initialize tables if they don't exist
sqliteDb.exec(`
  CREATE TABLE IF NOT EXISTS members (
    member_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    has_borrowed INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS books (
    book_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT NOT NULL,
    is_available INTEGER NOT NULL DEFAULT 1,
    category TEXT,
    published_date TEXT,
    rating REAL,
    borrowing_count INTEGER DEFAULT 0,
    popularity_score REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    borrowed_at TEXT NOT NULL,
    returned_at TEXT,
    due_date TEXT,          -- <-- Add this
    status TEXT NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
  );

  CREATE TABLE IF NOT EXISTS reservations (
    reservation_id TEXT PRIMARY KEY,
    member_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    reservation_status TEXT NOT NULL,
    queue_position INTEGER NOT NULL,
    priority_score REAL NOT NULL,
    reservation_type TEXT NOT NULL,
    fee_paid REAL NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
  );
`);

module.exports = { db, sqliteDb, members, books, transactions, reservations };

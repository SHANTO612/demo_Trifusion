const { sqliteTable, integer, text, real } = require("drizzle-orm/sqlite-core");

// Members table
const members = sqliteTable("members", {
    member_id: integer("member_id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    age: integer("age").notNull(),
    has_borrowed: integer("has_borrowed").notNull().default(0), // 0 = false, 1 = true
});

// Books table
const books = sqliteTable("books", {
    book_id: integer("book_id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    author: text("author").notNull(),
    isbn: text("isbn").notNull(),
    is_available: integer("is_available").notNull().default(1), // 1 = true, 0 = false
    category: text("category"),
    published_date: text("published_date"),
    rating: real("rating"),
    borrowing_count: integer("borrowing_count").default(0),
    popularity_score: real("popularity_score").default(0),
});

// Transactions table
const transactions = sqliteTable("transactions", {
    transaction_id: integer("transaction_id").primaryKey({ autoIncrement: true }),
    member_id: integer("member_id").notNull(),
    book_id: integer("book_id").notNull(),
    borrowed_at: text("borrowed_at").notNull(),
    returned_at: text("returned_at"),
    due_date: text("due_date"), // <-- Add this
    status: text("status").notNull(),
});

// Reservations table
const reservations = sqliteTable("reservations", {
    reservation_id: text("reservation_id").primaryKey(),
    member_id: integer("member_id").notNull(),
    book_id: integer("book_id").notNull(),
    created_at: text("created_at").notNull(),
    expires_at: text("expires_at").notNull(),
    reservation_status: text("reservation_status").notNull(),
    queue_position: integer("queue_position").notNull(),
    priority_score: real("priority_score").notNull(),
    reservation_type: text("reservation_type").notNull(),
    fee_paid: real("fee_paid").notNull(),
});

module.exports = { members, books, transactions, reservations };

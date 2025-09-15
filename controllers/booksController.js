// controllers/booksController.js
const { db } = require("../models/db");
const { books, members, transactions, reservations } = require("../models/schema");
const { eq, and, lte, gte, like } = require("drizzle-orm");
const { isValidISODate, calculateDueDate, calculateOverdueDays } = require("../models/helpers");
// controllers/booksController.js
const { sqliteDb } = require("../models/db"); // export sqliteDb from db.js
// // Borrow a book
// const borrowBook = async (req, res) => {
//     try {
//         const { member_id, book_id } = req.body;
//         if (!member_id || !book_id) return res.status(400).json({ message: "Invalid request" });

//         // Check if member already has active borrow
//         const activeBorrow = await db.select()
//             .from(transactions)
//             .where(and(eq(transactions.member_id, member_id), eq(transactions.status, "active")));
//         if (activeBorrow.length > 0)
//             return res.status(400).json({ message: `member with id: ${member_id} has already borrowed a book` });

//         // Check if book exists and is available
//         const [book] = await db.select().from(books).where(eq(books.book_id, book_id));
//         if (!book) return res.status(404).json({ message: `Book with id: ${book_id} not found` });
//         if (book.is_available === 0) return res.status(400).json({ message: `Book with id: ${book_id} is not available` });

//         const borrowed_at = new Date().toISOString();
//         const due_date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 2 weeks
//         const [transaction] = await db.insert(transactions).values({
//             member_id,
//             book_id,
//             borrowed_at,
//             due_date,
//             status: "active"
//         }).returning();

//         // Mark book as not available
//         await db.update(books).set({ is_available: 0 }).where(eq(books.book_id, book_id));

//         return res.status(200).json(transaction);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: "DB error" });
//     }
// };

// Borrow a book
const borrowBook = async (req, res) => {
    try {
        const { member_id, book_id } = req.body;
        if (!member_id || !book_id) return res.status(400).json({ message: "Invalid request" });

        // Check if member already has active borrow
        const activeBorrow = await db.select()
            .from(transactions)
            .where(and(eq(transactions.member_id, member_id), eq(transactions.status, "active")));
        if (activeBorrow.length > 0)
            return res.status(400).json({ message: `member with id: ${member_id} has already borrowed a book` });

        // Check if book exists and is available
        const [book] = await db.select().from(books).where(eq(books.book_id, book_id));
        if (!book) return res.status(404).json({ message: `Book with id: ${book_id} not found` });
        if (book.is_available === 0) return res.status(400).json({ message: `Book with id: ${book_id} is not available` });

        const borrowed_at = new Date().toISOString();
        const due_date = calculateDueDate(borrowed_at);

        const [transaction] = await db.insert(transactions).values({
            member_id,
            book_id,
            borrowed_at,
            due_date,
            status: "active"
        }).returning();

        // Mark book as not available
        await db.update(books).set({ is_available: 0 }).where(eq(books.book_id, book_id));

        return res.status(200).json(transaction);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};

// Return a book
const returnBook = async (req, res) => {
    try {
        const { member_id, book_id } = req.body;
        if (!member_id || !book_id) return res.status(400).json({ message: "Invalid request" });

        // Find active transaction
        const [transaction] = await db.select().from(transactions)
            .where(and(eq(transactions.member_id, member_id), eq(transactions.book_id, book_id), eq(transactions.status, "active")));

        if (!transaction)
            return res.status(400).json({ message: `member with id: ${member_id} has not borrowed book with id: ${book_id}` });

        const returned_at = new Date().toISOString();

        // Update transaction status
        await db.update(transactions)
            .set({ returned_at, status: "returned" })
            .where(eq(transactions.transaction_id, transaction.transaction_id));

        // Mark book as available
        await db.update(books).set({ is_available: 1 }).where(eq(books.book_id, book_id));

        return res.status(200).json({ ...transaction, returned_at, status: "returned" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};


// List borrowed books
const listBorrowedBooks = async (req, res) => {
    try {
        const borrowed = await db.select({
            transaction_id: transactions.transaction_id,
            member_id: transactions.member_id,
            member_name: members.name,
            book_id: transactions.book_id,
            book_title: books.title,
            borrowed_at: transactions.borrowed_at,
            due_date: transactions.due_date,
        })
            .from(transactions)
            .leftJoin(members, eq(transactions.member_id, members.member_id))
            .leftJoin(books, eq(transactions.book_id, books.book_id))
            .where(eq(transactions.status, "active"));

        return res.status(200).json({ borrowed_books: borrowed });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};

// Member borrowing history
const memberHistory = async (req, res) => {
    try {
        const member_id = parseInt(req.params.member_id);
        if (isNaN(member_id)) return res.status(400).json({ message: "Invalid member_id" });

        const [member] = await db.select({ name: members.name }).from(members).where(eq(members.member_id, member_id));
        if (!member) return res.status(404).json({ message: `Member with id: ${member_id} not found` });

        const history = await db.select({
            transaction_id: transactions.transaction_id,
            book_id: transactions.book_id,
            book_title: books.title,
            borrowed_at: transactions.borrowed_at,
            returned_at: transactions.returned_at,
            status: transactions.status,
        })
            .from(transactions)
            .leftJoin(books, eq(transactions.book_id, books.book_id))
            .where(eq(transactions.member_id, member_id));

        return res.status(200).json({
            member_id,
            member_name: member.name,
            borrowing_history: history,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};




// Overdue books
const overdueBooks = async (req, res) => {
    try {
        const currentDate = new Date().toISOString();

        // Step 1: Fetch all active transactions with joins
        const overdue = await db.select({
            transaction_id: transactions.transaction_id,
            member_id: transactions.member_id,
            member_name: members.name,
            book_id: transactions.book_id,
            book_title: books.title,
            borrowed_at: transactions.borrowed_at,
            due_date: transactions.due_date,
        })
            .from(transactions)
            .leftJoin(members, eq(transactions.member_id, members.member_id))
            .leftJoin(books, eq(transactions.book_id, books.book_id))
            .where(eq(transactions.status, "active"));

        // Debug: print what came from DB after join
        console.log("Raw joined data:", overdue);

        // Step 2: Filter only overdue
        const result = overdue
            .filter(o => o.due_date && new Date(o.due_date) < new Date()) // ensure due_date exists
            .map(o => ({
                ...o,
                days_overdue: calculateOverdueDays(o.due_date)
            }));

        // Debug: print after filtering & mapping
        console.log("Filtered overdue:", result);

        return res.status(200).json({ overdue_books: result });
    } catch (err) {
        console.error("Controller error:", err);
        return res.status(500).json({ message: "DB error" });
    }
};



// // Add book
// const addBook = async (req, res) => {
//     try {
//         const { book_id, title, author, isbn, category, published_date, rating } = req.body;
//         if (!book_id || !title || !author || !isbn) return res.status(400).json({ message: "Invalid input" });

//         const existing = await db.select().from(books).where(eq(books.book_id, book_id));
//         if (existing.length > 0) return res.status(400).json({ message: `Book with id: ${book_id} already exists` });

//         await db.insert(books).values({
//             book_id,
//             title,
//             author,
//             isbn,
//             is_available: 1,
//             category: category || null,
//             published_date: published_date || null,
//             rating: rating || null,
//         });

//         return res.status(200).json({ book_id, title, author, isbn, is_available: true });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: "DB error" });
//     }
// };

const addBook = async (req, res) => {
    try {
        const { title, author, isbn, category, published_date, rating } = req.body;

        // Validate required fields
        if (!title || !author || !isbn)
            return res.status(400).json({ message: "Invalid input" });

        // Optional: check if book with same ISBN already exists
        const existing = await db.select().from(books).where(eq(books.isbn, isbn));
        if (existing.length > 0)
            return res.status(400).json({ message: `Book with ISBN: ${isbn} already exists` });

        // Insert book
        const [newBook] = await db.insert(books).values({
            title,
            author,
            isbn,
            is_available: 1,
            category: category || null,
            published_date: published_date || null,
            rating: rating || null,
            borrowing_count: 0,
            popularity_score: 0
        }).returning();

        return res.status(200).json(newBook);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};


// Get book info
const getBookInfo = async (req, res) => {
    try {
        const book_id = parseInt(req.params.book_id);
        if (isNaN(book_id)) return res.status(400).json({ message: "Invalid book_id" });

        const [book] = await db.select().from(books).where(eq(books.book_id, book_id));
        if (!book) return res.status(404).json({ message: `Book with id: ${book_id} not found` });

        book.is_available = !!book.is_available;

        return res.status(200).json(book);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};

// Advanced book search
const searchBooks = async (req, res) => {
    try {
        let query = db.select({
            book_id: books.book_id,
            title: books.title,
            author: books.author,
            isbn: books.isbn,
            is_available: books.is_available,
            category: books.category,
            published_date: books.published_date,
            rating: books.rating,
            borrowing_count: books.borrowing_count,
            popularity_score: books.popularity_score,
        }).from(books);

        const {
            q, category, author, published_after, published_before,
            min_rating, max_rating, availability, sort_by = "title",
            sort_order = "asc", page = "1", limit = "20",
            include_analytics
        } = req.query;

        if (q) query = query.where(like(books.title, `%${q}%`));
        if (category) query = query.where(eq(books.category, category));
        if (author) query = query.where(like(books.author, `%${author}%`));
        if (published_after && isValidISODate(published_after)) query = query.where(gte(books.published_date, published_after));
        if (published_before && isValidISODate(published_before)) query = query.where(lte(books.published_date, published_before));
        if (min_rating && !isNaN(min_rating)) query = query.where(gte(books.rating, parseFloat(min_rating)));
        if (max_rating && !isNaN(max_rating)) query = query.where(lte(books.rating, parseFloat(max_rating)));
        if (availability === "available") query = query.where(eq(books.is_available, 1));
        if (availability === "borrowed") query = query.where(eq(books.is_available, 0));

        // Sorting
        const validSortFields = ["title", "author", "published_date", "rating", "borrowing_count", "popularity_score"];
        const orderField = validSortFields.includes(sort_by) ? books[sort_by] : books.title;
        query = query.orderBy(orderField, sort_order.toLowerCase() === "desc" ? "desc" : "asc");

        // Pagination
        const pageNum = Math.max(1, parseInt(page));
        const lim = Math.max(1, parseInt(limit));
        const offset = (pageNum - 1) * lim;
        query = query.limit(lim).offset(offset);

        const rows = await query.execute();
        const total_results = await db.select({ count: db.raw("COUNT(*)") }).from(books).execute();
        const total_pages = Math.ceil(total_results[0].count / lim);

        const response = {
            books: rows.map(r => ({ ...r, is_available: !!r.is_available, category: r.category || "Unknown", published_date: r.published_date || null })),
            pagination: { current_page: pageNum, total_pages, total_results: total_results[0].count, has_next: pageNum < total_pages, has_previous: pageNum > 1 }
        };

        if (include_analytics === "true") {
            response.analytics = { search_time_ms: 45, filters_applied: Object.keys(req.query) };
        }

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};

// Reservations
const reserveBook = async (req, res) => {
    try {
        const { member_id, book_id, reservation_type = "standard", preferred_pickup_date, max_wait_days = 14 } = req.body;

        if (!member_id || !book_id || !preferred_pickup_date || !isValidISODate(preferred_pickup_date))
            return res.status(400).json({ error: "reservation_conflict", message: "Invalid request body or date", details: { validation_errors: [] } });

        const [member] = await db.select().from(members).where(eq(members.member_id, member_id));
        if (!member) return res.status(404).json({ message: `Member with id: ${member_id} not found` });

        const [book] = await db.select().from(books).where(eq(books.book_id, book_id));
        if (!book) return res.status(404).json({ message: `Book with id: ${book_id} not found` });

        const reservation_id = `RES-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${Math.floor(Math.random() * 900 + 100)}`;
        const created_at = new Date().toISOString();
        const expires_at = calculateDueDate(created_at);

        await db.insert(reservations).values({
            reservation_id,
            member_id,
            book_id,
            created_at,
            expires_at,
            reservation_status: "queued",
            queue_position: 1,
            priority_score: 8.7,
            reservation_type,
            fee_paid: reservation_type === "premium" ? 5.0 : 0
        });

        return res.status(200).json({ reservation_id, member_id, book_id, reservation_status: "queued" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};

// Delete book
const deleteBook = async (req, res) => {
    try {
        const book_id = parseInt(req.params.book_id);
        if (isNaN(book_id)) return res.status(400).json({ message: "Invalid book_id" });

        const [book] = await db.select().from(books).where(eq(books.book_id, book_id));
        if (!book) return res.status(404).json({ message: `Book with id: ${book_id} not found` });

        const [active] = await db.select().from(transactions).where(and(eq(transactions.book_id, book_id), eq(transactions.status, "active")));
        if (active) return res.status(400).json({ message: `Cannot delete book with id: ${book_id}, book is currently borrowed` });

        await db.delete(books).where(eq(books.book_id, book_id));
        return res.status(200).json({ message: `Book with id: ${book_id} has been deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
    }
};

module.exports = {
    borrowBook,
    returnBook,
    listBorrowedBooks,
    memberHistory,
    overdueBooks,
    addBook,
    getBookInfo,
    searchBooks,
    reserveBook,
    deleteBook
};

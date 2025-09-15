


// const express = require("express");
// const router = express.Router();
// const booksController = require("../controllers/booksController");

// // Borrowed books
// router.get("/borrowed", booksController.listBorrowedBooks);

// // Member borrowing history
// router.get("/members/:member_id/history", booksController.memberHistory);

// // Overdue books
// router.get("/overdue", booksController.overdueBooks);

// // Advanced book search (must come BEFORE /:book_id)
// router.get("/search", booksController.searchBooks);

// // Books CRUD
// router.post("/", booksController.addBook);
// router.get("/:book_id", booksController.getBookInfo);
// router.post("/reservations", booksController.reserveBook); // or "/reserve"
// router.delete("/:book_id", booksController.deleteBook);

// module.exports = router;


const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

// Borrow a book
router.post("/borrow", booksController.borrowBook);

// Return a book
router.post("/return", booksController.returnBook);

// List borrowed books
router.get("/borrowed", booksController.listBorrowedBooks);

// Member borrowing history
router.get("/members/:member_id/history", booksController.memberHistory);

// Overdue books
router.get("/overdue", booksController.overdueBooks);

// Advanced book search (must come BEFORE /:book_id)
router.get("/search", booksController.searchBooks);

// Books CRUD
router.post("/", booksController.addBook);
router.get("/:book_id", booksController.getBookInfo);
router.post("/reservations", booksController.reserveBook);
router.delete("/:book_id", booksController.deleteBook);

module.exports = router;

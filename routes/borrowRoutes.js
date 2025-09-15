const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

router.post("/borrow", booksController.borrowBook);
router.post("/return", booksController.returnBook);
router.get("/borrowed", booksController.listBorrowedBooks);
router.get("/overdue", booksController.overdueBooks);

module.exports = router;

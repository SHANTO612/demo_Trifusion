const express = require("express");
const app = express();
const PORT = 8000;

app.use(express.json());

// Routes
const membersRoutes = require("./routes/membersRoutes");
const booksRoutes = require("./routes/booksRoutes");
const borrowRoutes = require("./routes/borrowRoutes");

app.use("/api", borrowRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/books", booksRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

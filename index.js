const express = require("express");
const bodyParser = require("body-parser");

const voterRoutes = require("./routes/voterRoutes");

const candidateRoutes = require("./routes/candidateRoutes");

const app = express();
app.use(bodyParser.json());

// Voter APIs
app.use("/api/voters", voterRoutes);


// Candidate APIs
app.use("/api/candidates", candidateRoutes);

const voteRoutes = require("./routes/voteRoutes");
// Vote APIs
app.use("/api/votes", voteRoutes);

const resultsRoutes = require("./routes/resultsRoutes");
const voteExtraRoutes = require("./routes/voteExtraRoutes");
const ballotRoutes = require("./routes/ballotRoutes");

// Results APIs
app.use("/api/results", resultsRoutes);
// Vote Extra APIs
app.use("/api/votes", voteExtraRoutes);
// Ballot APIs
app.use("/api/ballots", ballotRoutes);

const analyticsRoutes = require("./routes/analyticsRoutes");
// Analytics APIs
app.use("/api/analytics", analyticsRoutes);

const auditRoutes = require("./routes/auditRoutes");
// Audit APIs
app.use("/api/audits", auditRoutes);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Voting API running at http://localhost:${PORT}`);
});

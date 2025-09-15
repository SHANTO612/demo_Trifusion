const express = require("express");
const bodyParser = require("body-parser");

const voterRoutes = require("./routes/voterRoutes");
// later: candidateRoutes, voteRoutes, ballotRoutes, auditRoutes

const app = express();
app.use(bodyParser.json());

// Voter APIs
app.use("/api/voters", voterRoutes);

// TODO: add candidates, votes, ballots, audits

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Voting API running at http://localhost:${PORT}`);
});

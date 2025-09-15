const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

// Q18 Differential-Privacy Analytics
router.post("/dp", analyticsController.dpAnalytics);
// Q19 Ranked-Choice Ballot
router.post("/ballots/ranked", analyticsController.rankedBallot);
// Q20 Risk-Limiting Audit
router.post("/audits/plan", analyticsController.auditPlan);

module.exports = router;

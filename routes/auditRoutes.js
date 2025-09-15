const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

// Q20 Risk-Limiting Audit
router.post("/plan", analyticsController.auditPlan);

module.exports = router;

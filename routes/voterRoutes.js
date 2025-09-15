const express = require("express");
const router = express.Router();
const voterController = require("../controllers/voterController");

router.post("/", voterController.createVoter);       // Q1
router.get("/", voterController.listVoters);         // Q3
router.get("/:voter_id", voterController.getVoter);  // Q2
router.put("/:voter_id", voterController.updateVoter); // Q4
router.delete("/:voter_id", voterController.deleteVoter); // Q5

module.exports = router;

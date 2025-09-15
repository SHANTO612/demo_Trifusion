// const express = require("express");
// const router = express.Router();
// const membersController = require("../controllers/membersController");

// router.post("/", membersController.createMember);
// router.get("/:member_id", membersController.getMember);
// router.get("/", membersController.listMembers);
// router.put("/:member_id", membersController.updateMember);
// router.get("/:member_id/history", membersController.borrowingHistory);
// router.delete("/:member_id", membersController.deleteMember);

// module.exports = router;

const express = require("express");
const router = express.Router();
const membersController = require("../controllers/membersController");

// Member borrowing history (must come BEFORE getMember)
router.get("/:member_id/history", membersController.borrowingHistory);

// Member CRUD
router.post("/", membersController.createMember);
router.get("/:member_id", membersController.getMember);
router.get("/", membersController.listMembers);
router.put("/:member_id", membersController.updateMember);
router.delete("/:member_id", membersController.deleteMember);

module.exports = router;

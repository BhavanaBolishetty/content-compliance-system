const express = require("express");
const auth = require("../middleware/auth");
const ApprovalRequest = require("../models/ApprovalRequest");

const router = express.Router();

// Fetch approvals
router.get("/approvals", auth, async (req, res) => {
  const approvals = await ApprovalRequest.find({
    companyId: req.companyId
  });
  res.json(approvals);
});

// Approve / Reject
router.post("/approve/:id", auth, async (req, res) => {
  await ApprovalRequest.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  }); 
  res.json({ success: true });
});

module.exports = router;


const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema(
  {
    companyId: String,

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    message: String,
    detectedWord: String,
    reason: String,
    status: {
      type: String,
      default: "pending"
    },
    approvedOnce: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ApprovalRequest", approvalSchema);

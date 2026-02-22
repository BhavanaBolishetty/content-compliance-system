const mongoose = require("mongoose");

const RestrictedWordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  }
}, { timestamps: true });

RestrictedWordSchema.index(
  { word: 1, companyId: 1 },
  { unique: true }
);

module.exports = mongoose.model("RestrictedWord", RestrictedWordSchema);

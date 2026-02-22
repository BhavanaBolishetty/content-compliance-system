require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RestrictedWord = require("./models/RestrictedWord");
const ApprovalRequest = require("./models/ApprovalRequest");
const auth = require("./middleware/auth");
const bcrypt = require("bcryptjs");
const Company = require("./models/Company");
const User = require("./models/User");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


//==================INVITE EMPLOYEE=================
app.post("/api/invite-employee", auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      companyId: req.user.companyId
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Invite failed" });
  }
});




/* ================= ADD restricted word ================= */

app.post("/api/restricted-words", auth, async (req, res) => {
  const { word } = req.body;

  if (!word) return res.status(400).json({ error: "Word required" });

  const exists = await RestrictedWord.findOne({
    word: word.toLowerCase(),
    companyId: req.user.companyId
  });

  if (exists) return res.status(409).json({ error: "Already exists" });

  await RestrictedWord.create({
    word: word.toLowerCase(),
    companyId: req.user.companyId
  });

  res.json({ success: true });
});

//==============GET ALL RESTRICTED WORDS================
app.get("/api/restricted-words", auth, async (req, res) => {
  const words = await RestrictedWord.find({
    companyId: req.user.companyId
  });

  res.json(words);
});


//================Add DELETE Word ===============
app.delete("/api/restricted-words/:id", auth, async (req, res) => {
  await RestrictedWord.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

//=============Add UPDATE Word API==================

app.put("/api/restricted-words/:id", auth, async (req, res) => {
  const { word } = req.body;

  await RestrictedWord.findByIdAndUpdate(req.params.id, {
    word: word.toLowerCase()
  });

  res.json({ success: true });
});


/* ================= REQUEST-APPROVAL API ================= */

app.post("/api/request-approval", auth, async (req, res) => {
  try {
    const { message, word, reason } = req.body;

    await ApprovalRequest.create({
      companyId: req.user.companyId,
      employeeId: req.user.userId,
      message,
      detectedWord: word,
      reason,
      status: "pending"
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});




/* ================= FETCH APPROVAL REQUESTS ================= */

app.get("/api/approvals", auth, async (req, res) => {
  const approvals = await ApprovalRequest.find({
    companyId: req.user.companyId
  })

 .populate("employeeId", "email")   
 .sort({ createdAt: -1 });

  res.json(approvals);
});



/* ================= ADMIN APPROVE/REJECT API ================= */
 
app.post("/api/approvals/:id/:action", auth, async (req, res) => {
  const { id, action } = req.params;

  const request = await ApprovalRequest.findById(id);
  if (!request) return res.status(404).json({ error: "Not found" });

  request.status = action;
  await request.save();

  res.json({ success: true });
});


/* ================= CHECK APPROVAL STATUS ================= */

app.get("/api/approval-status", async (req, res) => {
  const { message, word } = req.query;

  const request = await ApprovalRequest.findOne({
    message: message,      
    detectedWord: word
  }).sort({ createdAt: -1 });

  if (!request) {
    return res.json({ status: "none" });
  }

  res.json({
    status: request.status
  });
});



/* ================= EMPLOYEE API ================= */


app.post("/api/check-message", auth, async (req, res) => {
  const { message } = req.body;
  const companyId = req.user.companyId;

  const words = message
  .toLowerCase()
  .replace(/[^\w\s]/g, "")
  .split(/\s+/);

  const restrictedWords = await RestrictedWord.find({ companyId });
  const restrictedSet = restrictedWords.map(w => w.word);

  const found = words.find(w => restrictedSet.includes(w));

  if (found) {
    const approval = await ApprovalRequest.findOne({
      companyId,
      detectedWord: found,
      status: "approved",
      approvedOnce: false
    });

    if (approval) {
      approval.approvedOnce = true;
      await approval.save();
      return res.json({ blocked: false });
    }

    return res.json({ blocked: true, word: found });
  }

  res.json({ blocked: false });
});



app.listen(5000, () => {
  console.log("Server running on port 5000");
});

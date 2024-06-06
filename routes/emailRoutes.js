// backend/routes/emailRoutes.js

const express = require("express");
const { sendEmail, fetchStudentsEmails } = require("../controllers/emailController");
const router = express.Router();

router.post("/sendEmail", sendEmail);
router.get("/fetchStudentsEmails", fetchStudentsEmails);

module.exports = router;

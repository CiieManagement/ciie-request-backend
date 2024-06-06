// backend/emailController.js

const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

// Dummy data - Replace this with your actual database query
const studentEmails = [
  'student1@stu.srmuniversity.ac.in',
  'student2@stu.srmuniversity.ac.in',
  'student3@stu.srmuniversity.ac.in',
];

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
});

const sendEmail = expressAsyncHandler(async (req, res) => {
  let { emails, subject, message } = req.body;
  
  if (!emails) {
    return res.status(400).send("emails is required");
  }

  if (!Array.isArray(emails)) {
    emails = [emails]; // Convert to array if it's a single email
  }

  emails.forEach(email => {
    var mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      text: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent successfully to ${email}!`);
      }
    });
  });

  res.status(200).send("Emails sent successfully!");
});

const fetchStudentsEmails = expressAsyncHandler(async (req, res) => {
  try {
    // Replace with your actual database call
    res.status(200).json(studentEmails);
  } catch (error) {
    res.status(500).send("Error fetching student emails");
  }
});

module.exports = { sendEmail, fetchStudentsEmails };

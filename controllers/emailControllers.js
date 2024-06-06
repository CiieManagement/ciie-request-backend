// emailController.js

const expressAsyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('../models/User'); // Ensure you have the correct path

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
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

  // Check for special case of sending to all students
  if (emails.includes('everyone@stu.srmuniversity.ac.in')) {
    const studentEmails = await User.find({ email: /@stu\.srmuniversity\.ac\.in$/ }).select('email -_id');
    const studentEmailList = studentEmails.map(user => user.email);
    emails = emails.filter(email => email !== 'everyone@stu.srmuniversity.ac.in');
    emails.push(...studentEmailList);
  }

  emails.forEach(email => {
    const mailOptions = {
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

module.exports = { sendEmail };

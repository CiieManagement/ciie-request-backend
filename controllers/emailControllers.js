const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

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
  const { emails, subject, message } = req.body;
  
  if (!emails) {
    return res.status(400).send("emails is required");
  }

  let filteredEmails = [];

  if (Array.isArray(emails)) {
    // Filter emails based on domain
    filteredEmails = emails.filter(email => email.endsWith('@stu.srmuniversity.ac.in'));
  } else if (emails.includes('everyone@stu.srmuniversity.ac.in')) {
    // Add logic to fetch all emails with @stu.srmuniversity.ac.in
    filteredEmails = ['example1@stu.srmuniversity.ac.in', 'example2@stu.srmuniversity.ac.in']; // Replace with actual logic to fetch emails
  } else {
    // Convert to array if it's a single email and filter based on domain
    filteredEmails = [emails].filter(email => email.endsWith('@stu.srmuniversity.ac.in'));
  }

  if (filteredEmails.length === 0) {
    return res.status(400).send("No valid emails found for the specified domain");
  }

  filteredEmails.forEach(email => {
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

  res.status(200).json({ message: "Emails sent successfully!" });
});

module.exports = { sendEmail };

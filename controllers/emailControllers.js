const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

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
  const { emails, subject, message } = req.body;

  if (!emails) {
    return res.status(400).send("Emails are required");
  }

  let filteredEmails = [];

  if (Array.isArray(emails)) {
    // Filter emails based on domain
    filteredEmails = emails.filter(email => {
      return email.endsWith('@stu.srmuniversity.ac.in');
    });
  } else {
    // Convert to array if it's a single email and filter based on domain
    filteredEmails = [emails].filter(email => {
      return email.endsWith('@stu.srmuniversity.ac.in');
    });
  }

  if (filteredEmails.length === 0) {
    return res.status(400).send("No valid emails found for the specified domain");
  }

  try {
    const mailPromises = filteredEmails.map(email => {
      const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        text: message,
      };

      return transporter.sendMail(mailOptions)
        .then(() => {
          console.log(`Email sent successfully to ${email}!`);
        })
        .catch(error => {
          console.log(`Error sending email to ${email}:`, error);
        });
    });

    await Promise.all(mailPromises);
    res.status(200).send("Emails sent successfully!");
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send("Failed to send emails");
  }
});

module.exports = { sendEmail };

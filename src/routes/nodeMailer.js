const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();
const htmlTemplate = `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Website Visit Notification</title>
  <style>
    body {
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .header {
      padding: 20px;
      text-align: center;
      background-color: #f9fafb;
      border-bottom: 1px solid #eee;
    }

    .logo {
      max-height: 40px;
      margin-bottom: 10px;
    }

    .title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .highlight {
      background-color: #ffeb99;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: bold;
    }

    .body {
      padding: 30px;
      text-align: center;
    }

    .preview {
      width: 100%;
      max-width: 400px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .cta-button {
      background-color: #0e76fd;
      color: #fff;
      padding: 12px 24px;
      font-size: 15px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      margin-top: 20px;
    }

    .footer {
      font-size: 12px;
      color: #888;
      text-align: center;
      padding: 20px;
    }

    a.unsubscribe {
      color: #888;
      text-decoration: underline;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <div class="title">
        Great Work! Someone just viewed Your <span class="highlight">Website</span>
      </div>
    </div>
    <div class="body">
      <img src="https://img.icons8.com/color/96/visible--v1.png" alt="View Icon" width="64" />
      <p>Hi <strong>Smit</strong>,</p>
      <p>
        Someone recently visited your <span class="highlight">website</span>!
      </p>
      <p>
        Want to know who, when, and from where? Track activity and engagement using our analytics tool.
      </p>
      <a href="https://yourdomain.com/dashboard" class="cta-button">View Analytics</a>
    </div>
    <div class="footer">
      &copy; 2025 Your Company. All rights reserved.<br />
      <a class="unsubscribe" href="https://yourdomain.com/unsubscribe">Unsubscribe</a>
    </div>
  </div>
</body>

</html>`

router.post("/send", async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "ransomeware94.tp@gmail.com",
      pass: process.env.NMP,
    },
  });

  const mailOptions = {
    from: "ransomeware94.tp@gmail.com",
    to: "smitkumar97@gmail.com",
    subject: "New Website Visit",
    html: htmlTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending email");
  }
});

module.exports = router;

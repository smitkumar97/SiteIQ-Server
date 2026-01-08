const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const axios = require("axios");

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
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
      }

      .info-grid {
        display: grid;
        grid-template-columns: 110px 1fr;
        gap: 1rem;
        margin: 20px 0;
      }

      .info-label {
        font-weight: 600;
        color: #555;
        text-align: left;
      }

      .info-value {
        color: #333;
        text-align: left;
      }

      .preview {
        width: 100%;
        max-width: 400px;
        border-radius: 8px;
        margin: 20px auto;
        display: block;
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

      .divider {
        border-top: 1px dashed #ddd;
        margin: 25px 0;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <div class="title">
          Great Work! Someone just viewed Your
          <span class="highlight">Website</span>
        </div>
      </div>
      <div class="body">
        <img
          src="https://img.icons8.com/color/96/visible--v1.png"
          alt="View Icon"
          width="64"
          style="display: block; margin: 0 auto 20px"
        />
        <p>Hi <strong>Smit</strong>,</p>
        <p>
          Someone recently visited your <span class="highlight">website</span>!
          Here are the details:
        </p>

        <div class="info-grid">
          <div class="info-label">IP Address:</div>
          <div class="info-value">{{IP}}</div>

          <div class="info-label">Location:</div>
          <div class="info-value">{{LOCATION}}</div>

          <div class="info-label">Referrer:</div>
          <div class="info-value">{{REFERRER}}</div>

          <div class="info-label">Session Time:</div>
          <div class="info-value">{{SESSION_TIME}} seconds</div>

          <div class="info-label">Active Users:</div>
          <div class="info-value">{{ACTIVE_USERS}} currently online</div>

          <div class="info-label">Project Visited:</div>
          <div class="info-value">{{PROJECT_NAME}}</div>
        </div>

        <div class="divider"></div>

        <p style="text-align: center">
          Want more detailed analytics? Track visitor engagement with our
          premium tools.
        </p>

        <div style="text-align: center">
          <a href="https://reactfolio-theta.vercel.app/#hero" class="cta-button"
            >View Full Analytics</a
          >
        </div>
      </div>
      <div class="footer">
        &copy; {{CURRENT_YEAR}} SmitPatel.dev. All rights reserved.<br />
        <a class="unsubscribe" href="https://reactfolio-theta.vercel.app/#hero"
          >Unsubscribe</a
        >
      </div>
    </div>
  </body>
</html>
`;

const contactTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4a6fa5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
        }
        .footer {
            padding: 15px;
            text-align: center;
            background-color: #eaeaea;
            border-radius: 0 0 5px 5px;
            font-size: 12px;
            color: #666;
        }
        .message-box {
            background-color: white;
            border: 1px solid #ddd;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .highlight {
            font-weight: bold;
            color: #4a6fa5;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Message From Your Portfolio</h2>
    </div>
    
    <div class="content">
        <p>Hello,</p>
        <p>You've received a new message from your portfolio website:</p>
        
        <div class="message-box">
            <p><span class="highlight">From:</span> {{userName}}</p>
            <p><span class="highlight">Email:</span> {{userEmail}}</p>
            <p><span class="highlight">Message:</span></p>
            <p>{{message}}</p>
        </div>
        
        <p>This message was sent via your portfolio contact form on {{date}} at {{time}}.</p>
    </div>
    
    <div class="footer">
        <p>This is an automated message. Please respond directly to the sender's email address.</p>
        <p>© {{currentYear}} Your Name. All rights reserved.</p>
    </div>
</body>
</html>
`;

const todayDate = new Date();
const dateString = todayDate.toDateString();
const currentYear = todayDate.getFullYear();
const currentTime = function formatAMPM(date) {
  var hours = todayDate.getHours();
  var minutes = todayDate.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

router.post("/send", async (req, res) => {
  if (!req.body) {
    return res.status(400).send("No data received");
  }

  const { ip, referrer, sessionTime, activeUsers, from, isFirstVisit } =
    req.body;

  if (isFirstVisit) {
    let location = "Unknown";
    try {
      const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
      location = `${geo.data.city}, ${geo.data.country_name}`;
    } catch (err) {
      console.error("Geo error:", err.message);
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.NMP,
      },
    });

    const emailHtml = htmlTemplate
      .replace("{{IP}}", ip)
      .replace("{{LOCATION}}", location)
      .replace("{{REFERRER}}", referrer)
      .replace("{{SESSION_TIME}}", sessionTime)
      .replace("{{ACTIVE_USERS}}", activeUsers)
      .replace("{{PROJECT_NAME}}", from)
      .replace("{{CURRENT_YEAR}}", currentYear);

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: process.env.TO_EMAIL,
      subject: "Someone visited your website!",
      html: emailHtml,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send("Email sent");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error sending email");
    }
  } else {
    res.status(200).send("Not the first visit, no email sent");
  }
});

router.post("/connect", async (req, res) => {
  if (!req.body) {
    return res.status(400).send("No data received");
  }

  const { userName, userEmail, message, isConnectionRequest } = req.body;
  console.log(req.body);

  if (isConnectionRequest) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.NMP,
      },
    });

    const emailTemplate = contactTemplate
      .replace("{{userName}}", userName)
      .replace("{{userEmail}}", userEmail)
      .replace("{{message}}", message)
      .replace("{{date}}", dateString)
      .replace("{{time}}", currentTime)
      .replace("{{currentYear}}", currentYear);

    const mailOptions = {
      from: process.env.TO_EMAIL,
      to: process.env.TO_EMAIL,
      subject: `${userName} wants to connect with you.`,
      html: emailTemplate,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send("Connection request sent");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error sending connection request!");
    }
  }
});

module.exports = router;

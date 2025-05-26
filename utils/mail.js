const nodemailer = require("nodemailer");

require("dotenv").config();

async function sendGR(reciepent, subject, body) {
  // Create a Nodemailer transporter using your SMTP settings
  let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    secure: true, // false for TLS - as Hostinger doesn't support SSL
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
      ciphers: "SSLv3",
    },
    requireTLS: true,
    port: 465, // or the appropriate SMTP port for Hostinger
    debug: true,
    auth: {
      user: process.env.GRIEVANCE_EMAIL,
      pass: process.env.GRIEVANCE_EMAIL_PASSWORD,
    },
  });

  // Define the email options
  let mailOptions = {
    from: process.env.GRIEVANCE_EMAIL,
    to: reciepent,
    subject: subject,
    html: body,
  };

  try {
    // Send the email
    let info = await transporter.sendMail(mailOptions);
    // console.log("Email sent:", info.messageId);
  } catch (error) {
    // console.log("Error occurred while sending the email:", error.message);
  }
}

async function sendNotification(emails) {
  // Create a Nodemailer transporter using your SMTP settings
  let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    secure: true, // false for TLS - as Hostinger doesn't support SSL
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
      ciphers: "SSLv3",
    },
    requireTLS: true,
    port: 465, // or the appropriate SMTP port for Hostinger
    debug: true,
    auth: {
      user: process.env.NOTIFICATION_EMAIL,
      pass: process.env.NOTIFICATION_EMAIL_PASSWORD,
    },
  });

  // Iterate over the recipients array
  for (let email of emails) {
    // Define the email options
    let mailOptions = {
      from: process.env.GRIEVANCE_EMAIL,
      to: email.recipient,
      subject: email.subject,
      html: email.body,
    };

    try {
      // Send the email
      let info = await transporter.sendMail(mailOptions);
      // console.log("Email sent:", info.messageId);
    } catch (error) {
      // console.log("Error occurred while sending the email:", error.message);
    }
  }
}

module.exports = { sendGR, sendNotification };

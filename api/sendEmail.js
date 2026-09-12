const nodemailer = require('nodemailer');

// Handler function for the /api/sendEmail route
module.exports = async (req, res) => {

  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Reject unsupported HTTP methods
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed'
    });
  }

  // Get new form fields
  const {
    name,
    email,
    phone,
    investmentType,
    investmentAmount,
    investmentDuration,
    discussionDate,
    discussionTime
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !email ||
    !phone ||
    !investmentType ||
    !investmentAmount ||
    !investmentDuration ||
    !discussionDate ||
    !discussionTime
  ) {
    return res.status(400).json({
      error: 'Please fill out all required fields.'
    });
  }

  // Convert values into nicer text
  const formattedInvestmentType =
    investmentType === 'sip' ? 'SIP' : 'Lump Sum';

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    },

    tls: {
      rejectUnauthorized: false
    }
  });

  // Set up email details
  const mailOptions = {

    // Send from your authenticated Gmail account
    from: process.env.GMAIL_USER,

    // Where the enquiry should be received
    to: 'greenstoneinvestments1@gmail.com',

    // Customer email can be used when replying
    replyTo: email,

    subject: `New Investment Inquiry from ${name}`,

    text: `
New Investment Inquiry

Personal Details
-------------------------
Name: ${name}
Email: ${email}
Phone: ${phone}

Investment Details
-------------------------
Investment Type: ${formattedInvestmentType}
Investment Amount: ${investmentAmount}
Investment Duration: ${investmentDuration}

Preferred Discussion
-------------------------
Date: ${discussionDate}
Time: ${discussionTime}
    `
  };

  // Send email
  try {

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: `Thank you, ${name}! Your request has been submitted successfully.`
    });

  } catch (error) {

    console.error('Email sending error:', error);

    return res.status(500).json({
      error: 'Unable to send the email. Please try again later.'
    });

  }
};
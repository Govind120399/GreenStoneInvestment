const nodemailer = require('nodemailer');

module.exports = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed'
    });
  }

  try {

    const {
      name,
      email,
      phone,
      investmentType,
      investmentAmount,
      investmentDuration,
      discussionDate,
      discussionTime
    } = req.body || {};

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

    /*
     * Make sure the environment variables actually exist
     * without exposing their values.
     */
    console.log('EMAIL CONFIG CHECK:', {
      EMAIL_USER_EXISTS: Boolean(process.env.EMAIL_USER),
      EMAIL_PASS_EXISTS: Boolean(process.env.EMAIL_PASS)
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('EMAIL_USER or EMAIL_PASS environment variable is missing.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: process.env.EMAIL_USER,

        // Gmail App Passwords are sometimes copied with spaces.
        pass: process.env.EMAIL_PASS.replace(/\s/g, '')
      }
    });

    /*
     * Test Gmail authentication before attempting to send.
     */
    await transporter.verify();

    console.log('Gmail SMTP authentication successful');

    const formattedInvestmentType =
      investmentType === 'sip'
        ? 'SIP'
        : 'Lump Sum';

    const mailOptions = {

      from: `"GreenStone Investment" <${process.env.EMAIL_USER}>`,

      to: 'greenstoneinvestments1@gmail.com',

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

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({
      message: `Thank you, ${name}! Your request has been submitted successfully.`
    });

  } catch (error) {

    console.error('EMAIL ERROR:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });

    /*
     * TEMPORARY debugging response.
     * Once fixed, replace this with a generic error message.
     */
    return res.status(500).json({
      error: error.message,
      code: error.code || null,
      command: error.command || null,
      response: error.response || null
    });
  }
};
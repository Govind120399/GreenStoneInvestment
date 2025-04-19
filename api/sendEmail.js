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

  // Handle POST requests
  if (req.method === 'POST') {
    const { name, email, phone, interest, experience, message } = req.body;

    // Validate required fields
    if (!name || !email || !interest) {
      return res.status(400).json({ error: "Please fill out all required fields." });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'gopalkkotecha@gmail.com',
        pass: 'dlkw gxdp knnf teyk'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Set up email details
    const mailOptions = {
      from: email,
      to: 'greenstoneinvestments1@gmail.com',
      subject: `New Investment Inquiry from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Primary Interest: ${interest}
        Investment Experience: ${experience}
        Message: ${message}
      `
    };

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: `Thank you, ${name}! Your request has been submitted successfully.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Unable to send the email. Please try again later." });
    }
  } else {
    // Reject unsupported HTTP methods
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
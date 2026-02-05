import nodemailer from 'nodemailer';

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@findyy.com',
      to: user.email,
      subject: 'Welcome to Findyy!',
      html: `
        <h1>Welcome to Findyy, ${user.name}!</h1>
        <p>Thank you for joining our roommate finder community for ADYPU, Pune.</p>
        <p>Start finding your perfect roommate match today!</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5176'}">Visit Findyy</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', user.email);
  } catch (error) {
    console.error('Email error:', error);
  }
};

// Send new message notification
export const sendMessageNotification = async (receiver, sender, message) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@findyy.com',
      to: receiver.email,
      subject: `New message from ${sender.name}`,
      html: `
        <h2>You have a new message!</h2>
        <p><strong>From:</strong> ${sender.name}</p>
        <p><strong>Message:</strong> ${message.content}</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5176'}/messages">View Message</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Message notification sent to:', receiver.email);
  } catch (error) {
    console.error('Email error:', error);
  }
};

// Send listing inquiry notification
export const sendInquiryNotification = async (owner, inquirer, listing) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@findyy.com',
      to: owner.email,
      subject: `New inquiry for ${listing.title}`,
      html: `
        <h2>You have a new inquiry!</h2>
        <p><strong>From:</strong> ${inquirer.name}</p>
        <p><strong>Listing:</strong> ${listing.title}</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5176'}/listing/${listing._id}">View Listing</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Inquiry notification sent to:', owner.email);
  } catch (error) {
    console.error('Email error:', error);
  }
};

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // For development, use Ethereal (fake SMTP service)
  const testAccount = await nodemailer.createTestAccount();

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME || testAccount.user,
      pass: process.env.EMAIL_PASSWORD || testAccount.pass,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Organic Shop" <noreply@organicshop.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    if (testAccount) {
      // Log preview URL in development
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Error sending email');
  }
};

module.exports = sendEmail; 
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;

  // Debug: Log environment variables
  console.log('Email Configuration Debug:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('EMAIL_USERNAME:', process.env.EMAIL_USERNAME ? 'Set' : 'Not set');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');

  // Check if we're in production or have Gmail credentials
  if (process.env.NODE_ENV === 'production' || (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD)) {
    console.log('Using Gmail SMTP configuration');
    // Use Gmail SMTP for production or when credentials are provided
    transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });
  } else {
    console.log('Using Ethereal Email (testing service)');
    // For development, use Ethereal (fake SMTP service)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

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
    
    // Log success message
    if (process.env.NODE_ENV === 'production' || (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD)) {
      console.log('Email sent successfully to:', options.email);
    } else {
      // Log preview URL in development (Ethereal)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Error sending email');
  }
};

module.exports = sendEmail; 
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Creaete transporter
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2. Set options
  let mailOptions = {
    from: 'Kahef Mirza <kahef@kahef.dev>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3. Send email

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

const nodeMailer = require('nodemailer');
const sendEMail = async options => {
  // 1.Create transporter
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // 2.Define email options
  const mailOptions = {
    from: 'trivedhnani@findmech.io',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  // 3.Actually send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEMail;

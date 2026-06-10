import dotenv from 'dotenv'
import nodemailer from "nodemailer"

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend_Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
export const SendRegistrationUserName = async(userEmail, name) => {
  const subject = 'Welcome To Backend_Ledger';
  const text = `Hello ${name}.\n\n Thank You for registering at Backend Ledger. We are excited to have you on board! If you have any questions or need assistance, feel free to reach out to our support team.`;
  const html = `<p>Hello ${name},</p><p>Thank You for registering at Backend Ledger. We are excited to have you on board! If you have any questions or need assistance, feel free to reach out to our support team.</p>`;
  await sendEmail(userEmail, subject, text, html);

}

export const sendTransactionEmail=async(userEmail, amount, transactionId)=>{
  const subject = 'Transaction Notification';
  const text = `Hello,\n\n A transaction of amount ${amount} has been processed with Transaction ID: ${transactionId}. If you have any questions or need assistance, feel free to reach out to our support team.`;
  const html = `<p>Hello,</p><p>A transaction of amount ${amount} has been processed with Transaction ID: ${transactionId}. If you have any questions or need assistance, feel free to reach out to our support team.</p>`;
  await sendEmail(userEmail, subject, text, html);
}

export const SendTransactionFailureEmail=async(userEmail, amount, transactionId)=>{
  const subject = 'Transaction Failure Notification';
  const text = `Hello,\n\n We regret to inform you that a transaction of amount ${amount} with Transaction ID: ${transactionId} has failed. Please check your account and try again. If you have any questions or need assistance, feel free to reach out to our support team.`; 
  const html = `<p>Hello,</p><p>We regret to inform you that a transaction of amount ${amount} with Transaction ID: ${transactionId} has failed. Please check your account and try again. If you have any questions or need assistance, feel free to reach out to our support team.</p>`;
  await sendEmail(userEmail, subject, text, html); 
}
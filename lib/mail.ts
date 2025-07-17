import nodemailer from 'nodemailer';

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

// Configure mail transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendEmail = async (data: EmailPayload) => {
  try {
    // If email settings are not configured, log the email instead
    if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER) {
      console.log('Email would have been sent:', {
        to: data.to,
        subject: data.subject,
        html: data.html,
      });
      return;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@upqroo.edu.mx',
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  throw new Error("SMTP config is missing in your .env file");
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendMailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Ichgram Support" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
};

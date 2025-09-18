import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const sendGridApi = process.env.SEND_GRID_API;
const fromEmail = process.env.FROM_EMAIL;

// Check if SendGrid is configured
const isEmailConfigured = sendGridApi && sendGridApi !== 'your_sendgrid_api_key_here' && fromEmail && fromEmail !== 'your_email@domain.com';

if (isEmailConfigured) {
  sgMail.setApiKey(sendGridApi);
}

export const sendEmail = async (to, subject, html) => {
  // If email is not configured, return true (skip email sending in development)
  if (!isEmailConfigured) {
    console.log("⚠️  Email service not configured. Skipping email send.");
    console.log(`📧 Would send email to: ${to}`);
    console.log(`📧 Subject: ${subject}`);
    console.log(`📧 Content: ${html}`);
    return true;
  }

  const msg = {
    to,
    from: `TaskHub <${fromEmail}>`,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("📧 Email sent successfully to:", to);

    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);

    return false;
  }
};

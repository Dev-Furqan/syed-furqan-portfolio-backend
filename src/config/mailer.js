import nodemailer from 'nodemailer';

export function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
}

export async function sendContactNotification(message) {
  const transporter = createTransporter();

  if (!transporter) {
    return { skipped: true };
  }

  const mailTo = process.env.MAIL_TO || 'syedfurqan1887@gmail.com';
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;

  return transporter.sendMail({
    from: mailFrom,
    to: mailTo,
    subject: `New portfolio inquiry from ${message.name}`,
    replyTo: message.email,
    text: [
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      `Company: ${message.company || 'N/A'}`,
      `Service: ${message.service}`,
      `Budget: ${message.budget || 'N/A'}`,
      '',
      message.message,
    ].join('\n'),
  });
}

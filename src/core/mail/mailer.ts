import nodemailer from 'nodemailer';
import { env } from '../../config/env';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async (options: MailOptions): Promise<void> => {
  await transporter.sendMail({
    from: `"Portfolio Contact" <${env.smtp.user}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};

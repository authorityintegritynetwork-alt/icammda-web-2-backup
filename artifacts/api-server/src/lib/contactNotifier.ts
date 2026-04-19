import { getResendClient } from "./resendClient";
import { logger } from "./logger";

const DEFAULT_RECIPIENTS = ["info@icammda.org", "icammda@fuoye.edu.ng"];

function getRecipients(): string[] {
  const raw = process.env["CONTACT_NOTIFY_EMAILS"];
  if (!raw) return DEFAULT_RECIPIENTS;
  const list = raw.split(",").map((e) => e.trim()).filter(Boolean);
  return list.length > 0 ? list : DEFAULT_RECIPIENTS;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface ContactPayload {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

export async function sendContactNotification(payload: ContactPayload): Promise<void> {
  try {
    const { client, fromEmail } = await getResendClient();
    const recipients = getRecipients();
    const safeName = escapeHtml(payload.name);
    const safeEmail = escapeHtml(payload.email);
    const safeSubject = escapeHtml(payload.subject);
    const safeBody = escapeHtml(payload.message).replace(/\n/g, "<br/>");

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937;">
        <div style="border-bottom: 3px solid #0891b2; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 18px; color: #0e7490;">New ICAMMDA contact form submission</h2>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 90px;">From</td><td><strong>${safeName}</strong> &lt;<a href="mailto:${safeEmail}" style="color: #0891b2;">${safeEmail}</a>&gt;</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Subject</td><td>${safeSubject}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Received</td><td>${payload.createdAt.toUTCString()}</td></tr>
        </table>
        <div style="margin-top: 20px; padding: 16px 18px; background: #f9fafb; border-left: 3px solid #0891b2; border-radius: 4px; font-size: 14px; line-height: 1.6;">
          ${safeBody}
        </div>
        <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          Reply directly to this email to respond to <strong>${safeName}</strong>.<br/>
          You can also manage messages in the admin panel: Inbox → message #${payload.id}.
        </p>
      </div>
    `;

    const text =
      `New ICAMMDA contact form submission\n\n` +
      `From: ${payload.name} <${payload.email}>\n` +
      `Subject: ${payload.subject}\n` +
      `Received: ${payload.createdAt.toUTCString()}\n\n` +
      `Message:\n${payload.message}\n\n` +
      `--\nReply directly to this email to respond. Also visible in the admin Inbox (message #${payload.id}).`;

    const result = await client.emails.send({
      from: fromEmail,
      to: recipients,
      replyTo: payload.email,
      subject: `[ICAMMDA Contact] ${payload.subject}`,
      html,
      text,
    });

    if (result.error) {
      logger.error({ err: result.error, messageId: payload.id, recipients }, "Resend rejected contact notification");
    } else {
      logger.info({ messageId: payload.id, recipients, providerId: result.data?.id }, "Contact notification email sent");
    }
  } catch (err) {
    logger.error({ err, messageId: payload.id }, "Failed to send contact notification email");
  }
}

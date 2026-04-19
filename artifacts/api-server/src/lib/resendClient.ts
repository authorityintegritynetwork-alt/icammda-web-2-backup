import { Resend } from "resend";

/**
 * Resend client.
 *
 * Required environment variables:
 *   - RESEND_API_KEY    — the Resend API key
 *   - RESEND_FROM_EMAIL — the verified sender (e.g. "ICAMMDA <noreply@icammda.org>")
 *                         The domain must be verified at https://resend.com/domains
 */

let cachedClient: Resend | null = null;
let cachedFrom: string | null = null;

export async function getResendClient(): Promise<{
  client: Resend;
  fromEmail: string;
}> {
  if (cachedClient && cachedFrom) {
    return { client: cachedClient, fromEmail: cachedFrom };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY environment variable is required to send email.",
    );
  }
  if (!fromEmail) {
    throw new Error(
      "RESEND_FROM_EMAIL environment variable is required (e.g. \"ICAMMDA <noreply@icammda.org>\").",
    );
  }

  cachedClient = new Resend(apiKey);
  cachedFrom = fromEmail;
  return { client: cachedClient, fromEmail: cachedFrom };
}

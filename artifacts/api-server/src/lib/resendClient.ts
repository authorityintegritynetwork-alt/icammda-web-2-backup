import { Resend } from "resend";

interface ResendConnection {
  apiKey: string;
  fromEmail: string;
}

let cachedConnection: ResendConnection | null = null;
let cachedAt = 0;
const TTL_MS = 5 * 60 * 1000;

async function fetchResendCredentials(): Promise<ResendConnection> {
  const hostname = process.env["REPLIT_CONNECTORS_HOSTNAME"];
  const xReplitToken = process.env["REPL_IDENTITY"]
    ? "repl " + process.env["REPL_IDENTITY"]
    : process.env["WEB_REPL_RENEWAL"]
    ? "depl " + process.env["WEB_REPL_RENEWAL"]
    : null;

  if (!hostname || !xReplitToken) {
    throw new Error("Replit connector credentials not available in this environment");
  }

  const res = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=resend`,
    {
      headers: {
        Accept: "application/json",
        "X-Replit-Token": xReplitToken,
      },
    },
  );
  const data = (await res.json()) as { items?: Array<{ settings: { api_key?: string; from_email?: string } }> };
  const item = data.items?.[0];
  if (!item || !item.settings.api_key || !item.settings.from_email) {
    throw new Error("Resend connection is not configured");
  }
  return { apiKey: item.settings.api_key, fromEmail: item.settings.from_email };
}

export async function getResendClient(): Promise<{ client: Resend; fromEmail: string }> {
  const now = Date.now();
  if (!cachedConnection || now - cachedAt > TTL_MS) {
    cachedConnection = await fetchResendCredentials();
    cachedAt = now;
  }
  return { client: new Resend(cachedConnection.apiKey), fromEmail: cachedConnection.fromEmail };
}

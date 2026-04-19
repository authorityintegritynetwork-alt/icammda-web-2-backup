import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { CLERK_PROXY_PATH, clerkProxyMiddleware } from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.set("trust proxy", 1);

const isProd = process.env["NODE_ENV"] === "production";

app.use(
  helmet({
    contentSecurityPolicy: isProd
      ? {
          useDefaults: true,
          directives: {
            "default-src": ["'self'"],
            "script-src": [
              "'self'",
              "'unsafe-inline'",
              "https://*.clerk.accounts.dev",
              "https://*.clerk.com",
              "https://*.clerk.dev",
              "https://challenges.cloudflare.com",
              "https://www.youtube.com",
              "https://s.ytimg.com",
            ],
            "script-src-elem": [
              "'self'",
              "'unsafe-inline'",
              "https://*.clerk.accounts.dev",
              "https://*.clerk.com",
              "https://*.clerk.dev",
              "https://challenges.cloudflare.com",
              "https://www.youtube.com",
              "https://s.ytimg.com",
            ],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "style-src-elem": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
            "img-src": [
              "'self'",
              "data:",
              "blob:",
              "https:",
            ],
            "media-src": ["'self'", "https:", "blob:"],
            "connect-src": [
              "'self'",
              "https://*.clerk.accounts.dev",
              "https://*.clerk.com",
              "https://*.clerk.dev",
              "https://clerk-telemetry.com",
              "https://www.googleapis.com",
              "https://i.ytimg.com",
              "https://storage.googleapis.com",
            ],
            "frame-src": [
              "'self'",
              "https://*.clerk.accounts.dev",
              "https://*.clerk.com",
              "https://www.youtube.com",
              "https://www.youtube-nocookie.com",
              "https://challenges.cloudflare.com",
              "https://www.linkedin.com",
              "https://docs.google.com",
              "https://forms.gle",
              "https://docs.googleusercontent.com",
            ],
            "object-src": ["'none'"],
            "base-uri": ["'self'"],
            "form-action": ["'self'"],
            "frame-ancestors": ["'self'"],
            "upgrade-insecure-requests": [],
          },
        }
      : false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: isProd ? { maxAge: 15552000, includeSubDomains: true } : false,
  }),
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.use("/api", router);

export default app;

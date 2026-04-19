import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import path from "path";
import fs from "fs";
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

// CORS — same-origin only by default (the single-container deployment does
// not need CORS). To allow cross-origin clients, set CORS_ORIGIN to a
// comma-separated list:
//   CORS_ORIGIN=https://icammda.org,https://www.icammda.org
// In development we relax this so the Vite dev server can call the API.
const corsOriginEnv = process.env.CORS_ORIGIN?.trim();
const corsAllowList = corsOriginEnv
  ? corsOriginEnv.split(",").map((s) => s.trim()).filter(Boolean)
  : null;
app.use(
  cors({
    credentials: true,
    origin: corsAllowList
      ? (origin, cb) => {
          // Allow requests with no Origin header (curl, same-origin, server-to-server)
          if (!origin) return cb(null, true);
          if (corsAllowList.includes(origin) || corsAllowList.includes("*")) {
            return cb(null, true);
          }
          return cb(new Error(`CORS: origin ${origin} not allowed`));
        }
      : isProd
        ? false
        : true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.use("/api", router);

// In production, serve the built React SPA from artifacts/icammda-website/dist/public.
// This makes the deployment a single service (one Koyeb app, one domain).
// Override with WEB_DIST_PATH if your build output lives elsewhere.
if (isProd) {
  const candidatePaths = [
    process.env.WEB_DIST_PATH,
    // When running from artifacts/api-server/dist/index.mjs
    path.resolve(process.cwd(), "../icammda-website/dist/public"),
    // When running from the repo root
    path.resolve(process.cwd(), "artifacts/icammda-website/dist/public"),
    // Docker layout
    path.resolve(process.cwd(), "web/public"),
  ].filter((p): p is string => Boolean(p));

  const webDist = candidatePaths.find((p) => {
    try {
      return fs.statSync(p).isDirectory();
    } catch {
      return false;
    }
  });

  if (webDist) {
    logger.info({ webDist }, "Serving SPA from disk");
    // Static assets — cache aggressively (Vite emits hashed filenames)
    app.use(
      express.static(webDist, {
        index: false,
        maxAge: "1y",
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith("index.html")) {
            res.setHeader("Cache-Control", "no-cache");
          }
        },
      }),
    );

    // SPA fallback — serve index.html for any non-API GET that didn't match a
    // file. We skip paths that look like asset requests (have a file extension)
    // so a missing /foo.js returns 404 instead of an HTML 200, which would
    // break the browser cache and confuse debugging.
    const indexFile = path.join(webDist, "index.html");
    app.get(/^(?!\/api\/).*/, (req: Request, res: Response, next: NextFunction) => {
      const last = req.path.split("/").pop() ?? "";
      if (last.includes(".") && !last.endsWith(".html")) {
        return next();
      }
      fs.access(indexFile, fs.constants.R_OK, (err) => {
        if (err) return next();
        res.setHeader("Cache-Control", "no-cache");
        res.sendFile(indexFile);
      });
    });
  } else {
    logger.warn(
      { tried: candidatePaths },
      "Production mode but no web build found — running API only",
    );
  }
}

export default app;

/**
 * S3-compatible object storage service.
 *
 * Works with any S3-compatible provider:
 *  - Cloudflare R2  (recommended — generous free tier, S3 API)
 *  - AWS S3
 *  - Backblaze B2  (S3-compatible endpoint)
 *  - MinIO         (self-hosted)
 *  - Any other S3-compatible store
 *
 * Required environment variables:
 *  - S3_BUCKET             — bucket name (e.g. "icammda-uploads")
 *  - S3_REGION             — region (use "auto" for Cloudflare R2, "us-east-1" for B2 default, etc.)
 *  - S3_ACCESS_KEY_ID      — access key id
 *  - S3_SECRET_ACCESS_KEY  — secret access key
 *
 * Optional:
 *  - S3_ENDPOINT           — custom endpoint URL (REQUIRED for R2/B2/MinIO; omit for AWS S3)
 *                            R2 example:  https://<account-id>.r2.cloudflarestorage.com
 *                            B2 example:  https://s3.us-west-002.backblazeb2.com
 *  - S3_FORCE_PATH_STYLE   — "true" to force path-style addressing (needed for MinIO; default false)
 *  - S3_UPLOAD_PREFIX      — folder prefix inside the bucket for all uploads (default "uploads")
 */

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  type GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import { randomUUID } from "crypto";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `${name} environment variable is required for object storage. See artifacts/api-server/src/lib/objectStorage.ts header for setup instructions.`,
    );
  }
  return v;
}

const BUCKET = process.env.S3_BUCKET ?? "";
const REGION = process.env.S3_REGION ?? "auto";
const ENDPOINT = process.env.S3_ENDPOINT;
const FORCE_PATH_STYLE = process.env.S3_FORCE_PATH_STYLE === "true";
const UPLOAD_PREFIX = (process.env.S3_UPLOAD_PREFIX ?? "uploads").replace(
  /^\/+|\/+$/g,
  "",
);

let cachedClient: S3Client | null = null;

function getClient(): S3Client {
  if (cachedClient) return cachedClient;

  // Validate required env at first use (not at import) so the rest of the app
  // can still start even if S3 isn't configured yet.
  if (!BUCKET) requireEnv("S3_BUCKET");
  const accessKeyId = requireEnv("S3_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("S3_SECRET_ACCESS_KEY");

 cachedClient = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  forcePathStyle: FORCE_PATH_STYLE,
  credentials: { accessKeyId, secretAccessKey },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});
  return cachedClient;
}

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

/**
 * Lightweight handle to an object in storage. Mirrors the small surface
 * of the previous `File` abstraction so consumers don't change.
 */
export interface StoredObject {
  key: string;
}

export class ObjectStorageService {
  /**
   * Generate a presigned PUT URL the browser can use to upload directly
   * to S3 (15-minute expiry). Returns the URL plus the canonical object
   * path used for downloads (e.g. "/objects/<uuid>").
   */
  async getObjectEntityUploadURL(): Promise<string> {
    const client = getClient();
    const objectId = randomUUID();
    const key = `${UPLOAD_PREFIX}/${objectId}`;

    const url = await getSignedUrl(
      client,
      new PutObjectCommand({ Bucket: BUCKET, Key: key }),
      { expiresIn: 900 },
    );
    return url;
  }

  /**
   * Resolve "/objects/<id>" or a raw key to a `StoredObject` handle if it
   * exists. Throws `ObjectNotFoundError` otherwise.
   */
  async getObjectEntityFile(objectPath: string): Promise<StoredObject> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }
    const id = objectPath.slice("/objects/".length);
    if (!id) throw new ObjectNotFoundError();
    const key = `${UPLOAD_PREFIX}/${id}`;

    try {
      await getClient().send(
        new HeadObjectCommand({ Bucket: BUCKET, Key: key }),
      );
    } catch (err: any) {
      if (
        err?.$metadata?.httpStatusCode === 404 ||
        err?.name === "NotFound" ||
        err?.name === "NoSuchKey"
      ) {
        throw new ObjectNotFoundError();
      }
      throw err;
    }
    return { key };
  }

  /**
   * Public asset lookup. We treat everything under PUBLIC_PREFIX (defaults
   * to UPLOAD_PREFIX) the same way as private — they're streamed through the
   * API. Kept for API-shape compatibility with the previous implementation.
   */
  async searchPublicObject(filePath: string): Promise<StoredObject | null> {
    const key = `${UPLOAD_PREFIX}/${filePath.replace(/^\/+/, "")}`;
    try {
      await getClient().send(
        new HeadObjectCommand({ Bucket: BUCKET, Key: key }),
      );
      return { key };
    } catch (err: any) {
      if (
        err?.$metadata?.httpStatusCode === 404 ||
        err?.name === "NotFound" ||
        err?.name === "NoSuchKey"
      ) {
        return null;
      }
      throw err;
    }
  }

  /**
   * Stream a stored object back as a Web `Response` with appropriate
   * Content-Type, Content-Length, and Cache-Control headers.
   */
  async downloadObject(
    file: StoredObject,
    cacheTtlSec = 3600,
  ): Promise<Response> {
    const out: GetObjectCommandOutput = await getClient().send(
      new GetObjectCommand({ Bucket: BUCKET, Key: file.key }),
    );
    if (!out.Body) {
      throw new ObjectNotFoundError();
    }

    const nodeStream = out.Body as Readable;
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    const headers: Record<string, string> = {
      "Content-Type": out.ContentType ?? "application/octet-stream",
      "Cache-Control": `public, max-age=${cacheTtlSec}`,
    };
    if (out.ContentLength !== undefined) {
      headers["Content-Length"] = String(out.ContentLength);
    }
    if (out.ETag) {
      headers["ETag"] = out.ETag;
    }
    return new Response(webStream, { headers });
  }

  /**
   * Convert any URL or key the client may have stored back into our canonical
   * `/objects/<id>` form. Accepts:
   *   - Raw "/objects/abc"
   *   - Presigned upload URLs (we extract the trailing path segment after the prefix)
   *   - Anything else returned unchanged
   */
  normalizeObjectEntityPath(rawPath: string): string {
    if (!rawPath) return rawPath;
    if (rawPath.startsWith("/objects/")) return rawPath;

    let candidate = rawPath;
    try {
      const url = new URL(rawPath);
      candidate = url.pathname;
    } catch {
      // not a URL — treat as a key/path
    }

    // Strip leading "/<bucket>/" if present (path-style addressing)
    candidate = candidate.replace(new RegExp(`^/${BUCKET}/`), "/");
    candidate = candidate.replace(/^\/+/, "");

    const prefix = `${UPLOAD_PREFIX}/`;
    if (candidate.startsWith(prefix)) {
      const id = candidate.slice(prefix.length);
      return `/objects/${id}`;
    }
    return rawPath;
  }
}

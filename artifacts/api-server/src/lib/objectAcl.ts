/**
 * Object ACL stubs.
 *
 * The ACL system was previously backed by Google Cloud Storage object
 * metadata. With the move to a generic S3-compatible backend, we keep these
 * exports as no-op stubs so that any existing imports continue to compile.
 *
 * The site currently treats every admin-uploaded asset as public-read
 * (post covers, team photos, etc.) and serves them through the API at
 * `/api/storage/objects/*`. If you need per-object permissions later,
 * add a database-backed ACL table and check it in the storage routes.
 */

export enum ObjectPermission {
  READ = "read",
  WRITE = "write",
}

export interface ObjectAclPolicy {
  owner: string;
  visibility: "public" | "private";
}

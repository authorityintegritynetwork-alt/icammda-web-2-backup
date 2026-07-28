---
name: ICAMMDA pnpm setup quirks
description: Non-obvious issues with pnpm install in this workspace and how they were resolved.
---

## packageManager version mismatch

`package.json` shipped with `"packageManager": "pnpm@9.15.0"`. The Replit environment provides pnpm 10.26.1 via Nix. When pnpm 10 sees a different `packageManager` version, it invokes corepack to bootstrap pnpm 9.15.0, which internally uses Node 24 (`/nix/store/...-nodejs-24.12.0/bin/node`) — and Node 24 crashes with a thread-creation assertion (`uv_thread_create`).

**Fix:** Update `packageManager` in root `package.json` to match the installed pnpm: `"pnpm@10.26.1"`. Also prefix any `pnpm` calls with `COREPACK_ENABLE_STRICT=0` to avoid re-triggering bootstrap.

**Why:** Corepack strict mode enforces the declared version and tries to download/run it. Node 24 has a thread-limit bug in this Nix sandbox.

## Package firewall blocked @clerk/shared@4.4.0

Replit's package firewall blocks `@clerk/shared@4.4.0` (pinned in the pnpm lockfile as a transitive dep of `@clerk/react@6.1.4`). Install fails with `ERR_PNPM_FETCH_403`.

**Fix:** Run `pnpm update "@clerk/react" "@clerk/express" --latest --recursive` to bump the lockfile to a non-blocked version (`@clerk/shared@4.25.8`).

## Artifact workflows not registered after GitHub import

After importing from GitHub, `listArtifacts()` returns empty and `WorkflowsRestart` fails. Root causes:
1. `.replit` `[[artifacts]]` IDs were wrong (path-style IDs instead of matching the real artifact.toml IDs)
2. `artifacts/icammda-website` was missing from `.replit` entirely

Even after fixing `.replit` via `verifyAndReplaceDotReplit`, `listArtifacts()` still returned empty — the Replit artifact system does not retroactively register existing artifacts from an import.

**Fix:** Use `configureWorkflow` with a single production-mode workflow at port 8080. The Express server in `NODE_ENV=production` serves both the built SPA and the API from one process.

**How to apply:** When setting up this workspace from scratch, use the workflow command in replit.md. Rebuild the frontend if secrets change (Vite bakes `VITE_*` vars at build time).

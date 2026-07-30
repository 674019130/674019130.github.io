# Node 24 Upgrade and Netlify Retirement Design

Date: 2026-07-30

## Context

The blog currently has three deployment-related services:

- GitHub Pages is the production host and deploys automatically from `main`.
- Vercel provides pull-request previews.
- Netlify also reports pull-request checks, but its repository configuration still pins Node 16.

The current Valaxy release requires Node `>=22.12.0`, so the obsolete Netlify
runtime cannot build the site. Netlify is not part of the production path and
duplicates the preview role already covered by Vercel.

The GitHub Pages workflow builds successfully, but several actions still use
the deprecated Node 20 action runtime. Updating only the workflow's
`node-version` input would not remove that warning because the action runtime
and the Node version used to build the blog are separate concerns.

## Decision

Use the following deployment model:

- GitHub Pages remains the only production deployment.
- Vercel remains the only pull-request preview deployment.
- Netlify is completely removed from this repository's deployment lifecycle.
- Node 24 becomes the explicit runtime for local version managers, package
  metadata, Vercel inference, and GitHub Pages builds.

This keeps production ownership clear while preserving one useful preview
environment.

## Repository Changes

### Node runtime

1. Add `.node-version` containing Node major version `24`.
2. Add a Node 24 engine constraint to `package.json`.
3. Configure `actions/setup-node` to read `.node-version` instead of using the
   moving `lts/*` alias.

The explicit major version gives local development and CI the same runtime
without unnecessarily pinning every patch release.

### GitHub Pages workflow

Upgrade the workflow actions to their current Node 24-compatible major
versions:

- `actions/checkout@v7`
- `pnpm/action-setup@v6`
- `actions/setup-node@v7`
- `actions/upload-pages-artifact@v5`
- `actions/deploy-pages@v5`

The workflow continues to use the repository's existing pnpm version from the
`packageManager` field and keeps the current SSG build command and Pages
permissions.

### Netlify retirement

1. Move `netlify.toml` into `archive/netlify/`.
2. Add `archive/netlify/README.md` with the retirement date, reason, previous
   project identity, and restoration context.
3. Update the root README so Netlify is no longer described as an active
   deployment target.
4. Remove the exact Netlify project `dainty-platypus-88fe45` after confirming
   its identity and lack of a custom domain.

The repository-wide Netlify GitHub App will not be uninstalled because doing
so could affect unrelated repositories. Removing the specific project is
enough to stop its deploy previews and status checks for this blog.

Deleting the Netlify project removes its old deploy history and
`dainty-platypus-88fe45.netlify.app` URL. The production
`674019130.github.io` site and Vercel previews are unaffected.

## Dependency Scope

The dependency audit on 2026-07-30 found that all direct runtime dependencies
are already current:

- `valaxy` and `valaxy-theme-yun`: `0.28.11`
- `valaxy-addon-bangumi`: `0.4.0`
- `valaxy-addon-components`: `0.1.0`
- `valaxy-addon-lightgallery`: `0.0.4`
- `valaxy-addon-twikoo`: `0.0.4`
- `valaxy-addon-waline`: `0.2.1`

Two independent toolchain major upgrades remain available:

- TypeScript `5.9.3` to `7.0.2`
- pnpm `10.14.0` to `11.18.0`

They are intentionally excluded. Neither is required for Node 24 or the
deployment cleanup, and each deserves a separate compatibility pass. Keeping
them out prevents a CI/CD maintenance change from also becoming a compiler and
package-manager migration.

## Validation

Before publication:

1. Install dependencies from the existing lockfile under Node 24.
2. Run the existing TypeScript check and record any dependency-owned baseline
   diagnostics.
3. Run the production SSG build.
4. Validate workflow syntax and inspect the intended diff.
5. Retire the exact Netlify project.
6. Push the branch and open a pull request.
7. Confirm that Vercel remains successful and Netlify no longer reports
   checks.

After merge:

1. Watch the GitHub Pages workflow through build and deploy.
2. Confirm the workflow no longer emits the Node 20 action-runtime warning.
3. Verify the production homepage and both multi-stage search articles.

## Compatibility and Rollback

Node 24 is compatible with Valaxy's declared Node requirement. Developers on
Node 22 will need to switch to Node 24 after this change; this is an intentional
toolchain requirement change.

The repository portion of the Netlify retirement is recoverable from
`archive/netlify/`. Deleting the Netlify project itself is not fully
recoverable: a new project can reuse the archived configuration, but historical
deploy data and the generated site URL are not guaranteed to return.

If the new GitHub Actions majors fail before deployment, revert the workflow
commit while keeping the Node 24 package constraint. GitHub Pages production
continues serving the previous successful deployment until a new deployment
completes.

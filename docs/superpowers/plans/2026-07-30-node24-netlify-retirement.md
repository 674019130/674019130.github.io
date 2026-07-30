# Node 24 Upgrade and Netlify Retirement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize the blog on Node 24, update the GitHub Pages workflow to Node 24-compatible actions, and remove Netlify from the repository and its external deployment lifecycle.

**Architecture:** GitHub Pages remains the only production host and Vercel remains the only pull-request preview provider. A single `.node-version` file and the package engine constraint define the runtime contract; the Pages workflow consumes that contract. Netlify's repository configuration is retained only in a documented archive, while the exact external Netlify project is removed.

**Tech Stack:** Node.js 24, pnpm 10.14.0, Valaxy 0.28.11, GitHub Actions, GitHub Pages, Vercel, Netlify.

## Global Constraints

- Work on `chore/node24-netlify-retirement`, created from `origin/main`.
- Keep `valaxy` and `valaxy-theme-yun` at `0.28.11`; all direct Valaxy addons are already current.
- Keep TypeScript at `5.9.3` and pnpm at `10.14.0`; TypeScript 7 and pnpm 11 are separate migrations.
- Use Node major version `24` for local version managers, package metadata, Vercel inference, and GitHub Pages builds.
- GitHub Pages remains the only production deployment.
- Vercel remains the only pull-request preview deployment.
- Retire only Netlify project `dainty-platypus-88fe45`; do not uninstall the account-wide Netlify GitHub App.
- Never delete the repository's historical `netlify.toml`; move it to `archive/netlify/` and record the reason.
- Preserve the existing SSG command, Pages permissions, production content, post order, and hidden Stats Card behavior.
- Treat the existing eight TypeScript diagnostics under `node_modules/valaxy` as the baseline; no project-owned TypeScript diagnostic is acceptable.

---

## File Map

- Create `.node-version`: the single Node major consumed by developers and GitHub Actions.
- Modify `package.json`: advertise the Node 24 runtime contract without changing dependency versions.
- Modify `.github/workflows/gh-pages.yml`: consume `.node-version` and upgrade every Pages action to a Node 24-compatible major.
- Move `netlify.toml` to `archive/netlify/netlify.toml`: retain the retired provider configuration for history.
- Create `archive/netlify/README.md`: explain why Netlify was retired and how the archived configuration must be treated.
- Modify `README.md`: document GitHub Pages as production, Vercel as preview, and Netlify as retired.
- Do not modify either lockfile: `pnpm-lock.yaml` and `package-lock.json` must remain byte-for-byte unchanged.

### Task 1: Establish the Node 24 Runtime Contract

**Files:**
- Create: `.node-version`
- Modify: `package.json:5-7`
- Test: shell assertions against `.node-version` and `package.json`

**Interfaces:**
- Consumes: the existing `packageManager: "pnpm@10.14.0"` declaration.
- Produces: `.node-version` with `24` and `package.json.engines.node` with `24.x`; Task 2 consumes `.node-version`.

- [ ] **Step 1: Verify the runtime contract is currently absent**

Run:

```bash
test -f .node-version
node -e 'const p=require("./package.json"); if (p.engines?.node !== "24.x") process.exit(1)'
```

Expected: both commands exit non-zero because the repository has neither file nor engine constraint.

- [ ] **Step 2: Add the Node version file**

Create `.node-version` with exactly:

```text
24
```

- [ ] **Step 3: Add the package engine constraint**

Change the beginning of `package.json` to:

```json
{
  "name": "valaxy-blog",
  "type": "module",
  "version": "0.0.0",
  "private": true,
  "engines": {
    "node": "24.x"
  },
  "packageManager": "pnpm@10.14.0",
```

Do not change scripts or dependency versions.

- [ ] **Step 4: Verify the runtime contract**

Run:

```bash
test "$(tr -d '\n' < .node-version)" = "24"
node -e 'const p=require("./package.json"); if (p.engines?.node !== "24.x") process.exit(1)'
node -e 'const p=require("./package.json"); if (p.packageManager !== "pnpm@10.14.0") process.exit(1)'
```

Expected: all commands exit zero with no output.

- [ ] **Step 5: Confirm dependency metadata did not change**

Run:

```bash
git diff --exit-code -- pnpm-lock.yaml package-lock.json
node -e 'const p=require("./package.json"); console.log(p.dependencies.valaxy, p.dependencies["valaxy-theme-yun"], p.devDependencies.typescript)'
```

Expected:

```text
^0.28.11 ^0.28.11 ^5.9.3
```

- [ ] **Step 6: Commit the runtime contract**

```bash
git add .node-version package.json
git commit -m "chore: standardize blog on Node 24"
```

### Task 2: Upgrade the GitHub Pages Workflow

**Files:**
- Modify: `.github/workflows/gh-pages.yml:26-67`
- Test: workflow text assertions, YAML parsing, and GitHub action tag checks

**Interfaces:**
- Consumes: `.node-version` from Task 1.
- Produces: a Pages workflow whose build runtime and action runtimes are all Node 24-compatible.

- [ ] **Step 1: Capture the obsolete workflow references**

Run:

```bash
rg -n 'actions/checkout@v4|pnpm/action-setup@v4|actions/setup-node@v4|node-version: lts/\\*|actions/upload-pages-artifact@v3|actions/deploy-pages@v4' .github/workflows/gh-pages.yml
```

Expected: six matches covering checkout, pnpm setup, Node setup, the moving LTS alias, artifact upload, and Pages deployment.

- [ ] **Step 2: Upgrade the build job**

Replace the build setup portion with:

```yaml
    steps:
      - uses: actions/checkout@v7

      - name: Install pnpm
        uses: pnpm/action-setup@v6
        with:
          run_install: true

      - name: Use Node.js 24
        uses: actions/setup-node@v7
        with:
          node-version-file: .node-version
          registry-url: https://registry.npmjs.org/
          cache: pnpm
```

Keep the commented Algolia section and the build command unchanged.

- [ ] **Step 3: Upgrade the Pages artifact and deployment actions**

Use:

```yaml
      - name: ⏫ Upload artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: ./dist
```

and:

```yaml
      - name: 🪤 Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 4: Verify obsolete action references are gone**

Run:

```bash
if rg -n 'actions/checkout@v4|pnpm/action-setup@v4|actions/setup-node@v4|node-version: lts/\\*|actions/upload-pages-artifact@v3|actions/deploy-pages@v4' .github/workflows/gh-pages.yml; then
  exit 1
fi
rg -n 'actions/checkout@v7|pnpm/action-setup@v6|actions/setup-node@v7|node-version-file: .node-version|actions/upload-pages-artifact@v5|actions/deploy-pages@v5' .github/workflows/gh-pages.yml
```

Expected: the first check prints nothing; the second prints exactly six new references.

- [ ] **Step 5: Parse the workflow and verify the action tags exist**

Run:

```bash
ruby -e 'require "yaml"; YAML.load_file(".github/workflows/gh-pages.yml"); puts "yaml ok"'
for ref in \
  actions/checkout/v7 \
  pnpm/action-setup/v6 \
  actions/setup-node/v7 \
  actions/upload-pages-artifact/v5 \
  actions/deploy-pages/v5
do
  repo="${ref%/*}"
  tag="${ref##*/}"
  gh api "repos/${repo}/git/ref/tags/${tag}" --silent
done
```

Expected: `yaml ok`, followed by zero exit status for all five tag lookups.

- [ ] **Step 6: Confirm protected production semantics remain unchanged**

Run:

```bash
rg -n 'branches: \\[main\\]|contents: read|pages: write|id-token: write|npm run build|path: ./dist|name: github-pages' .github/workflows/gh-pages.yml
```

Expected: all seven production trigger, permission, build, artifact, and environment lines remain present.

- [ ] **Step 7: Commit the workflow upgrade**

```bash
git add .github/workflows/gh-pages.yml
git commit -m "ci: upgrade Pages workflow to Node 24 actions"
```

### Task 3: Retire Netlify in the Repository

**Files:**
- Move: `netlify.toml` to `archive/netlify/netlify.toml`
- Create: `archive/netlify/README.md`
- Modify: `README.md:46-51`
- Test: repository path and documentation assertions

**Interfaces:**
- Consumes: the decision that GitHub Pages is production and Vercel is preview.
- Produces: no active root Netlify configuration and a recoverable historical record under `archive/netlify/`.

- [ ] **Step 1: Verify the active Netlify configuration and README reference**

Run:

```bash
test -f netlify.toml
rg -n 'NODE_VERSION = "16"' netlify.toml
rg -n 'netlify.toml.*netlify' README.md
```

Expected: all checks succeed and expose the obsolete Node 16 configuration.

- [ ] **Step 2: Move the configuration into the archive**

Use an `apply_patch` move operation so the file becomes:

```text
archive/netlify/netlify.toml
```

Keep its contents unchanged to preserve the historical configuration:

```toml
[build]
publish = "dist"
command = "npm run build"

[build.environment]
NODE_VERSION = "16"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[[headers]]
for = "/manifest.webmanifest"

[headers.values]
Content-Type = "application/manifest+json"
```

- [ ] **Step 3: Add the archive record**

Create `archive/netlify/README.md` with:

```markdown
# Retired Netlify Configuration

Retired on 2026-07-30.

The blog uses GitHub Pages for production and Vercel for pull-request
previews. Netlify project `dainty-platypus-88fe45` duplicated the preview role
and still pinned Node 16, which is incompatible with Valaxy 0.28.11.

`netlify.toml` is retained here only as deployment history. Do not move it back
into the repository root without first replacing the obsolete Node version
and explicitly re-approving Netlify as a deployment provider.

The Netlify project had no custom domain. Its generated
`dainty-platypus-88fe45.netlify.app` URL and deploy history were intentionally
retired; the production site remains `https://674019130.github.io/`.
```

- [ ] **Step 4: Update active deployment documentation**

Replace README lines 49-51 with:

```markdown
- `.github`: GitHub Actions build and deploy the production site to GitHub Pages
- `vercel.json`: Vercel routing for pull-request previews
- `archive/netlify`: retired Netlify configuration and retirement record
```

- [ ] **Step 5: Verify Netlify is no longer active in the repository root**

Run:

```bash
test ! -e netlify.toml
test -f archive/netlify/netlify.toml
test -f archive/netlify/README.md
rg -n 'Retired on 2026-07-30|dainty-platypus-88fe45|no custom domain' archive/netlify/README.md
rg -n 'GitHub Pages|Vercel|retired Netlify' README.md
```

Expected: all checks succeed. The archived `NODE_VERSION = "16"` remains only as documented history.

- [ ] **Step 6: Commit the repository retirement**

```bash
git add README.md archive/netlify/netlify.toml archive/netlify/README.md
git commit -m "chore: retire Netlify deployment"
```

### Task 4: Validate Under Node 24

**Files:**
- Verify only; no intended file changes
- Test: lockfile install, TypeScript baseline, SSG build, diff audit

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: evidence that Node 24 and the new workflow configuration preserve the existing blog output.

- [ ] **Step 1: Resolve a temporary Node 24 binary**

Run:

```bash
NODE24_BIN="$(npx --yes --package=node@24 -c 'command -v node')"
NODE24_DIR="$(dirname "$NODE24_BIN")"
PNPM_BIN="$(command -v pnpm)"
PATH="$NODE24_DIR:$PATH" "$NODE24_BIN" --version
```

Expected: a version beginning with `v24.`.

- [ ] **Step 2: Install from the frozen pnpm lockfile**

Run in the same shell:

```bash
PATH="$NODE24_DIR:$PATH" "$NODE24_BIN" "$PNPM_BIN" install --frozen-lockfile
```

Expected: exit zero, no lockfile rewrite, and no Node engine warning.

- [ ] **Step 3: Run the TypeScript baseline check**

Run:

```bash
set +e
TYPECHECK_OUTPUT="$(PATH="$NODE24_DIR:$PATH" "$NODE24_BIN" "$PNPM_BIN" exec tsc --noEmit 2>&1)"
TYPECHECK_STATUS=$?
set -e
printf '%s\n' "$TYPECHECK_OUTPUT"
test "$TYPECHECK_STATUS" -eq 2
test "$(printf '%s\n' "$TYPECHECK_OUTPUT" | rg -c 'error TS')" -eq 8
test -z "$(printf '%s\n' "$TYPECHECK_OUTPUT" | rg 'error TS' | rg -v '^node_modules/')"
```

Expected: the command records exactly eight existing diagnostics, all under `node_modules/valaxy`; no project-owned path appears.

- [ ] **Step 4: Run the production build**

Run:

```bash
PATH="$NODE24_DIR:$PATH" "$NODE24_BIN" "$PNPM_BIN" build
```

Expected: exit zero and a complete Valaxy SSG build in `dist/`.

- [ ] **Step 5: Confirm lockfiles and content are unchanged**

Run:

```bash
git diff --exit-code -- pnpm-lock.yaml package-lock.json pages site.config.ts valaxy.config.ts
git diff --check
git status --short
```

Expected: no lockfile or content diff; only the already committed design, plan, runtime, workflow, README, and archive work exists in branch history.

- [ ] **Step 6: Audit the full branch**

Run:

```bash
git log --oneline origin/main..HEAD
git diff --stat origin/main...HEAD
git diff origin/main...HEAD -- .node-version package.json .github/workflows/gh-pages.yml README.md archive/netlify
```

Expected: the diff is limited to the approved Node 24 and Netlify retirement scope plus the design and implementation plan.

### Task 5: Remove the Exact Netlify Project

**Files:**
- External state only; no repository file changes
- Test: Netlify public site metadata before deletion and absence after deletion

**Interfaces:**
- Consumes: the archived configuration and successful Node 24 build.
- Produces: no Netlify deploy preview or status source for this repository.

- [ ] **Step 1: Resolve the exact public Netlify target**

Run:

```bash
curl -L --fail --silent --show-error --max-time 20 \
  'https://api.netlify.com/api/v1/sites/dainty-platypus-88fe45.netlify.app' \
  | jq '{id,name,ssl_url,custom_domain,published_at:.published_deploy.published_at}'
```

Expected:

```json
{
  "id": "acc3ac05-1035-48b0-80ea-11a18f539a49",
  "name": "dainty-platypus-88fe45",
  "ssl_url": "https://dainty-platypus-88fe45.netlify.app",
  "custom_domain": null,
  "published_at": "2024-06-30T17:01:51.286Z"
}
```

Stop if the ID, name, or custom-domain state differs.

- [ ] **Step 2: Open the exact Netlify project settings**

Use the in-app browser at:

```text
https://app.netlify.com/projects/dainty-platypus-88fe45
```

Navigate to the project deletion control. Confirm the UI still displays project name `dainty-platypus-88fe45` and no production custom domain.

If Netlify requires authentication, stop this external step, ask the user to sign in in the selected browser, and resume only after they confirm. Do not switch accounts or delete any other project.

- [ ] **Step 3: Delete only the confirmed Netlify project**

Use the project's destructive-action confirmation and enter:

```text
dainty-platypus-88fe45
```

Do not uninstall the Netlify GitHub App at the user or organization level.

- [ ] **Step 4: Verify the project no longer exists publicly**

Run:

```bash
status="$(
  curl -L --silent --output /dev/null --write-out '%{http_code}' --max-time 20 \
    'https://api.netlify.com/api/v1/sites/dainty-platypus-88fe45.netlify.app'
)"
test "$status" = "404"
```

Expected: exit zero because the public site endpoint returns HTTP 404.

### Task 6: Publish Through Pull Request

**Files:**
- Git and GitHub state only
- Test: PR checks and absence of Netlify statuses

**Interfaces:**
- Consumes: all local commits and the removed Netlify project.
- Produces: an approved `main` commit that triggers GitHub Pages.

- [ ] **Step 1: Push the feature branch**

Run:

```bash
git status --short --branch
git push -u origin chore/node24-netlify-retirement
```

Expected: a clean worktree and a new remote branch.

- [ ] **Step 2: Open a ready pull request**

Run:

```bash
gh pr create \
  --repo 674019130/674019130.github.io \
  --base main \
  --head chore/node24-netlify-retirement \
  --title "Upgrade the blog to Node 24 and retire Netlify" \
  --body "$(cat <<'EOF'
## Summary
- standardize local, package, Vercel, and GitHub Pages builds on Node 24
- upgrade the Pages workflow to Node 24-compatible action majors
- archive the old Netlify configuration and retire the external Netlify project

## Validation
- pnpm install --frozen-lockfile under Node 24
- pnpm build under Node 24
- existing TypeScript baseline: eight dependency-owned Valaxy diagnostics, no project diagnostics
- pnpm-lock.yaml and package-lock.json unchanged
EOF
)"
```

Expected: a pull-request URL.

- [ ] **Step 3: Verify the PR checks**

Run:

```bash
PR_NUMBER="$(gh pr view --repo 674019130/674019130.github.io --json number --jq .number)"
gh pr checks "$PR_NUMBER" --repo 674019130/674019130.github.io --watch
gh pr view "$PR_NUMBER" --repo 674019130/674019130.github.io --json statusCheckRollup
```

Expected: Vercel checks succeed. No check name or context contains `Netlify`, `netlify`, or `dainty-platypus-88fe45`.

- [ ] **Step 4: Merge without deleting the branch**

Run:

```bash
HEAD_SHA="$(gh pr view "$PR_NUMBER" --repo 674019130/674019130.github.io --json headRefOid --jq .headRefOid)"
gh pr merge "$PR_NUMBER" \
  --repo 674019130/674019130.github.io \
  --merge \
  --match-head-commit "$HEAD_SHA"
```

Expected: the PR becomes merged and `main` receives a merge commit. Do not pass `--delete-branch`.

### Task 7: Verify the Production Deployment

**Files:**
- External verification only
- Test: GitHub Pages workflow annotations and live routes

**Interfaces:**
- Consumes: the merged `main` commit.
- Produces: evidence that production is healthy and the Node 20 warning is gone.

- [ ] **Step 1: Find the Pages run for the merge commit**

Run:

```bash
MERGE_SHA="$(gh pr view "$PR_NUMBER" --repo 674019130/674019130.github.io --json mergeCommit --jq .mergeCommit.oid)"
RUN_ID="$(
  gh run list \
    --repo 674019130/674019130.github.io \
    --workflow gh-pages.yml \
    --branch main \
    --limit 10 \
    --json databaseId,headSha \
    --jq ".[] | select(.headSha == \"$MERGE_SHA\") | .databaseId" \
    | head -1
)"
test -n "$RUN_ID"
```

Expected: `RUN_ID` contains the new GitHub Pages run ID.

- [ ] **Step 2: Watch build and deployment**

Run:

```bash
gh run watch "$RUN_ID" --repo 674019130/674019130.github.io --exit-status
```

Expected: both `build` and `deploy` complete successfully.

- [ ] **Step 3: Confirm the Node 20 action warning is gone**

Run:

```bash
gh run view "$RUN_ID" --repo 674019130/674019130.github.io
gh api "repos/674019130/674019130.github.io/actions/runs/$RUN_ID/jobs" \
  --jq '.jobs[].steps[] | [.name,.conclusion] | @tsv'
```

Expected: every required step succeeds. The run output has no annotation stating that Node.js 20 is deprecated or being forced to Node 24.

- [ ] **Step 4: Verify the live site**

Run:

```bash
for url in \
  'https://674019130.github.io/' \
  'https://674019130.github.io/posts/multi-stage-search-ranking-zh' \
  'https://674019130.github.io/posts/multi-stage-search-ranking-en'
do
  curl -L --fail --silent --show-error --max-time 20 \
    -o /dev/null \
    -w '%{http_code} %{url_effective}\n' \
    "$url"
done
```

Expected: all three routes return HTTP 200.

- [ ] **Step 5: Verify production content behavior**

Download the homepage and assert:

```bash
curl -L --fail --silent --show-error --max-time 20 \
  'https://674019130.github.io/' \
  -o /tmp/blog-node24-home.html

rg -n '当相关性遇见时效性：多阶段搜索排序的工程设计' /tmp/blog-node24-home.html
rg -n 'When Relevance Meets Recency: Engineering a Multi-Stage Search Ranking System' /tmp/blog-node24-home.html
if rg -n 'Stats Card' /tmp/blog-node24-home.html; then
  exit 1
fi
```

Expected: both search articles appear and Stats Card remains hidden.

- [ ] **Step 6: Record the final repository and deployment state**

Run:

```bash
git fetch origin main
git log -1 --oneline origin/main
gh run view "$RUN_ID" \
  --repo 674019130/674019130.github.io \
  --json status,conclusion,url,headSha,workflowName
gh api repos/674019130/674019130.github.io/pages \
  --jq '{status,html_url,build_type}'
```

Expected: `origin/main` contains the merged PR, the workflow conclusion is `success`, and GitHub Pages reports `status: built`.

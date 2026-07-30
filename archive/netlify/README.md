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

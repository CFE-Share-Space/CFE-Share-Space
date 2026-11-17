# Roadmap

## Available

- [x] Independent vanilla TypeScript/Vite and Python/Streamlit starters.
- [x] Offline image fixture, connection diagnostics, Yes/No task, payload preview.
- [x] Panoptes configuration, workflow queue, custom versioned annotations.
- [x] Anonymous access and configurable OAuth implementations.
- [x] GitHub Pages workflow and Streamlit deployment instructions.
- [x] Shared and portable agent context; initial contract tests.

## Before recommending authenticated public launches

- [ ] Validate client registrations, redirect URLs, scopes and anonymous/authenticated POSTs with Zooniverse and a dedicated test project.
- [ ] Verify authorization code + PKCE and token endpoint CORS for static hosting; replace implicit flow when supported.
- [ ] Robust Streamlit OAuth session continuity across redirects, refreshes and replicas, using a vetted callback/session mechanism.
- [ ] Browser end-to-end coverage of auth callbacks, failed/uncertain POSTs, queue exhaustion and deployed URL paths.
- [ ] Token refresh/revocation strategy and authenticated identity display across both starters.

## Languages and frameworks

- [ ] React + TypeScript; retain framework-independent API/annotation modules.
- [ ] Python Flask starter for conventional server-rendered apps.
- [ ] Python FastAPI starter for server processing plus custom browser UI.
- [ ] Python Django starter when a database/admin interface is justified.

## Hosting

- [ ] Vercel static deployment and applicable server runtime guide.
- [ ] Railway server deployment, environment/secrets and health checks.
- [ ] Reproducible container packaging for Python hosts.

## Task and operations extensions

- [ ] Video/audio/multiframe examples; drawing coordinate conventions.
- [ ] Representative custom annotation export/analysis walkthrough.
- [ ] Optional durable drafts and carefully designed duplicate-submission recovery.
- [ ] Accessibility and workshop usability review with external users.
- [ ] Dependency update policy and broader supported-runtime testing.

## Alternatives worth evaluating

FastAPI plus a TypeScript UI is useful for protected credentials, large server-side computations or custom API routes. React is useful when interaction state becomes complex. Flask suits small conventional web apps. Django should follow a concrete need for persistence or administration. Keep these as separate starters rather than adding every framework to the initial two.

## Verification on 2026-11-17

TypeScript contract test and production build passed with Node 26.3.0, TypeScript 5.9 and Vite 8.3.8. Python contract tests and a Streamlit AppTest launch/Yes submission passed with Python 3.14.5 and Streamlit 1.67.0. Hosted deployment, OAuth and live classification submission were not exercised. Supported lower runtime versions still need CI validation.

npm audit reports a high-severity picomatch ReDoS advisory (GHSA-fc5q-39xc-vjpf) propagated through Vite's development tooling. The registry's latest picomatch is 4.0.7 and remains affected. Track the upstream fix; avoid exposing the development server publicly. This dependency is not shipped as application JavaScript in the static build.

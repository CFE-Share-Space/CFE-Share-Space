# TypeScript + Vite CFE starter

An independently copyable starter for an existing Zooniverse Panoptes project. Starts with an offline image and a Yes/No task, with no Skip action.

## Run locally

Requires Node 22.12+ (or a current Node LTS) and npm.

```sh
npm install
npm run dev
```

Open the localhost URL printed by Vite. Edit `config.example.json` for your copied project. All configuration is public and bundled into the site; never add secrets. `npm run build` type-checks and creates `dist/`; `npm run preview` serves that build. `npm test` runs local contract tests.

## Connect to Panoptes

Keep mode=demo to work offline: all connection indicators explicitly identify fixtures, and answers never leave the app. In mode=live set environment (production or staging), projectId and workflowId as strings. Optionally set subjectSetId to check that resource; it does not constrain the workflow queue. Live failures are shown as failures, never disguised as fixture success. The workflow must belong to your project and have suitable queued subjects.

Leave allowLiveSubmission=false to preview. Set it to true only when ready to submit actual classifications. Yes/No produces `[{"task":"cfe","value":{"schema_version":1,"answer":"yes"}}]`. This custom task key is independent of workflow task definitions. Downstream analysis must understand this schema. The fetched workflow version is included in metadata.

Optional sign-in requires oauthClientId, oauthRedirectUri and oauthScope approved for your deployment by Zooniverse. Client IDs from example projects are not portable registrations. Never collect volunteer passwords. Sign-out clears local tokens; expired tokens require signing in again. Default access is anonymous.

## Customize with an agent

Read AGENTS.md. Replace the Yes/No controls in src/main.ts and the annotation serializer in src/core.ts. HTTP transport and payload construction live in that core module; OAuth lives in src/auth.ts. Keep a versioned annotation schema and a representative offline fixture. Image subjects are supported; add a viewer for other media. Preserve answer validation and failed-submission state.

Suggested prompt: “Read README.md and AGENTS.md. Replace Yes/No with [task], using [media] and storing [versioned schema]. Preserve demo mode, separate transport/auth/task code, and test locally without submitting real classifications.”

## Deploy

Copy this folder, including `.github`, to the root of a new GitHub repository. Commit the generated package-lock.json. In Settings → Pages select GitHub Actions as the source, then push to main. The included workflow tests, builds, uploads dist and deploys Pages. Relative build paths support repository Pages URLs. The workflow assumes this folder is the repository root, not nested in this collection.

For OAuth, configure the exact final Pages URL including its repository path/trailing slash. Confirm an implicit-flow public client with Zooniverse; no secret belongs here. Localhost needs its own approved redirect URL. Sign-in remains unavailable until client ID and redirect URI are configured. Anonymous classification remains available.

## Validate

Run the checks above, then manually verify offline Yes/No and payload preview. In a dedicated live test workflow verify connection success/failure, optional subject set, anonymous/sign-in behavior, preview-only mode and empty queues. Test failed submissions and confirm answers remain available. A timeout can mean the server accepted the answer: inspect records before retrying. No automatic POST retries, durable drafts or deduplication are provided. OAuth and live writes need deployment-specific acceptance testing.

New starter code/documentation: CC BY 4.0, attribution to CFE template contributors. Reference projects and dependencies retain their own licenses. Official API reference: https://zooniverse.github.io/panoptes/

Dependency audit: the current Vite development dependency tree includes the unresolved picomatch advisory GHSA-fc5q-39xc-vjpf. Keep the development server local and update when an upstream patch is available. The static production bundle does not include that tooling.

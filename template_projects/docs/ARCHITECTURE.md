# Architecture and data contract

Each template separates HTTP transport and classification serialization (`core.ts` / `core.py`), OAuth (`auth.ts` / `auth.py`), and task UI (`main.ts` / `app.py`). Configuration chooses offline demo or live Panoptes. No workflow-task renderer is required.

Live sequence: read project → read workflow and its actual version → optionally check subject set → request one queued subject → display media → collect Yes/No → submit → request next subject. Errors retain the current answer. A successful POST is never repeated merely because fetching the next subject failed. Only basic image rendering ships; other media need a viewer.

The starter annotation is:

```json
[{"task":"cfe","value":{"schema_version":1,"answer":"yes"}}]
```

`answer` is `yes` or `no`. Replace this value structure with your own documented JSON schema; increment schema_version when interpretation changes. The task key does not need a corresponding workflow task definition. Backend storage does not imply compatibility with built-in aggregation or exports that assume standard task formats. Validate your downstream analysis.

Classification metadata includes the fetched workflow version, start/end timestamps, client identification, language and timezone offset. Links identify the project, workflow and current subject. No project/workflow/subject creation is performed. Demo payloads use fixture IDs and must never be uploaded.

## Authentication limits

Anonymous access is the default. The browser starter implements the implicit redirect flow used by Cosmic Canvas, with state verification, fragment removal and expiring tab-scoped token storage. This is a compatibility baseline; production use requires Zooniverse confirmation. Authorization code with PKCE is the preferred future direction once Panoptes support and token-endpoint CORS are verified. Browser storage is accessible to script: avoid untrusted scripts and HTML injection.

The Python starter exchanges authorization codes server-side with a client secret in Streamlit secrets. OAuth state is bound to a Streamlit session and expires after ten minutes; lost sessions fail closed. Tokens remain in per-session memory, expire, and are cleared locally at logout. Neither starter implements token refresh or server-side revocation. A logout clears local credentials; it does not sign the volunteer out of Zooniverse itself.

## Sources and reference assessment

- [Official Panoptes API reference](https://zooniverse.github.io/panoptes/): endpoints, classification metadata, custom task/value annotations and OAuth application requirements. Consulted 2026-11-17.
- Workshop clone: basic project/workflow configuration and API separation; development-proxy/password sign-in intentionally replaced.
- Cosmic Canvas clone: queue, static hosting, implicit OAuth and classification lifecycle. Its README's authorization-code claim differs from its actual implicit implementation. The checked-out branch uses JavaScript/jQuery.
- SJH time-distance clone: Streamlit lifecycle and server-side OAuth. Task-specific plotting dependencies and hard-coded workflow version were removed.

No source credentials or project-specific task code are redistributed in the starters.

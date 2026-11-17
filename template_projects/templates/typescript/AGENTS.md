# Building a custom classifier
Read README.md first. This folder is an independent starter.
Keep the API client, annotation serialization, and task UI separate. Replace the Yes/No task; do not generate UI from workflow.tasks. Keep a versioned annotation value and document its schema for downstream analysis.
Demo mode must remain offline and must never POST to Panoptes. Live submissions require explicit configuration. Preserve the queued subject endpoint: never silently substitute a subject-set listing when the queue is empty or fails. Preserve answers on failed submissions and prevent duplicate clicks. Never automatically retry an uncertain classification POST.
Never embed passwords, client secrets, or bearer tokens in browser code, logs, fixtures, or git. OAuth client IDs are public but redirect URLs must be approved by Zooniverse. Do not copy credentials from reference projects.
Keep configuration and error messages understandable. Run the checks in README.md after editing. Do not deploy or submit real classifications during automated tests.

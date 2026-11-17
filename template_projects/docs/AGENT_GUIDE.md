# Building with a coding agent

Copy a starter folder into its own repository, launch its demo, then give your agent a concrete task specification. The per-template AGENTS.md contains the essential guardrails and travels with the folder.

Example prompt:

> Read README.md and AGENTS.md. Replace the Yes/No demonstration with [task]. Subjects contain [media types and metadata]. Volunteers should [interaction and completion conditions]. Store annotations as [versioned JSON structure, including coordinate system and units]. Keep the API client and authentication separate from task UI. Preserve demo mode and replace its fixture with a representative local example. Show the serialized payload and run the documented checks. Do not deploy or send live classifications.

Specify what a valid answer means, whether empty answers are meaningful, media dimensions, coordinate conventions, multiple frames, keyboard/accessibility requirements, and downstream analysis expectations. Have the agent document the resulting annotation schema before enabling live writes.

Review configuration and serialization, inspect fixture payloads, test validation and submission failures, then manually check a dedicated live workflow. Agents must not invent OAuth credentials, hard-code workflow versions, silently fall back to subject-set listing, or place secrets in browser bundles.

Keep changes focused: add a viewer, add task controls, replace the annotation serializer, add meaningful tests. Avoid importing the original projects' astronomy-specific dependencies or implementing all future frameworks at once.

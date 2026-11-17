# Python + Streamlit CFE starter

An independently copyable starter for an existing Zooniverse Panoptes project. Starts with an offline image and a Yes/No task, with no Skip action.

## Run locally

Requires Python 3.11+.

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

Open the localhost URL printed by Streamlit. Copy `config.example.json` to `config.local.json` for local settings, or edit the example for your copied project. `config.local.json` takes precedence and is ignored by git. Run `python -m unittest discover -s tests` for local contract tests.

## Connect to Panoptes

Keep mode=demo to work offline: all connection indicators explicitly identify fixtures, and answers never leave the app. In mode=live set environment (production or staging), projectId and workflowId as strings. Optionally set subjectSetId to check that resource; it does not constrain the workflow queue. Live failures are shown as failures, never disguised as fixture success. The workflow must belong to your project and have suitable queued subjects.

Leave allowLiveSubmission=false to preview. Set it to true only when ready to submit actual classifications. Yes/No produces `[{"task":"cfe","value":{"schema_version":1,"answer":"yes"}}]`. This custom task key is independent of workflow task definitions. Downstream analysis must understand this schema. The fetched workflow version is included in metadata.

Optional sign-in requires oauthClientId, oauthRedirectUri and oauthScope approved for your deployment by Zooniverse. Client IDs from example projects are not portable registrations. Never collect volunteer passwords. Sign-out clears local tokens; expired tokens require signing in again. Default access is anonymous.

## Customize with an agent

Read AGENTS.md. Replace the Yes/No controls in app.py and the annotation serializer in core.py. HTTP transport and payload construction live in that core module; OAuth lives in auth.py. Keep a versioned annotation schema and a representative offline fixture. Image subjects are supported; add a viewer for other media. Preserve answer validation and failed-submission state.

Suggested prompt: “Read README.md and AGENTS.md. Replace Yes/No with [task], using [media] and storing [versioned schema]. Preserve demo mode, separate transport/auth/task code, and test locally without submitting real classifications.”

## Deploy

Copy this folder to the root of a new GitHub repository. Commit your public deployment settings in config.example.json (config.local.json is ignored). In Streamlit Community Cloud create an app from that repository, select app.py as entrypoint and Python 3.11 or 3.12. The host installs requirements.txt. Set any OAuth secret in the app's Settings → Secrets using the structure in .streamlit/secrets.toml.example. Use the final https://…streamlit.app/ URL as the approved redirect URI.

Locally, copy .streamlit/secrets.toml.example to .streamlit/secrets.toml and supply the server application's secret from Zooniverse. Confirm authorization-code flow and scopes for that client. Keep the original Streamlit tab open when signing in via the new tab. Streamlit session changes across OAuth redirects can invalidate state; this starter fails closed and requires a retry. Validate this behavior with your host before public authenticated use. Anonymous operation does not require secrets.

## Validate

Run the checks above, then manually verify offline Yes/No and payload preview. In a dedicated live test workflow verify connection success/failure, optional subject set, anonymous/sign-in behavior, preview-only mode and empty queues. Test failed submissions and confirm answers remain available. A timeout can mean the server accepted the answer: inspect records before retrying. No automatic POST retries, durable drafts or deduplication are provided. OAuth and live writes need deployment-specific acceptance testing.

New starter code/documentation: CC BY 4.0, attribution to CFE template contributors. Reference projects and dependencies retain their own licenses. Official API reference: https://zooniverse.github.io/panoptes/

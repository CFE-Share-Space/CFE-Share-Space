# Setup and workshop path

1. Choose TypeScript for browser customization or Streamlit for Python-based work. Copy the entire selected folder, including hidden files, into a new repository.
2. Follow its README to run the offline demo. The image and connection labels are fixtures; they do not prove that Panoptes is reachable. Submit a Yes/No answer and inspect the payload.
3. Supply your existing project and workflow IDs. Optionally supply a subject set ID to check its accessibility. Use strings for IDs. Set environment to production or staging; records and credentials are environment-specific.
4. Switch mode to live, leaving allowLiveSubmission false. Check API, project, workflow, subject-set, and queue indicators. Private resources may require login. A configured subject set is a diagnostic check; it does not filter the workflow's queue. Ensure it is attached to your workflow through your existing Panoptes administration process.
5. Arrange OAuth with Zooniverse if sign-in is desired. Ask for an approved client ID, exact localhost and deployed redirect URLs, appropriate scopes, and supported flow. Static and server apps may need different registrations. Do not assume an example project's client ID covers another deployment. Anonymous mode requires no OAuth configuration.
6. Implement your actual task and versioned annotation serializer. Confirm that you can retrieve and interpret your custom annotations using your project's export/analysis process.
7. Enable allowLiveSubmission only when ready. A completed classification is a real contribution and may affect retirement. Test against a dedicated test workflow/subjects. Automated checks use mocks and fixtures only.
8. Deploy using the template README. Repeat connection, anonymous, login/logout, expired token, empty queue, and failed submission checks at the deployed URL. OAuth and private-resource access need validation with your own Zooniverse setup.

## Troubleshooting

- Missing project/workflow: verify IDs and environment; check access permissions and workflow ownership.
- Empty queue: check workflow activation, subject-set links, retirement, and whether the volunteer has classified available subjects. Do not replace the queue with a general subject listing.
- HTTP 401/403: sign in again, verify scopes and resource access. A client-credentials token represents an application; do not use it to impersonate volunteers.
- OAuth redirect failure: registered URL must match the configured URL, including path and trailing slash. Browser token exchange may be restricted by CORS.
- Streamlit state failure: authentication redirects can create a new session. Keep the original tab open and use the login link's new tab; state validation deliberately fails if the original session is lost. Reliable cross-session callback handling is a roadmap item; do not disable state checks to fix it.
- Failed/timeout submission: the server may have accepted it. Check records before retrying. These starters do not implement offline persistence or automatic POST retries.

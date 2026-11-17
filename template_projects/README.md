# Zooniverse custom front end starters

Two independent starters for external classifiers connected to existing Panoptes projects, workflows, and uploaded subjects:

- [TypeScript + Vite](templates/typescript/README.md): static browser app, GitHub Pages.
- [Python + Streamlit](templates/python/README.md): server-hosted Python app, Streamlit Community Cloud.

Both start offline with a local image and Yes/No task. Connection indicators distinguish demo fixtures from actual successful requests. Live mode reports connection failures and never silently substitutes fixture data. There is no Skip action.

Read [the setup guide](docs/SETUP.md), [agent implementation guide](docs/AGENT_GUIDE.md), [architecture and annotation contract](docs/ARCHITECTURE.md), and [roadmap](docs/ROADMAP.md).

Copy either template folder into its own repository. Its instructions and configuration travel with it. The original reference clones are kept locally outside this published collection; their existing licenses remain applicable. Reference sources are described in the architecture guide.

These starters do not create Panoptes projects or upload subjects. No real classification is sent until you choose live mode and explicitly enable submission. OAuth requires deployment-specific configuration coordinated with Zooniverse.

New starter code and documentation are licensed under [CC BY 4.0](LICENSE). Dependencies and reference projects retain their own licenses.

"""Panoptes transport and the small annotation contract, independent of Streamlit."""
from datetime import datetime, timezone
import requests


def now():
    return datetime.now(timezone.utc).isoformat()


def origin(environment):
    if environment not in ("production", "staging"):
        raise ValueError("Environment must be production or staging")
    return "https://panoptes-staging.zooniverse.org" if environment == "staging" else "https://panoptes.zooniverse.org"


def annotation(answer):
    if answer not in ("yes", "no"):
        raise ValueError("Choose Yes or No")
    return [{"task": "cfe", "value": {"schema_version": 1, "answer": answer}}]


def classification(config, workflow, subject, answer, started):
    return {"classifications": {
        "annotations": annotation(answer), "completed": True,
        "metadata": {"workflow_version": workflow["version"], "started_at": started,
                     "finished_at": now(), "user_agent": "cfe-streamlit/0.1",
                     "user_language": "en", "utc_offset": "0", "source": "cfe-streamlit/0.1"},
        "links": {"project": config["projectId"], "workflow": workflow["id"], "subjects": [subject["id"]]}
    }}


class Panoptes:
    def __init__(self, config, token=None):
        self.origin = origin(config["environment"])
        self.headers = {"Accept": "application/vnd.api+json; version=1"}
        if token:
            self.headers["Authorization"] = f"Bearer {token}"

    def request(self, path, payload=None):
        # No automatic retries: a timed-out POST may already have been accepted.
        response = requests.request("POST" if payload is not None else "GET",
                                    f"{self.origin}/api/{path}", headers=self.headers,
                                    json=payload, timeout=20)
        if not response.ok:
            raise RuntimeError(f"Panoptes HTTP {response.status_code} ({path.split('?')[0]})")
        return response.json()

"""Small classifier shell. Replace the task UI and core.annotation to customize."""
import json
from pathlib import Path
from urllib.parse import quote, urlparse
import streamlit as st
from auth import authenticate
from core import Panoptes, classification, now

ROOT = Path(__file__).parent
st.set_page_config(page_title="CFE starter")
config_path = ROOT / "config.local.json"
config = json.loads((config_path if config_path.exists() else ROOT / "config.example.json").read_text())
if config["mode"] not in ("demo", "live"):
    st.error("Mode must be demo or live")
    st.stop()
demo = config["mode"] == "demo"
st.title("CFE starter")
st.caption("Offline demo — nothing is sent to Panoptes" if demo else "Live Panoptes connection")
if not demo:
    authenticate(config)
api = Panoptes(config, st.session_state.get("token"))
workflow = {"id": "demo-workflow", "version": "1.0"}

try:
    if demo:
        for label in ("Panoptes API", "Project", "Workflow", "Subject set", "Subject queue"):
            st.write(f"{label}: local fixture; live connection not tested")
        st.session_state.setdefault("subject", {"id": "demo-subject", "locations": []})
    else:
        if not config["projectId"] or not config["workflowId"]:
            raise ValueError("Configure projectId and workflowId")
        api.request(f"projects/{quote(config['projectId'], safe='')}")
        st.success("Project / API connected")
        workflow = api.request(f"workflows/{quote(config['workflowId'], safe='')}")["workflows"][0]
        if str(workflow["links"]["project"]) != config["projectId"]:
            raise ValueError("Workflow does not belong to this project")
        st.success("Workflow connected")
        if config["subjectSetId"]:
            subject_set = api.request(f"subject_sets/{quote(config['subjectSetId'], safe='')}")["subject_sets"][0]
            if str(subject_set["links"]["project"]) != config["projectId"]:
                raise ValueError("Subject set belongs to another project")
            st.success("Subject set connected; subjects still come from the workflow queue")
        else:
            st.caption("Subject set not configured; using workflow queue")
        if "subject" not in st.session_state:
            subjects = api.request(f"subjects/queued?workflow_id={quote(str(workflow['id']), safe='')}&page_size=1")["subjects"]
            if not subjects:
                st.info("No subjects available in the workflow queue")
                st.stop()
            st.session_state.subject = subjects[0]
        st.success("Subject queue connected")
except Exception as error:
    st.error(f"Connection failed: {error}")
    st.stop()

subject = st.session_state.subject
st.session_state.setdefault("started", now())
st.write(f"Subject: {subject['id']}")
if demo:
    st.image(str(ROOT / "demo.svg"))
else:
    image = next((url for location in subject["locations"] for mime, url in location.items() if mime.startswith("image/")), None)
    if image and urlparse(image).scheme in ("http", "https"):
        st.image(image)
    else:
        st.info("Add a viewer for this subject's media type")
if not demo and not config["allowLiveSubmission"]:
    st.info("Preview only. Enable allowLiveSubmission when ready to write real classifications.")
answer = st.radio("Does this subject match your criterion?", ("yes", "no"), index=None, key="answer")
if st.session_state.get("uncertain"):
    st.warning("Submission outcome is unknown. Check classification records before retrying to avoid duplicates.")
    if st.button("I checked; allow another attempt"):
        st.session_state.uncertain = False
        st.rerun()
if st.button("Submit answer", disabled=answer is None or st.session_state.get("uncertain", False) or (not demo and not config["allowLiveSubmission"])):
    payload = classification(config, workflow, subject, answer, st.session_state.started)
    if demo:
        st.session_state.last_payload = payload
        st.success("Demo answer recorded locally; nothing sent to Panoptes")
    else:
        try:
            api.request("classifications", payload)
        except Exception:
            st.session_state.uncertain = True
            st.rerun()
        else:
            st.session_state.last_payload = payload
            st.session_state.pop("subject", None)
            st.session_state.pop("answer", None)
            st.session_state.pop("started", None)
            st.session_state.accepted = True
            st.rerun()
if st.session_state.pop("accepted", False):
    st.success("Previous classification accepted")
if "last_payload" in st.session_state:
    with st.expander("Last classification payload"):
        st.json(st.session_state.last_payload)

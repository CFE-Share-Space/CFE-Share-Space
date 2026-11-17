"""Server-side OAuth; client secrets never leave the Streamlit server."""
import secrets
import time
from urllib.parse import urlencode
import requests
import streamlit as st
from core import origin


def authenticate(config):
    state = st.session_state
    if state.get("token_expires", 0) <= time.time():
        state.pop("token", None)
    if "code" in st.query_params or "error" in st.query_params:
        code = st.query_params.get("code")
        returned = st.query_params.get("state", "")
        expected = state.pop("oauth_state", "")
        created = state.pop("oauth_created", 0)
        st.query_params.clear()
        if not expected or not secrets.compare_digest(returned, expected) or time.time() - created > 600:
            st.error("Sign-in state expired or browser session changed. Return to the original tab and try again.")
            return
        if not code:
            st.error("Zooniverse declined sign-in.")
            return
        try:
            response = requests.post(origin(config["environment"]) + "/oauth/token", data={
                "grant_type": "authorization_code", "client_id": config["oauthClientId"],
                "client_secret": st.secrets["zooniverse"]["client_secret"],
                "redirect_uri": config["oauthRedirectUri"], "code": code}, timeout=20)
            response.raise_for_status()
            data = response.json()
            state.token = data["access_token"]
            state.token_expires = time.time() + int(data["expires_in"])
            state.pop("subject", None)
        except (requests.RequestException, KeyError, ValueError):
            st.error("Sign-in exchange failed. Check server OAuth configuration and try again.")
    if state.get("token"):
        st.caption("Signed in with Zooniverse")
        if st.button("Sign out"):
            for key in ("token", "token_expires", "subject", "answer"):
                state.pop(key, None)
            st.rerun()
    elif config["oauthClientId"] and config["oauthRedirectUri"]:
        if "oauth_state" not in state or time.time() - state.get("oauth_created", 0) > 600:
            state.oauth_state = secrets.token_urlsafe(32)
            state.oauth_created = time.time()
        query = urlencode({"response_type": "code", "client_id": config["oauthClientId"],
                           "redirect_uri": config["oauthRedirectUri"], "scope": config["oauthScope"],
                           "state": state.oauth_state})
        st.link_button("Sign in with Zooniverse", origin(config["environment"]) + "/oauth/authorize?" + query)
        st.caption("Keep this tab open; complete sign-in in the linked tab.")
    else:
        st.caption("Anonymous — optional OAuth has not been configured")

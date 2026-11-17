import configData from '../config.example.json';
import { Panoptes, classification, type Config, type Subject } from './core.ts';
import { callback, token, login, logout } from './auth.ts';
import './style.css';
const config: Config = configData;
const app = document.querySelector<HTMLElement>('#app')!;
app.innerHTML = `<h1>CFE starter</h1><p id="mode"></p><button id="login">Sign in with Zooniverse</button> <button id="logout">Sign out</button><ul id="status"></ul><p id="message" role="status"></p><img id="subject" alt="Current subject"><p id="subject-id"></p><form><fieldset disabled><legend>Does this subject match your criterion?</legend><label><input type="radio" name="answer" value="yes" required> Yes</label> <label><input type="radio" name="answer" value="no"> No</label><p><button>Submit answer</button></p></fieldset></form><details><summary>Last classification payload</summary><pre></pre></details>`;
const message = document.querySelector<HTMLElement>('#message')!;
const status = document.querySelector<HTMLUListElement>('#status')!;
const form = document.querySelector('form')!;
const fieldset = document.querySelector('fieldset')!;
const report = (label: string, detail: string) => { const li = document.createElement('li'); li.textContent = `${label}: ${detail}`; status.append(li); };
let api: Panoptes;
let workflow = { id: 'demo-workflow', version: '1.0' };
let subject: Subject = { id: 'demo-subject', locations: [{'image/svg+xml': './demo.svg'}] };
let started = new Date().toISOString();
const demo = config.mode === 'demo';
function display() {
  const image = document.querySelector<HTMLImageElement>('#subject')!;
  const url = subject.locations.flatMap(location => Object.entries(location)).find(([mime]) => mime.startsWith('image/'))?.[1];
  image.hidden = !url;
  if (url) { const parsed = new URL(url, location.href); if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Unsupported media URL'); image.src = parsed.href; }
  document.querySelector('#subject-id')!.textContent = `Subject: ${subject.id}${url ? '' : ' — add a viewer for this media type'}`;
  started = new Date().toISOString(); form.reset(); fieldset.disabled = !demo && !config.allowLiveSubmission;
}
async function next() {
  const data = await api.request(`subjects/queued?workflow_id=${encodeURIComponent(workflow.id)}&page_size=1`);
  if (!data.subjects?.length) { fieldset.disabled = true; message.textContent = 'No subjects available in the workflow queue.'; return; }
  subject = data.subjects[0]; display();
}
async function init() {
  if (!['demo', 'live'].includes(config.mode)) throw new Error('Mode must be demo or live');
  callback(); api = new Panoptes(config, token());
  document.querySelector('#mode')!.textContent = demo ? 'Offline demo — answers stay in this browser.' : 'Live Panoptes connection';
  document.querySelector<HTMLButtonElement>('#login')!.disabled = demo || !config.oauthClientId || !config.oauthRedirectUri;
  document.querySelector<HTMLButtonElement>('#logout')!.disabled = !api.token;
  if (demo) {
    for (const label of ['Panoptes API', 'Project', 'Workflow', 'Subject set', 'Subject queue']) report(label, 'local fixture; live connection not tested');
    report('Authentication', 'anonymous demo'); display(); return;
  }
  if (!config.projectId || !config.workflowId) throw new Error('Configure projectId and workflowId');
  await api.request(`projects/${encodeURIComponent(config.projectId)}`); report('Project / API', 'connected');
  const data = await api.request(`workflows/${encodeURIComponent(config.workflowId)}`); workflow = data.workflows[0];
  if (String(data.workflows[0].links.project) !== config.projectId) throw new Error('Workflow does not belong to configured project');
  report('Workflow', 'connected');
  if (config.subjectSetId) {
    const set = (await api.request(`subject_sets/${encodeURIComponent(config.subjectSetId)}`)).subject_sets[0];
    if (String(set.links.project) !== config.projectId) throw new Error('Subject set belongs to another project');
    report('Subject set', 'connected (queue remains workflow controlled)');
  } else report('Subject set', 'not configured; workflow queue is used');
  if (api.token) { await api.request('me'); report('Authentication', 'signed in'); } else report('Authentication', 'anonymous');
  await next(); report('Subject queue', 'request succeeded');
  if (!config.allowLiveSubmission) message.textContent = 'Preview only. Enable allowLiveSubmission when ready to write real classifications.';
}
form.addEventListener('submit', async event => {
  event.preventDefault(); fieldset.disabled = true;
  const answer = String(new FormData(form).get('answer') || document.querySelector<HTMLInputElement>('input:checked')?.value || '');
  let submitted = false;
  try {
    const payload = classification(config, workflow, subject, answer, started);
    document.querySelector('pre')!.textContent = JSON.stringify(payload, null, 2);
    if (!demo) {
      if (!config.allowLiveSubmission) throw new Error('Live submission is disabled');
      api.token = token(); await api.request('classifications', payload);
    }
    submitted = true; message.textContent = demo ? 'Demo answer recorded locally; nothing sent to Panoptes.' : 'Classification accepted.';
    if (demo) display(); else await next();
  } catch (error) {
    message.textContent = `${submitted ? 'Answer accepted; loading the next subject failed. Reload to continue.' : 'Submission failed or outcome unknown. Your answer is retained; check before retrying.'} ${String(error)}`;
    if (!submitted) fieldset.disabled = false;
  }
});
document.querySelector('#login')!.addEventListener('click', () => login(config));
document.querySelector('#logout')!.addEventListener('click', logout);
init().catch(error => { report('Connection', `failed — ${String(error)}`); message.textContent = String(error); fieldset.disabled = true; });

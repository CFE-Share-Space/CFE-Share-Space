export type Config = { mode: string; environment: string; projectId: string; workflowId: string; subjectSetId: string; allowLiveSubmission: boolean; oauthClientId: string; oauthRedirectUri: string; oauthScope: string };
export type Subject = { id: string; locations: Record<string, string>[] };
export function origin(environment: string) {
  if (!['production', 'staging'].includes(environment)) throw new Error('Environment must be production or staging');
  return environment === 'staging' ? 'https://panoptes-staging.zooniverse.org' : 'https://panoptes.zooniverse.org';
}
export function annotation(answer: string) {
  if (!['yes', 'no'].includes(answer)) throw new Error('Choose Yes or No');
  return [{ task: 'cfe', value: { schema_version: 1, answer } }];
}
export function classification(config: Config, workflow: {id: string; version: string}, subject: Subject, answer: string, started: string) {
  return { classifications: { annotations: annotation(answer), completed: true,
    metadata: { workflow_version: workflow.version, started_at: started, finished_at: new Date().toISOString(), user_agent: navigator.userAgent, user_language: navigator.language, utc_offset: String(new Date().getTimezoneOffset() * 60), source: 'cfe-typescript/0.1' },
    links: { project: config.projectId, workflow: workflow.id, subjects: [subject.id] } } };
}
export class Panoptes {
  config: Config;
  token: string;
  constructor(config: Config, token = '') { this.config = config; this.token = token; }
  async request(path: string, body?: unknown) {
    const response = await fetch(`${origin(this.config.environment)}/api/${path}`, {
      method: body ? 'POST' : 'GET', signal: AbortSignal.timeout(20000),
      headers: { Accept: 'application/vnd.api+json; version=1', 'Content-Type': 'application/json', ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    if (!response.ok) throw new Error(`Panoptes ${response.status} for ${path.split('?')[0]}`);
    return response.json();
  }
}

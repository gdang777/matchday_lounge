// Data Connect REST client
// Wraps the Firebase Data Connect HTTP API so route handlers can call queries
// and mutations without importing firebase-admin's experimental data-connect module.
//
// Emulator:   http://localhost:9399/v1beta/...  (no auth header required)
// Production: https://firebasedataconnect.googleapis.com/v1beta/...  (Bearer token)

import { app } from './firebase';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID!;
const LOCATION   = 'us-east4';
const SERVICE_ID = 'matchdaylounge';
const CONNECTOR  = 'matchday';

const USE_EMULATOR   = process.env.USE_FIREBASE_EMULATOR === 'true';
const EMULATOR_HOST  = process.env.FIREBASE_DATACONNECT_EMULATOR_HOST || 'localhost:9399';

function connectorUrl(action: 'executeQuery' | 'executeMutation'): string {
  const base = USE_EMULATOR
    ? `http://${EMULATOR_HOST}`
    : 'https://firebasedataconnect.googleapis.com';
  return (
    `${base}/v1beta/projects/${PROJECT_ID}/locations/${LOCATION}` +
    `/services/${SERVICE_ID}/connectors/${CONNECTOR}:${action}`
  );
}

async function buildHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (USE_EMULATOR) return headers;

  const cred = app.options.credential;
  if (!cred) throw new Error('Firebase credential not initialised');
  const { access_token } = await cred.getAccessToken();
  return { ...headers, Authorization: `Bearer ${access_token}` };
}

export async function dcQuery<T>(
  operationName: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(connectorUrl('executeQuery'), {
    method: 'POST',
    headers: await buildHeaders(),
    body: JSON.stringify({ operationName, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DC query "${operationName}" failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as { data: T };
  return json.data;
}

export async function dcMutate<T>(
  operationName: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(connectorUrl('executeMutation'), {
    method: 'POST',
    headers: await buildHeaders(),
    body: JSON.stringify({ operationName, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DC mutation "${operationName}" failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as { data: T };
  return json.data;
}

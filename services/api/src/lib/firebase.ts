import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialise once — guard against hot-reload re-initialisation in dev (tsx watch).
const app = getApps().length === 0
  ? initializeApp({
      // Prefer explicit service-account creds (local dev with FIREBASE_CLIENT_EMAIL set).
      // Falls back to Application Default Credentials — works automatically on Cloud Run
      // via the metadata server, and locally when GOOGLE_APPLICATION_CREDENTIALS is set.
      credential: process.env.FIREBASE_CLIENT_EMAIL
        ? cert({
            projectId: process.env.FIREBASE_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Secret Manager stores the key with literal \n — replace them.
            privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
          })
        : applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };

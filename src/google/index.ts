import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

let client: JWT | null = null;

async function initializeClient(): Promise<JWT> {
  return new Promise((resolve, reject) => {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL ?? '';
    const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? '').replace(/\\n/g, '\n').replace(/\\/g, '');
    const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

    if (!clientEmail || !privateKey) {
      reject();
      return;
    }

    const jwtClient = new google.auth.JWT(clientEmail, undefined, privateKey, scopes, undefined);

    jwtClient.authorize((err) => {
      if (err) {
        console.error(err);
        reject();
        return;
      }

      resolve(jwtClient);
    });
  });
}

export async function getGoogleClient() {
  if (!client) {
    client = await initializeClient();
  }

  return client;
}

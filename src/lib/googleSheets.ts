import { google } from 'googleapis';
import { PhoningFormData } from '@/types/phoning';
import path from 'path';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuthClient() {
  let credentials;

  // En production (Vercel), utiliser la variable d'environnement
  if (process.env.GOOGLE_CREDENTIALS) {
    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    // Fix pour Vercel qui escape les \n
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
  } else {
    // En developpement local, utiliser le fichier
    const credentialsPath = path.join(process.cwd(), 'google-credentials.json');
    credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  return auth;
}

export async function appendToSheet(data: PhoningFormData & { id?: string; created_at?: string }): Promise<{ success: boolean; duplicate?: boolean }> {
  const auth = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const sheetId = process.env.GOOGLE_SHEET_ID!;

  // Verifier si l'email existe deja dans le Sheet
  const emailColumn = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'D:D', // Colonne Email
  });

  const emails = emailColumn.data.values || [];
  const emailExists = emails.some((row: string[]) => row[0] === data.email);

  if (emailExists) {
    console.log('Email deja present dans le Sheet:', data.email);
    return { success: false, duplicate: true };
  }

  // Formater la disponibilite
  const formatDisponibilite = (value: string) => {
    switch (value) {
      case '1-2h': return '1-2h/semaine';
      case '3-5h': return '3-5h/semaine';
      case '5h+': return '5h et +';
      default: return value;
    }
  };

  // Formater l'experience
  const formatExperience = (value: string) => {
    switch (value) {
      case 'deja_fait': return 'Deja fait';
      case 'jamais_mais_motive': return 'Jamais fait mais motive';
      default: return value;
    }
  };

  // Preparer les donnees pour le sheet
  const row = [
    data.created_at || new Date().toISOString(),
    data.prenom,
    data.nom,
    data.email,
    data.mobile,
    data.ville,
    data.code_postal,
    formatDisponibilite(data.disponibilite),
    formatExperience(data.experience),
  ];

  // Trouver la prochaine ligne vide en colonne A
  const existingData = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A:A',
  });

  const nextRow = (existingData.data.values?.length || 1) + 1;

  // Ajouter la ligne a une position precise
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `A${nextRow}:I${nextRow}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  });

  return { success: true };
}

export async function initializeSheetHeaders(forceUpdate: boolean = false) {
  const auth = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const sheetId = process.env.GOOGLE_SHEET_ID!;

  const headers = [
    'Date',
    'Prenom',
    'Nom',
    'Email',
    'Mobile',
    'Ville',
    'Code postal',
    'Disponibilite',
    'Experience',
  ];

  // Verifier si les headers existent deja
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A1:I1',
  });

  const headersExist = response.data.values && response.data.values.length > 0;

  if (!headersExist || forceUpdate) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'A1:I1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers],
      },
    });

    // Formater les headers en gras
    try {
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: sheetId,
      });
      const sheet = spreadsheet.data.sheets?.[0];
      const sheetTabId = sheet?.properties?.sheetId || 0;

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: sheetTabId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: headers.length,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.05, green: 0.11, blue: 0.30 }, // Bleu marine
                    textFormat: {
                      bold: true,
                      foregroundColor: { red: 1, green: 1, blue: 1 }, // Blanc
                    },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
            {
              updateSheetProperties: {
                properties: {
                  sheetId: sheetTabId,
                  gridProperties: {
                    frozenRowCount: 1,
                  },
                },
                fields: 'gridProperties.frozenRowCount',
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error('Erreur formatage headers:', error);
    }
  }
}

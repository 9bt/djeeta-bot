import { google, sheets_v4 } from 'googleapis';
import Schema$Sheet = sheets_v4.Schema$Sheet;
import Schema$Request = sheets_v4.Schema$Request;

import { getGoogleClient } from '@/google';

export type Record = {
  [key: string]: any;
};

const HEADER_COUNT = 1;

async function getSheetId(range: string): Promise<number | undefined> {
  if (range === '') {
    return;
  }

  const client = await getGoogleClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const response = await sheets.spreadsheets.get({
    auth: client,
    spreadsheetId: process.env.SPREADSHEET_ID,
  });
  const sheetIds = (response.data?.sheets ?? [])
    .filter((sheet: Schema$Sheet): boolean => sheet.properties?.title === range)
    .map((sheet: Schema$Sheet): number => sheet.properties?.sheetId || 0);

  return sheetIds[0];
}

export async function createRecord(range: string, row: any[]) {
  const client = await getGoogleClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        row,
      ],
    },
  });
}

export async function listRecords(range: string): Promise<Record[]> {
  const client = await getGoogleClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range,
  });

  return normalizeSheetValue(response.data.values ?? []);
}

export async function deleteRecords(ids: string[], range: string): Promise<void> {
  if (ids.length === 0) {
    return;
  }

  const client = await getGoogleClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range,
  });

  const sheetId = await getSheetId(range);

  const values = normalizeSheetValue(response.data.values ?? []);

  const requests: Schema$Request[] = [];
  values.forEach((record: Record, index: number) => {
    if (!ids.includes(record.id)) {
      return;
    }

    const rowIndex = index + HEADER_COUNT - requests.length;

    requests.push({
      deleteDimension: {
        range: {
          dimension: 'ROWS',
          sheetId,
          startIndex: rowIndex,
          endIndex: rowIndex + 1,
        },
      },
    });
  });

  await sheets.spreadsheets.batchUpdate({
    auth: client,
    spreadsheetId: process.env.SPREADSHEET_ID,
    requestBody: {
      requests,
    },
  });
}

function normalizeSheetValue(tmpValues: any[][]): Record[] {
  const headerIndex = HEADER_COUNT - 1;
  const firstData = tmpValues[headerIndex];

  const resultValues: Record[] = [];
  tmpValues
    .filter((tmpValue, i) => {
      const validColumns = tmpValue.filter((v) => v !== '');
      return i > headerIndex && validColumns.length > 0;
    })
    .forEach((tmpValue) => {
      const resultValue: Record = {};
      for (let tmpValueIndex = 0; tmpValueIndex < tmpValue.length; tmpValueIndex++) {
        if (!firstData[tmpValueIndex]) {
          continue;
        }

        resultValue[firstData[tmpValueIndex] as string] = (tmpValue[tmpValueIndex] ?? '').trim();
      }

      resultValues.push(resultValue);
    });

  return resultValues;
}

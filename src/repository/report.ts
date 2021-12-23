import alasql from 'alasql';

import { createRecord, listRecords } from '@/service/spreadsheet';
import { formatDate, getDateStrRange } from '@/service/date';

const GOLD_BRICK_SHEET_RANGE = 'gold_brick';

export interface Report {
  num: number;
  name?: string;
  year?: number;
  month?: number;
  day?: number;
}

export async function createGoldBrickReport(id: string, name: string, dateSerial: number): Promise<void> {
  await createRecord(GOLD_BRICK_SHEET_RANGE, [id, name, dateSerial]);
}

export async function findGoldBrickReportsInYear(year: number): Promise<Report[]> {
  const reports = await listRecords(GOLD_BRICK_SHEET_RANGE);

  const [start, end] = getDateStrRange(year, 0);
  const dateCondtionQuery = `DATE(date) >= DATE("${start}") AND DATE(date) <= DATE("${end}")`;

  const query = `
    SELECT name, COUNT(name) AS num
    FROM ?
    WHERE ${dateCondtionQuery}
    GROUP BY name, YEAR(date)
    ORDER BY num DESC;
  `;

  return alasql(query, [reports]) as Report[];
}

export async function findGoldBrickReportsInMonth(year: number, month: number): Promise<Report[]> {
  const reports = await listRecords(GOLD_BRICK_SHEET_RANGE);

  const [start, end] = getDateStrRange(year, month);
  const dateCondtionQuery = `DATE(date) >= DATE("${start}") AND DATE(date) <= DATE("${end}")`;

  const query = `
    SELECT name, COUNT(name) AS num
    FROM ?
    WHERE ${dateCondtionQuery}
    GROUP BY name, MONTH(date)
    ORDER BY num DESC;
  `;

  return alasql(query, [reports]) as Report[];
}

export async function findGoldBrickReportsInMonthByDay(year: number, month: number): Promise<Report[]> {
  const reports = await listRecords(GOLD_BRICK_SHEET_RANGE);

  const [start, end] = getDateStrRange(year, month);
  const dateCondtionQuery = `DATE(date) >= DATE("${start}") AND DATE(date) <= DATE("${end}")`;

  const query = `
    SELECT name, COUNT(name) AS num, DAY(date) AS day
    FROM ?
    WHERE ${dateCondtionQuery}
    GROUP BY name, DAY(date)
    ORDER BY day ASC;
  `;

  return alasql(query, [reports]) as Report[];
}

export async function findGoldBrickReportsInYearAsName(year: number, name: string): Promise<Report[]> {
  const reports = await listRecords(GOLD_BRICK_SHEET_RANGE);

  const [start, end] = getDateStrRange(year, 0);
  const dateCondtionQuery = `DATE(date) >= DATE("${start}") AND DATE(date) <= DATE("${end}")`;

  const query = `
    SELECT name, COUNT(name) AS num, MONTH(date) AS month
    FROM ?
    WHERE name = "${name}" AND ${dateCondtionQuery}
    GROUP BY name, MONTH(date)
    ORDER BY month ASC;
  `;

  return alasql(query, [reports]) as Report[];
}

export async function findGoldBrickReportsInMonthAsName(year: number, month: number, name: string): Promise<Report[]> {
  const reports = await listRecords(GOLD_BRICK_SHEET_RANGE);

  const [start, end] = getDateStrRange(year, month);
  const dateCondtionQuery = `DATE(date) >= DATE("${start}") AND DATE(date) <= DATE("${end}")`;

  const query = `
    SELECT name, COUNT(name) AS num, DAY(date) AS day
    FROM ?
    WHERE name = "${name}" AND ${dateCondtionQuery}
    GROUP BY name, DAY(date)
    ORDER BY day ASC;
  `;

  return alasql(query, [reports]) as Report[];
}

export async function findGoldBrickReportsByDateAndName(date: Date, name: string): Promise<Report[]> {
  const reports = await listRecords(GOLD_BRICK_SHEET_RANGE);

  const dateStr = formatDate(date);
  const dateCondtionQuery = `DATE(date) >= DATE("${dateStr} 00:00:00") AND DATE(date) <= DATE("${dateStr} 23:59:59")`;
  const query = `SELECT * FROM ? WHERE name = "${name}" AND ${dateCondtionQuery}`;

  return alasql(query, [reports]) as Report[];
}

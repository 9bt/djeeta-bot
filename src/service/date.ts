import format from 'date-fns/format';

export function formatDateInt(year: number, month: number, day: number): string {
  const yearStr = `${year}`.padStart(4, '0');
  const monthStr = `${month}`.padStart(2, '0');
  const dayStr = `${day}`.padStart(2, '0');

  return `${yearStr}-${monthStr}-${dayStr}`;
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getDateStrRange(year: number, month: number): [string, string] {
  const getLastDay = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const start = month ? `${year}-${month}-01 00:00:00` : `${year}-01-01 00:00:00`;
  const end = month ? `${year}-${month}-${getLastDay(year, month)} 23:59:59` : `${year}-12-31 23:59:59`;

  return [start, end];
}

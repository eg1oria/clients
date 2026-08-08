import { readFileSync } from 'node:fs';
import path from 'node:path';

export type DatasetId = 'komp' | 'mebel' | 'center' | 'center-al' | 'ned-astr' | 'meb-al';

export type Company = {
  id: string;
  name: string;
  whatsapp?: string;
  telegram?: string;
};

const datasetFiles: Record<DatasetId, string> = {
  komp: 'komp.csv',
  mebel: 'mebel.csv',
  center: 'center.csv',
  'center-al': 'center-al.csv',
  'ned-astr': 'ned-astr.csv',
  'meb-al': 'meb-al.csv',
};

function parseCsv(source: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  const text = source.replace(/^\uFEFF/, '');

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (character === ',' && !quoted) {
      row.push(field);
      field = '';
      continue;
    }

    if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') {
        index += 1;
      }

      row.push(field);
      if (row.some((value) => value.length > 0)) {
        rows.push(row);
      }
      row = [];
      field = '';
      continue;
    }

    field += character;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function firstValue(record: Record<string, string>, fields: string[]) {
  for (const field of fields) {
    const value = record[field]?.trim();
    if (value) return value;
  }
}

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('ru-RU');
}

export function getCompanies(dataset: DatasetId): Company[] {
  const filePath = path.join(process.cwd(), 'public', datasetFiles[dataset]);
  const [headerRow, ...dataRows] = parseCsv(readFileSync(filePath, 'utf8'));

  if (!headerRow) return [];

  const headers = headerRow.map((header) => header.trim());
  const companies = new Map<string, Company>();

  for (const values of dataRows) {
    const record = Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? '']),
    );
    const name = record['Наименование']?.trim().replace(/\s+/g, ' ');
    const whatsapp = firstValue(record, ['WhatsApp 1', 'WhatsApp 2', 'WhatsApp 3']);
    const telegram = firstValue(record, ['Telegram 1', 'Telegram 2']);

    if (!name || (!whatsapp && !telegram)) continue;

    const normalizedName = normalizeName(name);
    const existing = companies.get(normalizedName);

    if (existing) {
      existing.whatsapp ||= whatsapp;
      existing.telegram ||= telegram;
      continue;
    }

    companies.set(normalizedName, {
      id: `${dataset}:${normalizedName}`,
      name,
      whatsapp,
      telegram,
    });
  }

  return [...companies.values()];
}

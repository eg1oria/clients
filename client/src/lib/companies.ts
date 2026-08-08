import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

export type Company = {
  id: string;
  name: string;
  whatsapp?: string;
  telegram?: string;
};

export type Dataset = {
  id: string;
  fileName: string;
  title: string;
  eyebrow: string;
};

const datasetCopy: Record<string, Pick<Dataset, 'title' | 'eyebrow'>> = {
  komp: {
    title: 'Компьютерные компании',
    eyebrow: 'Алматы · Компьютеры и сервис',
  },
  mebel: {
    title: 'Магазины мебели',
    eyebrow: 'Астана · Мебель',
  },
  center: {
    title: 'Бизнес-центры',
    eyebrow: 'Астана · Бизнес-центры',
  },
  'center-al': {
    title: 'Бизнес-центры',
    eyebrow: 'Алматы · Бизнес-центры',
  },
  'ned-astr': {
    title: 'Агентства недвижимости',
    eyebrow: 'Астрахань · Недвижимость',
  },
  'meb-al': {
    title: 'Магазины мебели',
    eyebrow: 'Алматы · Мебель',
  },
};

const publicDirectory = path.join(process.cwd(), 'public');

function defaultTitle(id: string) {
  return id
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word[0].toLocaleUpperCase('ru-RU') + word.slice(1))
    .join(' ');
}

export function getDatasets(): Dataset[] {
  return readdirSync(publicDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.csv')
    .map((entry) => {
      const id = entry.name.slice(0, -path.extname(entry.name).length);
      const copy = datasetCopy[id];

      return {
        id,
        fileName: entry.name,
        title: copy?.title ?? defaultTitle(id),
        eyebrow: copy?.eyebrow ?? `Список · ${entry.name}`,
      };
    })
    .filter((dataset) => dataset.id.length > 0 && dataset.id !== '.' && dataset.id !== '..')
    .sort((left, right) => left.title.localeCompare(right.title, 'ru-RU'));
}

export function getDataset(id: string) {
  return getDatasets().find((dataset) => dataset.id === id);
}

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

export function getCompanies(datasetId: string): Company[] {
  const dataset = getDataset(datasetId);

  if (!dataset) return [];

  const filePath = path.join(publicDirectory, dataset.fileName);
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
      id: `${datasetId}:${normalizedName}`,
      name,
      whatsapp,
      telegram,
    });
  }

  return [...companies.values()];
}

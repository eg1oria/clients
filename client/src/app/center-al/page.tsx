import type { Metadata } from 'next';
import { ContactBoard } from '@/components/contact-board';
import { getCompanies } from '@/lib/companies';

export const metadata: Metadata = {
  title: 'Центр Алматы — Лидлист',
};

export default function FurnitureCompaniesPage() {
  return (
    <ContactBoard
      companies={getCompanies('center-al')}
      datasetId="center-al"
      eyebrow="Алматы · Бизнес-центры"
      title="Бизнес-центры"
    />
  );
}

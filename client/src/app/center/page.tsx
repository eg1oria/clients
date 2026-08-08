import type { Metadata } from 'next';
import { ContactBoard } from '@/components/contact-board';
import { getCompanies } from '@/lib/companies';

export const metadata: Metadata = {
  title: 'Центр Астаны — Лидлист',
};

export default function FurnitureCompaniesPage() {
  return (
    <ContactBoard
      companies={getCompanies('center')}
      datasetId="center"
      eyebrow="Астана · Бизнес-центры"
      title="Бизнес-центры"
    />
  );
}

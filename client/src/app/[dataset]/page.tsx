import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContactBoard } from '@/components/contact-board';
import { getCompanies, getDataset, getDatasets } from '@/lib/companies';

type DatasetPageProps = {
  params: Promise<{ dataset: string }>;
};

export function generateStaticParams() {
  return getDatasets().map((dataset) => ({ dataset: dataset.id }));
}

export async function generateMetadata({ params }: DatasetPageProps): Promise<Metadata> {
  const { dataset: datasetId } = await params;
  const dataset = getDataset(datasetId);

  return {
    title: dataset ? `${dataset.title} — Лидлист` : 'Список не найден — Лидлист',
  };
}

export default async function DatasetPage({ params }: DatasetPageProps) {
  const { dataset: datasetId } = await params;
  const dataset = getDataset(datasetId);

  if (!dataset) notFound();

  return (
    <ContactBoard
      companies={getCompanies(dataset.id)}
      datasetId={dataset.id}
      eyebrow={dataset.eyebrow}
      title={dataset.title}
    />
  );
}

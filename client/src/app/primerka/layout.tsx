import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Примерка — прототип automation system',
  description:
    'Демонстрационный прототип воронки, сегментации, n8n-автоматизации и выдачи цифрового продукта.',
};

export default function PrimerkaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

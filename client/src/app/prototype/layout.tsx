import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  variable: '--font-apgs',
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'APGS — UX-прототип подбора насосов',
  description: 'Кликабельный прототип сценария подбора насосного оборудования APGS',
};

export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
  return <div className={inter.variable}>{children}</div>;
}

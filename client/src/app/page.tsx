import Link from 'next/link';
import { getCompanies } from '@/lib/companies';

const lists = [
  {
    href: '/ned-astr',
    label: 'Астрахань',
    title: 'Агентства недвижимости',
    count: getCompanies('ned-astr').length,
    tone: 'sand',
  },
  {
    href: '/komp',
    label: 'Алматы',
    title: 'Компьютеры и сервис',
    count: getCompanies('komp').length,
    tone: 'sage',
  },
];

export default function Home() {
  return (
    <main className="home-shell">
      <nav className="home-nav" aria-label="Главная навигация">
        <div className="brand-link">
          <span className="brand-mark" aria-hidden="true">
            L
          </span>
          <span>Лидлист</span>
        </div>
        <span className="nav-note">Рабочее пространство</span>
      </nav>

      <section className="home-hero">
        <h1>Один клик до нового клиента.</h1>
        <p>
          Выберите список, откройте диалог с готовым предложением и двигайтесь дальше без повторов.
        </p>
      </section>
    </main>
  );
}

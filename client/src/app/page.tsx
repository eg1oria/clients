import Link from 'next/link';
import { getCompanies, getDatasets } from '@/lib/companies';

export default function Home() {
  const datasets = getDatasets();

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

      <section className="list-grid" aria-label="Списки компаний">
        {datasets.map((dataset, index) => {
          const companyCount = getCompanies(dataset.id).length;

          return (
            <Link
              href={`/${encodeURIComponent(dataset.id)}`}
              className={`list-card ${index % 2 === 0 ? 'list-card-sand' : 'list-card-sage'}`}
              key={dataset.id}
            >
              <div className="list-card-topline">
                <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="list-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
              <div>
                <p>{dataset.eyebrow}</p>
                <h2>{dataset.title}</h2>
              </div>
              <span className="list-count">{companyCount} компаний</span>
            </Link>
          );
        })}
      </section>

      <footer className="home-footer">
        Чтобы добавить список, поместите CSV-файл в <code>public</code>.
      </footer>
    </main>
  );
}

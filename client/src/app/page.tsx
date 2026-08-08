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

import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "YARD 8 — бизнес-центр нового ритма",
  description:
    "Офисы класса А, сервисы для команды и зелёная терраса в центре города.",
};

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={styles.arrow}
    fill="none"
  >
    {diagonal ? (
      <path d="M6 18 18 6m0 0H8m10 0v10" />
    ) : (
      <path d="M5 12h14m-5-5 5 5-5 5" />
    )}
  </svg>
);

const Brand = () => (
  <span className={styles.brand}>
    <span className={styles.brandMark} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
    <span>
      <strong>YARD 8</strong>
      <small>business residence</small>
    </span>
  </span>
);

const units = [
  { floor: "04 этаж", area: "186 м²", ready: "готов к въезду" },
  { floor: "06 этаж", area: "312 м²", ready: "с отделкой" },
  { floor: "08 этаж", area: "548 м²", ready: "видовой" },
];

export default function ExampleCenterPage() {
  return (
    <main className={styles.page} id="top">
      <a className={styles.skipLink} href="#content">
        Перейти к содержанию
      </a>

      <header className={styles.header}>
        <a href="#top" aria-label="YARD 8 — на главную">
          <Brand />
        </a>

        <nav className={styles.desktopNav} aria-label="Основная навигация">
          <a href="#concept">О центре</a>
          <a href="#spaces">Пространства</a>
          <a href="#location">Расположение</a>
          <a href="#offices">Офисы</a>
        </nav>

        <a className={styles.headerCta} href="mailto:hello@yard8.ru">
          Выбрать офис
          <Arrow diagonal />
        </a>

        <details className={styles.mobileMenu}>
          <summary aria-label="Открыть меню">
            <span>Меню</span>
            <i aria-hidden="true" />
          </summary>
          <nav aria-label="Мобильная навигация">
            <a href="#concept">О центре</a>
            <a href="#spaces">Пространства</a>
            <a href="#location">Расположение</a>
            <a href="#offices">Свободные офисы</a>
            <a href="tel:+74951288808">+7 495 128-88-08</a>
          </nav>
        </details>
      </header>

      <div id="content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span /> Бизнес-центр класса А
            </p>
            <h1 id="hero-title">
              Больше, чем
              <br />
              место <em>для работы.</em>
            </h1>
            <p className={styles.heroLead}>
              Пространство для команд, которые выбирают свой ритм — в центре
              города, среди света, воздуха и продуманных деталей.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#offices">
                Смотреть офисы <Arrow />
              </a>
              <a className={styles.textLink} href="tel:+74951288808">
                +7 495 128-88-08
              </a>
            </div>
          </div>

          <div className={styles.heroMedia}>
            <Image
              src="/example-center/yard-exterior.png"
              alt="Современный фасад и вход в бизнес-центр YARD 8"
              fill
              fetchPriority="high"
              sizes="(max-width: 959px) calc(100vw - 32px), 50vw"
              className={styles.coverImage}
            />
            <div className={styles.heroBadge}>
              <span>5 минут</span>
              <small>до Садового кольца</small>
            </div>
            <div className={styles.photoNote}>
              <span>55.7563° N</span>
              <span>Открыт 24 / 7</span>
            </div>
          </div>

          <a className={styles.scrollCue} href="#concept">
            <span>Листайте</span>
            <i aria-hidden="true" />
          </a>
        </section>

        <section className={styles.stats} aria-label="YARD 8 в цифрах">
          <article>
            <strong>18 400</strong>
            <span>м² общая площадь</span>
          </article>
          <article>
            <strong>8</strong>
            <span>светлых этажей</span>
          </article>
          <article>
            <strong>3,6 м</strong>
            <span>высота потолков</span>
          </article>
          <article>
            <strong>2026</strong>
            <span>год открытия</span>
          </article>
        </section>

        <section className={styles.concept} id="concept">
          <div className={styles.sectionLabel}>
            <span>01</span>
            <span>Концепция</span>
          </div>
          <div className={styles.conceptGrid}>
            <h2>Мы спроектировали день, в котором всё рядом.</h2>
            <div className={styles.conceptCopy}>
              <p>
                YARD 8 объединяет архитектуру, технологии и человеческий
                сервис. Здесь легко сосредоточиться, встретиться с партнёрами
                или сделать паузу между задачами.
              </p>
              <a className={styles.underlinedLink} href="#spaces">
                Исследовать пространство <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className={styles.principles}>
            <article>
              <span>01</span>
              <h3>Свет и воздух</h3>
              <p>Панорамные окна и потолки 3,6 м на каждом офисном этаже.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Тихий сервис</h3>
              <p>Команда ресепшен решает бытовые вопросы, не отвлекая вас.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Гибкий сценарий</h3>
              <p>Офисы растут вместе с командой и меняются под её процессы.</p>
            </article>
          </div>
        </section>

        <section className={styles.spaces} id="spaces">
          <div className={styles.spacesHeading}>
            <div className={styles.sectionLabel}>
              <span>02</span>
              <span>Пространства</span>
            </div>
            <h2>Всё нужное — внутри.</h2>
          </div>

          <div className={styles.spaceGrid}>
            <article className={`${styles.photoCard} ${styles.workspaceCard}`}>
              <Image
                src="/example-center/yard-workspace.png"
                alt="Светлое общее рабочее пространство с большим столом"
                fill
                sizes="(max-width: 959px) calc(100vw - 32px), 58vw"
                className={styles.coverImage}
              />
              <div className={styles.cardShade} />
              <div className={styles.photoCardTop}>
                <span>2 этаж</span>
                <span>для резидентов</span>
              </div>
              <div className={styles.photoCardText}>
                <p>Work lounge</p>
                <h3>Меняйте обстановку, не покидая здания.</h3>
              </div>
            </article>

            <article className={`${styles.photoCard} ${styles.terraceCard}`}>
              <Image
                src="/example-center/yard-terrace.png"
                alt="Зелёная терраса на крыше бизнес-центра"
                fill
                sizes="(max-width: 959px) calc(100vw - 32px), 36vw"
                className={styles.coverImage}
              />
              <div className={styles.cardShade} />
              <div className={styles.photoCardTop}>
                <span>8 этаж</span>
                <span>430 м²</span>
              </div>
              <div className={styles.photoCardText}>
                <p>Roof garden</p>
                <h3>Терраса для встреч и перезагрузки.</h3>
              </div>
            </article>

            <article className={styles.serviceCard}>
              <div className={styles.serviceTopline}>
                <span>Y8 / сервисы</span>
                <span className={styles.roundArrow}>
                  <Arrow diagonal />
                </span>
              </div>
              <div>
                <p className={styles.serviceIntro}>
                  Инфраструктура, которая экономит время каждый день.
                </p>
                <ul>
                  <li>Кофейня и ресторан</li>
                  <li>Переговорные комнаты</li>
                  <li>Фитнес и душевые</li>
                  <li>Велопаркинг</li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.offices} id="offices">
          <div className={styles.sectionLabel}>
            <span>03</span>
            <span>Свободные офисы</span>
          </div>
          <div className={styles.officesGrid}>
            <div className={styles.officesIntro}>
              <h2>Ваш новый офис уже здесь.</h2>
              <p>
                Покажем доступные планировки и соберём предложение под вашу
                команду за один рабочий день.
              </p>
            </div>
            <div className={styles.unitList}>
              {units.map((unit) => (
                <a
                  className={styles.unit}
                  href={`mailto:hello@yard8.ru?subject=${encodeURIComponent(
                    `Офис ${unit.area}, ${unit.floor}`,
                  )}`}
                  key={unit.area}
                >
                  <span>{unit.floor}</span>
                  <strong>{unit.area}</strong>
                  <small>{unit.ready}</small>
                  <span className={styles.unitArrow}>
                    <Arrow diagonal />
                  </span>
                </a>
              ))}
              <a className={styles.darkButton} href="mailto:hello@yard8.ru">
                Получить все планировки <Arrow />
              </a>
            </div>
          </div>
        </section>

        <section className={styles.location} id="location">
          <div className={styles.locationCopy}>
            <div className={`${styles.sectionLabel} ${styles.lightLabel}`}>
              <span>04</span>
              <span>Расположение</span>
            </div>
            <h2>В центре событий. В стороне от шума.</h2>
            <p>
              Тихая улица внутри Садового кольца. Рядом — любимые рестораны,
              отели и три удобных маршрута до метро.
            </p>
            <address>
              Москва, Большой Трёхсвятительский переулок, 8
            </address>
            <a
              className={styles.locationLink}
              href="https://maps.google.com/?q=Большой+Трёхсвятительский+переулок+8+Москва"
              target="_blank"
              rel="noreferrer"
            >
              Построить маршрут <Arrow diagonal />
            </a>
          </div>

          <div className={styles.map} aria-label="Схема расположения YARD 8">
            <div className={styles.mapRoadOne} />
            <div className={styles.mapRoadTwo} />
            <div className={styles.mapRoadThree} />
            <span className={`${styles.station} ${styles.stationOne}`}>
              Китай-город
            </span>
            <span className={`${styles.station} ${styles.stationTwo}`}>
              Чистые пруды
            </span>
            <span className={styles.mapWater}>Яуза</span>
            <span className={styles.mapPin}>
              <strong>Y8</strong>
              <small>вы здесь</small>
            </span>
            <span className={styles.mapTime}>7 мин пешком</span>
          </div>
        </section>

        <section className={styles.quote}>
          <span className={styles.quoteMark}>“</span>
          <blockquote>
            Не просто квадратные метры, а среда, в которую хочется возвращаться
            каждое утро.
          </blockquote>
          <div className={styles.quoteAuthor}>
            <span>Анна Левина</span>
            <small>архитектор проекта</small>
          </div>
        </section>

        <section className={styles.finalCta}>
          <p>Один визит скажет больше.</p>
          <h2>Увидимся в YARD 8?</h2>
          <div className={styles.finalLinks}>
            <a className={styles.darkButton} href="mailto:hello@yard8.ru">
              Записаться на просмотр <Arrow />
            </a>
            <a href="tel:+74951288808">+7 495 128-88-08</a>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <Brand />
        <div>
          <a href="mailto:hello@yard8.ru">hello@yard8.ru</a>
          <a href="tel:+74951288808">+7 495 128-88-08</a>
        </div>
        <div>
          <span>Москва, 2026</span>
          <a href="#top">Наверх ↑</a>
        </div>
      </footer>

      <div className={styles.mobileDock}>
        <a href="tel:+74951288808" aria-label="Позвонить в YARD 8">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path d="M8.6 3.5 6.8 4.8c-.8.6-1.1 1.7-.7 2.6 2 4.6 5.6 8.2 10.2 10.2.9.4 2 .1 2.6-.7l1.3-1.8-4-2.6-1.1 1.2c-2.2-1.1-3.9-2.8-5-5L11.2 7 8.6 3.5Z" />
          </svg>
        </a>
        <a href="#offices">
          Выбрать офис <Arrow />
        </a>
      </div>
    </main>
  );
}

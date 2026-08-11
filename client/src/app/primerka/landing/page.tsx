import type { Metadata } from 'next';
import Image from 'next/image';
import { LeadCapture } from './lead-capture';
import styles from './landing.module.css';

export const metadata: Metadata = {
  title: 'ПРИМЕРКА — система осознанного гардероба',
  description:
    'Бесплатный мини-гайд «7 ошибок базового гардероба» и персональный следующий шаг к гардеробу, в котором всё сочетается.',
};

const PROBLEMS = [
  'Покупаете красивую вещь, но дома оказывается, что носить её не с чем.',
  'Одни вещи используются каждую неделю, остальные месяцами остаются в шкафу.',
  'Перед выходом приходится снова собирать образ практически с нуля.',
  'Новые покупки увеличивают количество одежды, но не количество готовых комплектов.',
];

const GUIDE_POINTS = [
  'почему база не равна списку одинаковых вещей;',
  'какие покупки чаще всего оказываются бесполезными;',
  'почему вещи плохо сочетаются между собой;',
  'как оценить гардероб перед следующим шопингом;',
  'с чего начать его перестройку.',
];

const SYSTEM_STEPS = [
  ['Диагностика', 'Определяем, что именно мешает гардеробу работать как единая система.'],
  ['Структура', 'Отделяем действительно нужные категории от случайных покупок.'],
  ['Сочетаемость', 'Проверяем, насколько вещи работают друг с другом.'],
  ['Персонализация', 'Адаптируем систему под образ жизни, задачи и визуальные предпочтения.'],
];

const PRODUCT_STEPS = [
  ['Бесплатно', '7 ошибок базового гардероба', 'Первичная диагностика и знакомство с системой.'],
  ['Первый продукт', 'Разбор гардероба', 'Помогаем увидеть пробелы и убрать лишние покупки.'],
  ['Основная программа', 'Персональная система гардероба', 'Полная структура гардероба под образ жизни и задачи.'],
  ['Персональная работа', 'Консультация', 'Индивидуальная работа со стилистом.'],
];

const DIRECTIONS = [
  ['Хочу собрать базовый гардероб', ['Практические материалы', 'Разбор', 'Система гардероба']],
  ['Хочу разобраться со стилем', ['Упражнения', 'Визуальное направление', 'Персональная система']],
  ['Нужна помощь специалиста', ['Предварительная диагностика', 'Консультация']],
] as const;

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default function PrimerkaLandingPage() {
  return (
    <div className={styles.site}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="#top" aria-label="ПРИМЕРКА — наверх">
            ПРИМЕРКА
          </a>
          <nav className={styles.desktopNav} aria-label="Основная навигация">
            <a href="#how">Как это работает</a>
            <a href="#guide">Что внутри</a>
            <a href="#for-whom">Для кого</a>
            <a href="#program">Программа</a>
          </nav>
          <a className={styles.headerCta} href="#diagnostic">Получить гайд</a>
          <details className={styles.mobileMenu}>
            <summary>Меню</summary>
            <nav aria-label="Мобильная навигация">
              <a href="#how">Как это работает</a>
              <a href="#guide">Что внутри</a>
              <a href="#for-whom">Для кого</a>
              <a href="#program">Программа</a>
              <a href="#diagnostic">Получить гайд</a>
            </nav>
          </details>
        </div>
      </header>

      <main id="top">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroLayout}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>ПРИМЕРКА / СИСТЕМА ГАРДЕРОБА</p>
              <h1 id="hero-title">
                Шкаф полный.
                <em>А надеть всё ещё нечего?</em>
              </h1>
              <p className={styles.heroLead}>
                Разберитесь, какие вещи действительно нужны вашему гардеробу,
                почему покупки не складываются в образы и как собрать систему,
                в которой всё сочетается между собой.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="#diagnostic">
                  Получить бесплатный гайд <ArrowIcon />
                </a>
                <a className={styles.textLink} href="#guide">Посмотреть, что внутри ↓</a>
              </div>
              <p className={styles.fileNote}>PDF · 8 страниц · бесплатно</p>
            </div>

            <figure className={styles.heroVisual}>
              <Image
                src="/primerka/landing/hero-editorial.jpg"
                alt="Женщина в собранном повседневном образе из белой рубашки, тёмных брюк и бордового трикотажа"
                width={1122}
                height={1402}
                priority
                sizes="(max-width: 767px) 100vw, 46vw"
              />
              <figcaption>
                <span>01</span>
                <p>Меньше случайных вещей.<br />Больше готовых сочетаний.</p>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={`${styles.problem} ${styles.sectionSpace}`} id="for-whom" aria-labelledby="problem-title">
          <div className={styles.container}>
            <div className={styles.problemHeading}>
              <p className={styles.eyebrow}>Не про количество</p>
              <h2 id="problem-title">Проблема обычно<br />не в количестве вещей.</h2>
              <p>Чаще всего гардероб становится неудобным не потому, что в нём мало одежды. В нём нет системы.</p>
            </div>
            <ol className={styles.problemList}>
              {PROBLEMS.map((problem, index) => (
                <li key={problem}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{problem}</p>
                </li>
              ))}
            </ol>
            <p className={styles.problemStatement}>
              <span>ПРИМЕРКА</span> начинает не с покупок. Сначала мы находим причину.
            </p>
          </div>
        </section>

        <section className={`${styles.guideSection} ${styles.sectionSpace}`} id="guide" aria-labelledby="guide-title">
          <div className={`${styles.container} ${styles.guideLayout}`}>
            <div className={styles.guideVisual}>
              <div className={styles.guideSheet} aria-hidden="true" />
              <Image
                src="/primerka/landing/guide-cover.png"
                alt="Обложка мини-гайда «7 ошибок базового гардероба»"
                width={595}
                height={842}
                sizes="(max-width: 767px) 76vw, 36vw"
              />
              <span className={styles.guidePages}>01 — 08</span>
            </div>
            <div className={styles.guideCopy}>
              <p className={styles.eyebrow}>Бесплатный мини-гайд</p>
              <h2 id="guide-title">7 ошибок<br /><em>базового гардероба</em></h2>
              <p>
                Материал поможет быстро определить, почему вещи в вашем шкафу не
                складываются в цельную систему и на что стоит обратить внимание до
                следующей покупки.
              </p>
              <div className={styles.guideContents}>
                <span>Что внутри</span>
                <ul>
                  {GUIDE_POINTS.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
              <a className={styles.primaryButton} href="#diagnostic">Получить PDF <ArrowIcon /></a>
              <small>
                Отправим материал после короткого вопроса — он поможет подобрать
                дальнейшие рекомендации.
              </small>
            </div>
          </div>
        </section>

        <LeadCapture />

        <section className={`${styles.howSection} ${styles.sectionSpace}`} id="how" aria-labelledby="how-title">
          <div className={`${styles.container} ${styles.howLayout}`}>
            <div className={styles.howHeading}>
              <p className={styles.eyebrow}>Метод ПРИМЕРКИ</p>
              <h2 id="how-title">Не новая капсула.<br /><em>Сначала — система.</em></h2>
            </div>
            <ol className={styles.systemSteps}>
              {SYSTEM_STEPS.map(([title, copy], index) => (
                <li key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.comparison} aria-labelledby="comparison-title">
          <div className={styles.container}>
            <p className={styles.eyebrow}>Один и тот же шкаф — разный опыт</p>
            <h2 className={styles.srOnly} id="comparison-title">Гардероб без системы и с системой</h2>
            <div className={styles.comparisonGrid}>
              <div className={styles.withoutSystem}>
                <span>Без системы</span>
                <strong>43</strong>
                <p>вещи в гардеробе</p>
                <strong>12</strong>
                <p>регулярно используются</p>
                <ul>
                  <li>«нечего надеть»</li>
                  <li>случайные покупки</li>
                  <li>образы собираются каждый раз заново</li>
                </ul>
              </div>
              <div className={styles.withSystem}>
                <span>С системой</span>
                <blockquote>Новая вещь дополняет существующий гардероб.</blockquote>
                <ul>
                  <li>меньше случайных покупок</li>
                  <li>понятные сочетания</li>
                  <li>готовые формулы образов</li>
                  <li>ясно, чего действительно не хватает</li>
                </ul>
              </div>
            </div>
            <small>Цифры слева — демонстрационный пример, а не результат исследования.</small>
          </div>
        </section>

        <section className={`${styles.programSection} ${styles.sectionSpace}`} id="program" aria-labelledby="program-title">
          <div className={styles.container}>
            <div className={styles.programHeading}>
              <p className={styles.eyebrow}>Путь без перегруза</p>
              <h2 id="program-title">Один следующий шаг,<br /><em>а не десять продуктов сразу.</em></h2>
            </div>
            <ol className={styles.productLadder}>
              {PRODUCT_STEPS.map(([label, title, copy], index) => (
                <li key={title}>
                  <span className={styles.productNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.productLabel}>{label}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                  {index < PRODUCT_STEPS.length - 1 ? <i aria-hidden="true">↓</i> : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={`${styles.personalization} ${styles.sectionSpace}`} aria-labelledby="personalization-title">
          <div className={styles.container}>
            <div className={styles.personalizationHeading}>
              <p className={styles.eyebrow}>Персональный маршрут</p>
              <h2 id="personalization-title">Не всем нужен<br /><em>одинаковый следующий шаг.</em></h2>
              <p>После получения гайда рекомендации зависят от вашей задачи.</p>
            </div>
            <div className={styles.directionList}>
              {DIRECTIONS.map(([title, steps], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <h3>«{title}»</h3>
                  <div>
                    {steps.map((step, stepIndex) => (
                      <span key={step}>{stepIndex ? '→ ' : ''}{step}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.finalCta} aria-labelledby="final-title">
          <div className={styles.finalCtaInner}>
            <p className={styles.eyebrow}>Начать с диагностики</p>
            <h2 id="final-title">
              Не покупайте ещё одну вещь,
              <em>пока не поймёте, чего не хватает системе.</em>
            </h2>
            <p>Начните с бесплатного мини-гайда и короткой диагностики гардероба.</p>
            <a className={styles.lightButton} href="#diagnostic">
              Получить «7 ошибок базового гардероба» <ArrowIcon />
            </a>
            <small>PDF · бесплатно</small>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <a className={styles.brand} href="#top">ПРИМЕРКА</a>
            <p>Система осознанного гардероба.</p>
          </div>
          <nav aria-label="Навигация в подвале">
            <a href="#how">Как это работает</a>
            <a href="#guide">Гайд</a>
            <a href="#program">Программа</a>
          </nav>
          <div className={styles.footerMeta}>
            <details className={styles.privacy} id="privacy">
              <summary>Политика конфиденциальности</summary>
              <p>
                Контакт используется только для отправки выбранного материала и
                связанных рекомендаций. От рассылки можно отказаться в любой момент.
              </p>
            </details>
            <span>© 2026 ПРИМЕРКА</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

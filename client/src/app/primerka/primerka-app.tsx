'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './primerka.module.css';

type SegmentKey = 'basic_wardrobe' | 'personal_style' | 'consultation';
type ScenarioStatus = 'lead' | 'engaged' | 'checkout' | 'customer';
type NodeCategory = 'TRIGGER' | 'LOGIC' | 'DATA' | 'CRM' | 'MESSAGE' | 'PAYMENT' | 'DELIVERY';

interface Segment {
  label: string;
  tag: SegmentKey;
  summary: string;
  steps: string[];
}

interface WorkflowNode {
  id: string;
  label: string;
  description: string;
  category: NodeCategory;
}

const FUNNEL_STEPS = [
  ['VK-сообщество', 'Пользователь знакомится с продуктами, контентом и оффером.'],
  ['Лид-магнит', 'Получает предложение скачать бесплатный материал.'],
  ['Чат-бот', 'Бот получает контакт и задаёт квалифицирующий вопрос.'],
  ['Сегментация', 'Пользователь попадает в ветку в зависимости от ответа.'],
  ['Прогрев', 'Запускается персональная последовательность сообщений.'],
  ['Оффер', 'Пользователь получает предложение подходящего продукта.'],
  ['Оплата', 'Платёжный сервис подтверждает успешную транзакцию.'],
  ['Автоматическая выдача', 'n8n получает webhook и отправляет приобретённый материал.'],
  ['Повторная коммуникация', 'Пользователь переводится в следующий сегмент для дальнейшего прогрева.'],
] as const;

const SEGMENTS: Record<SegmentKey, Segment> = {
  basic_wardrobe: {
    label: 'Собрать базовый гардероб',
    tag: 'basic_wardrobe',
    summary: 'Образовательная ветка с лид-магнитом и переходом к основному продукту.',
    steps: ['Лид-магнит PDF', '2 полезных сообщения', 'Кейс / пример', '«Базовый гардероб»'],
  },
  personal_style: {
    label: 'Разобраться со своим стилем',
    tag: 'personal_style',
    summary: 'Диагностическая ветка, которая помогает определить направление и следующий шаг.',
    steps: ['Мини-тест', 'Материал о стилях', 'Серия сообщений', '«Персональный стиль»'],
  },
  consultation: {
    label: 'Получить персональную консультацию',
    tag: 'consultation',
    summary: 'Квалификационная ветка с передачей подготовленной заявки менеджеру.',
    steps: ['Имя и контакт', 'Квалификация', 'Заявка', 'Уведомление менеджеру', 'Запись'],
  },
};

const WORKFLOW_LANES: WorkflowNode[][] = [
  [
    { id: 'webhook', label: 'Webhook', description: 'Событие от VK / чат-бота', category: 'TRIGGER' },
    { id: 'normalize', label: 'Normalize Data', description: 'Единая структура пользователя', category: 'DATA' },
    { id: 'check', label: 'Check Contact', description: 'Проверка существующего контакта', category: 'CRM' },
    { id: 'if', label: 'IF', description: 'Новый пользователь?', category: 'LOGIC' },
  ],
  [
    { id: 'create', label: 'Create Lead', description: 'Ветка YES · новый контакт', category: 'CRM' },
    { id: 'update-lead', label: 'Update Lead', description: 'Ветка NO · контакт найден', category: 'CRM' },
    { id: 'assign', label: 'Assign Segment', description: 'basic_wardrobe', category: 'LOGIC' },
    { id: 'crm', label: 'Save to CRM', description: 'Источник, сегмент, этап', category: 'CRM' },
    { id: 'message', label: 'Send Message', description: 'Следующее сообщение', category: 'MESSAGE' },
    { id: 'wait', label: 'Wait / Trigger', description: 'Событие или таймер', category: 'TRIGGER' },
  ],
  [
    { id: 'payment', label: 'Payment Webhook', description: 'Успешная транзакция', category: 'PAYMENT' },
    { id: 'validate', label: 'Validate Payment', description: 'Проверка статуса', category: 'PAYMENT' },
    { id: 'grant', label: 'Grant Access', description: 'Определение продукта', category: 'DELIVERY' },
    { id: 'deliver', label: 'Deliver Product', description: 'Файл / ссылка / доступ', category: 'DELIVERY' },
    { id: 'update', label: 'Update Customer', description: 'lead → customer', category: 'CRM' },
    { id: 'followup', label: 'Follow-up', description: 'Post-purchase цепочка', category: 'MESSAGE' },
  ],
];

const DEMO_STEPS = [
  { node: 'webhook', log: 'Webhook received', detail: 'Получен webhook', time: '12:41:02' },
  { node: 'normalize', log: 'User normalized', detail: 'Данные нормализованы', time: '12:41:02' },
  { node: 'create', log: 'User found / created', detail: 'Пользователь создан', time: '12:41:03' },
  { node: 'assign', log: 'Segment assigned: basic_wardrobe', detail: 'Присвоен сегмент basic_wardrobe', time: '12:41:03' },
  { node: 'crm', log: 'Lead stored', detail: 'Записан в CRM', time: '12:41:03' },
  { node: 'message', log: 'Lead magnet sent', detail: 'Отправлен лид-магнит', time: '12:41:04' },
  { node: 'payment', log: 'Payment event received', detail: 'Получена информация об оплате', time: '12:41:05' },
  { node: 'validate', log: 'Payment confirmed', detail: 'Оплата подтверждена', time: '12:41:05' },
  { node: 'deliver', log: 'Product delivered', detail: 'Доступ к продукту выдан', time: '12:41:06' },
  { node: 'update', log: 'Status changed: customer', detail: 'Статус изменён на customer', time: '12:41:06' },
] as const;

const STATUS_COPY: Record<ScenarioStatus, { label: string; next: string }> = {
  lead: { label: 'lead', next: 'Отправить лид-магнит' },
  engaged: { label: 'engaged', next: 'Продолжить прогрев' },
  checkout: { label: 'checkout', next: 'Проверить оплату' },
  customer: { label: 'customer', next: 'Запустить follow-up' },
};

const IMPLEMENTATION_CARDS = [
  ['VK', 'Оформление сообщества, меню, продукты, точки входа'],
  ['Bot', 'Ветки, вопросы, сегменты, пользовательские состояния'],
  ['Рассылки', 'Trigger-, nurture- и sales-последовательности'],
  ['n8n', 'Webhooks, API, бизнес-логика, синхронизация сервисов'],
  ['Payment', 'Обработка успешных платежей и ошибок'],
  ['Delivery', 'Автоматическая выдача файлов или доступов'],
  ['CRM', 'Карточка клиента, источник, сегмент, история взаимодействия'],
  ['Analytics', 'Конверсии между этапами и точки потери пользователей'],
] as const;

const PRODUCT_LADDER = [
  ['Бесплатно', '7 ошибок базового гардероба', 'Получение контакта'],
  ['Недорогой продукт', 'Разбор гардероба', 'Первая покупка'],
  ['Основной продукт', 'Персональная система гардероба', 'Основная продажа'],
  ['Консультация', 'Персональная работа', 'High-ticket предложение'],
] as const;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function SectionHeading({
  index,
  title,
  copy,
}: {
  index: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <span className={styles.sectionIndex}>{index}</span>
      <div>
        <h2>{title}</h2>
        {copy ? <p>{copy}</p> : null}
      </div>
    </div>
  );
}

function WorkflowCard({
  node,
  active,
  complete,
}: {
  node: WorkflowNode;
  active: boolean;
  complete: boolean;
}) {
  return (
    <article
      className={cx(styles.workflowNode, active && styles.nodeActive, complete && styles.nodeComplete)}
      data-category={node.category}
      aria-current={active ? 'step' : undefined}
    >
      <div className={styles.nodeTopline}>
        <span className={styles.nodeCategory}>{node.category}</span>
        <span className={styles.nodeState} aria-hidden="true" />
      </div>
      <h3>{node.label}</h3>
      <p>{node.description}</p>
    </article>
  );
}

function ProductPage({ page, onProductClick }: { page: number; onProductClick: () => void }) {
  if (page === 0) {
    return (
      <div className={cx(styles.documentPage, styles.coverPage)}>
        <div className={styles.documentBrand}>ПРИМЕРКА</div>
        <div className={styles.coverCount}>07</div>
        <div className={styles.coverTitle}>
          <span>7 ошибок</span>
          <strong>базового гардероба</strong>
        </div>
        <p>Практический мини-гайд</p>
        <blockquote>Как перестать покупать вещи по отдельности и начать собирать гардероб как систему.</blockquote>
        <span className={styles.pageNumber}>01 / 08</span>
      </div>
    );
  }

  if (page === 1) {
    return (
      <div className={styles.documentPage}>
        <div className={styles.documentKicker}>Введение</div>
        <h3>Что такое базовый гардероб</h3>
        <p className={styles.leadText}>Базовый гардероб — это не список одинаковых белых рубашек, джинсов и жакетов. Это набор вещей, которые подходят вашему образу жизни, сочетаются между собой и закрывают большинство ежедневных сценариев.</p>
        <p>Хорошая база сокращает количество случайных покупок и упрощает выбор одежды.</p>
        <div className={styles.criteriaBlock}>
          <span>Хорошая база отвечает трём критериям</span>
          {['Соответствует вашему образу жизни', 'Вещи легко комбинируются', 'Каждая покупка дополняет гардероб'].map((item, index) => (
            <div key={item}><b>0{index + 1}</b><p>{item}</p></div>
          ))}
        </div>
        <span className={styles.pageNumber}>02 / 08</span>
      </div>
    );
  }

  if (page === 2) {
    return (
      <div className={styles.documentPage}>
        <div className={styles.errorNumber}>01</div>
        <div className={styles.documentKicker}>Ошибка 01</div>
        <h3>Покупать отдельные красивые вещи</h3>
        <p className={styles.leadText}>Вещь может отлично выглядеть сама по себе и при этом почти не работать внутри гардероба.</p>
        <div className={styles.quoteBlock}>
          <span>Вопрос перед покупкой</span>
          <blockquote>«С чем минимум из трёх вещей, которые у меня уже есть, я смогу это носить?»</blockquote>
        </div>
        <p>Если вариантов нет, вероятно, вы покупаете отдельный образ, а не часть системы.</p>
        <span className={styles.pageNumber}>03 / 08</span>
      </div>
    );
  }

  if (page === 3) {
    return (
      <div className={styles.documentPage}>
        <div className={styles.documentKicker}>Ошибка 02</div>
        <h3>Копировать чужой список базы</h3>
        <p className={styles.leadText}>Универсального списка базового гардероба не существует. Гардероб человека, который работает из дома, будет отличаться от гардероба человека с офисным дресс-кодом.</p>
        <p>Перед формированием базы определите основные сценарии своей недели.</p>
        <div className={styles.scenarioBars}>
          {[['Работа', '40%'], ['Повседневные дела', '30%'], ['Встречи', '20%'], ['Спорт / отдых', '10%']].map(([label, value]) => (
            <div key={label}><span>{label}</span><i style={{ width: value }} /><b>{value}</b></div>
          ))}
        </div>
        <span className={styles.pageNumber}>04 / 08</span>
      </div>
    );
  }

  if (page === 4) {
    return (
      <div className={styles.documentPage}>
        <div className={styles.documentKicker}>Ошибка 03</div>
        <h3>Не учитывать цветовую систему</h3>
        <p className={styles.leadText}>Чем меньше вещи связаны между собой по цвету, тем больше одежды требуется для создания комплектов.</p>
        <p>Не обязательно использовать только нейтральные оттенки. Достаточно определить:</p>
        <div className={styles.paletteFormula}>
          <div><span className={styles.swatches}><i /><i /><i /></span><b>2–3</b><small>основных цвета</small></div>
          <em>+</em>
          <div><span className={styles.swatches}><i /><i /></span><b>1–2</b><small>дополнительных</small></div>
          <em>+</em>
          <div><span className={styles.swatches}><i /></span><b>1</b><small>акцентный оттенок</small></div>
        </div>
        <span className={styles.pageNumber}>05 / 08</span>
      </div>
    );
  }

  if (page === 5) {
    const errors = [
      ['04', 'Покупать слишком много одинаковых вещей', 'Дубли не расширяют число комплектов. Сначала найдите пробелы в сценариях.'],
      ['05', 'Игнорировать посадку и пропорции', 'Посадка влияет на работу вещи сильнее, чем её формальная универсальность.'],
      ['06', 'Покупать вещь «на потом»', 'База решает задачи текущей жизни, а не предполагаемого будущего.'],
      ['07', 'Не пересматривать гардероб регулярно', 'Короткая сезонная ревизия сохраняет систему актуальной.'],
    ];
    return (
      <div className={styles.documentPage}>
        <div className={styles.documentKicker}>Ошибки 04–07</div>
        <h3>Ещё четыре системные ошибки</h3>
        <div className={styles.errorList}>
          {errors.map(([number, title, copy]) => (
            <div key={number}><b>{number}</b><div><h4>{title}</h4><p>{copy}</p></div></div>
          ))}
        </div>
        <span className={styles.pageNumber}>06 / 08</span>
      </div>
    );
  }

  if (page === 6) {
    const checklist = [
      'Подходит ли вещь моему образу жизни?',
      'Есть ли минимум три готовые комбинации?',
      'Подходит ли цвет к существующему гардеробу?',
      'Комфортна ли посадка?',
      'Есть ли похожая вещь?',
      'Купил(а) бы я её без скидки?',
      'Буду ли я носить её в ближайшие две недели?',
    ];
    return (
      <div className={styles.documentPage}>
        <div className={styles.documentKicker}>Практика</div>
        <h3>Чек-лист перед покупкой</h3>
        <div className={styles.checklist}>
          {checklist.map((item) => <div key={item}><span aria-hidden="true" /><p>{item}</p></div>)}
        </div>
        <span className={styles.pageNumber}>07 / 08</span>
      </div>
    );
  }

  return (
    <div className={cx(styles.documentPage, styles.finalProductPage)}>
      <div className={styles.documentKicker}>Следующий шаг</div>
      <h3>От чек-листа — к персональной системе</h3>
      <p className={styles.leadText}>Этот чек-лист помогает убрать случайные покупки. Следующий этап — собрать структуру гардероба под ваши реальные задачи, привычки и стиль.</p>
      <div className={styles.nextProduct}>
        <span>Следующий продукт</span>
        <h4>Базовый гардероб:<br />персональная система</h4>
        <p>Анализ · сценарии · цветовая система · сочетания · план покупок</p>
        <button type="button" onClick={onProductClick}>Перейти к продукту</button>
      </div>
      <span className={styles.pageNumber}>08 / 08</span>
    </div>
  );
}

export function PrimerkaApp() {
  const [segmentKey, setSegmentKey] = useState<SegmentKey>('basic_wardrobe');
  const [runStep, setRunStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [productPage, setProductPage] = useState(0);
  const [productStatus, setProductStatus] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const segment = SEGMENTS[segmentKey];

  useEffect(() => {
    if (!running) return;
    if (runStep >= DEMO_STEPS.length - 1) {
      const completionTimeout = window.setTimeout(() => setRunning(false), 680);
      return () => window.clearTimeout(completionTimeout);
    }
    const timeout = window.setTimeout(() => setRunStep((value) => value + 1), 680);
    return () => window.clearTimeout(timeout);
  }, [runStep, running]);

  const completedNodes = useMemo(
    () => new Set<string>(DEMO_STEPS.slice(0, Math.max(0, runStep)).map((step) => step.node)),
    [runStep],
  );

  const scenarioStatus: ScenarioStatus =
    runStep >= 8 ? 'customer' : runStep >= 6 ? 'checkout' : runStep >= 3 ? 'engaged' : 'lead';

  function startDemo() {
    setRunStep(0);
    setRunning(true);
  }

  function resetDemo() {
    setRunning(false);
    setRunStep(-1);
  }

  function openProduct() {
    setProductOpen(true);
    window.setTimeout(() => productRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 30);
  }

  return (
    <div className={styles.site}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="#overview" aria-label="Примерка — к началу страницы">
            <strong>ПРИМЕРКА</strong>
            <span>Prototype / Automation System</span>
          </a>
          <nav className={styles.nav} aria-label="Навигация по прототипу">
            <a href="#overview">Обзор</a>
            <a href="#funnel">Воронка</a>
            <a href="#automation">n8n</a>
            <a href="#product">Продукт</a>
          </nav>
          <a className={styles.headerAction} href="#funnel">Смотреть сценарий <span>↓</span></a>
        </div>
      </header>

      <main>
        <section className={cx(styles.hero, styles.container)} id="overview">
          <div className={styles.prototypeLabel}><span /> Демонстрационный прототип</div>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <h1>Прототип системы упаковки и автоматизации VK-сообщества</h1>
              <p>Демонстрация пользовательского пути: от первого контакта с сообществом до сегментации, оплаты и автоматической выдачи цифрового продукта.</p>
            </div>
            <aside className={styles.demoCard} aria-label="Демо-сценарий">
              <div className={styles.cardLabel}>Демо-сценарий</div>
              <dl>
                <div><dt>Лид-магнит</dt><dd>«7 ошибок базового гардероба»</dd></div>
                <div><dt>Сегмент</dt><dd>«Хочу собрать базовый гардероб»</dd></div>
                <div><dt>Цель</dt><dd>PDF → прогрев → основной продукт</dd></div>
              </dl>
            </aside>
          </div>
          <div className={styles.systemOverview} aria-label="Краткая схема системы">
            {['VK', 'Воронка', 'Сегментация', 'Рассылки', 'Оплата', 'n8n', 'Выдача продукта'].map((item, index, array) => (
              <div key={item} className={styles.overviewItem}>
                <span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>
                {index < array.length - 1 ? <i aria-hidden="true">→</i> : null}
              </div>
            ))}
          </div>
          <p className={styles.prototypeNote}>Пример архитектуры воронки, автоматизации и выдачи цифрового продукта. Финальная логика адаптируется под реальные продукты и процессы проекта.</p>
        </section>

        <section className={cx(styles.section, styles.container)} id="funnel">
          <SectionHeading index="01" title="Путь пользователя" copy="Один сценарий — от первого касания до следующей коммуникации после покупки." />
          <div className={styles.funnelGrid}>
            {FUNNEL_STEPS.map(([title, copy], index) => (
              <article className={styles.funnelCard} key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                {index < FUNNEL_STEPS.length - 1 ? <i aria-hidden="true">→</i> : null}
              </article>
            ))}
          </div>
        </section>

        <section className={cx(styles.section, styles.container)} id="segmentation">
          <SectionHeading index="02" title="Пример логики сегментации" copy="Ответ пользователя меняет не только тег, но и всю дальнейшую последовательность." />
          <div className={styles.segmentationGrid}>
            <div className={styles.botCard}>
              <div className={styles.botMeta}><span>Чат-бот</span><i>Квалифицирующий вопрос</i></div>
              <h3>Что сейчас актуальнее всего?</h3>
              <div className={styles.segmentOptions} role="group" aria-label="Выберите вариант ответа">
                {(Object.keys(SEGMENTS) as SegmentKey[]).map((key) => (
                  <button
                    type="button"
                    key={key}
                    className={cx(styles.segmentButton, segmentKey === key && styles.segmentButtonActive)}
                    onClick={() => setSegmentKey(key)}
                    aria-pressed={segmentKey === key}
                  >
                    <span>{SEGMENTS[key].label}</span><i>→</i>
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.segmentResult} aria-live="polite">
              <div className={styles.segmentResultHead}>
                <div><span>Выбранный сегмент</span><code>{segment.tag}</code></div>
                <strong>{segment.label}</strong>
                <p>{segment.summary}</p>
              </div>
              <div className={styles.segmentPath}>
                {segment.steps.map((step, index) => (
                  <div key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p>{index < segment.steps.length - 1 ? <i>↓</i> : null}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.automationSection} id="automation">
          <div className={styles.container}>
            <div className={styles.automationHeader}>
              <SectionHeading index="03" title="Automation workflow" copy="Пример сценария обработки пользователя после получения события из VK / чат-бота." />
              <div className={styles.workflowActions}>
                <a href="/primerka/demo-workflow.json" download>Workflow JSON <span>↓</span></a>
                <button type="button" className={styles.primaryButton} onClick={startDemo} disabled={running}>
                  {running ? `Выполняется · ${runStep + 1}/10` : runStep >= 0 ? 'Запустить снова' : 'Запустить демо'}
                </button>
              </div>
            </div>

            <div className={styles.workflowShell}>
              <div className={styles.workflowCanvas}>
                <div className={styles.canvasTopline}><span>PRIMERKA / lead-to-customer</span><span>simulation mode</span></div>
                {WORKFLOW_LANES.map((lane, laneIndex) => (
                  <div className={styles.workflowLane} key={laneIndex}>
                    <div className={styles.laneLabel}>{laneIndex === 0 ? 'ВХОД' : laneIndex === 1 ? 'LEAD FLOW' : 'PAYMENT FLOW'}</div>
                    <div className={styles.laneNodes}>
                      {lane.map((node, nodeIndex) => {
                        const active = runStep >= 0 && DEMO_STEPS[runStep]?.node === node.id;
                        return (
                          <div className={styles.nodeWithConnector} key={node.id}>
                            <WorkflowCard node={node} active={active} complete={completedNodes.has(node.id)} />
                            {nodeIndex < lane.length - 1 ? <span className={styles.nodeConnector} aria-hidden="true">→</span> : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <aside className={styles.runPanel}>
                <div className={styles.runPanelHead}>
                  <div><span>Журнал выполнения</span><i className={cx(styles.runDot, running && styles.runDotActive)} /></div>
                  <button type="button" onClick={resetDemo} disabled={runStep < 0}>Сбросить</button>
                </div>
                <div className={styles.currentRun} aria-live="polite">
                  <span>Текущий шаг</span>
                  <strong>{runStep >= 0 ? DEMO_STEPS[runStep].detail : 'Ожидание запуска'}</strong>
                  <div className={styles.runProgress}><i style={{ width: `${runStep < 0 ? 0 : ((runStep + 1) / DEMO_STEPS.length) * 100}%` }} /></div>
                </div>
                <div className={styles.logList} aria-label="Лог выполнения">
                  {runStep < 0 ? <p className={styles.emptyLog}>После запуска здесь появятся события сценария.</p> : null}
                  {DEMO_STEPS.slice(0, runStep + 1).map((step) => (
                    <div key={step.log}><time>{step.time}</time><span>{step.log}</span></div>
                  ))}
                </div>
                <div className={styles.scenarioOverview}>
                  <div className={styles.panelLabel}>Scenario overview</div>
                  <dl>
                    <div><dt>Источник</dt><dd>VK</dd></div>
                    <div><dt>Сегмент</dt><dd><code>basic_wardrobe</code></dd></div>
                    <div><dt>Статус</dt><dd className={styles.statusValue}>{STATUS_COPY[scenarioStatus].label}</dd></div>
                    <div><dt>Следующее действие</dt><dd>{STATUS_COPY[scenarioStatus].next}</dd></div>
                  </dl>
                </div>
              </aside>
            </div>
            <p className={styles.configNote}>Демонстрационная конфигурация. Credentials и endpoints подключаются на этапе интеграции.</p>
          </div>
        </section>

        <section className={cx(styles.section, styles.container)} id="data">
          <SectionHeading index="04" title="Что передаётся между сервисами" copy="Данные остаются предсказуемыми на каждом этапе пользовательского пути." />
          <div className={styles.dataGrid}>
            <article className={styles.codeCard}>
              <div><span>До оплаты</span><code>lead.json</code></div>
              <pre>{`{
  "userId": "vk_184502",
  "name": "Анна",
  "source": "vk",
  "segment": "basic_wardrobe",
  "funnelStage": "lead_magnet",
  "product": null,
  "paymentStatus": "pending"
}`}</pre>
            </article>
            <article className={styles.codeCard}>
              <div><span>После оплаты</span><code>customer.patch.json</code></div>
              <pre>{`{
  "funnelStage": "customer",
  "product": "basic_wardrobe_guide",
  "paymentStatus": "paid",
  "accessGranted": true
}`}</pre>
            </article>
          </div>
          <p className={styles.dataNote}>Единая структура данных позволяет менять отдельные сервисы — CRM, рассыльщик или платёжный модуль — без перестройки всей воронки.</p>
        </section>

        <section className={cx(styles.section, styles.container)} id="architecture">
          <SectionHeading index="05" title="Архитектура" copy="n8n используется как связующий automation layer между пользовательскими событиями, данными, оплатой и выдачей материалов." />
          <div className={styles.architecture}>
            <div className={styles.archInputs}>
              <div><span>Канал</span><strong>VK-сообщество</strong><p>Контент · продукты · точки входа</p></div>
              <div><span>Интерфейс</span><strong>Чат-бот / формы</strong><p>Контакты · ответы · события</p></div>
            </div>
            <div className={styles.archArrow}><span>пользовательские события</span><i>↓</i></div>
            <div className={styles.automationLayer}>
              <span>AUTOMATION LAYER</span><strong>n8n</strong><p>Маршрутизация событий, преобразование данных и бизнес-логика</p>
            </div>
            <div className={styles.archArrow}><span>API / webhooks</span><i>↓</i></div>
            <div className={styles.serviceGrid}>
              {['CRM / база клиентов', 'Сервис рассылок', 'Платёжный сервис', 'Хранилище продуктов', 'Уведомления менеджеру'].map((item) => <div key={item}>{item}</div>)}
            </div>
            <div className={styles.dataPipeline}>
              {['Customer Data', 'Segmentation', 'Follow-up scenarios', 'Analytics / повторные продажи'].map((item, index) => (
                <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>{index < 3 ? <i>→</i> : null}</div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.productSection} id="product">
          <div className={styles.container}>
            <div className={styles.productIntro}>
              <SectionHeading index="06" title="Цифровой продукт внутри воронки" copy="Не макет обложки, а полноценный демонстрационный материал из восьми страниц." />
              <div className={styles.productActions}>
                <button type="button" className={styles.primaryButton} onClick={openProduct}>Открыть продукт</button>
                <a href="/primerka/7-oshibok-bazovogo-garderoba.pdf" download>Скачать PDF <span>↓</span></a>
              </div>
            </div>
            {!productOpen ? (
              <button type="button" className={styles.closedProduct} onClick={openProduct} aria-label="Открыть предпросмотр продукта">
                <div className={styles.miniCover}><span>ПРИМЕРКА</span><b>7 ошибок<br />базового гардероба</b><i>Практический мини-гайд</i></div>
                <div><span>Материал готов к выдаче</span><strong>8 страниц · PDF</strong><p>Нажмите, чтобы открыть редакционный preview документа.</p></div>
                <i>→</i>
              </button>
            ) : (
              <div className={styles.productViewer} ref={productRef}>
                <aside className={styles.pageRail} aria-label="Страницы документа">
                  <div><span>Страницы</span><b>{String(productPage + 1).padStart(2, '0')} / 08</b></div>
                  <div className={styles.pageButtons}>
                    {Array.from({ length: 8 }, (_, index) => (
                      <button type="button" key={index} onClick={() => setProductPage(index)} aria-current={productPage === index ? 'page' : undefined}>
                        <span>{String(index + 1).padStart(2, '0')}</span><i />
                      </button>
                    ))}
                  </div>
                  <a href="/primerka/7-oshibok-bazovogo-garderoba.pdf" download>Скачать PDF <span>↓</span></a>
                </aside>
                <div className={styles.documentStage}>
                  <ProductPage page={productPage} onProductClick={() => setProductStatus(true)} />
                  <div className={styles.viewerControls}>
                    <button type="button" onClick={() => setProductPage((value) => Math.max(0, value - 1))} disabled={productPage === 0}>← Предыдущая</button>
                    <span>Страница {productPage + 1} из 8</span>
                    <button type="button" onClick={() => setProductPage((value) => Math.min(7, value + 1))} disabled={productPage === 7}>Следующая →</button>
                  </div>
                  {productStatus ? <div className={styles.demoStatus} role="status">Демонстрационный сценарий: переход к основному продукту будет настроен после интеграции.</div> : null}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className={cx(styles.section, styles.container)} id="product-logic">
          <SectionHeading index="07" title="Пример продуктовой логики" copy="Каждый следующий продукт продолжает задачу предыдущего и соответствует готовности пользователя." />
          <div className={styles.productLadder}>
            {PRODUCT_LADDER.map(([stage, product, goal], index) => (
              <article key={stage}>
                <span>Этап {index + 1}</span><small>{stage}</small><h3>{product}</h3><p>Цель: {goal}</p>{index < 3 ? <i>↓</i> : null}
              </article>
            ))}
          </div>
          <p className={styles.ladderNote}>Это демонстрационная структура. На этапе проектирования продукты, цены, сообщения и точки перехода определяются после анализа аудитории.</p>
        </section>

        <section className={cx(styles.section, styles.container)} id="implementation">
          <SectionHeading index="08" title="Что переносится из прототипа в рабочую систему" copy="Интерфейс фиксирует логику, которую затем можно последовательно развернуть в реальных сервисах." />
          <div className={styles.implementationGrid}>
            {IMPLEMENTATION_CARDS.map(([title, copy], index) => (
              <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{copy}</p></article>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div><span /> Демонстрационный прототип</div>
          <p>Система показана на одном пользовательском сценарии. После утверждения концепции архитектура масштабируется на четыре продукта, необходимые сегменты, цепочки рассылок и пользовательские сценарии.</p>
          <a href="#overview">К началу ↑</a>
        </div>
      </footer>
    </div>
  );
}

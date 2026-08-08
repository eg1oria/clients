'use client';

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './prototype.module.css';

type View = 'select' | 'results' | 'pump';
type SelectionMode = 'wizard' | 'quick' | 'model' | 'pro';
type DemoState = 'A' | 'B' | 'C' | 'no-context' | 'no-curve' | 'insufficient' | 'error';
type DetailsTab = 'specs' | 'materials' | 'documents';

interface PumpContext {
  q: number;
  h: number;
  dn: number;
  temp: number;
  density: number;
  frequency: number;
  priceKwh: number;
  hoursYear: number;
  application: string;
  task: string;
  source: SelectionMode;
  createdAt: string;
}

interface Pump {
  id: number;
  name: string;
  sku: string;
  series: string;
  description: string;
  match: number;
  grade: 'A' | 'B' | 'C';
  price: number;
  stock: number;
  q: number;
  h: number;
  dn: number;
  power: number;
  efficiency: number;
  temperature: number;
  pressure: string;
}

interface ProjectItem {
  pumpId: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  context: PumpContext;
}

interface QuoteForm {
  name: string;
  phone: string;
  email: string;
  company: string;
  comment: string;
  consent: boolean;
}

type IconName =
  | 'arrow'
  | 'back'
  | 'cart'
  | 'check'
  | 'chevron'
  | 'close'
  | 'document'
  | 'download'
  | 'edit'
  | 'info'
  | 'minus'
  | 'plus'
  | 'reset'
  | 'search'
  | 'warning';

const CONTEXT_STORAGE_KEY = 'apgs_prototype_context';
const PROJECT_STORAGE_KEY = 'apgs_prototype_project';

const DEFAULT_CONTEXT: PumpContext = {
  q: 34,
  h: 41,
  dn: 50,
  temp: 90,
  density: 1000,
  frequency: 50,
  priceKwh: 6.5,
  hoursYear: 8000,
  application: 'Котельная',
  task: 'Отопление',
  source: 'wizard',
  createdAt: '2026-08-08T09:00:00.000Z',
};

const PUMPS: Pump[] = [
  {
    id: 123,
    name: 'APGS InLine 50-200/5.5',
    sku: 'APGS-IL-50200-55',
    series: 'InLine',
    description: 'Вертикальный центробежный насос для систем отопления и водоснабжения',
    match: 96,
    grade: 'A',
    price: 182000,
    stock: 25,
    q: 34,
    h: 41,
    dn: 50,
    power: 5.5,
    efficiency: 78.2,
    temperature: 120,
    pressure: 'PN16',
  },
  {
    id: 456,
    name: 'APGS InLine 50-200/7.5',
    sku: 'APGS-IL-50200-75',
    series: 'InLine',
    description: 'Исполнение с увеличенным запасом мощности для переменных режимов',
    match: 88,
    grade: 'B',
    price: 214000,
    stock: 8,
    q: 36,
    h: 43,
    dn: 50,
    power: 7.5,
    efficiency: 80.1,
    temperature: 120,
    pressure: 'PN16',
  },
  {
    id: 789,
    name: 'CNP NIS 50-32-200',
    sku: 'CNP-NIS-5032200',
    series: 'NIS',
    description: 'Консольно-моноблочный аналог с близкой рабочей областью',
    match: 74,
    grade: 'B',
    price: 145000,
    stock: 12,
    q: 32,
    h: 38,
    dn: 50,
    power: 5.5,
    efficiency: 72.6,
    temperature: 110,
    pressure: 'PN16',
  },
];

const APPLICATIONS = ['Котельная', 'Водоснабжение', 'ЖКХ', 'Канализация', 'Производство', 'Частный дом'];
const TASKS = ['Отопление', 'Горячее водоснабжение', 'Поднять давление', 'Отвести воду', 'Другое'];

const DIAGNOSTICS = [
  { name: 'Скорость потока', value: '1,2 м/с', norm: 'Норма 0,5–3,0', status: 'ok' },
  { name: 'Кавитация', value: 'Маловероятна', norm: 'Запас NPSH 1,4 м', status: 'ok' },
  { name: 'Рабочая зона', value: 'В зоне BEP', norm: 'Отклонение 4%', status: 'ok' },
  { name: 'Двигатель', value: 'Загрузка 88%', norm: 'Запас 12%', status: 'ok' },
  { name: 'Запас напора', value: '+8%', norm: 'Допуск до 20%', status: 'ok' },
  { name: 'Температура', value: '90 °C', norm: 'Максимум 120 °C', status: 'ok' },
  { name: 'Гидроудар', value: 'Низкий риск', norm: 'При плавном пуске', status: 'ok' },
  { name: 'Частота сети', value: '50 Гц', norm: 'Соответствует', status: 'ok' },
] as const;

const EXCLUDED = [
  { model: 'Grundfos CR 10-4', reason: 'DN 50 вместо требуемого DN 40' },
  { model: 'Wilo Stratos GIGA', reason: 'Температура жидкости до 70 °C при требуемых 90 °C' },
  { model: 'CNP CDL 20-4', reason: 'Рабочая точка Q находится вне допуска ±10%' },
];

const MODE_COPY: Record<SelectionMode, { index: string; title: string; text: string }> = {
  wizard: { index: '01', title: 'Помогите подобрать', text: 'Ответьте на несколько простых вопросов — мы сформируем параметры.' },
  quick: { index: '02', title: 'Знаю параметры', text: 'Быстрый подбор по расходу Q, напору H и диаметру DN.' },
  model: { index: '03', title: 'Знаю модель', text: 'Найдём аналог APGS по названию или артикулу конкурента.' },
  pro: { index: '04', title: 'Профессиональный', text: 'Расширенный ввод инженерных параметров и ограничений.' },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU').format(Math.round(value));
}

function parseStored<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    cart: <><path d="M4 5h2l2.2 9.2h8.8l2-6.2H7" /><circle cx="10" cy="19" r="1" /><circle cx="17" cy="19" r="1" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m8 10 4 4 4-4" />,
    close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
    document: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
    minus: <path d="M5 12h14" />,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    reset: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v6h6" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    warning: <><path d="M12 3 2.5 20h19z" /><path d="M12 9v4M12 17h.01" /></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function useOverlayFocus<T extends HTMLElement>(isOpen: boolean, onClose: () => void) {
  const ref = useRef<T>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const closeOverlay = useEffectEvent(onClose);
  const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  useEffect(() => {
    if (!isOpen) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const node = ref.current;
    const focusable = node?.querySelector<HTMLElement>('[data-autofocus]') ?? node?.querySelector<HTMLElement>(focusableSelector);
    focusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOverlay();
        return;
      }
      if (event.key !== 'Tab' || !node) return;

      const focusableElements = Array.from(node.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = bodyOverflow;
      previousFocus.current?.focus();
    };
  }, [isOpen]);

  return ref;
}

function PumpIllustration({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={cx(styles.pumpSvg, compact && styles.pumpSvgCompact)} viewBox="0 0 520 420" role="img" aria-label="Схематичное изображение промышленного насоса APGS InLine">
      <defs>
        <linearGradient id={compact ? 'body-compact' : 'body'} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8fbff" />
          <stop offset="1" stopColor="#d7e5fa" />
        </linearGradient>
        <linearGradient id={compact ? 'motor-compact' : 'motor'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f4650" />
          <stop offset="1" stopColor="#171b22" />
        </linearGradient>
        <filter id={compact ? 'shadow-compact' : 'shadow'} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#0f1f38" floodOpacity=".18" />
        </filter>
      </defs>
      <ellipse cx="260" cy="380" rx="150" ry="18" fill="#092c63" opacity=".1" />
      <g filter={`url(#${compact ? 'shadow-compact' : 'shadow'})`}>
        <path d="M206 88h108l20 43v112H186V131z" fill={`url(#${compact ? 'motor-compact' : 'motor'})`} />
        <path d="M197 100h126M190 122h140M188 146h144M188 170h144M188 194h144M188 218h144" stroke="#69717c" strokeWidth="7" opacity=".65" />
        <rect x="220" y="56" width="80" height="37" rx="8" fill="#0f62fe" />
        <path d="M242 56V38h36v18" stroke="#20262e" strokeWidth="10" />
        <rect x="211" y="239" width="98" height="36" rx="8" fill="#aab3bf" />
        <path d="M152 286c0-33 27-60 60-60h96c33 0 60 27 60 60v55H152z" fill={`url(#${compact ? 'body-compact' : 'body'})`} stroke="#7f91a9" strokeWidth="5" />
        <circle cx="260" cy="301" r="52" fill="#0f62fe" />
        <circle cx="260" cy="301" r="25" fill="#f5f9ff" stroke="#0a3f9b" strokeWidth="8" />
        <path d="M152 286H90v55h68M368 286h62v55h-68" fill="#d9e4f2" stroke="#7f91a9" strokeWidth="5" />
        <path d="M78 276h24v76H78zM418 276h24v76h-24z" fill="#b8c6d8" stroke="#71839c" strokeWidth="4" />
        <path d="M129 341h262l18 34H111z" fill="#28313d" />
        <path d="M150 375v14M370 375v14" stroke="#161b22" strokeWidth="16" />
      </g>
      <g fill="#0f62fe" fontFamily="var(--font-apgs), sans-serif" fontWeight="700" fontSize="14">
        <text x="232" y="80">APGS</text>
      </g>
    </svg>
  );
}

function Header({
  view,
  projectCount,
  demoState,
  onDemoState,
  onHome,
  onResults,
  onProject,
  onReset,
  onDemoAction,
}: {
  view: View;
  projectCount: number;
  demoState: DemoState;
  onDemoState: (value: DemoState) => void;
  onHome: () => void;
  onResults: () => void;
  onProject: () => void;
  onReset: () => void;
  onDemoAction: (message: string) => void;
}) {
  const currentStep = view === 'select' ? 1 : view === 'results' ? 2 : 3;
  return (
    <header className={styles.headerWrap}>
      <div className={styles.demoBar}>
        <div className={styles.demoBarInner}>
          <span><span className={styles.demoDot} /> Интерактивный UX-прототип</span>
          <label className={styles.demoSelectLabel}>
            <span>Состояние карточки</span>
            <select value={demoState} onChange={(event) => onDemoState(event.target.value as DemoState)}>
              <option value="A">A — Подходит</option>
              <option value="B">B — С ограничениями</option>
              <option value="C">C — Не рекомендуется</option>
              <option value="no-context">Без контекста</option>
              <option value="no-curve">Нет Q-H кривой</option>
              <option value="insufficient">Недостаточно данных</option>
              <option value="error">Ошибка API</option>
            </select>
          </label>
        </div>
      </div>
      <div className={styles.header}>
        <button className={styles.logo} onClick={onHome} aria-label="APGS — на начало прототипа">
          <span className={styles.logoMark}>A</span>
          <span><strong>APGS</strong><small>Насосные системы</small></span>
        </button>
        <nav className={styles.mainNav} aria-label="Основная навигация">
          <button className={styles.navActive} onClick={onHome}>Подбор насосов</button>
          <button onClick={onResults}>Каталог</button>
          <button onClick={() => onDemoAction('Раздел документации будет подключён на следующем этапе')}>Документация</button>
        </nav>
        <div className={styles.headerActions}>
          <button className={styles.iconTextButton} onClick={onReset} title="Сбросить прототип">
            <Icon name="reset" size={18} /><span>Сбросить</span>
          </button>
          <button className={styles.projectButton} onClick={onProject} aria-label={`Открыть проект, позиций: ${projectCount}`}>
            <Icon name="cart" size={19} /><span>Проект</span><b>{projectCount}</b>
          </button>
        </div>
      </div>
      <div className={styles.journey} aria-label="Этапы сценария">
        {['Подбор', 'Результаты', 'Карточка', 'Проект', 'КП'].map((label, index) => {
          const step = index + 1;
          return (
            <div className={cx(styles.journeyStep, step < currentStep && styles.journeyDone, step === currentStep && styles.journeyCurrent)} key={label}>
              <span>{step < currentStep ? <Icon name="check" size={14} /> : step}</span><em>{label}</em>
            </div>
          );
        })}
      </div>
    </header>
  );
}

function ContextStrip({ context, onEdit, compact = false }: { context: PumpContext; onEdit: () => void; compact?: boolean }) {
  return (
    <section className={cx(styles.contextStrip, compact && styles.contextCompact)} aria-label="Контекст подбора">
      <div className={styles.contextTitle}>
        <span className={styles.contextIcon}><Icon name="check" size={17} /></span>
        <div><strong>Ваши исходные данные</strong><small>{context.application} · {context.task}</small></div>
      </div>
      <dl className={styles.contextValues}>
        <div><dt>Q</dt><dd>{context.q} м³/ч</dd></div>
        <div><dt>H</dt><dd>{context.h} м</dd></div>
        <div><dt>DN</dt><dd>{context.dn} мм</dd></div>
        {!compact && <div><dt>t°</dt><dd>{context.temp} °C</dd></div>}
        {!compact && <div><dt>Сеть</dt><dd>{context.frequency} Гц</dd></div>}
      </dl>
      <button className={styles.textButton} onClick={onEdit}><Icon name="edit" size={16} /> Изменить</button>
    </section>
  );
}

function NumberField({
  label,
  value,
  unit,
  onChange,
  min = 0,
  hint,
}: {
  label: string;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
  min?: number;
  hint?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}{hint && <button type="button" className={styles.infoButton} title={hint} aria-label={`${label}: ${hint}`}><Icon name="info" size={14} /></button>}</span>
      <span className={styles.inputWrap}>
        <input type="number" min={min} value={value} onChange={(event) => onChange(Number(event.target.value))} />
        {unit && <em>{unit}</em>}
      </span>
    </label>
  );
}

function SelectionScreen({
  mode,
  onMode,
  context,
  onContext,
  wizardStep,
  onWizardStep,
  onSubmit,
}: {
  mode: SelectionMode;
  onMode: (mode: SelectionMode) => void;
  context: PumpContext;
  onContext: (context: PumpContext) => void;
  wizardStep: number;
  onWizardStep: (step: number) => void;
  onSubmit: () => void;
}) {
  const update = <K extends keyof PumpContext>(key: K, value: PumpContext[K]) => onContext({ ...context, [key]: value });
  return (
    <main className={styles.main}>
      <section className={styles.selectionHero}>
        <div className={styles.eyebrow}><span>APGS Pump Select</span><span>01 / Подбор</span></div>
        <h1>Найдём насос под вашу систему,<br /> <span>а не просто по параметрам.</span></h1>
        <p>Ответьте на несколько вопросов. Сервис проверит рабочую точку, ограничения и стоимость владения.</p>
        <div className={styles.trustRow}>
          <span><Icon name="check" size={15} /> Инженерная проверка</span>
          <span><Icon name="check" size={15} /> 22 бренда</span>
          <span><Icon name="check" size={15} /> Результат за 60 секунд</span>
        </div>
      </section>

      <section className={styles.modeSection} aria-labelledby="mode-heading">
        <div className={styles.sectionHeadingInline}><div><span className={styles.overline}>Способ подбора</span><h2 id="mode-heading">Что вам уже известно?</h2></div><span className={styles.stepNote}>Можно изменить в любой момент</span></div>
        <div className={styles.modeGrid} role="tablist" aria-label="Способ подбора насоса">
          {(Object.keys(MODE_COPY) as SelectionMode[]).map((item) => (
            <button className={cx(styles.modeCard, mode === item && styles.modeCardActive)} role="tab" aria-selected={mode === item} onClick={() => { onMode(item); onWizardStep(1); }} key={item}>
              <span className={styles.modeIndex}>{MODE_COPY[item].index}</span>
              <span className={styles.modeIcon}>{item === 'model' ? <Icon name="search" /> : item === 'pro' ? '∑' : item === 'quick' ? 'Q/H' : '?'}</span>
              <strong>{MODE_COPY[item].title}</strong>
              <small>{MODE_COPY[item].text}</small>
              <span className={styles.modeArrow}><Icon name="arrow" size={18} /></span>
            </button>
          ))}
        </div>

        <div className={styles.selectionPanel} role="tabpanel">
          {mode === 'wizard' && (
            <div className={styles.wizardLayout}>
              <ol className={styles.wizardSteps}>
                {['Объект', 'Задача', 'Параметры'].map((label, index) => (
                  <li className={cx(index + 1 === wizardStep && styles.wizardCurrent, index + 1 < wizardStep && styles.wizardDone)} key={label}>
                    <button onClick={() => onWizardStep(index + 1)}><span>{index + 1 < wizardStep ? <Icon name="check" size={14} /> : index + 1}</span><div><small>Шаг {index + 1}</small><strong>{label}</strong></div></button>
                  </li>
                ))}
              </ol>
              <div className={styles.wizardContent}>
                <span className={styles.overline}>Шаг {wizardStep} из 3</span>
                {wizardStep === 1 && <><h3>Где будет работать насос?</h3><p>Это поможет определить тип оборудования и обязательные проверки.</p><div className={styles.choiceGrid}>{APPLICATIONS.map((item) => <button className={cx(styles.choiceButton, context.application === item && styles.choiceActive)} onClick={() => update('application', item)} key={item}>{item}</button>)}</div></>}
                {wizardStep === 2 && <><h3>Какую задачу нужно решить?</h3><p>Мы используем ответ для первичного ранжирования моделей.</p><div className={styles.choiceGrid}>{TASKS.map((item) => <button className={cx(styles.choiceButton, context.task === item && styles.choiceActive)} onClick={() => update('task', item)} key={item}>{item}</button>)}</div></>}
                {wizardStep === 3 && <><h3>Уточните рабочую точку</h3><p>Можно использовать расчётные значения или приблизительные данные.</p><div className={styles.fieldGrid}><NumberField label="Расход Q" value={context.q} unit="м³/ч" onChange={(value) => update('q', value)} hint="Объём жидкости, проходящий через насос за час" /><NumberField label="Напор H" value={context.h} unit="м" onChange={(value) => update('h', value)} hint="Энергия, которую насос передаёт потоку" /><NumberField label="Диаметр DN" value={context.dn} unit="мм" onChange={(value) => update('dn', value)} /><NumberField label="Температура" value={context.temp} unit="°C" onChange={(value) => update('temp', value)} /></div></>}
                <div className={styles.panelActions}>
                  {wizardStep > 1 && <button className={styles.secondaryButton} onClick={() => onWizardStep(wizardStep - 1)}><Icon name="back" size={18} /> Назад</button>}
                  <button className={styles.primaryButton} onClick={() => wizardStep < 3 ? onWizardStep(wizardStep + 1) : onSubmit()}>{wizardStep < 3 ? 'Продолжить' : 'Показать подходящие насосы'} <Icon name="arrow" size={18} /></button>
                </div>
              </div>
            </div>
          )}

          {mode === 'quick' && (
            <div className={styles.formPanel}>
              <div><span className={styles.overline}>Быстрый подбор</span><h3>Введите ключевые параметры</h3><p>Остальные ограничения можно уточнить на следующем шаге.</p></div>
              <div className={styles.fieldGrid}><NumberField label="Расход Q" value={context.q} unit="м³/ч" onChange={(value) => update('q', value)} /><NumberField label="Напор H" value={context.h} unit="м" onChange={(value) => update('h', value)} /><NumberField label="Диаметр DN" value={context.dn} unit="мм" onChange={(value) => update('dn', value)} /><NumberField label="Температура" value={context.temp} unit="°C" onChange={(value) => update('temp', value)} /></div>
              <button className={styles.primaryButton} onClick={onSubmit}>Подобрать насосы <Icon name="arrow" size={18} /></button>
            </div>
          )}

          {mode === 'model' && (
            <div className={styles.formPanel}>
              <div><span className={styles.overline}>Поиск аналога</span><h3>Какую модель нужно заменить?</h3><p>Сопоставим рабочую точку, материалы и исполнение.</p></div>
              <label className={cx(styles.field, styles.fullField)}><span>Модель или артикул</span><span className={styles.searchInput}><Icon name="search" /><input defaultValue="Grundfos CR 15-4" /></span></label>
              <button className={styles.primaryButton} onClick={onSubmit}>Найти аналог APGS <Icon name="arrow" size={18} /></button>
            </div>
          )}

          {mode === 'pro' && (
            <div className={styles.formPanel}>
              <div><span className={styles.overline}>Профессиональный режим</span><h3>Инженерные параметры</h3><p>Расширенный набор условий для точного подбора.</p></div>
              <div className={styles.fieldGrid}><NumberField label="Расход Q" value={context.q} unit="м³/ч" onChange={(value) => update('q', value)} /><NumberField label="Напор H" value={context.h} unit="м" onChange={(value) => update('h', value)} /><NumberField label="DN" value={context.dn} unit="мм" onChange={(value) => update('dn', value)} /><NumberField label="Температура" value={context.temp} unit="°C" onChange={(value) => update('temp', value)} /><NumberField label="Плотность" value={context.density} unit="кг/м³" onChange={(value) => update('density', value)} /><NumberField label="Частота" value={context.frequency} unit="Гц" onChange={(value) => update('frequency', value)} /></div>
              <div className={styles.professionalNote}><Icon name="info" /><span>Ещё 9 параметров будут доступны в рабочей версии: NPSH, PN, материалы, взрывозащита, напряжение и ограничения по брендам.</span></div>
              <button className={styles.primaryButton} onClick={onSubmit}>Выполнить инженерный подбор <Icon name="arrow" size={18} /></button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function MatchRing({ score, grade }: { score: number; grade: 'A' | 'B' | 'C' }) {
  const circumference = 2 * Math.PI * 34;
  return (
    <div className={cx(styles.matchRing, styles[`grade${grade}`])} aria-label={`Соответствие ${score} процентов, класс ${grade}`}>
      <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="34" /><circle cx="40" cy="40" r="34" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)} /></svg>
      <span><strong>{score}%</strong><small>{grade}</small></span>
    </div>
  );
}

function ResultCard({ pump, featured, onOpen, onAdd }: { pump: Pump; featured?: boolean; onOpen: () => void; onAdd: () => void }) {
  return (
    <article className={cx(styles.resultCard, featured && styles.resultFeatured)}>
      {featured && <div className={styles.bestLabel}><Icon name="check" size={14} /> Лучший результат</div>}
      <div className={styles.resultVisual}><PumpIllustration compact /></div>
      <div className={styles.resultInfo}>
        <div className={styles.resultMeta}><span>{pump.sku}</span><span className={styles.stockDot}>В наличии · {pump.stock} шт.</span></div>
        <h3>{pump.name}</h3><p>{pump.description}</p>
        <dl className={styles.resultSpecs}><div><dt>Q ном.</dt><dd>{pump.q} м³/ч</dd></div><div><dt>H ном.</dt><dd>{pump.h} м</dd></div><div><dt>DN</dt><dd>{pump.dn}</dd></div><div><dt>P₂</dt><dd>{pump.power} кВт</dd></div></dl>
      </div>
      <div className={styles.resultDecision}>
        <MatchRing score={pump.match} grade={pump.grade} />
        <div className={styles.resultPrice}><small>Розничная цена</small><strong>{formatPrice(pump.price)} ₽</strong></div>
        <button className={styles.primaryButton} onClick={onOpen}>Открыть карточку <Icon name="arrow" size={17} /></button>
        <button className={styles.secondaryButton} onClick={onAdd}><Icon name="plus" size={17} /> В проект</button>
      </div>
    </article>
  );
}

function ResultsScreen({ context, onEdit, onOpenPump, onAdd, onDemoAction }: { context: PumpContext; onEdit: () => void; onOpenPump: (pump: Pump) => void; onAdd: (pump: Pump) => void; onDemoAction: (message: string) => void }) {
  const [excludedOpen, setExcludedOpen] = useState(false);
  return (
    <main className={styles.main}>
      <div className={styles.screenTopline}><button className={styles.backButton} onClick={onEdit}><Icon name="back" /> Изменить подбор</button><span>Подбор № AP-2026-0841</span></div>
      <ContextStrip context={context} onEdit={onEdit} />
      <section className={styles.resultsHeader}>
        <div><span className={styles.overline}>Результаты расчёта</span><h1>Нашли 10 подходящих насосов</h1><p>2 точных совпадения · 8 аналогов · 47 моделей исключено</p></div>
        <div className={styles.resultsVerdict}><span><Icon name="check" /></span><div><strong>Рабочая точка определена</strong><small>Q {context.q} м³/ч · H {context.h} м находится в допустимой области</small></div></div>
      </section>

      <section className={styles.resultsSection}>
        <div className={styles.listHeading}><div><h2>Точные совпадения</h2><span>Соответствуют рабочей точке и ограничениям</span></div><label className={styles.sortLabel}>Сортировка <select defaultValue="match"><option value="match">По соответствию</option><option value="price">По цене</option><option value="tco">По TCO</option></select></label></div>
        <ResultCard pump={PUMPS[0]} featured onOpen={() => onOpenPump(PUMPS[0])} onAdd={() => onAdd(PUMPS[0])} />
      </section>

      <section className={styles.resultsSection}>
        <div className={styles.listHeading}><div><h2>Подходящие аналоги</h2><span>Незначительные отличия отмечены в карточке</span></div><span className={styles.countBadge}>8 моделей</span></div>
        <div className={styles.analogResultGrid}>{PUMPS.slice(1).map((pump) => <ResultCard pump={pump} onOpen={() => onOpenPump(pump)} onAdd={() => onAdd(pump)} key={pump.id} />)}</div>
      </section>

      <section className={styles.excludedSection}>
        <button className={styles.excludedToggle} onClick={() => setExcludedOpen(!excludedOpen)} aria-expanded={excludedOpen}>
          <span className={styles.dangerIcon}><Icon name="warning" /></span><span><strong>Почему 47 моделей не подошли?</strong><small>Показываем конкретные инженерные причины, а не скрываем результаты.</small></span><Icon name="chevron" />
        </button>
        {excludedOpen && <div className={styles.excludedList}>{EXCLUDED.map((item) => <div key={item.model}><span>{item.model}</span><p><strong>Не подходит:</strong> {item.reason}</p><button onClick={() => onDemoAction(`${item.model}: полный протокол проверки доступен в рабочей версии`)}>Подробнее</button></div>)}</div>}
      </section>
    </main>
  );
}

function VerdictBlock({ state, score, grade }: { state: DemoState; score: number; grade: 'A' | 'B' | 'C' }) {
  const content = grade === 'A'
    ? { title: 'Подходит для вашей системы', text: 'Критических ограничений не обнаружено', icon: 'check' as const }
    : grade === 'B'
      ? { title: 'Подходит с ограничениями', text: 'Перед заказом проверьте отмеченные условия', icon: 'warning' as const }
      : { title: 'Не рекомендуется', text: 'Рабочая точка выходит за безопасную область', icon: 'close' as const };
  return (
    <section className={cx(styles.cardSection, styles.verdictCard, styles[`verdict${grade}`])}>
      <div className={styles.verdictTop}><MatchRing score={score} grade={grade} /><div><span className={styles.overline}>Инженерный вердикт</span><h2>{content.title}</h2><p>{content.text}</p></div></div>
      {state === 'insufficient' ? <div className={styles.emptyInline}><Icon name="warning" /><span><strong>Недостаточно данных для полного вердикта</strong><small>Производитель не указал NPSH и уровень шума. Результат предварительный.</small></span></div> : <ul className={styles.verdictSummary}><li><Icon name={content.icon} size={16} /> Q/H в рабочей области</li><li><Icon name={content.icon} size={16} /> DN и PN совместимы</li><li><Icon name={grade === 'A' ? 'check' : 'warning'} size={16} /> {grade === 'A' ? 'Температурный запас 30 °C' : 'Требуется дополнительная проверка'}</li></ul>}
    </section>
  );
}

function WhyBlock({ grade }: { grade: 'A' | 'B' | 'C' }) {
  const reasons = [
    'Рабочая точка находится в зоне максимального КПД — 78,2%',
    'Насос есть на складе: 25 шт., возможна отгрузка завтра',
    'Минимальная стоимость владения среди точных аналогов',
    'DN 50 и PN16 соответствуют параметрам вашей системы',
    'Двигатель IE3 даёт экономию до 112 000 ₽ за 5 лет',
  ];
  return (
    <section className={cx(styles.cardSection, styles.whyCard)}>
      <div className={styles.sectionTitle}><div><span className={styles.overline}>Обоснование</span><h2>Почему эта модель</h2></div><span className={styles.reasonCount}>5 причин</span></div>
      <ol className={styles.reasons}>{reasons.map((reason, index) => <li key={reason}><span>{index + 1}</span><p>{reason}</p></li>)}</ol>
      <div className={cx(styles.limitations, grade === 'C' && styles.limitationsDanger)}><Icon name="warning" /><div><strong>{grade === 'A' ? 'Обратите внимание' : 'Ограничения и риски'}</strong><p>{grade === 'A' ? 'NPSH указан для воды 20 °C — для горячей воды требуется контрольный расчёт.' : 'Напор и температурный режим требуют подтверждения инженером APGS.'}</p></div></div>
    </section>
  );
}

function DiagnosticsSection({ state }: { state: DemoState }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? DIAGNOSTICS : DIAGNOSTICS.slice(0, 4);
  return (
    <section className={styles.contentSection}>
      <div className={styles.sectionTitle}><div><span className={styles.overline}>8 автоматических проверок</span><h2>Инженерная диагностика</h2><p>Проверяем насос относительно текущего Context.</p></div><span className={styles.statusPill}><Icon name="check" size={15} /> Критических ошибок нет</span></div>
      <div className={styles.diagnosticGrid}>{visible.map((item, index) => {
        const warn = state === 'B' && index === 3 || state === 'C' && index < 2 || state === 'insufficient' && index === 1;
        return <article className={cx(styles.diagnosticCard, warn && styles.diagnosticWarn)} key={item.name}><span className={styles.diagnosticStatus}>{warn ? <Icon name="warning" /> : <Icon name="check" />}</span><div><small>{item.name}</small><strong>{state === 'insufficient' && index === 1 ? 'Нет данных' : item.value}</strong><p>{state === 'insufficient' && index === 1 ? 'NPSH не указан производителем' : item.norm}</p></div></article>;
      })}</div>
      <button className={styles.showMoreButton} onClick={() => setExpanded(!expanded)}>{expanded ? 'Свернуть диагностику' : 'Показать все 8 проверок'} <Icon name="chevron" size={17} /></button>
    </section>
  );
}

function QHChart({ context, unavailable, onDemoAction }: { context: PumpContext; unavailable: boolean; onDemoAction: (message: string) => void }) {
  if (unavailable) {
    return <div className={styles.chartEmpty}><span><Icon name="warning" size={28} /></span><h3>Q-H кривая пока недоступна</h3><p>Производитель не передал табличные данные. Можно запросить техлист у инженера APGS.</p><button className={styles.secondaryButton} onClick={() => onDemoAction('Запрос Q-H кривой добавлен в проект')}>Запросить кривую</button></div>;
  }
  const x = 58 + Math.max(0, Math.min(55, context.q)) / 55 * 650;
  const y = 326 - Math.max(0, Math.min(60, context.h)) / 60 * 280;
  return (
    <div className={styles.chartWrap}>
      <svg className={styles.chart} viewBox="0 0 760 370" role="img" aria-labelledby="qh-title qh-description">
        <title id="qh-title">График Q-H для APGS InLine 50-200/5.5</title>
        <desc id="qh-description">Синяя кривая показывает напор насоса. Зелёная точка — BEP при Q 34 и H 41. Чёрная точка — рабочая точка пользователя Q {context.q} и H {context.h}.</desc>
        <g className={styles.chartGrid}>
          {[46, 102, 158, 214, 270, 326].map((gridY, index) => <g key={gridY}><line x1="58" x2="728" y1={gridY} y2={gridY} /><text x="42" y={gridY + 4}>{60 - index * 12}</text></g>)}
          {[58, 180, 302, 424, 546, 668, 728].map((gridX, index) => <g key={gridX}><line y1="46" y2="326" x1={gridX} x2={gridX} /><text x={gridX} y="350">{index * 10}</text></g>)}
        </g>
        <text className={styles.axisLabel} x="10" y="28">H, м</text><text className={styles.axisLabel} x="700" y="366">Q, м³/ч</text>
        <path className={styles.chartBand} d="M58 64 C170 72 246 91 340 122 C450 159 548 215 704 315" />
        <path className={styles.chartCurve} d="M58 64 C170 72 246 91 340 122 C450 159 548 215 704 315" />
        <circle className={styles.bepHalo} cx="460" cy="135" r="18" /><circle className={styles.bepPoint} cx="460" cy="135" r="7" /><text className={styles.pointLabel} x="478" y="120">BEP · 78,2%</text>
        <line className={styles.userGuide} x1={x} x2={x} y1={y} y2="326" /><line className={styles.userGuide} x1="58" x2={x} y1={y} y2={y} />
        <circle className={styles.userPointHalo} cx={x} cy={y} r="14" /><circle className={styles.userPoint} cx={x} cy={y} r="7" /><g transform={`translate(${Math.min(x + 14, 585)} ${Math.max(y - 50, 8)})`}><rect className={styles.chartTooltip} width="128" height="38" rx="6" /><text className={styles.tooltipText} x="12" y="24">Q {context.q} · H {context.h}</text></g>
      </svg>
      <div className={styles.chartLegend}><span><i className={styles.legendCurve} /> Кривая насоса</span><span><i className={styles.legendZone} /> Допустимая зона</span><span><i className={styles.legendBep} /> BEP</span><span><i className={styles.legendUser} /> Ваша точка</span></div>
    </div>
  );
}

function TCOCalculator({ context, pump }: { context: PumpContext; pump: Pump }) {
  const [years, setYears] = useState(5);
  const [hours, setHours] = useState(context.hoursYear);
  const [priceKwh, setPriceKwh] = useState(context.priceKwh);
  const energy = pump.power / (pump.efficiency / 100) * hours * priceKwh * years;
  const maintenance = pump.price * 0.03 * years;
  const total = pump.price + energy + maintenance;
  const alternative = total * 1.19;
  return (
    <div className={styles.tcoCalculator}>
      <div className={styles.tcoControls}>
        <label><span>Период</span><select value={years} onChange={(event) => setYears(Number(event.target.value))}><option value={5}>5 лет</option><option value={10}>10 лет</option><option value={15}>15 лет</option></select></label>
        <label><span>Работа в год</span><span className={styles.inputWrap}><input type="number" value={hours} onChange={(event) => setHours(Number(event.target.value))} /><em>ч</em></span></label>
        <label><span>Электроэнергия</span><span className={styles.inputWrap}><input type="number" step="0.1" value={priceKwh} onChange={(event) => setPriceKwh(Number(event.target.value))} /><em>₽/кВт·ч</em></span></label>
      </div>
      <div className={styles.tcoSummary}>
        <div><small>Оборудование</small><strong>{formatPrice(pump.price)} ₽</strong><span style={{ width: '37%' }} /></div>
        <div><small>Электроэнергия</small><strong>{formatPrice(energy)} ₽</strong><span style={{ width: '78%' }} /></div>
        <div><small>Обслуживание</small><strong>{formatPrice(maintenance)} ₽</strong><span style={{ width: '24%' }} /></div>
      </div>
      <div className={styles.tcoTotal}><div><small>TCO за {years} лет</small><strong>{formatPrice(total)} ₽</strong></div><div className={styles.saving}><Icon name="check" /><span>Экономия относительно IE1<strong>{formatPrice(alternative - total)} ₽</strong></span></div></div>
      <p className={styles.demoCaption}><Icon name="info" size={14} /> Демонстрационный расчёт. Итоговое значение уточняется по режиму эксплуатации.</p>
    </div>
  );
}

function ProductDetails({ tab, onTab, onDemoAction }: { tab: DetailsTab; onTab: (tab: DetailsTab) => void; onDemoAction: (message: string) => void }) {
  return (
    <section className={styles.contentSection} id="product-details">
      <div className={styles.tabs} role="tablist" aria-label="Сведения о насосе">
        <button role="tab" aria-selected={tab === 'specs'} className={tab === 'specs' ? styles.tabActive : undefined} onClick={() => onTab('specs')}>Характеристики</button>
        <button role="tab" aria-selected={tab === 'materials'} className={tab === 'materials' ? styles.tabActive : undefined} onClick={() => onTab('materials')}>Материалы и исполнение</button>
        <button role="tab" aria-selected={tab === 'documents'} className={tab === 'documents' ? styles.tabActive : undefined} onClick={() => onTab('documents')}>Документы <span>4</span></button>
      </div>
      <div className={styles.tabPanel} role="tabpanel">
        {tab === 'specs' && <dl className={styles.specTable}><div><dt>Номинальный расход Q</dt><dd>34 м³/ч</dd></div><div><dt>Номинальный напор H</dt><dd>41 м</dd></div><div><dt>Мощность двигателя P₂</dt><dd>5,5 кВт</dd></div><div><dt>КПД в точке BEP</dt><dd>78,2%</dd></div><div><dt>Присоединение</dt><dd>DN 50 / PN16</dd></div><div><dt>Класс эффективности</dt><dd>IE3</dd></div></dl>}
        {tab === 'materials' && <dl className={styles.specTable}><div><dt>Корпус насоса</dt><dd>Чугун EN-GJL-250</dd></div><div><dt>Рабочее колесо</dt><dd>Нержавеющая сталь AISI 304</dd></div><div><dt>Уплотнение вала</dt><dd>SiC / SiC / EPDM</dd></div><div><dt>Температура жидкости</dt><dd>−10…+120 °C</dd></div></dl>}
        {tab === 'documents' && <div className={styles.documents}>{['Паспорт насоса.pdf', 'Габаритный чертёж.dwg', 'Руководство по монтажу.pdf', 'Технический лист.pdf'].map((name) => <button key={name} onClick={() => onDemoAction(`${name}: демо-загрузка подготовлена`)}><span><Icon name="document" /></span><div><strong>{name}</strong><small>Образец документа · PDF</small></div><Icon name="download" /></button>)}</div>}
      </div>
    </section>
  );
}

function PumpScreen({
  context,
  onContext,
  pump,
  demoState,
  onDemoState,
  onBack,
  onAdd,
  onQuote,
  onDemoAction,
}: {
  context: PumpContext;
  onContext: (context: PumpContext) => void;
  pump: Pump;
  demoState: DemoState;
  onDemoState: (state: DemoState) => void;
  onBack: () => void;
  onAdd: () => void;
  onQuote: () => void;
  onDemoAction: (message: string) => void;
}) {
  const [contextOpen, setContextOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState<DetailsTab>('specs');
  const variation = Math.abs(context.q - pump.q) / pump.q + Math.abs(context.h - pump.h) / pump.h;
  const dynamicA = Math.max(86, Math.min(98, Math.round(98 - variation * 38)));
  const grade: 'A' | 'B' | 'C' = demoState === 'B' ? 'B' : demoState === 'C' ? 'C' : 'A';
  const score = grade === 'B' ? Math.max(70, 82 - Math.round(variation * 12)) : grade === 'C' ? 48 : dynamicA;
  const update = <K extends keyof PumpContext>(key: K, value: PumpContext[K]) => onContext({ ...context, [key]: value });

  if (demoState === 'error') {
    return (
      <main className={styles.main}>
        <div className={styles.screenTopline}><button className={styles.backButton} onClick={onBack}><Icon name="back" /> К результатам</button><span>{pump.sku}</span></div>
        <section className={styles.fullError}><span><Icon name="warning" size={34} /></span><p className={styles.errorCode}>Ошибка APGS-503</p><h1>Не удалось загрузить расчёт</h1><p>Каталог временно доступен, но инженерная диагностика не отвечает. Введённые параметры сохранены.</p><div><button className={styles.primaryButton} onClick={() => onDemoState('A')}>Повторить попытку</button><button className={styles.secondaryButton} onClick={onBack}>Вернуться к результатам</button></div></section>
      </main>
    );
  }

  return (
    <main className={cx(styles.main, styles.pumpMain)}>
      <div className={styles.screenTopline}><button className={styles.backButton} onClick={onBack}><Icon name="back" /> К результатам</button><span>Каталог / Насосы / {pump.series}</span></div>
      <section className={styles.productHero}>
        <div className={styles.productVisual}><div className={styles.visualBadges}><span>APGS</span><span>3D preview</span></div><PumpIllustration /><div className={styles.thumbnails}><button className={styles.thumbnailActive} aria-label="Основное изображение выбрано" aria-pressed="true"><PumpIllustration compact /></button><button onClick={() => document.getElementById('qh-analysis')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><span>Q-H</span></button><button onClick={() => { setDetailsTab('documents'); window.setTimeout(() => document.getElementById('product-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0); }}><span>DWG</span></button></div></div>
        <div className={styles.productInfo}>
          <div className={styles.productMeta}><span>{pump.sku}</span><span className={styles.stockDot}>В наличии · {pump.stock} шт.</span></div>
          <h1>{pump.name}</h1><p className={styles.productDescription}>{pump.description}</p>
          {demoState !== 'no-context' && <div className={cx(styles.heroVerdict, styles[`verdict${grade}`])}><span><Icon name={grade === 'A' ? 'check' : grade === 'B' ? 'warning' : 'close'} /></span><div><small>Вердикт подбора</small><strong>{grade === 'A' ? 'Подходит' : grade === 'B' ? 'С ограничениями' : 'Не рекомендуется'}</strong></div><b>{score}%</b></div>}
          <dl className={styles.heroSpecs}><div><dt>Q ном.</dt><dd>{pump.q}<small>м³/ч</small></dd></div><div><dt>H ном.</dt><dd>{pump.h}<small>м</small></dd></div><div><dt>DN</dt><dd>{pump.dn}<small>мм</small></dd></div><div><dt>КПД</dt><dd>{pump.efficiency}<small>%</small></dd></div></dl>
          <div className={styles.priceBlock}><div><small>Розничная цена</small><strong>{formatPrice(pump.price)} ₽</strong><span>Цена с НДС · срок поставки 1–2 дня</span></div><div><button className={styles.primaryButton} onClick={onQuote}>Получить КП <Icon name="arrow" size={17} /></button><button className={styles.secondaryButton} onClick={onAdd}><Icon name="plus" size={17} /> В проект</button></div></div>
        </div>
      </section>

      {demoState === 'no-context' ? (
        <section className={styles.noContextCard}>
          <div className={styles.noContextIcon}>Q/H</div><div><span className={styles.overline}>Карточка открыта из каталога</span><h2>Проверить насос на вашей рабочей точке?</h2><p>Введите расход и напор — мы покажем Verdict, диагностику, Q-H и TCO.</p></div>
          <div className={styles.noContextFields}><NumberField label="Расход Q" value={context.q} unit="м³/ч" onChange={(value) => update('q', value)} /><NumberField label="Напор H" value={context.h} unit="м" onChange={(value) => update('h', value)} /><button className={styles.primaryButton} onClick={() => onDemoState('A')}>Проверить насос</button></div>
        </section>
      ) : (
        <>
          <ContextStrip context={context} onEdit={() => setContextOpen(!contextOpen)} />
          {contextOpen && <section className={styles.contextEditor}><div><NumberField label="Расход Q" value={context.q} unit="м³/ч" onChange={(value) => update('q', value)} /><NumberField label="Напор H" value={context.h} unit="м" onChange={(value) => update('h', value)} /><NumberField label="Диаметр DN" value={context.dn} unit="мм" onChange={(value) => update('dn', value)} /><NumberField label="Температура" value={context.temp} unit="°C" onChange={(value) => update('temp', value)} /></div><p><span className={styles.liveDot} /> Verdict, график и TCO обновляются автоматически</p></section>}
          <div className={styles.decisionGrid}><VerdictBlock state={demoState} score={score} grade={grade} /><WhyBlock grade={grade} /></div>
          <DiagnosticsSection state={demoState} />
          <section className={styles.analysisGrid}>
            <div className={cx(styles.contentSection, styles.chartSection)} id="qh-analysis"><div className={styles.sectionTitle}><div><span className={styles.overline}>Рабочая характеристика</span><h2>График Q-H</h2><p>Рабочая точка, BEP и допустимая область.</p></div><span className={styles.frequencyBadge}>{context.frequency} Гц</span></div><QHChart context={context} unavailable={demoState === 'no-curve'} onDemoAction={onDemoAction} /></div>
            <div className={cx(styles.contentSection, styles.tcoSection)}><div className={styles.sectionTitle}><div><span className={styles.overline}>Экономика проекта</span><h2>Стоимость владения</h2><p>CAPEX, энергия и обслуживание.</p></div></div><TCOCalculator context={context} pump={pump} /></div>
          </section>
          <ProductDetails tab={detailsTab} onTab={setDetailsTab} onDemoAction={onDemoAction} />
          <section className={styles.contentSection}><div className={styles.sectionTitle}><div><span className={styles.overline}>Альтернативы</span><h2>Подходящие аналоги</h2><p>Можно сравнить параметры до добавления в проект.</p></div><button className={styles.textButton} onClick={() => onDemoAction('Сравнение моделей будет доступно в версии 2.0')}>Сравнить все <Icon name="arrow" size={16} /></button></div><div className={styles.analogCards}>{PUMPS.slice(1).map((item) => <article key={item.id}><div><span className={styles.miniGrade}>{item.grade}</span><small>{item.match}% соответствие</small></div><h3>{item.name}</h3><dl><div><dt>Q / H</dt><dd>{item.q} / {item.h}</dd></div><div><dt>Цена</dt><dd>{formatPrice(item.price)} ₽</dd></div><div><dt>TCO 5 лет</dt><dd>{formatPrice(item.price * 2.72)} ₽</dd></div></dl><button className={styles.secondaryButton} onClick={() => onDemoAction(`Карточка ${item.name} — следующий экран прототипа`)}>Открыть карточку</button></article>)}</div></section>
        </>
      )}
      <div className={styles.stickyCta}><div><span className={styles.stickyStatus}><Icon name="check" size={16} /></span><p><small>{pump.sku}</small><strong>{demoState === 'no-context' ? 'Введите Q/H для проверки' : `${score}% · ${grade === 'A' ? 'Подходит' : grade === 'B' ? 'С ограничениями' : 'Не рекомендуется'}`}</strong></p></div><div><span className={styles.stickyPrice}>{formatPrice(pump.price)} ₽</span><button className={styles.secondaryButton} onClick={onAdd}><Icon name="plus" size={17} /> В проект</button><button className={styles.primaryButton} onClick={onQuote}>Получить КП</button></div></div>
    </main>
  );
}

function ProjectDrawer({
  open,
  items,
  onClose,
  onQuantity,
  onRemove,
  onQuote,
  onDemoAction,
}: {
  open: boolean;
  items: ProjectItem[];
  onClose: () => void;
  onQuantity: (pumpId: number, quantity: number) => void;
  onRemove: (pumpId: number) => void;
  onQuote: () => void;
  onDemoAction: (message: string) => void;
}) {
  const ref = useOverlayFocus<HTMLDivElement>(open, onClose);
  if (!open) return null;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className={styles.overlay} role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <aside className={styles.drawer} ref={ref} role="dialog" aria-modal="true" aria-labelledby="project-title">
        <div className={styles.drawerHeader}><div><span className={styles.overline}>Zero-Cart</span><h2 id="project-title">Ваш проект</h2><p>{items.length} {items.length === 1 ? 'позиция' : 'позиции'} в спецификации</p></div><button className={styles.closeButton} onClick={onClose} data-autofocus aria-label="Закрыть проект"><Icon name="close" /></button></div>
        <div className={styles.drawerBody}>
          {items.length === 0 ? <div className={styles.emptyProject}><span><Icon name="cart" size={32} /></span><h3>Проект пока пуст</h3><p>Добавьте насос из результатов или карточки — Context сохранится вместе с позицией.</p><button className={styles.secondaryButton} onClick={onClose}>Вернуться к подбору</button></div> : items.map((item) => <article className={styles.projectItem} key={item.pumpId}><div className={styles.projectItemTop}><span className={styles.projectThumb}><PumpIllustration compact /></span><div><small>{item.sku}</small><h3>{item.name}</h3><p>Q {item.context.q} · H {item.context.h} · DN {item.context.dn}</p></div><button onClick={() => onRemove(item.pumpId)} aria-label={`Удалить ${item.name}`}><Icon name="close" size={17} /></button></div><div className={styles.projectItemBottom}><div className={styles.quantity}><button onClick={() => onQuantity(item.pumpId, Math.max(1, item.quantity - 1))} aria-label="Уменьшить количество"><Icon name="minus" size={16} /></button><span>{item.quantity}</span><button onClick={() => onQuantity(item.pumpId, item.quantity + 1)} aria-label="Увеличить количество"><Icon name="plus" size={16} /></button></div><strong>{formatPrice(item.price * item.quantity)} ₽</strong></div></article>)}
        </div>
        {items.length > 0 && <div className={styles.drawerFooter}><div className={styles.projectTotal}><span>Итого без доставки</span><strong>{formatPrice(total)} ₽</strong></div><div className={styles.exportButtons}><button onClick={() => onDemoAction('PDF-спецификация подготовлена в демо-режиме')}><Icon name="download" size={17} /> PDF</button><button onClick={() => onDemoAction('Excel-спецификация подготовлена в демо-режиме')}><Icon name="download" size={17} /> Excel</button></div><button className={styles.primaryButton} onClick={onQuote}>Получить коммерческое предложение <Icon name="arrow" size={18} /></button><p><Icon name="info" size={13} /> Контекст и настройки TCO будут приложены автоматически</p></div>}
      </aside>
    </div>
  );
}

function QuoteModal({
  open,
  items,
  form,
  errors,
  success,
  onForm,
  onClose,
  onSubmit,
}: {
  open: boolean;
  items: ProjectItem[];
  form: QuoteForm;
  errors: Partial<Record<keyof QuoteForm, string>>;
  success: boolean;
  onForm: (form: QuoteForm) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
}) {
  const ref = useOverlayFocus<HTMLDivElement>(open, onClose);
  useEffect(() => {
    if (open && success) ref.current?.querySelector<HTMLElement>('[data-success-autofocus]')?.focus();
  }, [open, success, ref]);
  if (!open) return null;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className={styles.overlay} role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <div className={styles.quoteModal} ref={ref} role="dialog" aria-modal="true" aria-labelledby="quote-title">
        <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть форму"><Icon name="close" /></button>
        {success ? <div className={styles.quoteSuccess}><span><Icon name="check" size={34} /></span><small>Заявка AP-0841</small><h2 id="quote-title">Коммерческое предложение формируется</h2><p>Мы сохранили параметры подбора и спецификацию. Инженер APGS свяжется с вами в течение 30 минут.</p><div><Icon name="document" /><span><strong>В заявку добавлено</strong><small>{items.length} поз. · PDF + Excel · Context Q/H/DN</small></span></div><button className={styles.primaryButton} onClick={onClose} data-success-autofocus>Вернуться к проекту</button></div> : <>
          <div className={styles.quoteHeader}><span className={styles.overline}>Последний шаг</span><h2 id="quote-title">Получить коммерческое предложение</h2><p>Технические данные уже заполнены — нужны только контакты.</p></div>
          <div className={styles.quoteLayout}>
            <div className={styles.quoteSummary}><span className={styles.overline}>Ваш проект</span>{items.map((item) => <div key={item.pumpId}><span>{item.quantity}×</span><p><strong>{item.name}</strong><small>{item.sku}</small></p><b>{formatPrice(item.price * item.quantity)} ₽</b></div>)}<footer><span>Предварительно</span><strong>{formatPrice(total)} ₽</strong></footer><p><Icon name="check" size={14} /> Context и расчёт TCO приложены</p></div>
            <form className={styles.quoteForm} onSubmit={onSubmit} noValidate>
              <div className={styles.quoteFieldRow}><label><span>Имя *</span><input data-autofocus value={form.name} onChange={(event) => onForm({ ...form, name: event.target.value })} aria-invalid={Boolean(errors.name)} />{errors.name && <small>{errors.name}</small>}</label><label><span>Телефон *</span><input placeholder="+7 (___) ___-__-__" value={form.phone} onChange={(event) => onForm({ ...form, phone: event.target.value })} aria-invalid={Boolean(errors.phone)} />{errors.phone && <small>{errors.phone}</small>}</label></div>
              <div className={styles.quoteFieldRow}><label><span>Email</span><input type="email" value={form.email} onChange={(event) => onForm({ ...form, email: event.target.value })} aria-invalid={Boolean(errors.email)} />{errors.email && <small>{errors.email}</small>}</label><label><span>Компания</span><input value={form.company} onChange={(event) => onForm({ ...form, company: event.target.value })} /></label></div>
              <label><span>Комментарий</span><textarea rows={3} placeholder="Срок поставки, объект или дополнительные требования" value={form.comment} onChange={(event) => onForm({ ...form, comment: event.target.value })} /></label>
              <label className={styles.consent}><input type="checkbox" checked={form.consent} onChange={(event) => onForm({ ...form, consent: event.target.checked })} /><span>Согласен на обработку персональных данных</span></label>{errors.consent && <p className={styles.consentError}>{errors.consent}</p>}
              <button className={styles.primaryButton} type="submit">Отправить заявку <Icon name="arrow" size={18} /></button><p className={styles.demoCaption}><Icon name="info" size={13} /> Демо-форма: данные никуда не отправляются</p>
            </form>
          </div>
        </>}
      </div>
    </div>
  );
}

export function PrototypeApp() {
  const [view, setView] = useState<View>('select');
  const [mode, setMode] = useState<SelectionMode>('wizard');
  const [wizardStep, setWizardStep] = useState(1);
  const [context, setContext] = useState<PumpContext>(DEFAULT_CONTEXT);
  const [selectedPump, setSelectedPump] = useState<Pump>(PUMPS[0]);
  const [project, setProject] = useState<ProjectItem[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [demoState, setDemoState] = useState<DemoState>('A');
  const [toast, setToast] = useState('');
  const [quoteForm, setQuoteForm] = useState<QuoteForm>({ name: '', phone: '', email: '', company: '', comment: '', consent: false });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof QuoteForm, string>>>({});

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const storedContext = parseStored<PumpContext>(localStorage.getItem(CONTEXT_STORAGE_KEY));
      const storedProject = parseStored<ProjectItem[]>(localStorage.getItem(PROJECT_STORAGE_KEY));
      if (storedContext) setContext(storedContext);
      if (storedProject) setProject(storedProject);
      setStorageReady(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(CONTEXT_STORAGE_KEY, JSON.stringify(context));
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(project));
  }, [context, project, storageReady]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const projectCount = useMemo(() => project.reduce((sum, item) => sum + item.quantity, 0), [project]);

  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const changeView = (next: View) => { setView(next); window.setTimeout(goTop, 0); };

  const submitSelection = () => {
    setContext((current) => ({ ...current, source: mode, createdAt: new Date().toISOString() }));
    changeView('results');
  };

  const addToProject = (pump: Pump = selectedPump) => {
    setProject((items) => {
      const existing = items.find((item) => item.pumpId === pump.id);
      if (existing) return items.map((item) => item.pumpId === pump.id ? { ...item, quantity: item.quantity + 1, context } : item);
      return [...items, { pumpId: pump.id, name: pump.name, sku: pump.sku, quantity: 1, price: pump.price, context }];
    });
    setToast(`${pump.name} добавлен в проект`);
  };

  const openPump = (pump: Pump) => { setSelectedPump(pump); changeView('pump'); };

  const openProject = () => {
    setToast('');
    setDrawerOpen(true);
  };

  const openQuote = () => {
    if (!project.some((item) => item.pumpId === selectedPump.id)) addToProject(selectedPump);
    setToast('');
    setDrawerOpen(false);
    setQuoteSuccess(false);
    setQuoteOpen(true);
  };

  const resetPrototype = () => {
    localStorage.removeItem(CONTEXT_STORAGE_KEY);
    localStorage.removeItem(PROJECT_STORAGE_KEY);
    setContext(DEFAULT_CONTEXT);
    setProject([]);
    setMode('wizard');
    setWizardStep(1);
    setSelectedPump(PUMPS[0]);
    setDemoState('A');
    setDrawerOpen(false);
    setQuoteOpen(false);
    setQuoteSuccess(false);
    setQuoteForm({ name: '', phone: '', email: '', company: '', comment: '', consent: false });
    setFormErrors({});
    changeView('select');
    setToast('Прототип сброшен');
  };

  const submitQuote = (event: FormEvent) => {
    event.preventDefault();
    const errors: Partial<Record<keyof QuoteForm, string>> = {};
    if (quoteForm.name.trim().length < 2) errors.name = 'Укажите имя';
    if (quoteForm.phone.replace(/\D/g, '').length < 10) errors.phone = 'Укажите корректный телефон';
    if (quoteForm.email && !/^\S+@\S+\.\S+$/.test(quoteForm.email)) errors.email = 'Проверьте email';
    if (!quoteForm.consent) errors.consent = 'Нужно согласие на обработку данных';
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) setQuoteSuccess(true);
  };

  return (
    <div className={styles.prototype}>
      <Header view={view} projectCount={projectCount} demoState={demoState} onDemoState={setDemoState} onHome={() => changeView('select')} onResults={() => changeView('results')} onProject={openProject} onReset={resetPrototype} onDemoAction={setToast} />
      {view === 'select' && <SelectionScreen mode={mode} onMode={setMode} context={context} onContext={setContext} wizardStep={wizardStep} onWizardStep={setWizardStep} onSubmit={submitSelection} />}
      {view === 'results' && <ResultsScreen context={context} onEdit={() => { setMode('quick'); changeView('select'); }} onOpenPump={openPump} onAdd={addToProject} onDemoAction={setToast} />}
      {view === 'pump' && <PumpScreen context={context} onContext={setContext} pump={selectedPump} demoState={demoState} onDemoState={setDemoState} onBack={() => changeView('results')} onAdd={() => addToProject(selectedPump)} onQuote={openQuote} onDemoAction={setToast} />}
      <ProjectDrawer open={drawerOpen} items={project} onClose={() => setDrawerOpen(false)} onQuantity={(pumpId, quantity) => setProject((items) => items.map((item) => item.pumpId === pumpId ? { ...item, quantity } : item))} onRemove={(pumpId) => setProject((items) => items.filter((item) => item.pumpId !== pumpId))} onQuote={openQuote} onDemoAction={setToast} />
      <QuoteModal open={quoteOpen} items={project.length ? project : [{ pumpId: selectedPump.id, name: selectedPump.name, sku: selectedPump.sku, quantity: 1, price: selectedPump.price, context }]} form={quoteForm} errors={formErrors} success={quoteSuccess} onForm={setQuoteForm} onClose={() => setQuoteOpen(false)} onSubmit={submitQuote} />
      {toast && <div className={styles.toast} role="status"><span><Icon name="check" size={17} /></span>{toast}</div>}
    </div>
  );
}

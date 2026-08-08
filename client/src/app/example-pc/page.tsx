import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'PULSE — компьютеры, собранные под тебя',
  description:
    'Премиальные компьютеры для игр, работы и творчества. Подбор, сборка и поддержка без компромиссов.',
};

const builds = [
  {
    index: '01',
    label: 'Работа',
    name: 'CORE',
    description: 'Тихий и быстрый. Для кода, графики и ежедневных задач.',
    specs: ['Intel Core i5', 'RTX 4060 8 GB', '32 GB DDR5', 'SSD 1 TB'],
    price: '129 900 ₽',
    tone: 'light',
  },
  {
    index: '02',
    label: 'Бестселлер',
    name: 'PULSE',
    description: '1440p на максимуме. Запас мощности на несколько лет вперёд.',
    specs: ['Intel Core i7', 'RTX 5070 12 GB', '32 GB DDR5', 'SSD 2 TB'],
    price: '219 900 ₽',
    tone: 'green',
  },
  {
    index: '03',
    label: 'Максимум',
    name: 'APEX',
    description: '4K, 3D и тяжёлый монтаж. Никаких ограничений по мощности.',
    specs: ['AMD Ryzen 9', 'RTX 5080 16 GB', '64 GB DDR5', 'SSD 4 TB'],
    price: '389 900 ₽',
    tone: 'dark',
  },
];

const steps = [
  {
    number: '01',
    title: 'Узнаём задачу',
    text: 'Играешь, монтируешь или работаешь с 3D — сначала понимаем твой сценарий.',
  },
  {
    number: '02',
    title: 'Подбираем баланс',
    text: 'Без переплаты за лишнее. Каждая деталь усиливает систему, а не ценник.',
  },
  {
    number: '03',
    title: 'Собираем и тестируем',
    text: 'Настраиваем охлаждение, прогоняем нагрузку и фиксируем результаты в отчёте.',
  },
];

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
      <path
        d={diagonal ? 'M3.5 12.5 12 4m0 0H5.8M12 4v6.2' : 'M2.5 8h11m-4-4 4 4-4 4'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5" fill="none" viewBox="0 0 16 16">
      <path
        d="m3 8.2 3.1 3.1L13 4.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function Brand() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-[10px] bg-[#c8ff37] text-[13px] font-black tracking-[-0.08em] text-[#0d0f0c]">
        P//
      </span>
      <span className="text-[14px] font-bold tracking-[0.16em]">PULSE</span>
    </span>
  );
}

function PrimaryLink({
  children,
  href,
  inverse = false,
}: {
  children: React.ReactNode;
  href: string;
  inverse?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group flex h-[58px] w-full max-w-[calc(100vw-40px)] items-center justify-between rounded-full py-2 pl-6 pr-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-transform active:scale-[.98] sm:w-[270px] ${
        inverse
          ? 'bg-[#0d0f0c] text-white'
          : 'bg-[#c8ff37] text-[#0d0f0c] hover:scale-[1.02]'
      }`}>
      <span>{children}</span>
      <span
        className={`grid size-10 place-items-center rounded-full transition-transform group-hover:rotate-6 ${
          inverse ? 'bg-[#c8ff37] text-[#0d0f0c]' : 'bg-[#0d0f0c] text-white'
        }`}>
        <ArrowIcon diagonal />
      </span>
    </a>
  );
}

export default function PcCompanyExamplePage() {
  return (
    <main className="overflow-hidden bg-[#efeee8] pb-24 text-[#0d0f0c] selection:bg-[#c8ff37] selection:text-[#0d0f0c] lg:pb-0">
      <section id="top" className="relative bg-[#f5f4ef]">
        <header className="relative z-20 mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-5 sm:h-[88px] sm:px-8 lg:px-12">
          <a href="#top" aria-label="PULSE — на главную">
            <Brand />
          </a>

          <nav
            aria-label="Основная навигация"
            className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/55 lg:flex">
            <a className="transition-colors hover:text-black" href="#models">
              Модели
            </a>
            <a className="transition-colors hover:text-black" href="#approach">
              Как собираем
            </a>
            <a className="transition-colors hover:text-black" href="#support">
              Поддержка
            </a>
          </nav>

          <a
            href="#models"
            className="hidden h-11 items-center gap-4 rounded-full bg-[#c8ff37] py-1.5 pl-5 pr-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0d0f0c] transition-transform hover:scale-[1.03] sm:flex">
            Подобрать компьютер
            <span className="grid size-8 place-items-center rounded-full bg-[#0d0f0c] text-white">
              <ArrowIcon diagonal />
            </span>
          </a>

          <a
            href="#models"
            aria-label="Посмотреть модели"
            className="grid size-10 place-items-center rounded-full border border-black/15 sm:hidden">
            <span className="flex w-4 flex-col gap-1.5">
              <span className="h-px w-4 bg-current" />
              <span className="h-px w-4 bg-current" />
            </span>
          </a>
        </header>

        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-5 pb-8 pt-8 sm:px-8 sm:pb-12 sm:pt-12 lg:min-h-[830px] lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16 lg:px-12 lg:pb-16 lg:pt-8">
          <div className="relative z-10 min-w-0">
            <p className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black/55 sm:mb-7 sm:text-[11px]">
              <span className="size-2 rounded-full bg-[#c8ff37] ring-4 ring-[#c8ff37]/25" />
              Кастомные компьютеры · Алматы
            </p>

            <h1 className="max-w-[8.8ch] text-[clamp(3rem,13.5vw,6.9rem)] font-semibold uppercase leading-[0.83] tracking-[-0.075em] lg:text-[112px]">
              Твой ПК. <span className="block text-black/28">Без рамок.</span>
            </h1>

            <p className="mt-7 max-w-[33ch] text-[15px] leading-relaxed text-black/55 sm:mt-9 sm:text-base lg:text-[17px]">
              Собираем мощные и тихие системы под твои задачи. Честно подбираем детали, аккуратно
              собираем, три года остаёмся на связи.
            </p>

            <div className="mt-8 sm:mt-10">
              <PrimaryLink href="#models">Выбрать свой PULSE</PrimaryLink>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-black/15 pt-5 sm:max-w-[460px]">
              <div>
                <strong className="block text-lg font-semibold tracking-[-0.04em]">3 года</strong>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-black/45">
                  гарантии
                </span>
              </div>
              <div>
                <strong className="block text-lg font-semibold tracking-[-0.04em]">48 часов</strong>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-black/45">
                  на сборку
                </span>
              </div>
            </div>
          </div>

          <div className="relative mt-2 lg:mt-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] bg-[#deddd6] sm:rounded-[40px] lg:max-h-[700px]">
              <Image
                src="/pulse/hero-pc.png"
                alt="Премиальный компьютер PULSE в графитовом корпусе"
                fill
                preload
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-[#0d0f0c]/92 p-3 pl-4 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-4 sm:pl-5">
                <span className="text-[10px] font-semibold uppercase leading-relaxed tracking-[0.12em]">
                  Тихий под нагрузкой
                  <br />
                  <b className="font-normal text-white/45">от 29 dB</b>
                </span>
                <span className="grid size-10 place-items-center rounded-full bg-[#c8ff37] text-[#0d0f0c]">
                  <ArrowIcon diagonal />
                </span>
              </div>
            </div>
            <div className="absolute -right-3 top-8 grid size-[86px] rotate-6 place-items-center rounded-full bg-[#c8ff37] text-center text-[9px] font-black uppercase leading-tight tracking-[0.12em] text-[#0d0f0c] sm:-left-7 sm:right-auto sm:size-[104px] lg:-left-10">
              Собрано
              <br />
              вручную
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0d0f0c] text-white">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-y divide-white/10 px-5 sm:grid-cols-4 sm:divide-y-0 sm:px-8 lg:px-12">
          {[
            ['500+', 'собранных систем'],
            ['4.9', 'средняя оценка'],
            ['72 ч', 'стресс-тест'],
            ['24/7', 'онлайн-поддержка'],
          ].map(([value, label]) => (
            <div className="min-h-36 px-4 py-7 first:pl-0 sm:min-h-44 sm:px-6 sm:py-10" key={label}>
              <strong className="block text-[34px] font-medium tracking-[-0.06em] sm:text-5xl">
                {value}
              </strong>
              <span className="mt-8 block max-w-[15ch] text-[9px] uppercase leading-snug tracking-[0.14em] text-white/42 sm:mt-12 sm:text-[10px]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="models" className="bg-[#e9e8e2] py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black/50">
              <span className="size-1.5 rounded-full bg-black" />
              Готовые конфигурации
            </p>
            <div>
              <h2 className="max-w-[10ch] text-[clamp(3.2rem,14vw,7rem)] font-semibold uppercase leading-[0.84] tracking-[-0.075em]">
                Выбери свой <span className="text-black/25">ритм.</span>
              </h2>
              <p className="mt-7 max-w-[43ch] text-sm leading-relaxed text-black/50 sm:text-base">
                Три проверенные основы. Любую адаптируем под бюджет, любимые игры и рабочие
                программы.
              </p>
            </div>
          </div>

          <div className="mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-16 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
            {builds.map((build) => {
              const isGreen = build.tone === 'green';
              const isDark = build.tone === 'dark';

              return (
                <article
                  key={build.name}
                  className={`flex min-h-[520px] w-[86vw] max-w-[390px] shrink-0 snap-center flex-col justify-between rounded-[26px] p-5 sm:w-auto sm:max-w-none sm:p-6 lg:min-h-[560px] lg:rounded-[30px] lg:p-7 ${
                    isGreen
                      ? 'bg-[#c8ff37] text-[#0d0f0c]'
                      : isDark
                        ? 'bg-[#0d0f0c] text-white'
                        : 'bg-[#f8f7f2] text-[#0d0f0c]'
                  }`}>
                  <div>
                    <div
                      className={`flex items-center justify-between border-b pb-5 text-[9px] font-bold uppercase tracking-[0.14em] ${
                        isDark ? 'border-white/15 text-white/50' : 'border-black/15 text-black/50'
                      }`}>
                      <span>{build.index}</span>
                      <span>{build.label}</span>
                    </div>

                    <h3 className="mt-8 text-[52px] font-semibold leading-none tracking-[-0.07em]">
                      {build.name}
                    </h3>
                    <p
                      className={`mt-4 max-w-[29ch] text-[13px] leading-relaxed ${
                        isDark ? 'text-white/50' : 'text-black/55'
                      }`}>
                      {build.description}
                    </p>

                    <ul className="mt-8 space-y-3" aria-label={`Характеристики ${build.name}`}>
                      {build.specs.map((spec) => (
                        <li
                          className={`flex items-center gap-3 text-[12px] ${
                            isDark ? 'text-white/72' : 'text-black/70'
                          }`}
                          key={spec}>
                          <span
                            className={`grid size-5 place-items-center rounded-full ${
                              isDark ? 'bg-white/10 text-[#c8ff37]' : 'bg-black/8 text-black'
                            }`}>
                            <CheckIcon />
                          </span>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className={`text-[9px] uppercase tracking-[0.14em] ${isDark ? 'text-white/40' : 'text-black/45'}`}>
                      стоимость от
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <strong className="text-[27px] font-semibold tracking-[-0.05em]">
                        {build.price}
                      </strong>
                      <a
                        href="#contact"
                        aria-label={`Выбрать конфигурацию ${build.name}`}
                        className={`grid size-12 shrink-0 place-items-center rounded-full transition-transform hover:rotate-6 ${
                          isGreen
                            ? 'bg-[#0d0f0c] text-white'
                            : isDark
                              ? 'bg-[#c8ff37] text-[#0d0f0c]'
                              : 'bg-[#0d0f0c] text-white'
                        }`}>
                        <ArrowIcon diagonal />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-2 text-center text-[9px] uppercase tracking-[0.14em] text-black/35 sm:hidden">
            Листай, чтобы сравнить →
          </p>
        </div>
      </section>

      <section id="approach" className="bg-[#f5f4ef] py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-stretch lg:gap-16">
            <div>
              <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black/50">
                <span className="size-1.5 rounded-full bg-[#c8ff37] ring-4 ring-[#c8ff37]/25" />
                Под капотом
              </p>
              <h2 className="max-w-[9ch] text-[clamp(3.15rem,14vw,6.8rem)] font-semibold uppercase leading-[0.84] tracking-[-0.075em]">
                Собираем как <span className="text-black/25">для себя.</span>
              </h2>
              <p className="mt-7 max-w-[43ch] text-sm leading-relaxed text-black/52 sm:text-base">
                Красивый корпус — только начало. Внутри всё должно быть так же продуманно: поток
                воздуха, кабели, настройки и каждый децибел.
              </p>

              <div className="mt-10 border-t border-black/15 sm:mt-14">
                {steps.map((step) => (
                  <div
                    className="grid grid-cols-[32px_1fr] gap-3 border-b border-black/15 py-6 sm:grid-cols-[48px_170px_1fr] sm:gap-5"
                    key={step.number}>
                    <span className="pt-1 text-[9px] font-semibold text-black/35">{step.number}</span>
                    <h3 className="text-[15px] font-semibold tracking-[-0.025em] sm:text-base">
                      {step.title}
                    </h3>
                    <p className="col-start-2 text-[12px] leading-relaxed text-black/48 sm:col-start-auto">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[510px] overflow-hidden rounded-[28px] bg-[#d9d8d1] sm:min-h-[680px] sm:rounded-[36px] lg:min-h-0">
              <Image
                src="/pulse/assembly.png"
                alt="Специалист PULSE устанавливает видеокарту в компьютер"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
              <div className="absolute left-4 top-4 rounded-full bg-[#c8ff37] px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.14em] text-[#0d0f0c] sm:left-6 sm:top-6">
                Ручная сборка
              </div>
              <div className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-3 rounded-2xl bg-[#0d0f0c]/92 p-4 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
                <div>
                  <strong className="block text-2xl font-medium tracking-[-0.05em]">72 ч</strong>
                  <span className="mt-1 block text-[8px] uppercase tracking-[0.13em] text-white/45">
                    тест стабильности
                  </span>
                </div>
                <div className="border-l border-white/15 pl-4">
                  <strong className="block text-2xl font-medium tracking-[-0.05em]">29 dB</strong>
                  <span className="mt-1 block text-[8px] uppercase tracking-[0.13em] text-white/45">
                    тихая работа
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="bg-[#0d0f0c] py-20 text-white sm:py-28 lg:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 border-b border-white/15 pb-12 lg:grid-cols-[.7fr_1.3fr] lg:pb-20">
            <p className="flex items-center gap-3 self-start text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              <span className="size-1.5 rounded-full bg-[#c8ff37]" />
              После покупки
            </p>
            <h2 className="max-w-[12ch] text-[clamp(3.1rem,13vw,7.2rem)] font-semibold uppercase leading-[0.84] tracking-[-0.075em]">
              Мы рядом, даже когда <span className="text-white/25">всё работает.</span>
            </h2>
          </div>

          <div className="grid gap-px bg-white/15 sm:grid-cols-3">
            {[
              ['01', 'Удалённая помощь', 'Подключимся, настроим драйверы и решим вопрос без поездки в сервис.'],
              ['02', 'Чистка каждый год', 'Первое обслуживание с заменой термоинтерфейсов — за наш счёт.'],
              ['03', 'Апгрейд без риска', 'Проверим совместимость, зачтём старую деталь и аккуратно установим новую.'],
            ].map(([number, title, text]) => (
              <article className="min-h-[230px] bg-[#0d0f0c] px-1 py-8 sm:p-7 lg:min-h-[280px]" key={number}>
                <span className="text-[9px] font-semibold text-[#c8ff37]">{number}</span>
                <h3 className="mt-12 text-xl font-medium tracking-[-0.04em] lg:mt-20 lg:text-2xl">
                  {title}
                </h3>
                <p className="mt-4 max-w-[31ch] text-[12px] leading-relaxed text-white/45">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#c8ff37] text-[#0d0f0c]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[.65fr_1.35fr] lg:px-12 lg:py-28">
          <div className="flex items-start justify-between lg:block">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black/55">
              <span className="size-1.5 rounded-full bg-[#0d0f0c]" />
              Отзыв владельца
            </p>
            <span className="text-sm font-bold tracking-[0.1em]">5.0 ★</span>
          </div>
          <div>
            <blockquote className="max-w-[17ch] text-[clamp(2.4rem,10vw,5.2rem)] font-semibold leading-[0.94] tracking-[-0.065em]">
              «Впервые компьютер выглядит именно так, как работает — безупречно».
            </blockquote>
            <div className="mt-10 flex items-center justify-between border-t border-black/20 pt-5 text-[9px] font-bold uppercase tracking-[0.13em] text-black/60 sm:text-[10px]">
              <span>Александр · PULSE APEX</span>
              <span>6 месяцев вместе</span>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#f5f4ef] py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="rounded-[30px] bg-[#deddd6] px-5 py-10 sm:rounded-[40px] sm:px-10 sm:py-16 lg:grid lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:gap-16 lg:px-14 lg:py-20">
            <div>
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">
                Начнём с разговора
              </p>
              <h2 className="max-w-[11ch] text-[clamp(3.1rem,14vw,7rem)] font-semibold uppercase leading-[0.84] tracking-[-0.075em]">
                Какой ПК нужен тебе?
              </h2>
            </div>
            <div className="mt-8 lg:mt-0">
              <p className="mb-7 max-w-[36ch] text-sm leading-relaxed text-black/52 sm:text-base">
                Ответь на пять коротких вопросов — предложим конфигурацию и честную смету в тот же
                день.
              </p>
              <PrimaryLink href="mailto:hello@pulse-pc.example">Получить конфигурацию</PrimaryLink>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#0d0f0c] text-white">
        <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-16 lg:px-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_.7fr_.7fr]">
            <div>
              <Brand />
              <p className="mt-5 max-w-[28ch] text-xs leading-relaxed text-white/40">
                Компьютеры, которыми хочется пользоваться и на которые хочется смотреть.
              </p>
            </div>
            <div className="text-xs leading-7">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
                Навигация
              </p>
              <a className="block transition-colors hover:text-[#c8ff37]" href="#models">
                Модели
              </a>
              <a className="block transition-colors hover:text-[#c8ff37]" href="#approach">
                Как собираем
              </a>
              <a className="block transition-colors hover:text-[#c8ff37]" href="#support">
                Поддержка
              </a>
            </div>
            <div className="text-xs leading-7">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
                Связаться
              </p>
              <a className="block transition-colors hover:text-[#c8ff37]" href="tel:+77000000000">
                +7 700 000 00 00
              </a>
              <a
                className="block transition-colors hover:text-[#c8ff37]"
                href="mailto:hello@pulse-pc.example">
                hello@pulse-pc.example
              </a>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-5 text-[8px] uppercase tracking-[0.13em] text-white/30 sm:mt-16 sm:text-[9px]">
            <span>© 2026 PULSE</span>
            <a href="#top">Наверх ↑</a>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f5f4ef]/92 p-3 backdrop-blur-xl lg:hidden">
        <a
          href="#contact"
          className="mx-auto flex h-14 w-full max-w-[calc(100vw-24px)] items-center justify-between rounded-full bg-[#c8ff37] pl-5 pr-2 text-[10px] font-black uppercase tracking-[0.13em] text-[#0d0f0c]">
          Собрать мой компьютер
          <span className="grid size-10 place-items-center rounded-full bg-[#0d0f0c] text-white">
            <ArrowIcon diagonal />
          </span>
        </a>
      </div>
    </main>
  );
}

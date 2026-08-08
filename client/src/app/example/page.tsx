import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Север — мужская парикмахерская',
  description: 'Мужские стрижки и оформление бороды в центре Санкт-Петербурга.',
};

const services = [
  { number: '01', name: 'Мужская стрижка', time: '60 мин', price: '2 200 ₽' },
  { number: '02', name: 'Стрижка + борода', time: '90 мин', price: '3 300 ₽' },
  { number: '03', name: 'Оформление бороды', time: '45 мин', price: '1 500 ₽' },
  { number: '04', name: 'Отец + сын', time: '90 мин', price: '3 800 ₽' },
];

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
      <path
        d={diagonal ? 'M3.5 12.5 12 4m0 0H5.8M12 4v6.2' : 'M2.5 8h11m-4-4 4 4-4 4'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function BrandMark() {
  return (
    <span className="relative grid size-10 place-items-center rounded-full border border-current/40">
      <span className="absolute h-5 w-px -rotate-45 bg-current" />
      <span className="absolute h-5 w-px rotate-45 bg-current" />
      <span className="text-[8px] font-bold tracking-[-0.08em]">СВ</span>
    </span>
  );
}

export default function BarberExamplePage() {
  return (
    <main className="overflow-hidden bg-[#eee9df] text-[#171714] selection:bg-[#bcff45] selection:text-[#171714]">
      <section className="relative min-h-[780px] h-[100svh] bg-[#171714] text-[#f4f0e7] sm:min-h-[820px] lg:h-[920px] lg:min-h-0">
        <Image
          src="/barber/hero-source.png"
          alt="Барбер делает мужскую стрижку в студии Север"
          fill
          preload
          sizes="100vw"
          className="object-cover object-[52%_58%] sm:object-[50%_56%] lg:object-[70%_54%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,7,.72)_0%,rgba(10,9,7,.12)_30%,rgba(10,9,7,.05)_51%,rgba(10,9,7,.82)_100%)] lg:bg-[linear-gradient(90deg,rgba(10,9,7,.74)_0%,rgba(10,9,7,.22)_48%,rgba(10,9,7,.22)_100%)]" />

        <header className="absolute inset-x-0 top-0 z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12 lg:py-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Север — на главную">
            <BrandMark />
            <span className="text-[15px] font-semibold tracking-[0.22em]">СЕВЕР</span>
          </a>

          <nav
            className="hidden items-center gap-9 text-[12px] font-medium uppercase tracking-[0.13em] lg:flex"
            aria-label="Основная навигация">
            <a className="transition-opacity hover:opacity-60" href="#services">
              Услуги
            </a>
            <a className="transition-opacity hover:opacity-60" href="#approach">
              Подход
            </a>
            <a className="transition-opacity hover:opacity-60" href="#place">
              Пространство
            </a>
            <a className="transition-opacity hover:opacity-60" href="#contacts">
              Контакты
            </a>
          </nav>

          <a
            href="#services"
            aria-label="Перейти к услугам"
            className="grid size-11 place-items-center rounded-full border border-white/40 transition-colors hover:bg-white hover:text-[#171714] lg:hidden">
            <span className="flex w-4 flex-col gap-1.5">
              <span className="h-px w-4 bg-current" />
              <span className="h-px w-4 bg-current" />
            </span>
          </a>

          <a
            href="#booking"
            className="hidden items-center gap-5 rounded-full bg-[#bcff45] py-2 pl-5 pr-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#171714] transition-transform hover:scale-[1.03] lg:flex">
            Записаться
            <span className="grid size-9 place-items-center rounded-full bg-[#171714] text-white">
              <ArrowIcon diagonal />
            </span>
          </a>
        </header>

        <div
          id="top"
          className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-between px-5 pb-7 pt-28 sm:px-8 sm:pb-9 lg:px-12 lg:pb-12 lg:pt-40">
          <div className="max-w-[820px]">
            <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75 sm:text-xs">
              <span className="inline-block size-1.5 rounded-full bg-[#bcff45]" />
              Барбершоп · Санкт-Петербург
            </p>
            <h1 className="max-w-[11ch] text-[clamp(3.15rem,15vw,6rem)] font-medium uppercase leading-[0.86] tracking-[-0.075em] lg:max-w-[9ch] lg:text-[118px]">
              Хорошая форма. <span className="text-[#bcff45]">Сильный</span> характер.
            </h1>
          </div>

          <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div className="max-w-[540px]">
              <p className="mb-6 max-w-[32ch] text-[15px] leading-relaxed text-white/75 sm:text-base">
                Стрижём без лишнего шума. Подчёркиваем твоё, а не навязываем чужое.
              </p>
              <a
                href="#booking"
                className="flex h-14 w-full items-center justify-between rounded-full bg-[#bcff45] pl-6 pr-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#171714] transition-transform active:scale-[.98] sm:w-[255px]">
                Выбрать время
                <span className="grid size-10 place-items-center rounded-full bg-[#171714] text-white">
                  <ArrowIcon diagonal />
                </span>
              </a>
            </div>

            <div className="flex items-center justify-between border-t border-white/25 pt-4 text-[11px] uppercase tracking-[0.12em] text-white/70 lg:w-[330px]">
              <span>
                Ежедневно
                <br />
                <b className="font-medium text-white">10:00 — 22:00</b>
              </span>
              <span className="text-right">
                Оценка гостей
                <br />
                <b className="font-medium text-white">★ 4.9 · 317 отзывов</b>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="approach"
        className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-[.8fr_2fr] lg:gap-20">
          <p className="flex items-center gap-3 self-start text-[10px] font-semibold uppercase tracking-[0.2em]">
            <span className="size-1.5 rounded-full bg-[#171714]" />
            Наш подход
          </p>
          <div>
            <h2 className="text-[clamp(2.65rem,11vw,5.8rem)] font-medium uppercase leading-[0.91] tracking-[-0.07em]">
              Не меняем тебя. <span className="text-[#8a847a]">Делаем точнее.</span>
            </h2>
            <div className="mt-10 grid gap-6 border-t border-black/20 pt-6 sm:grid-cols-2 lg:mt-16">
              <p className="max-w-[37ch] text-[15px] leading-relaxed text-black/60">
                Сначала слушаем, потом предлагаем. Учитываем привычки, стиль и то, сколько времени
                ты готов тратить на укладку.
              </p>
              <p className="max-w-[37ch] text-[15px] leading-relaxed text-black/60 sm:justify-self-end">
                Работаем спокойно и точно. Объясняем, как повторить результат дома, и не продаём то,
                что тебе не нужно.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-black/15 sm:grid-cols-4 lg:mt-24">
          {[
            ['7+', 'лет опыта мастеров'],
            ['60', 'минут на стрижку'],
            ['14', 'дней гарантия формы'],
            ['100%', 'внимания к деталям'],
          ].map(([value, label]) => (
            <div className="min-h-40 bg-[#e6e0d5] p-5 sm:min-h-48 sm:p-6" key={label}>
              <strong className="block text-4xl font-medium tracking-[-0.06em] sm:text-5xl">
                {value}
              </strong>
              <span className="mt-14 block max-w-[14ch] text-[11px] leading-snug uppercase tracking-[0.1em] text-black/50 sm:mt-20">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="bg-[#171714] text-[#f4f0e7]">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
          <div className="mb-12 flex items-end justify-between border-b border-white/20 pb-6 lg:mb-20">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#bcff45]">
                Услуги и цены
              </p>
              <h2 className="text-[clamp(3.2rem,13vw,7rem)] font-medium uppercase leading-none tracking-[-0.075em]">
                По делу.
              </h2>
            </div>
            <span className="mb-2 hidden text-xs uppercase tracking-[0.12em] text-white/40 sm:block">
              Без скрытых доплат
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
            <div className="order-2 lg:order-1">
              {services.map((service) => (
                <a
                  href="#booking"
                  key={service.number}
                  className="group grid grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-white/20 py-6 transition-colors hover:text-[#bcff45] sm:grid-cols-[38px_1fr_80px_auto] sm:gap-5 sm:py-7">
                  <span className="text-[10px] text-white/35">{service.number}</span>
                  <span className="text-[17px] font-medium tracking-[-0.02em] sm:text-xl">
                    {service.name}
                  </span>
                  <span className="hidden text-xs text-white/40 sm:block">{service.time}</span>
                  <span className="whitespace-nowrap text-[13px] font-medium sm:text-base">
                    {service.price}
                  </span>
                </a>
              ))}
              <p className="mt-6 text-xs leading-relaxed text-white/40">
                Консультация, мытьё головы и укладка уже входят в стоимость.
              </p>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="/barber/beard-service.png"
                  alt="Оформление бороды опасной бритвой"
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.025]"
                />
                <span className="absolute bottom-4 left-4 rounded-full bg-[#bcff45] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#171714]">
                  Точная работа
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#bcff45] text-[#171714]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[.7fr_1.3fr] lg:px-12 lg:py-28">
          <p className="flex items-center gap-3 self-start text-[10px] font-semibold uppercase tracking-[0.2em]">
            <span className="size-1.5 rounded-full bg-[#171714]" />
            Говорят гости
          </p>
          <div>
            <blockquote className="text-[clamp(2.25rem,9vw,5.1rem)] font-medium leading-[.98] tracking-[-0.065em]">
              «Впервые мастер услышал “как обычно”, но сделал лучше, чем обычно».
            </blockquote>
            <div className="mt-10 flex items-center justify-between border-t border-black/25 pt-5 text-xs uppercase tracking-[0.1em]">
              <span>Алексей · постоянный гость</span>
              <span>5.0 ★</span>
            </div>
          </div>
        </div>
      </section>

      <section id="place" className="bg-[#eee9df]">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
          <div className="mb-10 grid gap-7 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/50">
                Пространство
              </p>
              <h2 className="text-[clamp(3.2rem,12vw,7rem)] font-medium uppercase leading-[.88] tracking-[-0.075em]">
                Место,
                <br />
                где тихо.
              </h2>
            </div>
            <p className="max-w-[37ch] text-[15px] leading-relaxed text-black/60 lg:justify-self-end">
              Два кресла, никакой очереди и суеты. Кофе, хорошая музыка и время, которое полностью
              твоё.
            </p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] sm:aspect-[3/2] lg:aspect-[16/8]">
            <Image
              src="/barber/studio-source.png"
              alt="Интерьер барбершопа Север"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-[#171714]/90 px-4 py-4 text-[#f4f0e7] backdrop-blur-md sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[360px] sm:px-5">
              <span className="text-[11px] leading-relaxed uppercase tracking-[0.1em]">
                Панфилова, 56
                <br />
                <b className="font-medium text-white/55">5 минут от метро</b>
              </span>
              <a
                href="https://maps.google.com"
                aria-label="Открыть адрес на карте"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-[#bcff45] text-[#171714]">
                <ArrowIcon diagonal />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="booking" className="bg-[#171714] text-[#f4f0e7]">
        <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-20 sm:px-8 sm:pb-7 sm:pt-28 lg:px-12 lg:pt-36">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#bcff45]">
            Онлайн-запись · 24/7
          </p>
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <h2 className="max-w-[9ch] text-[clamp(3.4rem,14vw,8rem)] font-medium uppercase leading-[.86] tracking-[-0.08em]">
              Пора привести себя в форму.
            </h2>
            <a
              href="tel:+78125554141"
              className="group grid aspect-square w-full place-items-center rounded-full bg-[#bcff45] text-[#171714] transition-transform hover:rotate-3 sm:w-72">
              <span className="flex flex-col items-center gap-4 text-center">
                <span className="text-sm text-black font-semibold uppercase tracking-[0.13em]">
                  Записаться
                </span>
                <span className="grid size-11 place-items-center rounded-full bg-[#171714] text-white transition-transform group-hover:translate-x-1">
                  <ArrowIcon diagonal />
                </span>
              </span>
            </a>
          </div>

          <footer
            id="contacts"
            className="mt-20 grid gap-8 border-t border-white/20 pt-8 text-[11px] leading-relaxed uppercase tracking-[0.1em] text-white/50 sm:grid-cols-3 lg:mt-32">
            <a
              href="tel:+78125554141"
              className="text-base font-medium tracking-normal text-white transition-colors hover:text-[#bcff45]">
              +7 812 555-41-41
            </a>
            <p>
              Алматы
              <br />
              Панфилова, 56
            </p>
            <p className="sm:text-right">
              Ежедневно
              <br />
              10:00 — 22:00
            </p>
          </footer>
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-[9px] uppercase tracking-[0.12em] text-white/30">
            <span>© 2026 Север</span>
            <a href="#top" className="transition-colors hover:text-white">
              Наверх ↑
            </a>
          </div>
        </div>
      </section>

      <a
        href="#booking"
        className="fixed inset-x-4 bottom-4 z-50 flex h-14 items-center justify-between rounded-full bg-[#bcff45] pl-6 pr-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#171714] shadow-[0_12px_40px_rgba(0,0,0,.22)] sm:hidden">
        Записаться
        <span className="grid size-10 place-items-center rounded-full bg-[#171714] text-white">
          <ArrowIcon />
        </span>
      </a>
    </main>
  );
}

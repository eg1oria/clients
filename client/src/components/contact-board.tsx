"use client";

import Link from "next/link";
import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { Company } from "@/lib/companies";

type ContactChannel = "whatsapp" | "telegram";

type ContactBoardProps = {
  companies: Company[];
  datasetId: string;
  eyebrow: string;
  title: string;
};

const messageTemplates = [
  (name: string) =>
    `Здравствуйте! Посмотрел информацию о компании «${name}» и хотел предложить разработку современного сайта-лендинга. Он поможет понятно представить ваши услуги, повысить доверие клиентов и превращать больше посетителей из поиска и соцсетей в обращения. Могу показать, как такой сайт может выглядеть именно для вашего бизнеса. Интересно обсудить?`,
  (name: string) =>
    `Добрый день! Увидел компанию «${name}». Для вашего бизнеса можно сделать быстрый и удобный лендинг, где клиент сразу поймёт ваши преимущества и сможет оставить заявку или связаться в один клик. Такой сайт хорошо работает на телефонах и помогает не терять заинтересованных клиентов. Хотите, предложу концепцию?`,
  (name: string) =>
    `Здравствуйте! Есть идея для компании «${name}»: аккуратный одностраничный сайт, который соберёт услуги, преимущества и контакты в одном месте. Лендинг укрепляет доверие к бизнесу и помогает получать больше целевых обращений без лишних шагов для клиента. Могу бесплатно набросать структуру и обсудить детали.`,
  (name: string) =>
    `Добрый день! Предлагаю создать для «${name}» современный лендинг. Он будет быстро загружаться, удобно смотреться со смартфона и вести посетителя прямо к заявке. Для бизнеса это дополнительный канал продаж, понятная презентация услуг и более профессиональный образ в интернете. Было бы интересно узнать подробности?`,
  (name: string) =>
    `Здравствуйте! Обратил внимание на «${name}» и хочу предложить сайт-лендинг под ваш бизнес. На нём можно коротко показать, почему клиенту стоит выбрать вас, ответить на основные вопросы и добавить удобные кнопки связи. Это помогает повысить доверие и получать обращения круглосуточно. Могу предложить вариант структуры без обязательств.`,
];

const storageEventName = "leadlist:storage";

function getRandomMessage(companyName: string) {
  const template =
    messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
  return template(companyName);
}

function safeStoredIds(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function addMessageToLink(
  source: string,
  channel: ContactChannel,
  message: string,
) {
  if (channel === "whatsapp") {
    const phone = source.match(/(?:wa\.me\/|phone=)(\d+)/i)?.[1] ??
      source.replace(/\D/g, "");
    const params = new URLSearchParams({ phone, text: message });

    return `whatsapp://send?${params.toString()}`;
  }

  const fallbackHost = "t.me";
  const trimmed = source.trim();
  const normalized = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${fallbackHost}/${trimmed.replace(/^\/+/, "")}`;

  try {
    const url = new URL(normalized);
    url.searchParams.set("text", message);
    return url.toString();
  } catch {
    return normalized;
  }
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a9.7 9.7 0 0 0-8.4 14.55L2.2 21.8l5.38-1.41A9.75 9.75 0 1 0 12 2Zm0 17.75a8 8 0 0 1-4.08-1.11l-.3-.18-3.2.84.86-3.12-.2-.32A8.05 8.05 0 1 1 12 19.75Zm4.42-6.03c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2a7.3 7.3 0 0 1-1.34-1.67c-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.67 3.36 2.9 10.2c-1.21.49-1.2 1.16-.22 1.46l4.56 1.42 1.75 5.36c.21.59.11.82.72.82.47 0 .68-.22.94-.47l2.19-2.13 4.55 3.36c.84.46 1.44.22 1.65-.78l2.99-14.09c.3-1.22-.47-1.78-1.36-1.39ZM8 12.75l10.27-6.48c.51-.31.97-.14.59.2l-8.31 7.5-.32 3.39L8 12.75Z"
      />
    </svg>
  );
}

export function ContactBoard({
  companies,
  datasetId,
  eyebrow,
  title,
}: ContactBoardProps) {
  const storageKey = `leadlist:processed:v1:${datasetId}`;
  const [sessionProcessed, setSessionProcessed] = useState<Set<string>>(
    () => new Set(),
  );
  const [lastRemoved, setLastRemoved] = useState<Company | null>(null);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const onStorage = (event: StorageEvent) => {
        if (event.key === storageKey) onStoreChange();
      };
      const onLocalStorage = (event: Event) => {
        if ((event as CustomEvent<string>).detail === storageKey) {
          onStoreChange();
        }
      };

      window.addEventListener("storage", onStorage);
      window.addEventListener(storageEventName, onLocalStorage);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(storageEventName, onLocalStorage);
      };
    },
    [storageKey],
  );

  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(storageKey) ?? "[]";
    } catch {
      return "[]";
    }
  }, [storageKey]);

  const getServerSnapshot = useCallback(() => "[]", []);
  const storedSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const storedProcessed = useMemo(
    () => new Set(safeStoredIds(storedSnapshot)),
    [storedSnapshot],
  );
  const processed = useMemo(
    () => new Set([...storedProcessed, ...sessionProcessed]),
    [sessionProcessed, storedProcessed],
  );
  const visibleCompanies = companies.filter(
    (company) => !processed.has(company.id),
  );
  const processedCount = companies.length - visibleCompanies.length;
  const progress = companies.length
    ? Math.round((processedCount / companies.length) * 100)
    : 0;

  const persist = useCallback(
    (ids: Set<string>) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify([...ids]));
        window.dispatchEvent(
          new CustomEvent(storageEventName, { detail: storageKey }),
        );
      } catch {
        // Session state still keeps the interface usable if storage is blocked.
      }
    },
    [storageKey],
  );

  const contact = (company: Company, channel: ContactChannel, url: string) => {
    const target = addMessageToLink(
      url,
      channel,
      getRandomMessage(company.name),
    );

    const nextSession = new Set(sessionProcessed).add(company.id);
    const nextStored = new Set(storedProcessed).add(company.id);
    setSessionProcessed(nextSession);
    setLastRemoved(company);
    persist(nextStored);

    if (channel === "whatsapp") {
      window.location.assign(target);
    } else {
      window.open(target, "_blank", "noopener,noreferrer");
    }
  };

  const undo = () => {
    if (!lastRemoved) return;

    const nextSession = new Set(sessionProcessed);
    const nextStored = new Set(storedProcessed);
    nextSession.delete(lastRemoved.id);
    nextStored.delete(lastRemoved.id);
    setSessionProcessed(nextSession);
    persist(nextStored);
    setLastRemoved(null);
  };

  const reset = () => {
    setSessionProcessed(new Set());
    setLastRemoved(null);
    persist(new Set());
  };

  return (
    <main className="board-shell">
      <nav className="board-nav" aria-label="Навигация">
        <Link href="/" className="brand-link" aria-label="На главную">
          <span className="brand-mark" aria-hidden="true">
            L
          </span>
          <span>Лидлист</span>
        </Link>
        <Link href="/" className="back-link">
          Все списки
        </Link>
      </nav>

      <header className="board-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="board-description">
            Выберите мессенджер — готовое предложение подставится автоматически,
            а компания исчезнет из списка.
          </p>
        </div>

        <div className="progress-panel" aria-label="Прогресс обработки">
          <div className="progress-copy">
            <span>Обработано</span>
            <strong>
              {processedCount} / {companies.length}
            </strong>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          {processedCount > 0 && (
            <button type="button" className="reset-button" onClick={reset}>
              Вернуть все карточки
            </button>
          )}
        </div>
      </header>

      {visibleCompanies.length > 0 ? (
        <section className="company-grid" aria-label="Компании">
          {visibleCompanies.map((company) => (
            <article className="company-card" key={company.id}>
              <h2>{company.name}</h2>
              <div className="contact-actions">
                {company.whatsapp && (
                  <button
                    type="button"
                    className="contact-button whatsapp-button"
                    onClick={() =>
                      contact(company, "whatsapp", company.whatsapp!)
                    }
                    aria-label={`Написать ${company.name} в WhatsApp`}
                  >
                    <WhatsAppIcon />
                    <span>WhatsApp</span>
                  </button>
                )}
                {company.telegram && (
                  <button
                    type="button"
                    className="contact-button telegram-button"
                    onClick={() =>
                      contact(company, "telegram", company.telegram!)
                    }
                    aria-label={`Написать ${company.name} в Telegram`}
                  >
                    <TelegramIcon />
                    <span>Telegram</span>
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <span className="empty-check" aria-hidden="true">
            ✓
          </span>
          <h2>Список обработан</h2>
          <p>Все компании из этой базы уже открыты в мессенджере.</p>
          <button type="button" className="primary-button" onClick={reset}>
            Начать заново
          </button>
        </section>
      )}

      {lastRemoved && (
        <aside className="undo-toast" aria-live="polite">
          <span>
            <strong>{lastRemoved.name}</strong> убрана из списка
          </span>
          <button type="button" onClick={undo}>
            Вернуть
          </button>
        </aside>
      )}
    </main>
  );
}

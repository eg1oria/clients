'use client';

import { FormEvent, useId, useState } from 'react';
import {
  LandingLead,
  LeadSegment,
  submitPrimerkaLead,
} from '@/lib/primerka/lead-service';
import styles from './landing.module.css';

type SegmentContent = {
  number: string;
  title: string;
  result: string;
  successLabel: string;
};

const SEGMENTS: Record<LeadSegment, SegmentContent> = {
  basic_wardrobe: {
    number: '01',
    title: 'Собрать базовый гардероб',
    result: 'Начнём с диагностики вашего базового гардероба.',
    successLabel: 'Базовый гардероб',
  },
  personal_style: {
    number: '02',
    title: 'Разобраться со своим стилем',
    result: 'Начнём с визуального направления и ваших реальных сценариев жизни.',
    successLabel: 'Персональный стиль',
  },
  personal_consultation: {
    number: '03',
    title: 'Получить персональный разбор',
    result: 'Лучший следующий шаг — персональный разбор со стилистом.',
    successLabel: 'Персональный разбор',
  },
};

type FormErrors = Partial<Record<'name' | 'contact' | 'consent', string>>;

function validateContact(contact: string) {
  const normalized = contact.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  const isMessenger = /^@[a-zA-Z0-9_.]{4,}$/.test(normalized);
  const isPhone = normalized.replace(/\D/g, '').length >= 10;
  return isEmail || isMessenger || isPhone;
}

export function LeadCapture() {
  const [segment, setSegment] = useState<LeadSegment | null>(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedLead, setSubmittedLead] = useState<LandingLead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameId = useId();
  const contactId = useId();
  const consentId = useId();

  function selectSegment(nextSegment: LeadSegment) {
    setSegment(nextSegment);
    setSubmittedLead(null);
    setErrors({});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!segment) return;

    const nextErrors: FormErrors = {};
    if (name.trim().length < 2) {
      nextErrors.name = 'Укажите имя — хотя бы 2 символа.';
    }
    if (!validateContact(contact)) {
      nextErrors.contact = 'Укажите email, телефон или ник, начиная с @.';
    }
    if (!consent) {
      nextErrors.consent = 'Нужно согласие на обработку данных.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const lead: LandingLead = {
      name: name.trim(),
      contact: contact.trim(),
      source: 'landing',
      segment,
      funnelStage: 'lead_magnet',
      product: '7_wardrobe_mistakes',
    };

    setIsSubmitting(true);
    try {
      const result = await submitPrimerkaLead(lead);
      setSubmittedLead(result.lead);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className={`${styles.segmentSection} ${styles.sectionSpace}`}
      id="diagnostic"
      aria-labelledby="diagnostic-title"
    >
      <div className={styles.container}>
        <div className={styles.segmentIntro}>
          <p className={styles.eyebrow}>Короткая диагностика</p>
          <h2 id="diagnostic-title">С чего вы хотите начать?</h2>
          <p>Один вопрос поможет подобрать наиболее полезный следующий шаг.</p>
        </div>

        <fieldset className={styles.segmentOptions}>
          <legend className={styles.srOnly}>Выберите задачу</legend>
          {(Object.entries(SEGMENTS) as [LeadSegment, SegmentContent][]).map(
            ([key, item]) => {
              const isSelected = segment === key;
              return (
                <button
                  className={styles.segmentOption}
                  type="button"
                  key={key}
                  aria-pressed={isSelected}
                  onClick={() => selectSegment(key)}
                >
                  <span>{item.number}</span>
                  <strong>{item.title}</strong>
                  <i aria-hidden="true">{isSelected ? '✓' : '↗'}</i>
                </button>
              );
            },
          )}
        </fieldset>

        {segment ? (
          <div className={styles.leadPanel} aria-live="polite">
            {submittedLead ? (
              <div className={styles.successState}>
                <span className={styles.successMark} aria-hidden="true">✓</span>
                <p className={styles.eyebrow}>Диагностика завершена</p>
                <h3>Готово.<br />Мы определили ваш следующий шаг.</h3>
                <dl>
                  <div>
                    <dt>Ваше направление</dt>
                    <dd>{SEGMENTS[submittedLead.segment].successLabel}</dd>
                  </div>
                  <div>
                    <dt>Материал</dt>
                    <dd>«7 ошибок базового гардероба»</dd>
                  </div>
                </dl>
                <a
                  className={styles.primaryButton}
                  href="/primerka/7-oshibok-bazovogo-garderoba.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Перейти к получению материала
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            ) : (
              <>
                <div className={styles.leadPanelCopy}>
                  <p className={styles.eyebrow}>Ваш следующий шаг</p>
                  <h3>{SEGMENTS[segment].result}</h3>
                  <p>
                    Оставьте контакт — отправим мини-гайд и сохраним выбранное
                    направление для следующих рекомендаций.
                  </p>
                </div>

                <form className={styles.leadForm} onSubmit={handleSubmit} noValidate>
                  <div className={styles.field}>
                    <label htmlFor={nameId}>Имя</label>
                    <input
                      id={nameId}
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? `${nameId}-error` : undefined}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Как к вам обращаться"
                    />
                    {errors.name ? <span id={`${nameId}-error`} role="alert">{errors.name}</span> : null}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor={contactId}>Email или другой контакт</label>
                    <input
                      id={contactId}
                      name="contact"
                      type="text"
                      autoComplete="email"
                      value={contact}
                      aria-invalid={Boolean(errors.contact)}
                      aria-describedby={errors.contact ? `${contactId}-error` : undefined}
                      onChange={(event) => setContact(event.target.value)}
                      placeholder="mail@example.com или @username"
                    />
                    {errors.contact ? <span id={`${contactId}-error`} role="alert">{errors.contact}</span> : null}
                  </div>

                  <div className={styles.consentRow}>
                    <input
                      id={consentId}
                      type="checkbox"
                      checked={consent}
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? `${consentId}-error` : undefined}
                      onChange={(event) => setConsent(event.target.checked)}
                    />
                    <label htmlFor={consentId}>
                      Я согласна на обработку данных и получение материала.
                    </label>
                  </div>
                  {errors.consent ? <span className={styles.consentError} id={`${consentId}-error`} role="alert">{errors.consent}</span> : null}

                  <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Отправляем…' : 'Получить гайд'}
                    <span aria-hidden="true">↗</span>
                  </button>
                </form>
              </>
            )}
          </div>
        ) : (
          <p className={styles.selectionHint} aria-live="polite">
            Выберите один вариант — ниже появится форма получения гайда.
          </p>
        )}
      </div>
    </section>
  );
}

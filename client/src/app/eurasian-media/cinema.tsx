"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./page.module.css";

export type Scene = {
  image: StaticImageData;
  genre: string;
  title: string;
  logline: string;
  /** object-position кадра — куда смотреть при обрезке на узких экранах */
  focus: string;
  /** Шторка, которой кадр открывается поверх предыдущего */
  transition?: "slit" | "rise" | "window";
};

// Таймлайн в «единицах» скролла (1 единица = 1 высота экрана)
const INTRO = 1;
const HOLD = 0.6;
const TRANS = 1.1;
const TAIL = 0.7;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const pad = (value: number) => String(Math.floor(value)).padStart(2, "0");

/** Начало перехода к сцене i (i ≥ 1) */
const transStart = (i: number) => INTRO + HOLD + (i - 1) * (HOLD + TRANS);
/** Середина «паузы» на сцене i — сюда скроллим по клику в навигации */
const holdMiddle = (i: number) => (i === 0 ? INTRO + HOLD / 2 : transStart(i) + TRANS + HOLD / 2);

export function Cinema({ scenes, className = "" }: { scenes: Scene[]; className?: string }) {
  const stageRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const count = scenes.length;
  const units = INTRO + (count - 1) * (HOLD + TRANS) + HOLD + TAIL;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const frames = Array.from(stage.querySelectorAll<HTMLElement>("[data-frame]"));
    const captions = Array.from(stage.querySelectorAll<HTMLElement>("[data-caption]"));
    let raf = 0;
    let current = -1;

    const update = () => {
      raf = 0;
      const distance = stage.offsetHeight - window.innerHeight;
      const progress = clamp01(-stage.getBoundingClientRect().top / distance);
      const u = progress * units;

      const intro = clamp01(u / INTRO);
      // t — насколько кадр открылся, 0..1
      const enter = scenes.map((_, i) => (i === 0 ? intro : clamp01((u - transStart(i)) / TRANS)));
      let sceneValue = 0;

      frames.forEach((frame, i) => {
        const lifeStart = i === 0 ? 0 : transStart(i);
        const lifeEnd = i === count - 1 ? units : transStart(i + 1) + TRANS;

        frame.style.setProperty("--t", enter[i].toFixed(4));
        frame.style.setProperty("--e", (enter[i + 1] ?? 0).toFixed(4));
        frame.style.setProperty("--k", clamp01((u - lifeStart) / (lifeEnd - lifeStart)).toFixed(4));
        if (i > 0) sceneValue += enter[i];
      });

      captions.forEach((caption, i) => {
        const show = i === 0 ? clamp01((intro - 0.55) / 0.45) : clamp01((enter[i] - 0.45) / 0.55);
        const hide = clamp01((enter[i + 1] ?? 0) / 0.45);
        caption.style.setProperty("--in", show.toFixed(4));
        caption.style.setProperty("--out", hide.toFixed(4));
      });

      stage.style.setProperty("--intro", intro.toFixed(4));
      stage.style.setProperty("--scene", sceneValue.toFixed(4));

      const next = Math.min(count - 1, Math.round(sceneValue));
      if (next !== current) {
        current = next;
        setActive(next);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [scenes, count, units]);

  const jumpTo = (i: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const distance = stage.offsetHeight - window.innerHeight;
    const top =
      stage.getBoundingClientRect().top + window.scrollY + (holdMiddle(i) / units) * distance;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <main className={`${styles.page} ${className}`}>
      <section
        ref={stageRef}
        className={styles.stage}
        style={{ "--units": units } as CSSProperties}
        aria-label="Проекты Eurasian Media"
      >
        <div className={styles.viewport}>
          {scenes.map((scene, i) => (
            <div
              key={scene.title}
              data-frame
              className={`${styles.frame} ${scene.transition ? styles[scene.transition] : ""}`}
              style={{ zIndex: i + 1 }}
            >
              <div className={styles.frameMedia}>
                <Image
                  src={scene.image}
                  alt={`${scene.genre} «${scene.title}»`}
                  fill
                  sizes="100vw"
                  placeholder="blur"
                  preload={i === 0}
                  loading={i === 0 ? undefined : "eager"}
                  className={styles.frameImage}
                  style={{ objectPosition: scene.focus }}
                />
              </div>
            </div>
          ))}

          <div className={styles.shade} aria-hidden="true" />

          {scenes.map((scene, i) => (
            <article
              key={scene.title}
              data-caption
              className={styles.caption}
              aria-hidden={i !== active}
            >
              <p className={styles.meta}>{scene.genre}</p>
              <SplitTitle text={scene.title} />
              <p className={styles.logline}>{scene.logline}</p>
            </article>
          ))}

          <div className={styles.intro}>
            <div className={styles.barTop} aria-hidden="true" />
            <div className={styles.barBottom} aria-hidden="true" />
            <div className={styles.wordmark}>
              <h1>
                <LoadLine text="Eurasian Media" />
              </h1>
              <p className={styles.tagline}>Истории, рождённые между Европой и Азией</p>
            </div>
            <span className={styles.hint} aria-hidden="true" />
          </div>

          <header className={styles.top}>
            <span className={styles.logo}>Eurasian Media</span>
            <span className={styles.counter} aria-hidden="true">
              <span className={styles.counterMask}>
                <span className={styles.counterStrip}>
                  {scenes.map((scene, i) => (
                    <span key={scene.title}>{pad(i + 1)}</span>
                  ))}
                </span>
              </span>
              <span className={styles.counterTotal}>/ {pad(count)}</span>
            </span>
          </header>

          <nav className={styles.dots} aria-label="Сцены">
            {scenes.map((scene, i) => (
              <button
                key={scene.title}
                type="button"
                aria-current={i === active ? "true" : undefined}
                aria-label={`Сцена ${i + 1}: ${scene.title}`}
                onClick={() => jumpTo(i)}
              />
            ))}
          </nav>
        </div>
      </section>

      <Outro onReplay={() => jumpTo(0)} />
    </main>
  );
}

/** Название по буквам: каждая буква выезжает из маски со сдвигом по скроллу */
function SplitTitle({ text }: { text: string }) {
  const words = text.split(" ");
  const total = text.replace(/ /g, "").length;
  let index = 0;

  return (
    <h2 className={styles.title} aria-label={text} style={{ "--n": total } as CSSProperties}>
      {words.map((word, w) => (
        <span key={w} className={styles.word} aria-hidden="true">
          {Array.from(word).map((char) => {
            const i = index++;
            return (
              <span key={i} className={styles.char} style={{ "--i": i } as CSSProperties}>
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

/** Строка вордмарка, которая проявляется по буквам при загрузке */
function LoadLine({ text }: { text: string }) {
  return (
    <span className={styles.loadLine} aria-label={text}>
      {Array.from(text).map((char, i) => (
        <span key={i} aria-hidden="true" style={{ "--i": i } as CSSProperties}>
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

function Outro({ onReplay }: { onReplay: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`${styles.outro} ${visible ? styles.outroVisible : ""}`}>
      <h2 className={styles.manifest}>
        Каждый кадр — <em>это выбор.</em>
      </h2>
      <p className={styles.outroText}>
        Мы рассказываем истории о людях Центральной Азии — честные, смешные, тревожные и живые.
      </p>
      <div className={styles.actions}>
        <a href="mailto:">Обсудить проект →</a>
        <button type="button" onClick={onReplay}>
          Смотреть снова
        </button>
      </div>
      <footer className={styles.footer}>
        <span>© Eurasian Media</span>
        <span>Кино · Сериалы</span>
      </footer>
    </section>
  );
}

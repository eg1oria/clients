import type { Metadata } from "next";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контактная информация",
};

export default function MePage() {
  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />

      <section className={styles.message} aria-label="Контактная информация">
        <span className={styles.label}>На связи</span>
        <p>
          Кворк блокирует аккаунт, если обменяться контактами, но ссылки вроде
          отправлять можно. Мой номер —{" "}
          <a className={styles.contact} href="tel:+77054424389">
            87054424389
          </a>
          , тг —{" "}
          <a
            className={styles.contact}
            href="https://t.me/eg1oria"
            rel="noreferrer"
            target="_blank"
          >
            eg1oria
          </a>
          .
        </p>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { Cormorant_Garamond, Unbounded } from "next/font/google";
import { Cinema, type Scene } from "./cinema";
import frameDrama from "./1.webp";
import frameComedy from "./2.webp";
import frameSport from "./3.png";
import frameThriller from "./4.webp";

const display = Unbounded({
  variable: "--font-display",
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400"],
});

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["cyrillic", "latin"],
  weight: ["400"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "Eurasian Media — истории, рождённые между Европой и Азией",
  description:
    "Кино и сериалы о людях Центральной Азии: драмы, комедии, спорт и триллеры.",
};

// Тексты-заглушки: замените названия и логлайны на реальные проекты.
const scenes: Scene[] = [
  {
    image: frameDrama,
    genre: "Драма",
    title: "Красное",
    logline: "Двое, которым больше некуда бежать, кроме как друг к другу.",
    focus: "68% 40%",
  },
  {
    image: frameComedy,
    genre: "Комедия",
    title: "Три друга",
    logline: "Дружба, которую не сломать даже собственными планами.",
    focus: "50% 35%",
    transition: "slit",
  },
  {
    image: frameSport,
    genre: "Спортивная драма",
    title: "Намыс",
    logline: "Честь не выигрывают. Её отстаивают.",
    focus: "70% 30%",
    transition: "rise",
  },
  {
    image: frameThriller,
    genre: "Триллер",
    title: "Под ковром",
    logline: "Некоторые семейные тайны прячут слишком хорошо.",
    focus: "62% 40%",
    transition: "window",
  },
];

export default function EurasianMediaPage() {
  return <Cinema scenes={scenes} className={`${display.variable} ${serif.variable}`} />;
}

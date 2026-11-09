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

const DEFAULT_BRAND = "Eurasian Media";

/** Название бренда можно подменить ссылкой: /eurasian-media?name=Qazaq Film */
async function readBrand(searchParams: PageProps<"/eurasian-media">["searchParams"]) {
  const { name } = await searchParams;
  const value = (Array.isArray(name) ? name[0] : name)?.trim().replace(/\s+/g, " ").slice(0, 40);
  return value || DEFAULT_BRAND;
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/eurasian-media">): Promise<Metadata> {
  const brand = await readBrand(searchParams);
  return {
    title: `${brand} — истории, рождённые между Европой и Азией`,
    description: "Кино и сериалы о людях Центральной Азии: драмы, комедии, спорт и триллеры.",
  };
}

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

export default async function EurasianMediaPage({ searchParams }: PageProps<"/eurasian-media">) {
  const brand = await readBrand(searchParams);
  return (
    <Cinema brand={brand} scenes={scenes} className={`${display.variable} ${serif.variable}`} />
  );
}

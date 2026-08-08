import type { Metadata } from "next";
import { ContactBoard } from "@/components/contact-board";
import { getCompanies } from "@/lib/companies";

export const metadata: Metadata = {
  title: "Недвижимость Астрахани — Лидлист",
};

export default function RealEstateCompaniesPage() {
  return (
    <ContactBoard
      companies={getCompanies("ned-astr")}
      datasetId="ned-astr"
      eyebrow="Астрахань · Недвижимость"
      title="Агентства недвижимости"
    />
  );
}

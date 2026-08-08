import type { Metadata } from "next";
import { ContactBoard } from "@/components/contact-board";
import { getCompanies } from "@/lib/companies";

export const metadata: Metadata = {
  title: "Мебель алматы — Лидлист",
};

export default function FurnitureCompaniesPage() {
  return (
    <ContactBoard
      companies={getCompanies("meb-al")}
      datasetId="meb-al"
      eyebrow="Алматы · Мебель"
      title="Магазины мебели"
    />
  );
}

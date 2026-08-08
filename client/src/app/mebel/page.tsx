import type { Metadata } from "next";
import { ContactBoard } from "@/components/contact-board";
import { getCompanies } from "@/lib/companies";

export const metadata: Metadata = {
  title: "Мебель Астаны — Лидлист",
};

export default function FurnitureCompaniesPage() {
  return (
    <ContactBoard
      companies={getCompanies("mebel")}
      datasetId="mebel"
      eyebrow="Астана · Мебель"
      title="Магазины мебели"
    />
  );
}

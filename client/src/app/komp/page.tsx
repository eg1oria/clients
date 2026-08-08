import type { Metadata } from "next";
import { ContactBoard } from "@/components/contact-board";
import { getCompanies } from "@/lib/companies";

export const metadata: Metadata = {
  title: "Компьютерные компании — Лидлист",
};

export default function ComputerCompaniesPage() {
  return (
    <ContactBoard
      companies={getCompanies("komp")}
      datasetId="komp"
      eyebrow="Алматы · Компьютеры и сервис"
      title="Компьютерные компании"
    />
  );
}

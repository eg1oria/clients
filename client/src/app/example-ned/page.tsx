import type { Metadata } from "next";
import { ArcaLanding } from "./sections";

export const metadata: Metadata = {
  metadataBase: new URL("https://arca-estates.com"),
  title: "ARCA — Exceptional homes across Germany",
  description:
    "A private real estate advisory for architecturally significant homes in Berlin, Hamburg and Munich.",
  openGraph: {
    title: "ARCA — Exceptional homes. Enduring places.",
    description:
      "Private real estate advisory for architecturally significant homes.",
    images: ["/example-ned/hero-lake-house.jpg"],
  },
};

export default function ExampleNedPage() {
  return <ArcaLanding />;
}

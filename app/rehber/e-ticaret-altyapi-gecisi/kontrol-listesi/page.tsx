import "@/styles/hakkimizda.css";
import "@/styles/kontrol-listesi.css";
import "@/styles/ortak.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

export const metadata = legacyMetadata("kontrol-listesi");
export const viewport = legacyViewport("kontrol-listesi");

export default function Page() {
  return <LegacyPage slug="kontrol-listesi" />;
}

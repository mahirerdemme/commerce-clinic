import "@/styles/ornek-rapor.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

export const metadata = legacyMetadata("ornek-rapor");
export const viewport = legacyViewport("ornek-rapor");

export default function Page() {
  return <LegacyPage slug="ornek-rapor" />;
}

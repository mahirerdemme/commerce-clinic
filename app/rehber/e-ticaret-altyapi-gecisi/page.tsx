import "@/styles/commerce-notes.css";
import "@/styles/mobil.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

export const metadata = legacyMetadata("rehber-altyapi-gecisi");
export const viewport = legacyViewport("rehber-altyapi-gecisi");

export default function Page() {
  return <LegacyPage slug="rehber-altyapi-gecisi" />;
}

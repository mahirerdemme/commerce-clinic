import "@/styles/danismanlik.css";
import "@/styles/mobil.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

export const metadata = legacyMetadata("danismanlik");
export const viewport = legacyViewport("danismanlik");

export default function Page() {
  return <LegacyPage slug="danismanlik" />;
}

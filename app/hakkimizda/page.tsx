import "@/styles/hakkimizda.css";
import "@/styles/mobil.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

export const metadata = legacyMetadata("hakkimizda");
export const viewport = legacyViewport("hakkimizda");

export default function Page() {
  return <LegacyPage slug="hakkimizda" />;
}

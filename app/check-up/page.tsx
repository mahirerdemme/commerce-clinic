import "@/styles/check-up.css";
import "@/styles/mobil.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

export const metadata = legacyMetadata("check-up");
export const viewport = legacyViewport("check-up");

export default function Page() {
  return <LegacyPage slug="check-up" />;
}

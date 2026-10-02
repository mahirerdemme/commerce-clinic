import "@/styles/commerce-notes.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

export const metadata = legacyMetadata("commerce-notes");
export const viewport = legacyViewport("commerce-notes");

export default function Page() {
  return <LegacyPage slug="commerce-notes" />;
}

import "@/styles/commerce-notes.css";
import "@/styles/ortak.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

// Yazı kartları yayın saatine göre açılır (lib/blog-takvim.ts)
export const dynamic = "force-dynamic";
export const metadata = legacyMetadata("commerce-notes");
export const viewport = legacyViewport("commerce-notes");

export default function Page() {
  return <LegacyPage slug="commerce-notes" />;
}

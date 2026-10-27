import "@/styles/commerce-notes.css";
import "@/styles/ortak.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

export const metadata = legacyMetadata("blog-301-haritasi");
export const viewport = legacyViewport("blog-301-haritasi");

export default function Page() {
  return <LegacyPage slug="blog-301-haritasi" />;
}

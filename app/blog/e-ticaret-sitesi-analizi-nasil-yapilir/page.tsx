import "@/styles/commerce-notes.css";
import "@/styles/ortak.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

export const metadata = legacyMetadata("blog-site-analizi");
export const viewport = legacyViewport("blog-site-analizi");

export default function Page() {
  return <LegacyPage slug="blog-site-analizi" />;
}

import "@/styles/commerce-notes.css";
import "@/styles/ortak.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

export const metadata = legacyMetadata("blog-platform-gecisi");
export const viewport = legacyViewport("blog-platform-gecisi");

export default function Page() {
  return <LegacyPage slug="blog-platform-gecisi" />;
}

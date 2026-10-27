import "@/styles/commerce-notes.css";
import "@/styles/ortak.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

export const metadata = legacyMetadata("blog-altyapi-secimi");
export const viewport = legacyViewport("blog-altyapi-secimi");

export default function Page() {
  return <LegacyPage slug="blog-altyapi-secimi" />;
}

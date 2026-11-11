import { notFound } from "next/navigation";
import "@/styles/commerce-notes.css";
import "@/styles/ortak.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";
import { yayinda } from "@/lib/blog-takvim";

// Yayın saati lib/blog-takvim.ts'de; saat gelene kadar 404, gelince ek yayın gerekmeden açılır.
export const dynamic = "force-dynamic";
export const metadata = legacyMetadata("blog-ai-reklam-butce-testi");
export const viewport = legacyViewport("blog-ai-reklam-butce-testi");

export default function Page() {
  if (!yayinda("/blog/yeni-reklam-kanalinda-butce-nasil-test-edilir")) notFound();
  return <LegacyPage slug="blog-ai-reklam-butce-testi" />;
}

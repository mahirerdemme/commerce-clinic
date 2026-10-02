import "@/styles/home.css";
import { LegacyPage, legacyMetadata, legacyViewport } from "@/lib/legacy-page";

export const metadata = legacyMetadata("home");
export const viewport = legacyViewport("home");

export default function Page() {
  return <LegacyPage slug="home" />;
}

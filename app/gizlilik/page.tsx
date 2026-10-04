import { LegalPage, legalMetadata } from "@/lib/legal";

export const metadata = legalMetadata("gizlilik");

export default function Page() {
  return <LegalPage slug="gizlilik" />;
}

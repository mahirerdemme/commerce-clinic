import { LegalPage, legalMetadata } from "@/lib/legal";

export const metadata = legalMetadata("kvkk");

export default function Page() {
  return <LegalPage slug="kvkk" />;
}

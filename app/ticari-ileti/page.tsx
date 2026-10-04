import { LegalPage, legalMetadata } from "@/lib/legal";

export const metadata = legalMetadata("ticari-ileti");

export default function Page() {
  return <LegalPage slug="ticari-ileti" />;
}

import { LegalPage, legalMetadata } from "@/lib/legal";

export const metadata = legalMetadata("cerez-politikasi");

export default function Page() {
  return <LegalPage slug="cerez-politikasi" />;
}

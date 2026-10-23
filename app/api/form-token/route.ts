import { formToken } from "@/lib/email/forms";

/** Sayfa yüklenince form betiği (public/js/form-api.js) imzalı zaman damgasını buradan alır */
export async function GET() {
  return Response.json({ t: formToken() }, { headers: { "Cache-Control": "no-store" } });
}

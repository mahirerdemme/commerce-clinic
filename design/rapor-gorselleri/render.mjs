// gorseller.html'deki her <section class="cv" id="..."> → public/media/rapor/<id>.webp (1800×1125)
// Çalıştırma: npm i --no-save puppeteer-core && node design/rapor-gorselleri/render.mjs
// CHROME değişkeniyle farklı bir Chrome yolu verilebilir.
import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "../../public/media/rapor");
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--allow-file-access-from-files"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1300, height: 900, deviceScaleFactor: 1.5 });
await page.goto("file://" + path.join(here, "gorseller.html"), { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
for (const el of await page.$$("section.cv")) {
  const id = await el.evaluate((e) => e.id);
  const file = path.join(out, id + ".webp");
  await el.screenshot({ path: file, type: "webp", quality: 82 });
  console.log(id, Math.round(fs.statSync(file).size / 1024) + " KB");
}
await browser.close();

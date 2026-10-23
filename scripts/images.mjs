import sharp from "sharp";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const articles = JSON.parse(readFileSync("src/content/articles.json", "utf8"));
const site = JSON.parse(readFileSync("src/content/site.json", "utf8"));
const paths = new Set([
  site.logo,
  "images/coguisDeMochila2.png",
  "images/coguisManutencaoSuporte2.png",
  "images/coguisUpgradesMelhorias2.png",
  "images/coguisPrivacidadeConfianca2.png",
]);
for (const a of articles) {
  paths.add(a.image);
  for (const match of a.body.matchAll(
    /\bsrc="(?:\.\.\/\.\.\/)?(images\/[^"?]+)"/g,
  ))
    paths.add(match[1]);
}
mkdirSync("public/optimized", { recursive: true });
mkdirSync(".generated", { recursive: true });
const manifest = {};
let originalBytes = 0,
  optimizedBytes = 0;
// Serial encoding bounds memory and CPU usage in CI and smaller cloud machines.
sharp.concurrency(2);
for (const path of [...paths].sort()) {
  const source = readFileSync(path);
  const { width, height } = await sharp(source).metadata();
  const maxWidth = Math.min(width, 1440);
  const widths = [
    ...new Set([480, 960, maxWidth].filter((w) => w <= maxWidth)),
  ].sort((a, b) => a - b);
  const hash = createHash("sha256")
    .update(source)
    .update("webp-82-v1")
    .digest("hex")
    .slice(0, 16);
  const variants = [];
  for (const w of widths) {
    const file = `optimized/${hash}-${w}.webp`;
    const output = await sharp(source)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    writeFileSync(`public/${file}`, output);
    variants.push({ path: file, width: w, bytes: output.length });
  }
  manifest[path] = { width, height, variants };
  originalBytes += source.length;
  optimizedBytes += variants.at(-1).bytes;
}
writeFileSync(
  ".generated/images.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Imagens: ${paths.size} originais preservados; ${(originalBytes / 1024 / 1024).toFixed(2)} MB → ${(optimizedBytes / 1024 / 1024).toFixed(2)} MB nas maiores versões WebP (${(100 * (1 - optimizedBytes / originalBytes)).toFixed(1)}% de redução em bytes).`,
);

/**
 * Generates PWA PNG icons from SVG.
 * Run: node scripts/generate-icons.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public", "icons", "icon.svg");
const outDir = join(root, "public", "icons");

mkdirSync(outDir, { recursive: true });
const svg = readFileSync(svgPath);

for (const size of [192, 512, 180]) {
  const name = size === 180 ? "apple-touch-icon.png" : `icon-${size}.png`;
  await sharp(svg).resize(size, size).png().toFile(join(outDir, name));
  console.log(`✓ ${name}`);
}

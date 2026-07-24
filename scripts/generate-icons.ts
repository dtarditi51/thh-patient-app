// One-off icon generator. Renders an SVG with the practice initials "HH" on the
// brand red and rasterizes to the PNG sizes the manifest references.
//
// Usage: tsx scripts/generate-icons.ts
//
// TODO: replace with a real brand mark when design assets land. See CLAUDE.md.

import { writeFileSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const RED = "#C8102E";
const WHITE = "#FFFFFF";

// Inset icon: rounded corners, "HH" in white centered, transparent edges allowed.
// Used for /icon-192.png and /icon-512.png (purpose: any).
function insetSvg(size: number): string {
  const radius = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.55);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${RED}"/>
  <text x="50%" y="50%" font-family="Inter, system-ui, sans-serif" font-weight="600" font-size="${fontSize}" fill="${WHITE}" text-anchor="middle" dominant-baseline="central" letter-spacing="-2">HH</text>
</svg>`;
}

// Maskable icon: full-bleed red, "HH" centered in inner 80% safe zone so Android
// can crop to any adaptive shape without clipping the mark.
function maskableSvg(size: number): string {
  const fontSize = Math.round(size * 0.42);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="0" y="0" width="${size}" height="${size}" fill="${RED}"/>
  <text x="50%" y="50%" font-family="Inter, system-ui, sans-serif" font-weight="600" font-size="${fontSize}" fill="${WHITE}" text-anchor="middle" dominant-baseline="central" letter-spacing="-2">HH</text>
</svg>`;
}

async function render(svg: string, outPath: string, size: number): Promise<void> {
  await sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toFile(outPath);
}

async function main() {
  const pub = join(process.cwd(), "public");
  const targets: { name: string; size: number; kind: "inset" | "maskable" }[] = [
    { name: "icon-192.png", size: 192, kind: "inset" },
    { name: "icon-512.png", size: 512, kind: "inset" },
    { name: "apple-icon-180.png", size: 180, kind: "inset" },
    { name: "icon-32.png", size: 32, kind: "inset" },
    { name: "icon-16.png", size: 16, kind: "inset" },
    { name: "icon-maskable.png", size: 512, kind: "maskable" }
  ];

  for (const t of targets) {
    const svg = t.kind === "maskable" ? maskableSvg(t.size) : insetSvg(t.size);
    const outPath = join(pub, t.name);
    await render(svg, outPath, t.size);
    console.log(`[OK] ${t.name} (${t.size}x${t.size}, ${t.kind})`);
  }

  // Drop the inline SVG sources too — useful for downstream design tooling.
  writeFileSync(join(pub, "icon-source.svg"), insetSvg(512));
  writeFileSync(join(pub, "icon-maskable-source.svg"), maskableSvg(512));
  console.log("[OK] icon-source.svg + icon-maskable-source.svg");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

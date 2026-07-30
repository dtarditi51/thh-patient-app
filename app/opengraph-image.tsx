import { ImageResponse } from "next/og";

// Default share card for every page that doesn't supply its own image.
// Rendered at build time by Satori — no external assets, no network fetches
// (the artifact CSP and the edge runtime both forbid them), so the mark is
// drawn with plain divs rather than an <img> or an icon font.

export const runtime = "nodejs";
export const alt = "The Heart House and Vascular Care — cardiology in southern New Jersey";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #C8102E 0%, #8B0A1F 100%)",
          padding: "72px",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "999px",
              background: "#fff",
              color: "#C8102E",
              fontSize: "38px",
              fontWeight: 700
            }}
          >
            HH
          </div>
          <div style={{ display: "flex", flexDirection: "column", color: "#fff" }}>
            <div style={{ fontSize: "32px", fontWeight: 600 }}>The Heart House</div>
            <div style={{ fontSize: "22px", opacity: 0.85 }}>&amp; Vascular Care</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", color: "#fff" }}>
          <div style={{ fontSize: "60px", fontWeight: 600, lineHeight: 1.15 }}>
            Cardiology care across
          </div>
          <div style={{ fontSize: "60px", fontWeight: 600, lineHeight: 1.15 }}>
            southern New Jersey
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "40px",
            color: "#fff",
            fontSize: "24px",
            opacity: 0.9
          }}
        >
          <span>34 cardiologists</span>
          <span>6 offices</span>
          <span>9 hospitals</span>
          <span>Since 1979</span>
        </div>
      </div>
    ),
    size
  );
}

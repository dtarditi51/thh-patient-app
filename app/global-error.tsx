"use client";

import { useEffect } from "react";

// Last-resort boundary: catches errors thrown in the root layout itself, which
// means it REPLACES that layout. globals.css is imported by
// app/[locale]/layout.tsx, so Tailwind is not available here — every style is
// inline on purpose. Do not "clean this up" into utility classes.
export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary:", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F7F5",
          color: "#1A1A1A",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          padding: "1rem"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "24rem",
            background: "#fff",
            borderRadius: "1rem",
            border: "1px solid #E5E5E0",
            padding: "1.5rem"
          }}
        >
          <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 500, color: "#C8102E" }}>
            The Heart House &amp; Vascular Care
          </p>
          <h1 style={{ margin: "1rem 0 0.5rem", fontSize: "1.25rem", fontWeight: 500 }}>
            Something went wrong
          </h1>
          <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.6, color: "#5A5A5A" }}>
            We hit an unexpected problem. Trying again usually fixes it. If it keeps
            happening, please call us.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.25rem",
              width: "100%",
              minHeight: "44px",
              borderRadius: "9999px",
              border: "none",
              background: "#C8102E",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Try again
          </button>
          <div style={{ marginTop: "1.25rem", borderTop: "1px solid #E5E5E0", paddingTop: "1rem" }}>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#5A5A5A" }}>Need to reach us?</p>
            <a
              href="tel:856-546-3003"
              style={{
                display: "inline-block",
                marginTop: "0.25rem",
                minHeight: "44px",
                fontSize: "1rem",
                fontWeight: 500,
                color: "#C8102E",
                textDecoration: "none"
              }}
            >
              (856) 546-3003
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

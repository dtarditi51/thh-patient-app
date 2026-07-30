// Renders a schema.org graph into the page.
//
// Server component, so the JSON-LD is in the initial HTML where crawlers read
// it. Not a client component and not injected via useEffect — Googlebot renders
// JS but structured data added after hydration is far less reliably picked up.
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Content is built from typed literals in lib/structuredData.ts, never
          // from user input. JSON.stringify with the </script> escape is the
          // standard guard against breaking out of the script element.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(node).replace(/</g, "\\u003c")
          }}
        />
      ))}
    </>
  );
}

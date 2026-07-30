import type { Tagline } from "@/data/legal";

// Renders one Section 1557 language-assistance tagline.
//
// The phone number goes inside <bdi>. Without it, the Latin digits and
// parentheses of "(856) 546-3003" get reordered by the Unicode bidi algorithm
// when embedded in Arabic or Urdu, and the number renders scrambled —
// "3003-546 (856)" — which makes the one actionable piece of the notice wrong
// in exactly the two languages that need it most. <bdi> isolates the run so it
// keeps its own direction inside an RTL paragraph.
export function TaglineText({
  tagline,
  phone,
  className
}: {
  tagline: Tagline;
  phone: string;
  className?: string;
}) {
  const [before, after = ""] = tagline.text.split("{phone}");
  return (
    <p lang={tagline.code} dir={tagline.rtl ? "rtl" : undefined} className={className}>
      {before}
      <bdi>{phone}</bdi>
      {after}
    </p>
  );
}

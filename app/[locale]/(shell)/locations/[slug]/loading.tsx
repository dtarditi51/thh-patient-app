// The page awaits fetchPlaceDetails() inline before rendering anything, so a
// slow Google Places round-trip left the patient staring at the previous route.
// This skeleton mirrors the real layout: back link, name, address, phone,
// hours card, map, providers.
export default function LocationDetailLoading() {
  return (
    <div className="container-app space-y-6 py-4 pb-12" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading office details…</span>

      <div className="h-4 w-28 animate-pulse rounded bg-thh-line" />

      <section className="space-y-3">
        <div className="h-7 w-52 animate-pulse rounded bg-thh-line" />
        <div className="space-y-2">
          <div className="h-4 w-64 animate-pulse rounded bg-thh-line" />
          <div className="h-4 w-40 animate-pulse rounded bg-thh-line" />
        </div>
        <div className="h-11 w-44 animate-pulse rounded-full bg-thh-line" />
      </section>

      <div className="h-28 animate-pulse rounded-2xl bg-thh-line" />
      <div className="h-56 animate-pulse rounded-2xl bg-thh-line" />

      <section className="space-y-3">
        <div className="h-5 w-48 animate-pulse rounded bg-thh-line" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-thh-line" />
          ))}
        </div>
      </section>
    </div>
  );
}

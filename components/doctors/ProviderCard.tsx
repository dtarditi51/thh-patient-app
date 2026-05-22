import Link from "next/link";
import Image from "next/image";
import { Calendar, Star } from "lucide-react";
import { type Provider, subspecialtyLabels, type Subspecialty } from "@/data/providers";

export function ProviderCard({
  provider,
  locale,
  acceptingNewLabel
}: {
  provider: Provider;
  locale: string;
  acceptingNewLabel: string;
}) {
  const lang = locale as "en" | "es";
  return (
    <Link
      href={`/${locale}/doctors/${provider.slug}`}
      className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-thh-line hover:bg-thh-surface"
    >
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-thh-red-50">
        {provider.photoUrl ? (
          <Image src={provider.photoUrl} alt={provider.name} fill className="object-cover" sizes="56px" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-medium text-thh-red">
            {provider.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{provider.name}, {provider.credentials}</div>
        <div className="truncate text-xs text-thh-muted">
          {provider.subspecialties.map((s) => subspecialtyLabels[s as Subspecialty][lang]).join(" · ")}
        </div>
        <div className="mt-1 flex items-center gap-2">
          {provider.rater8Score && (
            <span className="inline-flex items-center gap-0.5 text-xs text-thh-muted">
              <Star className="h-3 w-3 fill-thh-red text-thh-red" />
              {provider.rater8Score.toFixed(1)} ({provider.rater8Count})
            </span>
          )}
          {provider.acceptingNew && <span className="pill bg-green-50 text-green-800">{acceptingNewLabel}</span>}
        </div>
      </div>
      <Calendar className="h-5 w-5 text-thh-red" />
    </Link>
  );
}

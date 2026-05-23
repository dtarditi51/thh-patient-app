export type HoursEntry = { open: string; close: string };

export type DayKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type OfficeHours = Record<DayKey, HoursEntry | null>;

// Index matches JS Date.getDay() (0 = Sunday).
const DAY_KEYS: DayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

function parseHM(hhmm: string): { h: number; m: number } {
  const [h, m] = hhmm.split(":").map(Number);
  return { h, m };
}

function intlLocale(locale: string): string {
  return locale === "es" ? "es-US" : "en-US";
}

function formatTime(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(date);
}

function formatWeekday(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { weekday: "long" }).format(date);
}

export function isOpen(hours: OfficeHours, now: Date): boolean {
  const today = hours[DAY_KEYS[now.getDay()]];
  if (!today) return false;
  const { h: oh, m: om } = parseHM(today.open);
  const { h: ch, m: cm } = parseHM(today.close);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= oh * 60 + om && nowMin < ch * 60 + cm;
}

export type StatusInfo =
  | { status: "open"; closeTime: string }
  | { status: "closedOpensToday"; openTime: string }
  | { status: "closedOpensTomorrow"; openTime: string }
  | { status: "closedOpensWeekday"; weekday: string; openTime: string }
  | { status: "alwaysClosed" };

export function nextOpenInfo(hours: OfficeHours, now: Date, locale: string): StatusInfo {
  const today = hours[DAY_KEYS[now.getDay()]];
  const nowMin = now.getHours() * 60 + now.getMinutes();

  if (today) {
    const { h: oh, m: om } = parseHM(today.open);
    const { h: ch, m: cm } = parseHM(today.close);
    const openMin = oh * 60 + om;
    const closeMin = ch * 60 + cm;

    if (nowMin >= openMin && nowMin < closeMin) {
      const closeDate = new Date(now);
      closeDate.setHours(ch, cm, 0, 0);
      return { status: "open", closeTime: formatTime(closeDate, locale) };
    }

    if (nowMin < openMin) {
      const openDate = new Date(now);
      openDate.setHours(oh, om, 0, 0);
      return { status: "closedOpensToday", openTime: formatTime(openDate, locale) };
    }
  }

  for (let offset = 1; offset <= 7; offset++) {
    const nextIdx = (now.getDay() + offset) % 7;
    const next = hours[DAY_KEYS[nextIdx]];
    if (!next) continue;
    const { h: oh, m: om } = parseHM(next.open);
    const openDate = new Date(now);
    openDate.setDate(now.getDate() + offset);
    openDate.setHours(oh, om, 0, 0);
    if (offset === 1) {
      return { status: "closedOpensTomorrow", openTime: formatTime(openDate, locale) };
    }
    return {
      status: "closedOpensWeekday",
      weekday: formatWeekday(openDate, locale),
      openTime: formatTime(openDate, locale)
    };
  }

  return { status: "alwaysClosed" };
}

export type StatusLabels = {
  openUntil: string;
  closedOpensToday: string;
  closedOpensTomorrow: string;
  closedOpensWeekday: string;
  closed: string;
};

export function nextOpenLabel(
  hours: OfficeHours,
  now: Date,
  locale: string,
  labels: StatusLabels
): string {
  const info = nextOpenInfo(hours, now, locale);
  switch (info.status) {
    case "open":
      return labels.openUntil.replace("{time}", info.closeTime);
    case "closedOpensToday":
      return labels.closedOpensToday.replace("{time}", info.openTime);
    case "closedOpensTomorrow":
      return labels.closedOpensTomorrow.replace("{time}", info.openTime);
    case "closedOpensWeekday":
      return labels.closedOpensWeekday
        .replace("{weekday}", info.weekday)
        .replace("{time}", info.openTime);
    case "alwaysClosed":
      return labels.closed;
  }
}

export function formatHoursRange(entry: HoursEntry, locale: string): string {
  const open = new Date();
  const close = new Date();
  const { h: oh, m: om } = parseHM(entry.open);
  const { h: ch, m: cm } = parseHM(entry.close);
  open.setHours(oh, om, 0, 0);
  close.setHours(ch, cm, 0, 0);
  return `${formatTime(open, locale)} – ${formatTime(close, locale)}`;
}

export const ORDERED_DAYS: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];

// Haversine distance in miles between two lat/lng pairs.
export function haversineMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 3958.8;
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

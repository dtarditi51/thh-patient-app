// Single source of truth for practice contact info used across the PWA.
// Add new constants here rather than hardcoding strings in components.

export const PRACTICE_SCHEDULING_URL = "https://www.hearthousenj.com/request-an-appointment";

// Confirmed in CLAUDE.md ("Practice main line: 856-546-3003") and already used in
// header, doctor pages, and locations data.
export const PRACTICE_MAIN_PHONE = "856-546-3003";
export const PRACTICE_MAIN_PHONE_DISPLAY = "(856) 546-3003";

// TODO: confirm whether main-line call hours match office hours (8am-5pm M-F per data/locations.ts).
export const PRACTICE_HOURS_DISPLAY = "Monday through Friday, 8am to 5pm";

// Phone shown in the sticky header pill ONLY. Everything else in the app —
// footer, appointment page, 404/offline fallback, Section 1557 grievance
// contact, and the MedicalOrganization JSON-LD — stays on PRACTICE_MAIN_PHONE,
// so the app's structured data still matches the Google Business Profile,
// hearthousenj.com, and printed materials (NAP consistency drives local-pack
// ranking).
//
// Why Elmer: it's the lowest-volume office that has its OWN dedicated line
// (~478 Google reviews vs Sewell's 1,064), so it's the most likely to pick up
// promptly. Deliberately NOT 856-582-2000 — that number is shared between
// Woodbury and Sewell, and Sewell is the busiest office in the practice, so it
// would have routed header taps to the most congested line.
//
// Tradeoff being accepted (per Dr. Tarditi, 2026-07-30): Elmer is the
// southernmost office, so a Haddon Heights or Marlton patient tapping the
// header reaches a desk 30+ miles away that has no context on them. Revisit
// once `tel_tap` data lands — events carry `office`, so header-tap volume and
// any change in misrouted calls will be visible.
export const HEADER_PHONE = "856-358-2363";
export const HEADER_PHONE_DISPLAY = "(856) 358-2363";
/** Office slug behind HEADER_PHONE, for analytics attribution. */
export const HEADER_PHONE_OFFICE = "elmer";

// TODO: confirm exact confirmation-window wording with practice ops.
export const APPOINTMENT_CONFIRMATION_WINDOW = "within one business day";

// Section 1557 expects a covered entity with 15+ employees to designate a
// coordinator and publish a grievance procedure naming them. No named
// coordinator has been provided yet, so /nondiscrimination routes grievances to
// the main office line instead of publishing a placeholder contact.
//
// TODO (pre-public-launch): once the practice designates a coordinator, add
// their name/title/direct contact here and restore the named contact block on
// /nondiscrimination.

/** TTY relay. 711 is the nationwide Telecommunications Relay Service number. */
export const TTY_NUMBER = "711";

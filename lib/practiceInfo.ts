// Single source of truth for practice contact info used across the PWA.
// Add new constants here rather than hardcoding strings in components.

export const PRACTICE_SCHEDULING_URL = "https://www.hearthousenj.com/request-an-appointment";

// Confirmed in CLAUDE.md ("Practice main line: 856-546-3003") and already used in
// header, doctor pages, and locations data.
export const PRACTICE_MAIN_PHONE = "856-546-3003";
export const PRACTICE_MAIN_PHONE_DISPLAY = "(856) 546-3003";

// TODO: confirm whether main-line call hours match office hours (8am-5pm M-F per data/locations.ts).
export const PRACTICE_HOURS_DISPLAY = "Monday through Friday, 8am to 5pm";

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

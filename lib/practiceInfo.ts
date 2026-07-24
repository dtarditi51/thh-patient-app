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

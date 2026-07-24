import type { OfficeHours } from "@/lib/officeHours";

export type Location = {
  slug: string;
  name: string;
  address: string;
  city: string;
  state: "NJ";
  zip: string;
  phone: string;
  lat: number;
  lng: number;
  hours: OfficeHours;
  placeId: string;
};

// Directions deep link: place_id alongside lat/lng so Google's UI shows the
// business name, not a road-level address match. Opens the Google Maps app on
// phones that have it installed, the Google Maps site otherwise.
export function directionsUrl(loc: Pick<Location, "lat" | "lng" | "placeId">): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}&destination_place_id=${encodeURIComponent(loc.placeId)}`;
}

const standardWeekdayHours: OfficeHours = {
  monday: { open: "08:00", close: "17:00" },
  tuesday: { open: "08:00", close: "17:00" },
  wednesday: { open: "08:00", close: "17:00" },
  thursday: { open: "08:00", close: "17:00" },
  friday: { open: "08:00", close: "17:00" },
  saturday: null,
  sunday: null
};

export const locations: Location[] = [
  {
    slug: "haddon-heights",
    name: "Haddon Heights",
    address: "210 West Atlantic Ave",
    city: "Haddon Heights",
    state: "NJ",
    zip: "08035",
    phone: "856-546-3003",
    lat: 39.8817,
    lng: -75.0583,
    hours: standardWeekdayHours,
    placeId: "ChIJER224SDMxokRnZGpI5RGj8A"
  },
  {
    slug: "marlton",
    name: "Marlton",
    address: "999 Rte 73 North, Suite 205",
    city: "Marlton",
    state: "NJ",
    zip: "08053",
    phone: "856-795-2227",
    lat: 39.9078,
    lng: -74.9406,
    hours: standardWeekdayHours,
    placeId: "ChIJsa3Jm0HLxokRy8KQPqzIfe0"
  },
  {
    slug: "sewell",
    name: "Sewell",
    address: "243 Hurffville-Cross Keys Rd, Suite 101",
    city: "Sewell",
    state: "NJ",
    zip: "08080",
    phone: "856-582-2000",
    lat: 39.7225,
    lng: -75.0450,
    hours: standardWeekdayHours,
    placeId: "ChIJCYO74qfWxokRDc_wVaGr06U"
  },
  {
    slug: "woodbury",
    name: "Woodbury",
    address: "190 N. Evergreen Ave, Bldg. 1, Suite 102",
    city: "Woodbury",
    state: "NJ",
    zip: "08096",
    phone: "856-582-2000",
    lat: 39.8395,
    lng: -75.1426,
    hours: standardWeekdayHours,
    placeId: "ChIJ3dv__GfbxokRaJbDjeL0H6w"
  },
  {
    slug: "elmer",
    name: "Elmer",
    address: "525 State St, Suite 3",
    city: "Elmer",
    state: "NJ",
    zip: "08318",
    phone: "856-358-2363",
    lat: 39.5867,
    lng: -75.1815,
    hours: standardWeekdayHours,
    placeId: "ChIJzwoNBMMlx4kRzD2Hi9iDtXg"
  },
  {
    slug: "vineland",
    name: "Vineland",
    address: "1051 W. Sherman Ave, Suite 3-A",
    city: "Vineland",
    state: "NJ",
    zip: "08360",
    phone: "856-691-8070",
    lat: 39.4456,
    lng: -75.0490,
    hours: standardWeekdayHours,
    placeId: "ChIJl6H_xsQzx4kRzWomlkq0jkU"
  }
];

export const hospitals = [
  { name: "Cooper University Hospital", url: "http://www.cooperhealth.org/", system: "Cooper" },
  { name: "Jefferson Hospital - Cherry Hill", url: "https://www.jeffersonhealth.org/locations/cherry-hill-hospital", system: "Jefferson" },
  { name: "Jefferson Hospital - Stratford", url: "https://www.jeffersonhealth.org/locations/stratford-hospital", system: "Jefferson" },
  { name: "Jefferson Hospital - Washington Township", url: "https://www.jeffersonhealth.org/locations/washington-township-hospital", system: "Jefferson" },
  { name: "Our Lady of Lourdes Medical Center", url: "https://www.virtua.org/locations/hospital-virtua-our-lady-of-lourdes", system: "Virtua" },
  { name: "Inspira Medical Center - Elmer", url: "https://www.inspirahealthnetwork.org/locations/inspira-medical-center-elmer", system: "Inspira" },
  { name: "Inspira Medical Center - Vineland", url: "https://www.inspirahealthnetwork.org/locations/inspira-medical-center-vineland", system: "Inspira" },
  { name: "Virtua Hospital - Marlton", url: "https://www.virtua.org/locations/marlton-hospital", system: "Virtua" },
  { name: "Virtua Hospital - Voorhees", url: "https://www.virtua.org/locations/voorhees-hospital", system: "Virtua" }
];

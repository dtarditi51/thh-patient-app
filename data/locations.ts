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
  hours: { day: string; open: string; close: string }[];
  placeIdEnvKey: string; // env var name holding Google Place ID
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
    lat: 39.8779,
    lng: -75.0668,
    hours: [
      { day: "Mon", open: "08:00", close: "17:00" },
      { day: "Tue", open: "08:00", close: "17:00" },
      { day: "Wed", open: "08:00", close: "17:00" },
      { day: "Thu", open: "08:00", close: "17:00" },
      { day: "Fri", open: "08:00", close: "17:00" }
    ],
    placeIdEnvKey: "NEXT_PUBLIC_PLACE_ID_HADDON_HEIGHTS"
  },
  {
    slug: "marlton",
    name: "Marlton",
    address: "999 Rte 73 North, Suite 205",
    city: "Marlton",
    state: "NJ",
    zip: "08053",
    phone: "856-795-2227",
    lat: 39.8915,
    lng: -74.9213,
    hours: [
      { day: "Mon", open: "08:00", close: "17:00" },
      { day: "Tue", open: "08:00", close: "17:00" },
      { day: "Wed", open: "08:00", close: "17:00" },
      { day: "Thu", open: "08:00", close: "17:00" },
      { day: "Fri", open: "08:00", close: "17:00" }
    ],
    placeIdEnvKey: "NEXT_PUBLIC_PLACE_ID_MARLTON"
  },
  {
    slug: "sewell",
    name: "Sewell",
    address: "243 Hurffville-Cross Keys Rd, Suite 101",
    city: "Sewell",
    state: "NJ",
    zip: "08080",
    phone: "856-582-2000",
    lat: 39.7501,
    lng: -75.1140,
    hours: [
      { day: "Mon", open: "08:00", close: "17:00" },
      { day: "Tue", open: "08:00", close: "17:00" },
      { day: "Wed", open: "08:00", close: "17:00" },
      { day: "Thu", open: "08:00", close: "17:00" },
      { day: "Fri", open: "08:00", close: "17:00" }
    ],
    placeIdEnvKey: "NEXT_PUBLIC_PLACE_ID_SEWELL"
  },
  {
    slug: "woodbury",
    name: "Woodbury",
    address: "190 N. Evergreen Ave, Bldg. 1, Suite 102",
    city: "Woodbury",
    state: "NJ",
    zip: "08096",
    phone: "856-582-2000",
    lat: 39.8398,
    lng: -75.1535,
    hours: [
      { day: "Mon", open: "08:00", close: "17:00" },
      { day: "Tue", open: "08:00", close: "17:00" },
      { day: "Wed", open: "08:00", close: "17:00" },
      { day: "Thu", open: "08:00", close: "17:00" },
      { day: "Fri", open: "08:00", close: "17:00" }
    ],
    placeIdEnvKey: "NEXT_PUBLIC_PLACE_ID_WOODBURY"
  },
  {
    slug: "elmer",
    name: "Elmer",
    address: "525 State St, Suite 3",
    city: "Elmer",
    state: "NJ",
    zip: "08318",
    phone: "856-358-2363",
    lat: 39.5984,
    lng: -75.1719,
    hours: [
      { day: "Mon", open: "08:00", close: "17:00" },
      { day: "Tue", open: "08:00", close: "17:00" },
      { day: "Wed", open: "08:00", close: "17:00" },
      { day: "Thu", open: "08:00", close: "17:00" },
      { day: "Fri", open: "08:00", close: "17:00" }
    ],
    placeIdEnvKey: "NEXT_PUBLIC_PLACE_ID_ELMER"
  },
  {
    slug: "vineland",
    name: "Vineland",
    address: "1051 W. Sherman Ave, Suite 3-A",
    city: "Vineland",
    state: "NJ",
    zip: "08360",
    phone: "856-691-8070",
    lat: 39.4862,
    lng: -75.0257,
    hours: [
      { day: "Mon", open: "08:00", close: "17:00" },
      { day: "Tue", open: "08:00", close: "17:00" },
      { day: "Wed", open: "08:00", close: "17:00" },
      { day: "Thu", open: "08:00", close: "17:00" },
      { day: "Fri", open: "08:00", close: "17:00" }
    ],
    placeIdEnvKey: "NEXT_PUBLIC_PLACE_ID_VINELAND"
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

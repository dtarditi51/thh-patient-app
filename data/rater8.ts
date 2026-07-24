// Heart House providers → their public Rater8 profile path on reviews.rater8.com.
//
// The CVA USA Rater8 listing at /specialty/cardiology/new-jersey/cvausa-1810 also
// includes Shore Heart Group physicians (a separate practice that happens to share
// the same parent network). This mapping is the hard allowlist that prevents any
// Shore Heart provider from ever being surfaced in our app — by construction we
// can only fetch what's listed below.
//
// One Heart House provider is intentionally absent:
//   - alexander-blake-smith-md: joined 2025, no Rater8 profile yet. The API
//     returns the standard empty-state response, which renders as the same
//     "Verified patient reviews from post-visit surveys will appear here soon"
//     card the page already uses for missing data.
//
// Amanda Salvatore, APN-C exists on the Rater8 listing but is not in the patient
// directory (we surface cardiologists only), so she is not mapped here.
//
// To refresh: visit https://reviews.rater8.com/specialty/cardiology/new-jersey/cvausa-1810
// and copy the doctor profile URLs. Slugs end in a stable hash that Rater8 assigns
// when the provider is onboarded — they don't change unless the vendor reassigns.

export const RATER8_PROFILE_PATHS: Record<string, string> = {
  "gladwyn-baptist-md": "/doctor/dr-gladwyn-baptist-md-b944d0af",
  "ronald-cohen-do-facc": "/doctor/dr-ronald-cohen-do-a8f9ceec",
  "steven-cohn-md": "/doctor/dr-steven-cohn-md-68b4b549",
  "john-costello-do-facc": "/doctor/dr-john-costello-do-523dac42",
  "steven-datorre-md-facc": "/doctor/dr-steven-datorre-md-04f490b5",
  "scott-fertels-do-facc": "/doctor/dr-scott-fertels-do-92aec73f",
  "gregg-fortino-md-facc": "/doctor/dr-gregg-fortino-md-01632c0a",
  "mark-gelernt-md-facc": "/doctor/dr-mark-gelernt-md-d5637666",
  "sanford-gips-md-facc-fscai": "/doctor/dr-sanford-gips-md-861f6451",
  "kartik-giri-md-facc": "/doctor/dr-kartik-giri-md-3c79d3cb",
  "georges-kaddissi-md-facc": "/doctor/dr-georges-kaddissi-md-70ff0c67",
  "jeffrey-leavy-md-facc": "/doctor/dr-jeffrey-leavy-md-17ffd797",
  "steven-levi-md-facc": "/doctor/dr-steven-levi-md-3cfd6e00",
  "adam-levine-do-facc-fscai": "/doctor/dr-adam-levine-do-4d4713e1",
  "robert-mohapatra-md-mph": "/doctor/dr-robert-mohapatra-md-9b0450f6",
  "jeffrey-ogbara-md-facc": "/doctor/dr-jeffrey-ogbara-md-72409b32",
  "jason-palermo-md-facc": "/doctor/dr-jason-palermo-md-70a85477",
  "andreas-pavlides-md-facc": "/doctor/dr-andreas-pavlides-md-695b5b39",
  "annie-peter-md-facc": "/doctor/dr-annie-peter-md-bcf540e9",
  "zahi-rafeq-md-facc": "/doctor/dr-zahi-rafeq-md-2c121864",
  "douglas-rheam-do": "/doctor/dr-douglas-rheam-do-0c0a1f88",
  "mitchell-rosenberg-md-facc": "/doctor/dr-mitchell-rosenberg-md-0d76881b",
  "bryan-saia-do": "/doctor/dr-bryan-saia-do-10f2d1b0",
  "vivek-sailam-md": "/doctor/dr-vivek-sailam-md-a3e46a29",
  "deborah-sambucci-do-facc": "/doctor/dr-deborah-sambucci-do-f104ae53",
  "steven-silver-md-facc": "/doctor/dr-steven-silver-md-357b2097",
  "neal-skop-md-facc": "/doctor/dr-neal-skop-md-49a4ac50",
  "jason-smith-do": "/doctor/dr-jason-smith-do-16375777",
  "daniel-tarditi-do-facc": "/doctor/dr-daniel-tarditi-do-6150a82c",
  "vijay-verma-md-facc": "/doctor/dr-vijay-verma-md-08075c12",
  "dilip-viswanath-md-facc": "/doctor/dr-dilip-viswanath-md-aa9fd66f",
  "andrew-zinn-md-facc": "/doctor/dr-andrew-zinn-md-7c6f6239"
};

export const RATER8_BASE_URL = "https://reviews.rater8.com";

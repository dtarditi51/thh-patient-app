// Legal / compliance surface for the patient app.
//
// Policy documents live on hearthousenj.com and are linked, never duplicated —
// duplicating them means two copies that drift, and the practice's counsel
// maintains the canonical versions. All five URLs verified 200 on 2026-07-30.

export type PolicyLink = {
  key: string;
  href: string;
  /** Locale this document is written in, when it differs from the UI locale. */
  lang?: string;
};

export const POLICY_LINKS: PolicyLink[] = [
  { key: "privacy", href: "https://www.hearthousenj.com/privacy-policy" },
  { key: "hipaa", href: "https://www.hearthousenj.com/hipaa-notice" },
  { key: "npp", href: "https://www.hearthousenj.com/notice-of-privacy-practices" },
  {
    key: "nppEs",
    href: "https://www.hearthousenj.com/aviso-de-practicas-de-privacidad",
    lang: "es"
  },
  { key: "terms", href: "https://www.hearthousenj.com/terms-of-use" }
];

// Office for Civil Rights complaint channel. This is HHS's standard published
// contact block and is required in a Section 1557 notice of nondiscrimination.
export const OCR_CONTACT = {
  name: "U.S. Department of Health and Human Services, Office for Civil Rights",
  address: "200 Independence Avenue SW, Room 509F, HHH Building, Washington, DC 20201",
  phone: "1-800-368-1019",
  tdd: "1-800-537-7697",
  complaintPortal: "https://ocrportal.hhs.gov/ocr/portal/lobby.jsf",
  complaintForms: "https://www.hhs.gov/ocr/complaints/index.html"
};

export type Tagline = {
  /** BCP-47 code for the lang attribute. */
  code: string;
  /** Endonym — the language's own name for itself, which is who the line is for. */
  endonym: string;
  /** English name, for the practice's own reference. */
  english: string;
  rtl?: boolean;
  /** `{phone}` is interpolated with the practice main line. */
  text: string;
};

// ⚠️ NOT CURRENTLY RENDERED ANYWHERE. Pulled from the UI on 2026-07-30 pending
// a compliance review of the translations. Kept here rather than deleted so the
// research isn't lost.
//
// What this is: the Section 1557 notice of availability of language assistance,
// in the 15 most common languages spoken by individuals with limited English
// proficiency in New Jersey (per NJ Human Services / ACS data — Spanish is
// 66.2% of the NJ LEP population, then Korean, Chinese, Portuguese, Gujarati,
// Polish, French/Haitian Creole, Arabic, Russian, Italian, and the rest).
//
// Before re-enabling, have the practice's compliance officer diff these against
// HHS's official published translated taglines and paste those verbatim. These
// follow HHS's standard sample wording but are a second-hand transcription, and
// a wrong character in a Gujarati tagline is a compliance finding, not a typo.
//
// To re-enable: render this array with <TaglineText> (components/legal/
// TaglineText.tsx) in components/layout/Footer.tsx and in
// app/[locale]/(shell)/nondiscrimination/page.tsx. Use TaglineText rather than
// interpolating the phone inline — it wraps the number in <bdi> so the Unicode
// bidi algorithm doesn't scramble "(856) 546-3003" into "3003-546 (856)" inside
// the Arabic and Urdu lines. That bug was found and fixed on 2026-07-30;
// don't reintroduce it.
export const LANGUAGE_TAGLINES: Tagline[] = [
  {
    code: "es",
    endonym: "Español",
    english: "Spanish",
    text: "ATENCIÓN: si habla español, tiene a su disposición servicios gratuitos de asistencia lingüística. Llame al {phone} (TTY: 711)."
  },
  {
    code: "ko",
    endonym: "한국어",
    english: "Korean",
    text: "주의: 한국어를 사용하시는 경우, 언어 지원 서비스를 무료로 이용하실 수 있습니다. {phone} (TTY: 711) 번으로 전화해 주십시오."
  },
  {
    code: "zh-Hant",
    endonym: "繁體中文",
    english: "Chinese",
    text: "注意：如果您使用繁體中文，您可以免費獲得語言援助服務。請致電 {phone} (TTY: 711)。"
  },
  {
    code: "pt",
    endonym: "Português",
    english: "Portuguese",
    text: "ATENÇÃO: Se fala português, encontram-se disponíveis serviços linguísticos, grátis. Ligue para {phone} (TTY: 711)."
  },
  {
    code: "gu",
    endonym: "ગુજરાતી",
    english: "Gujarati",
    text: "સૂચના: જો તમે ગુજરાતી બોલતા હો, તો નિ:શુલ્ક ભાષા સહાય સેવાઓ તમારા માટે ઉપલબ્ધ છે. ફોન કરો {phone} (TTY: 711)."
  },
  {
    code: "pl",
    endonym: "Polski",
    english: "Polish",
    text: "UWAGA: Jeżeli mówisz po polsku, możesz skorzystać z bezpłatnej pomocy językowej. Zadzwoń pod numer {phone} (TTY: 711)."
  },
  {
    code: "ht",
    endonym: "Kreyòl Ayisyen",
    english: "Haitian Creole",
    text: "ATANSYON: Si w pale Kreyòl Ayisyen, gen sèvis èd pou lang ki disponib gratis pou ou. Rele {phone} (TTY: 711)."
  },
  {
    code: "ar",
    endonym: "العربية",
    english: "Arabic",
    rtl: true,
    text: "ملحوظة: إذا كنت تتحدث العربية، فإن خدمات المساعدة اللغوية تتوافر لك بالمجان. اتصل برقم {phone} (رقم هاتف الصم والبكم: 711)."
  },
  {
    code: "ru",
    endonym: "Русский",
    english: "Russian",
    text: "ВНИМАНИЕ: Если вы говорите на русском языке, то вам доступны бесплатные услуги перевода. Звоните {phone} (телетайп: 711)."
  },
  {
    code: "it",
    endonym: "Italiano",
    english: "Italian",
    text: "ATTENZIONE: In caso la lingua parlata sia l'italiano, sono disponibili servizi di assistenza linguistica gratuiti. Chiamare il numero {phone} (TTY: 711)."
  },
  {
    code: "hi",
    endonym: "हिन्दी",
    english: "Hindi",
    text: "ध्यान दें: यदि आप हिंदी बोलते हैं तो आपके लिए मुफ्त में भाषा सहायता सेवाएं उपलब्ध हैं। {phone} (TTY: 711) पर कॉल करें।"
  },
  {
    code: "tl",
    endonym: "Tagalog",
    english: "Tagalog",
    text: "PAUNAWA: Kung nagsasalita ka ng Tagalog, maaari kang gumamit ng mga serbisyo ng tulong sa wika nang walang bayad. Tumawag sa {phone} (TTY: 711)."
  },
  {
    code: "vi",
    endonym: "Tiếng Việt",
    english: "Vietnamese",
    text: "CHÚ Ý: Nếu bạn nói Tiếng Việt, có các dịch vụ hỗ trợ ngôn ngữ miễn phí dành cho bạn. Gọi số {phone} (TTY: 711)."
  },
  {
    code: "ur",
    endonym: "اردو",
    english: "Urdu",
    rtl: true,
    text: "خبردار: اگر آپ اردو بولتے ہیں، تو آپ کو زبان کی مدد کی خدمات مفت میں دستیاب ہیں۔ کال کریں {phone} (TTY: 711)۔"
  },
  {
    code: "fr",
    endonym: "Français",
    english: "French",
    text: "ATTENTION: Si vous parlez français, des services d'aide linguistique vous sont proposés gratuitement. Appelez le {phone} (ATS: 711)."
  }
];

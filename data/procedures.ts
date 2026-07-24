// Procedure prep content authored in-app, sourced from the official Heart House
// PDFs at hearthousenj.com/patient-resources/test-and-study-instructions. PDFs
// stay linked as the printable backup ("Printable instructions"). Spanish
// strings are machine-translation placeholders flagged for medical-translator
// review per CLAUDE.md Week 3 plan.
//
// If the practice updates a PDF, update both the in-app content here AND the
// PDF source — this file is now the patient-facing source of truth.

export type PrepSection = {
  titleEn: string;
  titleEs: string;
  bodyEn: string;
  bodyEs: string;
};

export type ProcedurePdf = {
  labelEn: string;
  labelEs: string;
  urlEn: string;
  urlEs: string;
};

export type Procedure = {
  slug: string;
  icon: "heart-pulse" | "scan" | "activity";
  color: "red" | "blue" | "purple";
  titleEn: string;
  titleEs: string;
  shortEn: string;
  shortEs: string;
  summaryEn: string;
  summaryEs: string;
  durationEn: string;
  durationEs: string;
  prep: PrepSection[];
  pdfs: ProcedurePdf[];
  phone: string;
  phoneExt: string;
};

const PHONE = "856-546-3006";
const PHONE_EXT = "2250";

export const procedures: Procedure[] = [
  {
    slug: "nuclear-stress-test",
    icon: "heart-pulse",
    color: "red",
    titleEn: "Nuclear Stress Test",
    titleEs: "Prueba de esfuerzo nuclear",
    shortEn: "Nuclear stress",
    shortEs: "Esfuerzo nuclear",
    summaryEn:
      "A nuclear stress test takes two sets of pictures of your heart — one at rest and one after stress. Stress can come from walking on a treadmill or from medication that mimics exercise.",
    summaryEs:
      "Una prueba de esfuerzo nuclear toma dos series de imágenes de su corazón — una en reposo y otra después del esfuerzo. El esfuerzo puede provenir de caminar en una cinta o de un medicamento que imita el ejercicio.",
    durationEn: "About 3 to 3.5 hours total. Arrive 15 minutes before your appointment to register.",
    durationEs: "Aproximadamente 3 a 3.5 horas en total. Llegue 15 minutos antes de su cita para registrarse.",
    prep: [
      {
        titleEn: "No caffeine for 24 hours",
        titleEs: "Sin cafeína durante 24 horas",
        bodyEn:
          "Caffeine counteracts the medication used during the test, and your appointment will be cancelled if you have any. This includes coffee, tea, soda, chocolate, and energy drinks — regular AND decaf. Common OTC drugs with caffeine: Excedrin, Anacin, migraine relief, Midol, Vivarin, No-Doz, Cafergot, Fiorinal. You may drink water, juice, or white milk.",
        bodyEs:
          "La cafeína contrarresta el medicamento utilizado durante la prueba y su cita será cancelada si la consume. Esto incluye café, té, refrescos, chocolate y bebidas energéticas — regular Y descafeinado. Medicamentos sin receta comunes con cafeína: Excedrin, Anacin, alivio de migraña, Midol, Vivarin, No-Doz, Cafergot, Fiorinal. Puede beber agua, jugo o leche blanca."
      },
      {
        titleEn: "Eating and drinking",
        titleEs: "Comer y beber",
        bodyEn:
          "You may have a light breakfast or lunch (juice, water, white milk, toast, cereal) up to 2 hours before your appointment. If your veins are hard to access, drink extra water the day before. Bring a light snack to eat after the test if you'd like.",
        bodyEs:
          "Puede tomar un desayuno o almuerzo ligero (jugo, agua, leche blanca, tostadas, cereal) hasta 2 horas antes de su cita. Si sus venas son difíciles de acceder, beba agua adicional el día anterior. Traiga un refrigerio ligero para comer después de la prueba si lo desea."
      },
      {
        titleEn: "Medications",
        titleEs: "Medicamentos",
        bodyEn:
          "Take all your regular medications as usual unless your doctor tells you otherwise. Use your inhaler or nebulizer at the usual time. Bring your rescue inhaler with you even if you don't use it daily. Our office will call you 2-3 days before the test to review medications — some may interfere with the test.",
        bodyEs:
          "Tome todos sus medicamentos habituales como de costumbre a menos que su médico le indique lo contrario. Use su inhalador o nebulizador a la hora habitual. Traiga su inhalador de rescate incluso si no lo usa a diario. Nuestra oficina lo llamará 2-3 días antes de la prueba para revisar los medicamentos — algunos pueden interferir con la prueba."
      },
      {
        titleEn: "If you have diabetes",
        titleEs: "Si tiene diabetes",
        bodyEn:
          "Insulin pump: no change. Insulin-dependent: take half (½) your usual morning dose. Oral medication: do not take the morning of the test. All patients with diabetes should eat a light breakfast 2 hours before the appointment.",
        bodyEs:
          "Bomba de insulina: sin cambios. Insulinodependiente: tome la mitad (½) de su dosis matutina habitual. Medicamento oral: no lo tome la mañana de la prueba. Todos los pacientes con diabetes deben tomar un desayuno ligero 2 horas antes de la cita."
      },
      {
        titleEn: "What to wear",
        titleEs: "Qué vestir",
        bodyEn:
          "Treadmill-appropriate clothing and sneakers or other closed walking shoes. Women: wear a bra or sports bra. Avoid one-piece dresses or full slips. Bring a sweater or jacket for the waiting area. No lotions or powder on your chest or arms. Don't smoke after midnight the night before.",
        bodyEs:
          "Ropa apropiada para caminadora y zapatillas u otros zapatos cerrados para caminar. Mujeres: use sostén o sostén deportivo. Evite vestidos de una pieza o enaguas completas. Traiga un suéter o chaqueta para la sala de espera. No use lociones ni polvo en el pecho o los brazos. No fume después de la medianoche la noche anterior."
      },
      {
        titleEn: "What to bring",
        titleEs: "Qué traer",
        bodyEn:
          "A list of your medications, the written order for the test, your insurance card(s), photo ID, and any required referral. If you use oxygen to sleep, bring your oxygen with you.",
        bodyEs:
          "Una lista de sus medicamentos, la orden escrita para la prueba, su(s) tarjeta(s) de seguro, identificación con foto y cualquier referencia requerida. Si usa oxígeno para dormir, traiga su oxígeno con usted."
      },
      {
        titleEn: "Comfort and accessibility",
        titleEs: "Comodidad y accesibilidad",
        bodyEn:
          "You'll need to lie flat on your back with your arms above your head for 15 minutes per image set (two sets total). The camera moves close to your chin but your head stays out of the scanner. The camera table holds up to 400 pounds. If you use a wheelchair, you'll need to bear weight on your legs to stand and turn onto the table — we can assist but cannot lift you. Tell us in advance if you have claustrophobia, severe anxiety, back/arm/leg problems, or trouble breathing when lying flat.",
        bodyEs:
          "Deberá acostarse boca arriba con los brazos sobre la cabeza durante 15 minutos por serie de imágenes (dos series en total). La cámara se acerca a su mentón pero su cabeza permanece fuera del escáner. La mesa de la cámara soporta hasta 400 libras. Si usa silla de ruedas, deberá soportar peso en las piernas para pararse y girar hacia la mesa — podemos asistir pero no podemos levantarlo. Díganos con anticipación si tiene claustrofobia, ansiedad severa, problemas de espalda/brazo/pierna o dificultad para respirar al estar acostado."
      },
      {
        titleEn: "What happens during the test",
        titleEs: "Qué sucede durante la prueba",
        bodyEn:
          "We place an IV in your arm to inject a small amount of radioactive material. We take resting pictures of your heart first. You then walk on the treadmill (or receive medication that mimics exercise), with a second injection during the stress phase, followed by a second set of pictures.",
        bodyEs:
          "Colocamos una vía intravenosa en su brazo para inyectar una pequeña cantidad de material radiactivo. Primero tomamos imágenes de su corazón en reposo. Luego camina en la caminadora (o recibe medicamento que imita el ejercicio), con una segunda inyección durante la fase de esfuerzo, seguida de una segunda serie de imágenes."
      },
      {
        titleEn: "Confirming your appointment",
        titleEs: "Confirmar su cita",
        bodyEn:
          "Our office will call you 2-3 days before the test. If we can't reach you, you must call us at 856-546-3006 ext. 2250 to confirm — the radioactive material is ordered specifically for you and can't be saved for later.",
        bodyEs:
          "Nuestra oficina lo llamará 2-3 días antes de la prueba. Si no podemos comunicarnos con usted, debe llamarnos al 856-546-3006 ext. 2250 para confirmar — el material radiactivo se ordena específicamente para usted y no se puede guardar para después."
      }
    ],
    pdfs: [
      {
        labelEn: "Treadmill instructions (PDF)",
        labelEs: "Instrucciones de caminadora (PDF)",
        urlEn:
          "https://www.hearthousenj.com/hubfs/THH/Patient%20Forms%20and%20Docs/2-Treadmill-Nuclear-Instructions-PINK-2019.pdf",
        urlEs:
          "https://www.hearthousenj.com/hubfs/THH/Patient%20Forms%20and%20Docs/spanish/Spanish%20-%20Treadmill%20Nuclear%20Stress%20Test%20instructions.pdf"
      },
      {
        labelEn: "Pre-visit checklist (PDF)",
        labelEs: "Lista de verificación previa a la visita (PDF)",
        urlEn:
          "https://www.hearthousenj.com/hubfs/THH/Patient%20Forms%20and%20Docs/6-Nuclear-Stress-Test-Patient-Checklist-Pastel-Green-2019.pdf",
        urlEs:
          "https://www.hearthousenj.com/hubfs/THH/Patient%20Forms%20and%20Docs/spanish/Spanish%20-%20Nuclear%20Stress%20Test%20Checklist.pdf"
      }
    ],
    phone: PHONE,
    phoneExt: PHONE_EXT
  },
  {
    slug: "pet-ct-scan",
    icon: "scan",
    color: "blue",
    titleEn: "PET/CT Scan",
    titleEs: "Tomografía PET/CT",
    shortEn: "PET/CT scan",
    shortEs: "Tomografía PET/CT",
    summaryEn:
      "Cardiac PET/CT is a high-resolution imaging stress test. You'll lie on the scanner table while a small amount of radioactive material lets us photograph your heart at rest and under pharmacologic stress.",
    summaryEs:
      "El PET/CT cardíaco es una prueba de esfuerzo por imágenes de alta resolución. Se acostará en la mesa del escáner mientras una pequeña cantidad de material radiactivo nos permite fotografiar su corazón en reposo y bajo esfuerzo farmacológico.",
    durationEn: "About 1.5 hours total. Arrive 30 minutes before your appointment to register.",
    durationEs: "Aproximadamente 1.5 horas en total. Llegue 30 minutos antes de su cita para registrarse.",
    prep: [
      {
        titleEn: "No caffeine for 24 hours",
        titleEs: "Sin cafeína durante 24 horas",
        bodyEn:
          "Caffeine counteracts the medication used during the test, and your appointment will be cancelled if you have any. This includes coffee, tea, soda, chocolate, and energy drinks — regular AND decaf. You may drink water, juice, or white milk.",
        bodyEs:
          "La cafeína contrarresta el medicamento utilizado durante la prueba y su cita será cancelada si la consume. Esto incluye café, té, refrescos, chocolate y bebidas energéticas — regular Y descafeinado. Puede beber agua, jugo o leche blanca."
      },
      {
        titleEn: "Theophylline-based breathing drugs",
        titleEs: "Medicamentos respiratorios a base de teofilina",
        bodyEn:
          "If you take a breathing medication that contains theophylline, it must be stopped for 48 hours before your appointment. Check the label and confirm with your doctor before stopping any medication.",
        bodyEs:
          "Si toma un medicamento respiratorio que contiene teofilina, debe suspenderlo durante 48 horas antes de su cita. Revise la etiqueta y confirme con su médico antes de suspender cualquier medicamento."
      },
      {
        titleEn: "Fast for 4 hours before the test",
        titleEs: "Ayune durante 4 horas antes de la prueba",
        bodyEn:
          "You may have a light breakfast or lunch (juice, water, white milk, toast, cereal) up to 4 hours before your appointment. No food or water in the 4 hours immediately before. If you need to take medications during this 4-hour window, you may do so with a few sips of water. Drink extra water the day before if your veins are hard to access.",
        bodyEs:
          "Puede tomar un desayuno o almuerzo ligero (jugo, agua, leche blanca, tostadas, cereal) hasta 4 horas antes de su cita. Nada de comida ni agua en las 4 horas inmediatamente anteriores. Si necesita tomar medicamentos durante esta ventana de 4 horas, puede hacerlo con unos sorbos de agua. Beba agua adicional el día anterior si sus venas son difíciles de acceder."
      },
      {
        titleEn: "Medications",
        titleEs: "Medicamentos",
        bodyEn:
          "Take all your regular medications as usual unless your doctor tells you otherwise. Use your inhaler or nebulizer at the usual time. Bring your rescue inhaler with you. If you're oxygen-dependent, bring your oxygen.",
        bodyEs:
          "Tome todos sus medicamentos habituales como de costumbre a menos que su médico le indique lo contrario. Use su inhalador o nebulizador a la hora habitual. Traiga su inhalador de rescate con usted. Si depende del oxígeno, traiga su oxígeno."
      },
      {
        titleEn: "If you have diabetes",
        titleEs: "Si tiene diabetes",
        bodyEn:
          "Insulin pump: no change. Insulin-dependent: take half (½) your usual morning dose. Oral medication: do not take the morning of the test.",
        bodyEs:
          "Bomba de insulina: sin cambios. Insulinodependiente: tome la mitad (½) de su dosis matutina habitual. Medicamento oral: no lo tome la mañana de la prueba."
      },
      {
        titleEn: "What to wear",
        titleEs: "Qué vestir",
        bodyEn:
          "A comfortable, warm, two-piece outfit. No shirts with metal buttons or zippers. Women: no underwire bras. No necklaces. No lotions or powder on your chest or arms. Bring a blanket if you'd like extra warmth. Don't smoke after midnight the night before.",
        bodyEs:
          "Un conjunto cómodo, cálido, de dos piezas. Sin camisas con botones o cremalleras metálicas. Mujeres: sin sostenes con aros. Sin collares. Sin lociones ni polvo en el pecho o los brazos. Traiga una manta si desea más calor. No fume después de la medianoche la noche anterior."
      },
      {
        titleEn: "What to bring",
        titleEs: "Qué traer",
        bodyEn:
          "A list of your medications, the written order for the test, your insurance card(s), and photo ID.",
        bodyEs:
          "Una lista de sus medicamentos, la orden escrita para la prueba, su(s) tarjeta(s) de seguro e identificación con foto."
      },
      {
        titleEn: "Comfort and accessibility",
        titleEs: "Comodidad y accesibilidad",
        bodyEn:
          "You'll lie on the scanner table for about 30 minutes. You go headfirst into the CT scanner for about 2 minutes, then your body moves into the PET scanner for the remaining 25 minutes — your head and arms stay out. The scanner table holds up to 500 pounds. If you use a wheelchair, you'll need to bear weight on your legs to stand and turn onto the table — we can assist but cannot lift you. Tell us if you have claustrophobia, severe anxiety, PTSD, back/arm/leg problems, or trouble breathing when lying flat.",
        bodyEs:
          "Se acostará en la mesa del escáner durante aproximadamente 30 minutos. Entra de cabeza en el escáner CT durante unos 2 minutos, luego su cuerpo se mueve al escáner PET durante los 25 minutos restantes — su cabeza y brazos permanecen fuera. La mesa del escáner soporta hasta 500 libras. Si usa silla de ruedas, deberá soportar peso en las piernas para pararse y girar hacia la mesa — podemos asistir pero no podemos levantarlo. Díganos si tiene claustrofobia, ansiedad severa, TEPT, problemas de espalda/brazo/pierna o dificultad para respirar al estar acostado."
      },
      {
        titleEn: "What happens during the test",
        titleEs: "Qué sucede durante la prueba",
        bodyEn:
          "We place an IV in your arm for an infusion of radioactive material that lets us photograph your heart at rest. After the initial images, you undergo a pharmacologic stress test on the PET scanner table — a second injection happens during the stress phase, then a second set of pictures.",
        bodyEs:
          "Colocamos una vía intravenosa en su brazo para una infusión de material radiactivo que nos permite fotografiar su corazón en reposo. Después de las imágenes iniciales, se somete a una prueba de esfuerzo farmacológico en la mesa del escáner PET — una segunda inyección ocurre durante la fase de esfuerzo, luego una segunda serie de imágenes."
      },
      {
        titleEn: "Confirming your appointment",
        titleEs: "Confirmar su cita",
        bodyEn:
          "Call within 48 hours to review instructions and confirm your appointment. If we can't speak with you, your test will be rescheduled. Call 856-546-3006 ext. 2250 with questions.",
        bodyEs:
          "Llame dentro de las 48 horas para revisar las instrucciones y confirmar su cita. Si no podemos hablar con usted, su prueba será reprogramada. Llame al 856-546-3006 ext. 2250 con preguntas."
      }
    ],
    pdfs: [
      {
        labelEn: "PET/CT instructions (PDF)",
        labelEs: "Instrucciones de PET/CT (PDF)",
        urlEn:
          "https://www.hearthousenj.com/hubfs/THH/Patient%20Forms%20and%20Docs/PET-CT-instructions-Dec21.pdf",
        urlEs:
          "https://www.hearthousenj.com/hubfs/THH/Patient%20Forms%20and%20Docs/spanish/Spanish%20-%20Cardiac%20PET-CT%20Scan%20Instructions.pdf"
      },
      {
        labelEn: "PET/CT pre-visit checklist (PDF)",
        labelEs: "Lista de verificación previa a PET/CT (PDF)",
        urlEn:
          "https://www.hearthousenj.com/hubfs/THH/Patient%20Forms%20and%20Docs/12-PET-CT-checklist-2021.pdf",
        urlEs:
          "https://www.hearthousenj.com/hubfs/THH/Patient%20Forms%20and%20Docs/spanish/Spanish%20-%20Cardiac%20PET-CT%20Checklist.pdf"
      }
    ],
    phone: PHONE,
    phoneExt: PHONE_EXT
  },
  {
    slug: "muga-scan",
    icon: "activity",
    color: "purple",
    titleEn: "MUGA Scan (Gated Blood Pool)",
    titleEs: "Exploración MUGA (Reserva sanguínea sincronizada)",
    shortEn: "MUGA scan",
    shortEs: "Exploración MUGA",
    summaryEn:
      "A MUGA scan measures how efficiently your heart pumps. It's a safe, painless procedure that uses two small injections to make your red blood cells visible to a special camera.",
    summaryEs:
      "Una exploración MUGA mide qué tan eficientemente bombea su corazón. Es un procedimiento seguro e indoloro que usa dos pequeñas inyecciones para hacer visibles sus glóbulos rojos a una cámara especial.",
    durationEn: "About 1 hour total. The injections circulate for 15-20 minutes each, and the scan itself takes about 30 minutes.",
    durationEs: "Aproximadamente 1 hora en total. Las inyecciones circulan durante 15-20 minutos cada una, y la exploración en sí toma aproximadamente 30 minutos.",
    prep: [
      {
        titleEn: "No special preparation",
        titleEs: "Sin preparación especial",
        bodyEn:
          "There are no dietary restrictions or special prep for a MUGA scan. Eat and drink normally.",
        bodyEs:
          "No hay restricciones dietéticas ni preparación especial para una exploración MUGA. Coma y beba normalmente."
      },
      {
        titleEn: "What happens during the test",
        titleEs: "Qué sucede durante la prueba",
        bodyEn:
          "You'll receive two injections 20 minutes apart. The injections briefly make your red blood cells radioactive, which lets a special camera and computer measure your heart's pumping efficiency. You'll have no side effects from the injections, and the radiation exposure is minimal. The technologist processes the study after you leave, and your cardiologist interprets the results — your referring physician should have them within a few days.",
        bodyEs:
          "Recibirá dos inyecciones con 20 minutos de diferencia. Las inyecciones hacen brevemente radiactivos sus glóbulos rojos, lo que permite que una cámara y computadora especiales midan la eficiencia de bombeo de su corazón. No tendrá efectos secundarios de las inyecciones y la exposición a radiación es mínima. El tecnólogo procesa el estudio después de que se vaya, y su cardiólogo interpreta los resultados — su médico de referencia los debería tener en unos días."
      },
      {
        titleEn: "Questions",
        titleEs: "Preguntas",
        bodyEn:
          "Call 856-546-3006 ext. 2250 with any questions before your appointment.",
        bodyEs:
          "Llame al 856-546-3006 ext. 2250 con cualquier pregunta antes de su cita."
      }
    ],
    pdfs: [
      {
        labelEn: "MUGA instructions (PDF)",
        labelEs: "Instrucciones de MUGA (PDF)",
        urlEn:
          "https://www.hearthousenj.com/hubfs/THH/Patient%20Forms%20and%20Docs/Muga-Scan-Instructions.pdf",
        urlEs:
          "https://www.hearthousenj.com/hubfs/THH/Patient%20Forms%20and%20Docs/spanish/Spanish%20-%20Muga%20scan%20instructions.pdf"
      }
    ],
    phone: PHONE,
    phoneExt: PHONE_EXT
  }
];

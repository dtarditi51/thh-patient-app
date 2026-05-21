// CardioSmart topic mapping. Spanish URLs verified per-topic against cardiosmart.org/es.
// "esUrl" null means ACC does not yet have a Spanish version; UI falls back to English with a note.

export type EducationTopic = {
  slug: string;
  icon: string; // lucide icon name
  color: "red" | "blue" | "green" | "purple" | "teal" | "pink" | "amber" | "rose";
  title: { en: string; es: string };
  blurb: { en: string; es: string };
  summary: { en: string; es: string };
  whenToCall: { en: string[]; es: string[] };
  questionsToAsk: { en: string[]; es: string[] };
  cardioSmartUrl: { en: string; es: string | null };
  relatedSlugs: string[];
};

export const educationTopics: EducationTopic[] = [
  {
    slug: "atrial-fibrillation",
    icon: "Activity",
    color: "red",
    title: { en: "Atrial fibrillation", es: "Fibrilación auricular" },
    blurb: { en: "Symptoms, stroke risk, treatment", es: "Síntomas, riesgo de ACV, tratamiento" },
    summary: {
      en: "Atrial fibrillation (AFib) is an irregular heart rhythm that raises stroke risk. Many patients feel palpitations, fatigue, or shortness of breath, but some have no symptoms at all. Treatment focuses on stroke prevention, rhythm or rate control, and managing underlying conditions like high blood pressure or sleep apnea.",
      es: "La fibrilación auricular (FA) es un ritmo cardíaco irregular que aumenta el riesgo de accidente cerebrovascular. Muchos pacientes sienten palpitaciones, fatiga o dificultad para respirar, aunque algunos no presentan síntomas. El tratamiento se centra en prevenir ACV, controlar el ritmo o la frecuencia, y tratar condiciones subyacentes como la presión alta o la apnea del sueño."
    },
    whenToCall: {
      en: [
        "Fast or irregular heartbeat lasting more than a few minutes",
        "Chest pain or pressure",
        "Sudden shortness of breath, dizziness, or fainting",
        "New weakness or numbness on one side of the body (call 911)"
      ],
      es: [
        "Latidos rápidos o irregulares que duran más de unos minutos",
        "Dolor o presión en el pecho",
        "Falta de aire repentina, mareos o desmayo",
        "Debilidad o entumecimiento en un lado del cuerpo (llame al 911)"
      ]
    },
    questionsToAsk: {
      en: [
        "What is my stroke risk score (CHA2DS2-VASc)?",
        "Should I be on a blood thinner?",
        "Is rhythm control or rate control right for me?",
        "Am I a candidate for an ablation procedure?",
        "How can I track my heart rhythm at home?"
      ],
      es: [
        "¿Cuál es mi puntuación de riesgo de ACV (CHA2DS2-VASc)?",
        "¿Debería tomar un anticoagulante?",
        "¿Es mejor para mí el control del ritmo o de la frecuencia?",
        "¿Soy candidato para una ablación?",
        "¿Cómo puedo monitorear mi ritmo cardíaco en casa?"
      ]
    },
    cardioSmartUrl: {
      en: "https://www.cardiosmart.org/topics/atrial-fibrillation",
      es: "https://www.cardiosmart.org/es/temas/fibrilacion-auricular"
    },
    relatedSlugs: ["high-blood-pressure", "heart-failure"]
  },
  {
    slug: "cholesterol",
    icon: "Droplet",
    color: "blue",
    title: { en: "High cholesterol", es: "Colesterol alto" },
    blurb: { en: "LDL targets and statins", es: "Objetivos de LDL y estatinas" },
    summary: {
      en: "Cholesterol is a fat-like substance your body needs in small amounts. High LDL (\"bad\") cholesterol builds plaque in your arteries and raises heart attack and stroke risk. Lifestyle changes plus medications like statins can lower LDL substantially. Newer measures like ApoB give an even clearer picture of cardiovascular risk.",
      es: "El colesterol es una sustancia grasa que su cuerpo necesita en pequeñas cantidades. El LDL (\"malo\") alto forma placa en las arterias y aumenta el riesgo de infarto y ACV. Los cambios de estilo de vida más medicamentos como las estatinas pueden reducir el LDL significativamente. Medidas más nuevas como ApoB ofrecen una imagen aún más clara del riesgo cardiovascular."
    },
    whenToCall: {
      en: [
        "New or worsening chest pain with exertion",
        "Family history of early heart disease and you have not been screened",
        "Muscle pain or weakness after starting a statin",
        "LDL still elevated after 3 months on therapy"
      ],
      es: [
        "Dolor de pecho nuevo o peor con esfuerzo",
        "Historia familiar de enfermedad cardíaca temprana sin haberse hecho pruebas",
        "Dolor o debilidad muscular después de empezar una estatina",
        "LDL todavía alto después de 3 meses de tratamiento"
      ]
    },
    questionsToAsk: {
      en: [
        "What is my target LDL?",
        "Should I have my ApoB or Lp(a) checked?",
        "Do I need a coronary calcium scan?",
        "What lifestyle changes would lower my risk the most?",
        "Are there alternatives if statins do not agree with me?"
      ],
      es: [
        "¿Cuál es mi LDL objetivo?",
        "¿Debería medirme ApoB o Lp(a)?",
        "¿Necesito una tomografía de calcio coronario?",
        "¿Qué cambios de estilo de vida reducirían más mi riesgo?",
        "¿Hay alternativas si las estatinas no me sientan bien?"
      ]
    },
    cardioSmartUrl: {
      en: "https://www.cardiosmart.org/topics/cholesterol",
      es: "https://www.cardiosmart.org/es/temas/colesterol"
    },
    relatedSlugs: ["coronary-disease", "prevention"]
  },
  {
    slug: "high-blood-pressure",
    icon: "Gauge",
    color: "green",
    title: { en: "High blood pressure", es: "Presión arterial alta" },
    blurb: { en: "Home monitoring guide", es: "Guía de monitoreo en casa" },
    summary: {
      en: "High blood pressure (hypertension) damages arteries silently for years before causing symptoms. Most adults should aim for a reading below 130/80. Home monitoring with a validated cuff is more accurate than office readings and helps your team adjust medications. Reducing sodium, regular exercise, and weight management all lower blood pressure meaningfully.",
      es: "La presión arterial alta (hipertensión) daña las arterias silenciosamente durante años antes de causar síntomas. La mayoría de adultos deben tener menos de 130/80. El monitoreo en casa con un brazalete validado es más preciso que las lecturas en el consultorio y ayuda a su equipo a ajustar medicamentos. Reducir el sodio, ejercicio regular y control de peso bajan la presión significativamente."
    },
    whenToCall: {
      en: [
        "Home readings above 160/100 on more than one occasion",
        "Severe headache with very high blood pressure",
        "Chest pain or shortness of breath",
        "Vision changes or confusion (call 911)"
      ],
      es: [
        "Lecturas en casa mayores de 160/100 en más de una ocasión",
        "Dolor de cabeza fuerte con presión muy alta",
        "Dolor de pecho o falta de aire",
        "Cambios en la visión o confusión (llame al 911)"
      ]
    },
    questionsToAsk: {
      en: [
        "What is my target blood pressure?",
        "How and when should I check my pressure at home?",
        "Which of my medications affect my pressure?",
        "How much sodium should I aim for daily?",
        "Should I be screened for sleep apnea?"
      ],
      es: [
        "¿Cuál es mi presión objetivo?",
        "¿Cómo y cuándo debo medirme la presión en casa?",
        "¿Cuáles de mis medicamentos afectan mi presión?",
        "¿Cuánto sodio debería consumir al día?",
        "¿Debería hacerme una prueba de apnea del sueño?"
      ]
    },
    cardioSmartUrl: {
      en: "https://www.cardiosmart.org/topics/high-blood-pressure",
      es: "https://www.cardiosmart.org/es/temas/presion-arterial-alta"
    },
    relatedSlugs: ["atrial-fibrillation", "heart-failure"]
  },
  {
    slug: "heart-failure",
    icon: "HeartCrack",
    color: "purple",
    title: { en: "Heart failure", es: "Insuficiencia cardíaca" },
    blurb: { en: "Daily weights and meds", es: "Peso diario y medicamentos" },
    summary: {
      en: "Heart failure means your heart cannot pump blood as well as it should. It does not mean your heart has stopped. Most patients live fuller lives by taking guideline-directed medications, weighing themselves daily, limiting sodium and fluids, and watching for early warning signs of fluid buildup.",
      es: "La insuficiencia cardíaca significa que su corazón no bombea sangre tan bien como debería. No significa que su corazón se haya detenido. La mayoría de los pacientes viven vidas más plenas tomando medicamentos según las guías, pesándose a diario, limitando sodio y líquidos, y vigilando signos tempranos de acumulación de líquido."
    },
    whenToCall: {
      en: [
        "Weight gain of 3 lbs in 2 days or 5 lbs in a week",
        "New or worsening swelling in legs, ankles, or abdomen",
        "Shortness of breath at rest or lying flat",
        "Persistent cough or wheezing, especially at night"
      ],
      es: [
        "Aumento de 3 libras en 2 días o 5 libras en una semana",
        "Hinchazón nueva o peor en piernas, tobillos o abdomen",
        "Falta de aire en reposo o al acostarse",
        "Tos persistente o sibilancias, especialmente de noche"
      ]
    },
    questionsToAsk: {
      en: [
        "Which type of heart failure do I have (preserved or reduced EF)?",
        "Am I on all four guideline-directed medications?",
        "What is my target daily sodium and fluid limit?",
        "When should I call versus go to the ER?",
        "Should I be evaluated for advanced therapies?"
      ],
      es: [
        "¿Qué tipo de insuficiencia cardíaca tengo (FE preservada o reducida)?",
        "¿Estoy tomando los cuatro medicamentos recomendados?",
        "¿Cuál es mi límite diario de sodio y líquidos?",
        "¿Cuándo debo llamar versus ir a emergencias?",
        "¿Debería evaluarme para terapias avanzadas?"
      ]
    },
    cardioSmartUrl: {
      en: "https://www.cardiosmart.org/topics/heart-failure",
      es: "https://www.cardiosmart.org/es/temas/insuficiencia-cardiaca"
    },
    relatedSlugs: ["atrial-fibrillation", "high-blood-pressure"]
  },
  {
    slug: "coronary-disease",
    icon: "Heart",
    color: "teal",
    title: { en: "Coronary artery disease", es: "Enfermedad coronaria" },
    blurb: { en: "Chest pain and prevention", es: "Dolor de pecho y prevención" },
    summary: {
      en: "Coronary artery disease (CAD) is plaque buildup in the arteries that supply your heart. Symptoms range from no symptoms at all to chest pain with exertion (angina) to a heart attack. Treatment combines medications, lifestyle changes, and sometimes procedures like stents or bypass surgery.",
      es: "La enfermedad coronaria (EAC) es acumulación de placa en las arterias que alimentan su corazón. Los síntomas van desde nada hasta dolor de pecho con esfuerzo (angina) o un infarto. El tratamiento combina medicamentos, cambios de estilo de vida y a veces procedimientos como stents o cirugía de bypass."
    },
    whenToCall: {
      en: [
        "Chest pain or pressure, especially with exertion or stress",
        "New shortness of breath with usual activities",
        "Pain in the jaw, neck, arm, or back without clear cause",
        "Chest pain at rest or not relieved with rest (call 911)"
      ],
      es: [
        "Dolor o presión en el pecho, especialmente con esfuerzo o estrés",
        "Falta de aire nueva con actividades habituales",
        "Dolor en mandíbula, cuello, brazo o espalda sin causa clara",
        "Dolor de pecho en reposo o que no mejora (llame al 911)"
      ]
    },
    questionsToAsk: {
      en: [
        "What is my 10-year heart disease risk?",
        "Do I need a stress test or coronary calcium scan?",
        "Am I on the right medications?",
        "What does my chest pain pattern suggest?",
        "Could cardiac rehab help me?"
      ],
      es: [
        "¿Cuál es mi riesgo de enfermedad cardíaca a 10 años?",
        "¿Necesito una prueba de esfuerzo o tomografía de calcio?",
        "¿Estoy tomando los medicamentos correctos?",
        "¿Qué sugiere el patrón de mi dolor de pecho?",
        "¿Me ayudaría la rehabilitación cardíaca?"
      ]
    },
    cardioSmartUrl: {
      en: "https://www.cardiosmart.org/topics/coronary-artery-disease",
      es: null
    },
    relatedSlugs: ["cholesterol", "prevention"]
  },
  {
    slug: "valve-disease",
    icon: "HeartHandshake",
    color: "pink",
    title: { en: "Heart valve disease", es: "Enfermedad valvular cardíaca" },
    blurb: { en: "Aortic and mitral conditions", es: "Condiciones aórticas y mitrales" },
    summary: {
      en: "Heart valves control the direction of blood flow through your heart. Valves can become narrowed (stenosis) or leaky (regurgitation). Mild disease is often watched over time; more advanced disease may need valve repair or replacement. Modern options like TAVR allow many patients to avoid open-heart surgery.",
      es: "Las válvulas cardíacas controlan la dirección del flujo de sangre. Pueden estrecharse (estenosis) o tener fugas (regurgitación). La enfermedad leve a menudo se vigila; la avanzada puede requerir reparación o reemplazo de la válvula. Opciones modernas como TAVR permiten a muchos pacientes evitar la cirugía a corazón abierto."
    },
    whenToCall: {
      en: [
        "New shortness of breath with activity",
        "Dizziness or fainting, especially with exertion",
        "Chest pain or tightness",
        "Swelling in legs or abdomen"
      ],
      es: [
        "Falta de aire nueva con actividad",
        "Mareos o desmayos, especialmente con esfuerzo",
        "Dolor o presión en el pecho",
        "Hinchazón en piernas o abdomen"
      ]
    },
    questionsToAsk: {
      en: [
        "Which valve is affected and how severely?",
        "How often should I have an echocardiogram?",
        "What symptoms would mean I need treatment now?",
        "Am I a candidate for TAVR or other catheter-based repair?",
        "Do I need antibiotics before dental work?"
      ],
      es: [
        "¿Qué válvula está afectada y qué tan grave?",
        "¿Con qué frecuencia debo hacerme un ecocardiograma?",
        "¿Qué síntomas indicarían que necesito tratamiento ahora?",
        "¿Soy candidato para TAVR u otra reparación con catéter?",
        "¿Necesito antibióticos antes del dentista?"
      ]
    },
    cardioSmartUrl: {
      en: "https://www.cardiosmart.org/topics/heart-valve-disease",
      es: null
    },
    relatedSlugs: ["heart-failure", "atrial-fibrillation"]
  },
  {
    slug: "vascular-disease",
    icon: "Footprints",
    color: "amber",
    title: { en: "PAD & vein disease", es: "EAP y enfermedad venosa" },
    blurb: { en: "Leg pain and swelling", es: "Dolor y hinchazón de piernas" },
    summary: {
      en: "Peripheral artery disease (PAD) and vein disease both affect blood flow in the legs but in opposite ways. PAD narrows arteries and causes leg pain with walking. Vein disease causes blood to pool, leading to varicose veins, swelling, or skin changes. Both are treatable and often go undiagnosed.",
      es: "La enfermedad arterial periférica (EAP) y la enfermedad venosa afectan el flujo sanguíneo en las piernas de formas opuestas. La EAP estrecha las arterias y causa dolor al caminar. La enfermedad venosa hace que la sangre se acumule, causando várices, hinchazón o cambios en la piel. Ambas son tratables y a menudo no se diagnostican."
    },
    whenToCall: {
      en: [
        "Leg pain with walking that goes away with rest",
        "Wounds on feet or legs that will not heal",
        "Sudden, severe leg pain or cold, pale leg (call 911)",
        "Painful, swollen calf, especially after travel or surgery"
      ],
      es: [
        "Dolor de pierna al caminar que mejora con el descanso",
        "Heridas en pies o piernas que no sanan",
        "Dolor repentino y fuerte o pierna fría y pálida (llame al 911)",
        "Pantorrilla dolorosa e hinchada, especialmente tras viaje o cirugía"
      ]
    },
    questionsToAsk: {
      en: [
        "Should I have an ankle-brachial index test?",
        "What can I do to walk farther without pain?",
        "Do my veins need treatment or are they cosmetic?",
        "Am I at risk for a blood clot?",
        "Which lifestyle changes help the most?"
      ],
      es: [
        "¿Debería hacerme un índice tobillo-brazo?",
        "¿Qué puedo hacer para caminar más sin dolor?",
        "¿Mis venas necesitan tratamiento o son cosméticas?",
        "¿Estoy en riesgo de un coágulo?",
        "¿Qué cambios de estilo de vida ayudan más?"
      ]
    },
    cardioSmartUrl: {
      en: "https://www.cardiosmart.org/topics/peripheral-artery-disease",
      es: null
    },
    relatedSlugs: ["cholesterol", "prevention"]
  },
  {
    slug: "prevention",
    icon: "ShieldHeart",
    color: "rose",
    title: { en: "Prevention", es: "Prevención" },
    blurb: { en: "Diet, exercise, screening", es: "Dieta, ejercicio, exámenes" },
    summary: {
      en: "Most heart disease is preventable. The biggest gains come from not smoking, regular physical activity, a Mediterranean-style diet, managing blood pressure and cholesterol, and quality sleep. A coronary calcium scan can refine risk and guide treatment decisions in adults aged 40 to 75 who are not already on a statin.",
      es: "La mayoría de las enfermedades cardíacas se pueden prevenir. Los mayores beneficios vienen de no fumar, actividad física regular, una dieta tipo mediterránea, controlar la presión y el colesterol, y dormir bien. Una tomografía de calcio coronario puede afinar el riesgo y guiar decisiones en adultos de 40 a 75 años que no toman estatinas."
    },
    whenToCall: {
      en: [
        "Family history of heart attack or stroke before age 60",
        "Borderline cholesterol or blood pressure for over 6 months",
        "Considering starting an exercise program after a long break",
        "Wanting a personalized risk assessment"
      ],
      es: [
        "Historia familiar de infarto o ACV antes de los 60 años",
        "Colesterol o presión limítrofes por más de 6 meses",
        "Considerando empezar a hacer ejercicio tras una larga pausa",
        "Quiere una evaluación personalizada de riesgo"
      ]
    },
    questionsToAsk: {
      en: [
        "What is my 10-year and lifetime heart disease risk?",
        "Should I have a coronary calcium scan?",
        "What is the right exercise dose for me?",
        "Should I check my ApoB or Lp(a)?",
        "Do I need a sleep study?"
      ],
      es: [
        "¿Cuál es mi riesgo a 10 años y de por vida?",
        "¿Debería hacerme una tomografía de calcio?",
        "¿Cuál es la dosis correcta de ejercicio para mí?",
        "¿Debería medirme ApoB o Lp(a)?",
        "¿Necesito un estudio de sueño?"
      ]
    },
    cardioSmartUrl: {
      en: "https://www.cardiosmart.org/topics/prevention",
      es: null
    },
    relatedSlugs: ["cholesterol", "high-blood-pressure", "coronary-disease"]
  }
];

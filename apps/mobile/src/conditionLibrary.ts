export type ConditionReference = {
  id: string;
  title: string;
  specialist: string;
  summary: string;
  topics: string[];
};

export const conditionReferences: ConditionReference[] = [
  {
    id: 'cardiology',
    title: 'Heart & Cardiovascular Care',
    specialist: 'Cardiologist',
    summary: 'Reference support for heart failure, blood pressure, rhythm problems, coronary disease, valve disorders, and cardiovascular risk.',
    topics: ['Heart failure', 'Hypertension', 'Arrhythmias including atrial fibrillation', 'Coronary artery disease and post-heart-attack care', 'Valve disorders'],
  },
  {
    id: 'hematology-oncology',
    title: 'Blood Disorders & Cancer',
    specialist: 'Hematologist / Oncologist',
    summary: 'Reference support for cancer, anemia, bleeding or clotting disorders, and blood cancers.',
    topics: ['Cancer', 'Anemia', 'Bleeding and platelet disorders', 'Clotting disorders', 'Leukemia, lymphoma, and myeloma'],
  },
  {
    id: 'nephrology',
    title: 'Kidney Care',
    specialist: 'Nephrologist',
    summary: 'Reference support for chronic kidney disease, kidney failure, dialysis, fluid balance, and electrolyte concerns.',
    topics: ['Chronic kidney disease', 'Kidney failure', 'Hemodialysis', 'Peritoneal dialysis', 'Fluid and electrolyte balance'],
  },
  {
    id: 'neurology',
    title: 'Neurological Care',
    specialist: 'Neurologist',
    summary: 'Reference support for stroke, TIA, dementia, Alzheimer’s disease, Parkinson’s disease, seizures, and other neurological concerns.',
    topics: ['Stroke', 'TIA', 'Dementia', 'Alzheimer’s disease', 'Parkinson’s disease', 'Seizures and neuropathy'],
  },
  {
    id: 'endocrinology',
    title: 'Diabetes, Thyroid & Hormone Care',
    specialist: 'Endocrinologist',
    summary: 'Reference support for diabetes, thyroid, adrenal, pituitary, metabolic, and selected bone-health conditions.',
    topics: ['Diabetes', 'Thyroid disorders', 'Adrenal disorders', 'Pituitary and hormonal disorders', 'Metabolic and bone-health conditions'],
  },
  {
    id: 'pulmonology',
    title: 'Lung & Breathing Care',
    specialist: 'Pulmonologist',
    summary: 'Reference support for COPD, asthma, respiratory infections, shortness of breath, oxygen needs, and chronic lung disease.',
    topics: ['COPD', 'Asthma', 'Pneumonia and recurrent respiratory infections', 'Shortness of breath', 'Oxygen needs and chronic lung disease'],
  },
  {
    id: 'rheumatology',
    title: 'Autoimmune & Inflammatory Care',
    specialist: 'Rheumatologist',
    summary: 'Reference support for rheumatoid arthritis, lupus, autoimmune disease, connective-tissue disease, and inflammatory conditions.',
    topics: ['Rheumatoid arthritis', 'Lupus', 'Autoimmune disease', 'Connective-tissue disease', 'Inflammatory arthritis and vasculitis'],
  },
];

export const vitalSignReferences = [
  { id: 'heart-rate', label: 'Heart Rate', range: '60–100 bpm', unit: 'bpm' },
  { id: 'respiratory-rate', label: 'Respiratory Rate', range: '12–20 breaths/min', unit: 'breaths/min' },
  { id: 'oxygen', label: 'Oxygen Saturation', range: '95–100%', unit: '%' },
  { id: 'blood-pressure', label: 'Blood Pressure', range: 'Less than 120/80 mmHg', unit: 'mmHg' },
  { id: 'temperature', label: 'Temperature', range: '97.8–99.1°F', unit: '°F' },
];

export const neurologyMonitoring = {
  dementia: [
    'Memory changes, repeated questions, or getting lost',
    'Judgment, finances, medicines, cooking, and driving',
    'Agitation, hallucinations, sleep changes, depression, anxiety, or wandering',
    'Walking, balance, swallowing, speech, appetite, continence, and self-care',
  ],
  parkinsons: [
    'Tremor, stiffness, slowness, balance, and falls',
    'Medication timing and observed effect',
    'Swallowing, weight, hallucinations, sleepiness, or confusion',
    'Therapy needs and home safety',
  ],
};

export const transitionChecklist = [
  'Keep the discharge instructions together and easy to find.',
  'Reconcile the current medication and supplement list after the hospital stay.',
  'Record follow-up appointments and which clinician is coordinating care.',
  'Write down warning signs and who to contact for routine, same-day, urgent, or emergency concerns.',
  'Keep care-team contact information together.',
  'Prepare questions about patient rights, advance directives, insurance, or Medicare when relevant.',
  'Track symptoms, vital signs, blood sugar, behavior, or other items only as directed by the care plan.',
];

export const supportAreas = [
  {
    id: 'advocacy',
    title: 'Patient Advocacy',
    description: 'Prepare questions, understand care-team roles, and keep important care information organized.',
  },
  {
    id: 'rights',
    title: 'Rights & Advance Care Planning',
    description: 'Program materials include patient-rights education and an advance-directive starter resource. Detailed approved content is still pending.',
  },
  {
    id: 'insurance',
    title: 'Insurance & Medicare Education',
    description: 'The program includes insurance and Medicare education. Detailed approved guidance is still pending.',
  },
  {
    id: 'faith',
    title: 'Faith & Caregiver Wellbeing',
    description: 'The program includes spiritual wellness and faith-based caregiver support. Approved coaching content is still pending.',
  },
];

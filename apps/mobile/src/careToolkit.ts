export type JournalPrompt = {
  id: string;
  label: string;
  helper: string;
};

export type SpecialistReference = {
  id: string;
  title: string;
  role: string;
  focus: string;
};

export const journalPrompts: JournalPrompt[] = [
  {
    id: 'breathing',
    label: 'Breathing',
    helper: 'Note whether breathing is usual, better, or worse than the person’s normal baseline.',
  },
  {
    id: 'cough',
    label: 'Cough & mucus',
    helper: 'Track changes in cough, mucus amount, thickness, or color.',
  },
  {
    id: 'activity',
    label: 'Activity & energy',
    helper: 'Record changes in walking, bathing, dressing, eating, sleeping, or usual activities.',
  },
  {
    id: 'cognition',
    label: 'Memory & behavior',
    helper: 'Record changes in memory, thinking, behavior, speech, balance, movement, or daily function.',
  },
];

export const medicationSafetyNotes = [
  'Keep one current list of prescription medicines, over-the-counter products, and supplements.',
  'Bring the current list to appointments and reconcile it after hospital or specialist visits.',
  'Do not independently change prescribed medicine, insulin, hormone, inhaler, or oxygen instructions.',
];

export const specialistReferences: SpecialistReference[] = [
  {
    id: 'primary',
    title: 'Primary Care Clinician',
    role: 'Overall care coordination',
    focus: 'Helps coordinate the overall plan and referrals across chronic conditions.',
  },
  {
    id: 'cardiology',
    title: 'Cardiologist',
    role: 'Heart & blood vessels',
    focus: 'Heart failure, blood pressure, rhythm problems, coronary disease, valve disorders, and cardiovascular risk.',
  },
  {
    id: 'pulmonology',
    title: 'Pulmonologist',
    role: 'Lungs & breathing',
    focus: 'COPD, asthma, respiratory infections, shortness of breath, oxygen needs, and other chronic lung disease.',
  },
  {
    id: 'neurology',
    title: 'Neurologist',
    role: 'Brain, spinal cord & nerves',
    focus: 'Stroke, TIA, dementia, Parkinson’s disease, seizures, neuropathy, and other neurological conditions.',
  },
  {
    id: 'nephrology',
    title: 'Nephrologist',
    role: 'Kidneys & fluid balance',
    focus: 'Kidney disease, kidney failure, dialysis, electrolyte problems, and kidney-related blood pressure concerns.',
  },
  {
    id: 'endocrinology',
    title: 'Endocrinologist',
    role: 'Hormones & metabolism',
    focus: 'Diabetes, thyroid, adrenal, pituitary, metabolic, and selected bone-health conditions.',
  },
  {
    id: 'hematology-oncology',
    title: 'Hematologist / Oncologist',
    role: 'Blood disorders & cancer',
    focus: 'Cancer, anemia, bleeding and clotting disorders, and blood cancers.',
  },
  {
    id: 'rheumatology',
    title: 'Rheumatologist',
    role: 'Inflammatory & autoimmune disease',
    focus: 'Inflammatory arthritis, lupus, autoimmune disease, and connective-tissue conditions.',
  },
];

export const appointmentChecklist = [
  'Bring one current medication and supplement list.',
  'Bring recent symptom notes and changes from the usual baseline.',
  'Bring recent test results or discharge instructions when available.',
  'Write down the questions you want answered before the visit.',
  'Ask what requires routine follow-up, same-day contact, emergency evaluation, or emergency services.',
  'Ask who is coordinating the overall care plan and which clinician should be contacted for specific concerns.',
];

export const copdAppointmentQuestions = [
  'Which inhalers are for daily control and which are for quick relief?',
  'What is this person’s usual breathing and oxygen saturation baseline?',
  'What changes mean we should contact the healthcare team today?',
  'What symptoms mean we should use emergency services?',
  'Would pulmonary rehabilitation be appropriate?',
];

export const neurologyAppointmentQuestions = [
  'What changes should we expect, and what changes are concerning?',
  'What is the medication schedule and what side effects should we report?',
  'Would physical, occupational, speech, swallowing, cognitive, or driving evaluation be helpful?',
  'What home-safety changes are recommended?',
  'What symptoms mean emergency services rather than a routine office call?',
];

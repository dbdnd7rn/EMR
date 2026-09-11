export type CareArea = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

export const careAreas: CareArea[] = [
  { id: 'heart', title: 'Heart Health', subtitle: 'Cardiology support', icon: '❤️' },
  { id: 'lungs', title: 'Lung Health', subtitle: 'COPD and breathing support', icon: '🫁' },
  { id: 'neuro', title: 'Neurological Care', subtitle: 'Stroke, memory and movement', icon: '🧠' },
  { id: 'kidney', title: 'Kidney Health', subtitle: 'Renal care support', icon: '🫘' },
];

export const dailyTools = [
  { id: 'checkin', title: "Today's Check-In", subtitle: 'Record symptoms and changes', icon: '✓' },
  { id: 'meds', title: 'Medications', subtitle: 'Keep one current medicine list', icon: 'Rx' },
  { id: 'team', title: 'Care Team', subtitle: 'Specialists and contacts', icon: '👥' },
  { id: 'appointments', title: 'Appointments', subtitle: 'Prepare questions and notes', icon: '📅' },
];

export const copdOverview = {
  title: 'COPD',
  description:
    'Chronic obstructive pulmonary disease is a long-term lung condition that can make breathing difficult. This toolkit helps caregivers organize observations, prepare questions and follow approved care guidance.',
  sections: [
    'Overview',
    'Symptoms & Triggers',
    'Daily Management',
    'Action Plan',
    'Monitor',
    'Questions to Ask',
    'Resources',
  ],
};

export const actionZones = [
  {
    id: 'green',
    label: 'GREEN',
    title: 'Doing Well',
    summary: 'Usual breathing, cough, sleep, appetite and activity level.',
  },
  {
    id: 'yellow',
    label: 'YELLOW',
    title: 'Worse Than Usual',
    summary: 'More coughing, breathlessness, wheezing, fatigue or noticeable mucus changes.',
  },
  {
    id: 'red',
    label: 'RED',
    title: 'Emergency',
    summary: 'Severe breathing difficulty, chest pain, blue or gray lips, fainting or new confusion.',
  },
];

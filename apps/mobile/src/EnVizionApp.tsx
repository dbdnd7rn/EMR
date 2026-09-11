import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { actionZones, copdOverview } from './content';
import {
  appointmentChecklist,
  copdAppointmentQuestions,
  journalPrompts,
  medicationSafetyNotes,
  neurologyAppointmentQuestions,
  specialistReferences,
} from './careToolkit';
import {
  ConditionReference,
  conditionReferences,
  neurologyMonitoring,
  supportAreas,
  transitionChecklist,
  vitalSignReferences,
} from './conditionLibrary';
import { FadeSlide, MotionPressable, PulseNotice } from './motion';
import { colors, radius, spacing } from './theme';

type Screen =
  | 'home'
  | 'library'
  | 'condition-detail'
  | 'copd'
  | 'neurology'
  | 'emergency'
  | 'journal'
  | 'vitals'
  | 'medications'
  | 'care-team'
  | 'appointments'
  | 'transition'
  | 'support';

type CheckInStatus = 'usual' | 'better' | 'worse';
type JournalEntry = { id: string; createdAt: string; statusByPrompt: Record<string, CheckInStatus>; note: string };
type MedicationItem = { id: string; name: string; details: string };
type VitalEntry = { id: string; createdAt: string; values: Record<string, string> };

export default function EnVizionApp() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedCondition, setSelectedCondition] = useState<ConditionReference | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [vitalEntries, setVitalEntries] = useState<VitalEntry[]>([]);

  const openCondition = (condition: ConditionReference) => {
    setSelectedCondition(condition);
    setScreen(condition.id === 'pulmonology' ? 'copd' : condition.id === 'neurology' ? 'neurology' : 'condition-detail');
  };

  if (screen === 'library') return <ConditionLibraryScreen onBack={() => setScreen('home')} onOpen={openCondition} />;
  if (screen === 'condition-detail' && selectedCondition) return <ConditionDetailScreen condition={selectedCondition} onBack={() => setScreen('library')} />;
  if (screen === 'copd') return <CopdScreen onBack={() => setScreen('library')} />;
  if (screen === 'neurology') return <NeurologyScreen onBack={() => setScreen('library')} onEmergency={() => setScreen('emergency')} />;
  if (screen === 'emergency') return <EmergencyScreen onBack={() => setScreen('home')} />;
  if (screen === 'journal') return <JournalScreen entries={journalEntries} onBack={() => setScreen('home')} onSave={setJournalEntries} />;
  if (screen === 'vitals') return <VitalsScreen entries={vitalEntries} onBack={() => setScreen('home')} onSave={setVitalEntries} />;
  if (screen === 'medications') return <MedicationScreen items={medications} onBack={() => setScreen('home')} onChange={setMedications} />;
  if (screen === 'care-team') return <CareTeamScreen onBack={() => setScreen('home')} />;
  if (screen === 'appointments') return <AppointmentScreen onBack={() => setScreen('home')} />;
  if (screen === 'transition') return <TransitionScreen onBack={() => setScreen('home')} />;
  if (screen === 'support') return <SupportScreen onBack={() => setScreen('home')} />;
  return <HomeScreen onNavigate={setScreen} />;
}

function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <FadeSlide style={styles.screenMotion} distance={10}>
        <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>{children}</ScrollView>
      </FadeSlide>
    </SafeAreaView>
  );
}

function HomeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <ScreenShell>
      <FadeSlide delay={40}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>EV</Text></View>
          <View style={styles.flexOne}><Text style={styles.brandName}>EnVizion Life</Text><Text style={styles.brandSubtitle}>Digital Caregiver Toolkit</Text></View>
        </View>
      </FadeSlide>

      <FadeSlide delay={100}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>CAREGIVER SUPPORT</Text>
          <Text style={styles.heroTitle}>Care with clarity</Text>
          <Text style={styles.heroText}>Learn, track, prepare, navigate, and support the person you care for.</Text>
        </View>
      </FadeSlide>

      <FadeSlide delay={160}><Text style={styles.sectionTitle}>Start here</Text></FadeSlide>
      <View style={styles.grid}>
        <Stagger delay={190}><HomeCard icon="📚" title="Learn" subtitle="Conditions & specialist guides" onPress={() => onNavigate('library')} /></Stagger>
        <Stagger delay={230}><HomeCard icon="✓" title="Track" subtitle="Journal & vital signs" onPress={() => onNavigate('journal')} /></Stagger>
        <Stagger delay={270}><HomeCard icon="📅" title="Prepare" subtitle="Appointments & medicines" onPress={() => onNavigate('appointments')} /></Stagger>
        <Stagger delay={310}><HomeCard icon="🧭" title="Navigate" subtitle="Hospital-to-home support" onPress={() => onNavigate('transition')} /></Stagger>
      </View>

      <FadeSlide delay={340}><Text style={styles.sectionTitle}>Care tools</Text></FadeSlide>
      <Stagger delay={370}><ToolRow icon="♥" title="Vital Signs" subtitle="Record readings and view client reference ranges" onPress={() => onNavigate('vitals')} /></Stagger>
      <Stagger delay={410}><ToolRow icon="Rx" title="Medication List" subtitle="Keep one current medicine and supplement list" onPress={() => onNavigate('medications')} /></Stagger>
      <Stagger delay={450}><ToolRow icon="👥" title="Care Team" subtitle="Understand who manages what" onPress={() => onNavigate('care-team')} /></Stagger>
      <Stagger delay={490}><ToolRow icon="✦" title="Support & Advocacy" subtitle="Rights, insurance, faith, and caregiver support" onPress={() => onNavigate('support')} /></Stagger>

      <FadeSlide delay={530}>
        <MotionPressable onPress={() => onNavigate('emergency')} style={styles.emergencyButton} accessibilityLabel="Open stroke emergency warning signs">
          <View style={styles.flexOne}><Text style={styles.emergencyEyebrow}>EMERGENCY TOOLS</Text><Text style={styles.emergencyTitle}>Stroke B.E. F.A.S.T. warning signs</Text></View>
          <Text style={styles.emergencyArrow}>›</Text>
        </MotionPressable>
      </FadeSlide>
      <EducationalDisclaimer />
    </ScreenShell>
  );
}

function Stagger({ children, delay }: { children: React.ReactNode; delay: number }) {
  return <FadeSlide delay={delay} style={styles.staggerItem}>{children}</FadeSlide>;
}

function HomeCard({ icon, title, subtitle, onPress }: { icon: string; title: string; subtitle: string; onPress: () => void }) {
  return (
    <MotionPressable onPress={onPress} style={styles.homeCard}>
      <Text style={styles.homeIcon}>{icon}</Text><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardSubtitle}>{subtitle}</Text>
    </MotionPressable>
  );
}

function ToolRow({ icon, title, subtitle, onPress }: { icon: string; title: string; subtitle: string; onPress: () => void }) {
  return (
    <MotionPressable onPress={onPress} style={styles.toolRow}>
      <View style={styles.toolIconBox}><Text style={styles.toolIcon}>{icon}</Text></View>
      <View style={styles.flexOne}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardSubtitle}>{subtitle}</Text></View>
      <Text style={styles.chevron}>›</Text>
    </MotionPressable>
  );
}

function ConditionLibraryScreen({ onBack, onOpen }: { onBack: () => void; onOpen: (condition: ConditionReference) => void }) {
  return (
    <ScreenShell>
      <BackButton onPress={onBack} /><Header eyebrow="CONDITION LIBRARY" title="Understand the care journey" body="Browse the disease and specialist areas supplied in EnVizion Life’s caregiver materials." />
      <View style={styles.stack}>{conditionReferences.map((condition, index) => (
        <FadeSlide key={condition.id} delay={70 + index * 45}>
          <MotionPressable onPress={() => onOpen(condition)} style={styles.referenceCard}>
            <Text style={styles.cardTitle}>{condition.title}</Text><Text style={styles.specialistRole}>{condition.specialist}</Text><Text style={styles.cardSubtitle}>{condition.summary}</Text><Text style={styles.linkText}>Open guide ›</Text>
          </MotionPressable>
        </FadeSlide>
      ))}</View>
      <EducationalDisclaimer />
    </ScreenShell>
  );
}

function ConditionDetailScreen({ condition, onBack }: { condition: ConditionReference; onBack: () => void }) {
  return <ScreenShell><BackButton onPress={onBack} /><Header eyebrow={condition.specialist.toUpperCase()} title={condition.title} body={condition.summary} /><Text style={styles.sectionTitle}>Topics covered</Text><View style={styles.infoCard}>{condition.topics.map((topic) => <Bullet key={topic} text={topic} />)}</View><PendingCard /><EducationalDisclaimer /></ScreenShell>;
}

function CopdScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell>
      <BackButton onPress={onBack} /><Header eyebrow="PULMONOLOGY • LUNG HEALTH" title={copdOverview.title} body={copdOverview.description} />
      <Text style={styles.sectionTitle}>Guide sections</Text><View style={styles.infoCard}>{copdOverview.sections.map((item) => <Bullet key={item} text={item} />)}</View>
      <Text style={styles.sectionTitle}>COPD action plan</Text>
      <View style={styles.stack}>{actionZones.map((zone, index) => (
        <FadeSlide key={zone.id} delay={100 + index * 90} distance={18}>
          <View style={[styles.zoneCard, zone.id === 'green' ? styles.greenZone : zone.id === 'yellow' ? styles.yellowZone : styles.redZone]}>
            <Text style={[styles.zoneLabel, zone.id === 'green' ? styles.greenLabel : zone.id === 'yellow' ? styles.yellowLabel : styles.redLabel]}>{zone.label}</Text><Text style={styles.zoneTitle}>{zone.title}</Text><Text style={styles.zoneText}>{zone.summary}</Text>
          </View>
        </FadeSlide>
      ))}</View>
      <View style={styles.warningCard}><Text style={styles.cardTitle}>Medication & oxygen safety</Text><Text style={styles.cardSubtitle}>Follow the person’s prescribed plan. Do not independently change medicine, inhaler, rescue treatment, or oxygen instructions.</Text></View>
      <EducationalDisclaimer />
    </ScreenShell>
  );
}

function NeurologyScreen({ onBack, onEmergency }: { onBack: () => void; onEmergency: () => void }) {
  return <ScreenShell><BackButton onPress={onBack} /><Header eyebrow="NEUROLOGY" title="Stroke, memory & movement care" body="Caregiver guidance for stroke, TIA, dementia, Alzheimer’s disease, Parkinson’s disease, and related neurological concerns." /><MotionPressable onPress={onEmergency} style={styles.emergencyButton}><View style={styles.flexOne}><Text style={styles.emergencyEyebrow}>STROKE / TIA</Text><Text style={styles.emergencyTitle}>Open B.E. F.A.S.T.</Text></View><Text style={styles.emergencyArrow}>›</Text></MotionPressable><Text style={styles.sectionTitle}>Dementia & Alzheimer’s: track changes</Text><View style={styles.infoCard}>{neurologyMonitoring.dementia.map((item) => <Bullet key={item} text={item} />)}</View><View style={styles.warningCard}><Text style={styles.cardTitle}>Sudden confusion</Text><Text style={styles.cardSubtitle}>The supplied caregiver guide notes that sudden confusion is not typical gradual dementia progression and should be evaluated promptly.</Text></View><Text style={styles.sectionTitle}>Parkinson’s: track changes</Text><View style={styles.infoCard}>{neurologyMonitoring.parkinsons.map((item) => <Bullet key={item} text={item} />)}</View><EducationalDisclaimer /></ScreenShell>;
}

function EmergencyScreen({ onBack }: { onBack: () => void }) {
  const items = [['B','Balance','Sudden loss of balance or coordination'],['E','Eyes','Sudden vision changes'],['F','Face','Face droop or numbness'],['A','Arm','Arm weakness or numbness'],['S','Speech','Speech difficulty'],['T','Time','Time to call emergency services']];
  return <ScreenShell><BackButton onPress={onBack} /><Header eyebrow="EMERGENCY TOOL" title="B.E. F.A.S.T." body="The EnVizion neurology guide says to call emergency services immediately for sudden stroke signs, even if symptoms go away." /><View style={styles.befastCard}>{items.map(([letter,title,detail], index) => <FadeSlide key={letter} delay={index * 55}><View style={styles.befastRow}><View style={styles.befastLetterBox}><Text style={styles.befastLetter}>{letter}</Text></View><View style={styles.flexOne}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardSubtitle}>{detail}</Text></View></View></FadeSlide>)}</View><View style={styles.emergencyNotice}><Text style={styles.emergencyNoticeTitle}>TIA is also an emergency</Text><Text style={styles.emergencyNoticeText}>The supplied guide describes TIA as a warning of possible future stroke and says not to wait for a routine visit.</Text></View></ScreenShell>;
}

function JournalScreen({ entries, onBack, onSave }: { entries: JournalEntry[]; onBack: () => void; onSave: React.Dispatch<React.SetStateAction<JournalEntry[]>> }) {
  const [statusByPrompt, setStatusByPrompt] = useState<Record<string, CheckInStatus>>({}); const [note, setNote] = useState(''); const [saved, setSaved] = useState(false);
  const save = () => { if (!Object.keys(statusByPrompt).length && !note.trim()) return; onSave((current) => [{ id: `${Date.now()}`, createdAt: new Date().toLocaleString(), statusByPrompt, note: note.trim() }, ...current]); setStatusByPrompt({}); setNote(''); setSaved(true); };
  return <ScreenShell><BackButton onPress={onBack} /><Header eyebrow="HEALTH JOURNAL" title="Today’s check-in" body="Record changes from the person’s usual baseline for later discussion with the healthcare team." />{journalPrompts.map((prompt,index) => <FadeSlide key={prompt.id} delay={index * 55}><View style={styles.formCard}><Text style={styles.cardTitle}>{prompt.label}</Text><Text style={styles.cardSubtitle}>{prompt.helper}</Text><View style={styles.segmentRow}>{(['usual','better','worse'] as CheckInStatus[]).map((status) => { const active = statusByPrompt[prompt.id] === status; return <MotionPressable key={status} onPress={() => { setSaved(false); setStatusByPrompt((current) => ({...current,[prompt.id]:status})); }} style={[styles.segmentButton, active && styles.segmentButtonActive]}><Text style={[styles.segmentText,active && styles.segmentTextActive]}>{status === 'usual' ? 'Usual' : status === 'better' ? 'Better' : 'Worse'}</Text></MotionPressable>; })}</View></View></FadeSlide>)}<View style={styles.formCard}><Text style={styles.cardTitle}>Caregiver note</Text><TextInput multiline value={note} onChangeText={(value) => { setSaved(false); setNote(value); }} placeholder="Symptoms, behavior, questions, or context..." placeholderTextColor={colors.muted} style={styles.textArea} /></View><PrimaryButton label="Save check-in" onPress={save} /><SavedNotice visible={saved} text="Check-in saved for this prototype session." />{entries.length > 0 && <><Text style={styles.sectionTitle}>Recent check-ins</Text>{entries.slice(0,3).map((entry) => <View key={entry.id} style={styles.referenceCard}><Text style={styles.cardTitle}>{entry.createdAt}</Text><Text style={styles.cardSubtitle}>{Object.keys(entry.statusByPrompt).length} areas reviewed{entry.note ? ` • ${entry.note}` : ''}</Text></View>)}</>}<EducationalDisclaimer /></ScreenShell>;
}

function VitalsScreen({ entries, onBack, onSave }: { entries: VitalEntry[]; onBack: () => void; onSave: React.Dispatch<React.SetStateAction<VitalEntry[]>> }) {
  const [values, setValues] = useState<Record<string,string>>({}); const [saved,setSaved] = useState(false); const fields = [...vitalSignReferences,{ id:'blood-sugar', label:'Blood Sugar', range:'No default range provided in current client materials', unit:'' }];
  const save = () => { if (!Object.values(values).some((value) => value.trim())) return; onSave((current) => [{ id:`${Date.now()}`, createdAt:new Date().toLocaleString(), values },...current]); setValues({}); setSaved(true); };
  return <ScreenShell><BackButton onPress={onBack} /><Header eyebrow="DAILY TRACKERS" title="Vital signs & blood sugar" body="Record readings without interpreting them. Reference ranges below are reproduced from the client’s current vital-sign guide and may not match an individual care plan." />{fields.map((field,index) => <FadeSlide key={field.id} delay={index * 45}><View style={styles.formCard}><View style={styles.rowBetween}><Text style={styles.cardTitle}>{field.label}</Text>{!!field.unit && <Text style={styles.unitText}>{field.unit}</Text>}</View><Text style={styles.referenceText}>Reference: {field.range}</Text><TextInput keyboardType="numeric" value={values[field.id] || ''} onChangeText={(value) => { setSaved(false); setValues((current) => ({...current,[field.id]:value})); }} placeholder="Enter reading" placeholderTextColor={colors.muted} style={styles.input} /></View></FadeSlide>)}<PrimaryButton label="Save readings" onPress={save} /><SavedNotice visible={saved} text="Readings saved for this prototype session." />{entries.length > 0 && <><Text style={styles.sectionTitle}>Recent readings</Text>{entries.slice(0,3).map((entry) => <View key={entry.id} style={styles.referenceCard}><Text style={styles.cardTitle}>{entry.createdAt}</Text><Text style={styles.cardSubtitle}>{Object.entries(entry.values).filter(([,value]) => value).map(([key,value]) => `${key}: ${value}`).join(' • ')}</Text></View>)}</>}<EducationalDisclaimer /></ScreenShell>;
}

function MedicationScreen({ items, onBack, onChange }: { items: MedicationItem[]; onBack: () => void; onChange: React.Dispatch<React.SetStateAction<MedicationItem[]>> }) {
  const [name,setName] = useState(''); const [details,setDetails] = useState(''); const [saved,setSaved] = useState(false);
  const add = () => { if (!name.trim()) return; onChange((current) => [...current,{ id:`${Date.now()}`,name:name.trim(),details:details.trim() }]); setName(''); setDetails(''); setSaved(true); };
  return <ScreenShell><BackButton onPress={onBack} /><Header eyebrow="MEDICATION LOG" title="Keep one current list" body="Use the list for care coordination. Enter only the person’s actual medicines, supplements, and instructions." /><View style={styles.formCard}><TextInput value={name} onChangeText={(v) => { setSaved(false); setName(v); }} placeholder="Medicine or supplement name" placeholderTextColor={colors.muted} style={styles.input} /><TextInput value={details} onChangeText={(v) => { setSaved(false); setDetails(v); }} placeholder="Dose, schedule, purpose, or note" placeholderTextColor={colors.muted} style={styles.input} /><PrimaryButton label="Add to list" onPress={add} /></View><SavedNotice visible={saved} text="Medication added to this prototype session." />{items.map((item,index) => <FadeSlide key={item.id} delay={index * 40}><View style={styles.toolRow}><View style={styles.toolIconBox}><Text style={styles.toolIcon}>Rx</Text></View><View style={styles.flexOne}><Text style={styles.cardTitle}>{item.name}</Text><Text style={styles.cardSubtitle}>{item.details || 'No note added'}</Text></View><MotionPressable onPress={() => onChange((current) => current.filter((med) => med.id !== item.id))}><Text style={styles.removeText}>Remove</Text></MotionPressable></View></FadeSlide>)}<Text style={styles.sectionTitle}>Medication safety</Text><View style={styles.infoCard}>{medicationSafetyNotes.map((note) => <Bullet key={note} text={note} />)}</View><EducationalDisclaimer /></ScreenShell>;
}

function CareTeamScreen({ onBack }: { onBack: () => void }) { return <ScreenShell><BackButton onPress={onBack} /><Header eyebrow="CARE TEAM" title="Know who manages what" body="Use the current EnVizion specialist guide to understand the role of each clinician." />{specialistReferences.map((specialist,index) => <FadeSlide key={specialist.id} delay={index * 45}><View style={styles.referenceCard}><Text style={styles.cardTitle}>{specialist.title}</Text><Text style={styles.specialistRole}>{specialist.role}</Text><Text style={styles.cardSubtitle}>{specialist.focus}</Text></View></FadeSlide>)}<EducationalDisclaimer /></ScreenShell>; }

function AppointmentScreen({ onBack }: { onBack: () => void }) {
  const [checked,setChecked] = useState<Record<number,boolean>>({}); const [mode,setMode] = useState<'copd'|'neurology'>('copd'); const questions = useMemo(() => mode === 'copd' ? copdAppointmentQuestions : neurologyAppointmentQuestions,[mode]);
  return <ScreenShell><BackButton onPress={onBack} /><Header eyebrow="APPOINTMENT PREP" title="Walk in prepared" body="Gather the information and questions emphasized in the current caregiver materials." /><Text style={styles.sectionTitle}>Before the visit</Text>{appointmentChecklist.map((item,index) => <MotionPressable key={item} onPress={() => setChecked((current) => ({...current,[index]:!current[index]}))} style={styles.checklistRow}><View style={[styles.checkbox,checked[index] && styles.checkboxChecked]}>{checked[index] && <Text style={styles.checkboxMark}>✓</Text>}</View><Text style={styles.checklistText}>{item}</Text></MotionPressable>)}<Text style={styles.sectionTitle}>Suggested questions</Text><View style={styles.segmentRow}><MotionPressable onPress={() => setMode('copd')} style={[styles.segmentButton,mode === 'copd' && styles.segmentButtonActive]}><Text style={[styles.segmentText,mode === 'copd' && styles.segmentTextActive]}>COPD</Text></MotionPressable><MotionPressable onPress={() => setMode('neurology')} style={[styles.segmentButton,mode === 'neurology' && styles.segmentButtonActive]}><Text style={[styles.segmentText,mode === 'neurology' && styles.segmentTextActive]}>Neurology</Text></MotionPressable></View><FadeSlide key={mode}><View style={styles.infoCard}>{questions.map((question) => <Bullet key={question} text={question} />)}</View></FadeSlide><EducationalDisclaimer /></ScreenShell>;
}

function TransitionScreen({ onBack }: { onBack: () => void }) {
  const [checked,setChecked] = useState<Record<number,boolean>>({}); const count = Object.values(checked).filter(Boolean).length;
  return <ScreenShell><BackButton onPress={onBack} /><Header eyebrow="WALKING THROUGH THE TRANSITION" title="Hospital to home" body="A working digital version of the transitional-care concept named in the client email. It organizes the items caregivers may need to carry forward after discharge." /><PulseNotice visible={count > 0} style={styles.progressCard}><Text style={styles.cardTitle}>Transition checklist</Text><Text style={styles.cardSubtitle}>{count} of {transitionChecklist.length} items marked</Text></PulseNotice>{transitionChecklist.map((item,index) => <MotionPressable key={item} onPress={() => setChecked((current) => ({...current,[index]:!current[index]}))} style={styles.checklistRow}><View style={[styles.checkbox,checked[index] && styles.checkboxChecked]}>{checked[index] && <Text style={styles.checkboxMark}>✓</Text>}</View><Text style={styles.checklistText}>{item}</Text></MotionPressable>)}<View style={styles.pendingCard}><Text style={styles.cardTitle}>More transition content is pending</Text><Text style={styles.cardSubtitle}>The email names “Walking Through the Transition” but does not provide the final insert wording, so this screen currently stays at the checklist/organization level.</Text></View><EducationalDisclaimer /></ScreenShell>;
}

function SupportScreen({ onBack }: { onBack: () => void }) { return <ScreenShell><BackButton onPress={onBack} /><Header eyebrow="ADVOCACY & SUPPORT" title="Care for the caregiver, too" body="The EnVizion program combines practical care navigation with patient advocacy and faith-based caregiver support." />{supportAreas.map((area,index) => <FadeSlide key={area.id} delay={index * 60}><View style={styles.referenceCard}><Text style={styles.cardTitle}>{area.title}</Text><Text style={styles.cardSubtitle}>{area.description}</Text></View></FadeSlide>)}<View style={styles.pendingCard}><Text style={styles.cardTitle}>Content governance</Text><Text style={styles.cardSubtitle}>Where detailed coaching, legal, insurance, Medicare, rights, advance-directive, or spiritual content has not yet been supplied, the app marks it as pending instead of inventing guidance.</Text></View><EducationalDisclaimer /></ScreenShell>; }

function Header({ eyebrow,title,body }: { eyebrow:string; title:string; body:string }) { return <FadeSlide delay={60}><Text style={styles.eyebrow}>{eyebrow}</Text><Text style={styles.heroTitle}>{title}</Text><Text style={styles.bodyText}>{body}</Text></FadeSlide>; }
function BackButton({ onPress }: { onPress: () => void }) { return <MotionPressable onPress={onPress} style={styles.backButton}><Text style={styles.backButtonText}>‹ Back</Text></MotionPressable>; }
function PrimaryButton({ label,onPress }: { label:string; onPress:() => void }) { return <MotionPressable onPress={onPress} style={styles.primaryButton}><Text style={styles.primaryButtonText}>{label}</Text></MotionPressable>; }
function Bullet({ text }: { text:string }) { return <View style={styles.bulletRow}><Text style={styles.bulletDot}>•</Text><Text style={styles.bulletText}>{text}</Text></View>; }
function PendingCard() { return <View style={styles.pendingCard}><Text style={styles.cardTitle}>Guide expansion pending</Text><Text style={styles.cardSubtitle}>The current client materials identify these care areas and specialist responsibilities. More detailed disease-specific content can be added when EnVizion Life provides and approves it.</Text></View>; }
function SavedNotice({ visible,text }: { visible:boolean; text:string }) { return <PulseNotice visible={visible} style={styles.savedNotice}><Text style={styles.savedNoticeText}>✓ {text}</Text></PulseNotice>; }
function EducationalDisclaimer() { return <Text style={styles.disclaimer}>Educational and care-coordination support only. Follow the person’s individualized healthcare plan and use emergency services for severe or life-threatening symptoms.</Text>; }

const styles = StyleSheet.create({
  safeArea:{flex:1,backgroundColor:colors.background},screenMotion:{flex:1},page:{padding:spacing.lg,paddingBottom:48,gap:spacing.md},flexOne:{flex:1},
  brandRow:{flexDirection:'row',alignItems:'center',gap:12},brandMark:{width:46,height:46,borderRadius:15,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center'},brandMarkText:{color:'#fff',fontWeight:'900',fontSize:15},brandName:{color:colors.text,fontSize:18,fontWeight:'800'},brandSubtitle:{color:colors.muted,fontSize:13,marginTop:2},
  hero:{backgroundColor:colors.primarySoft,borderRadius:radius.lg,padding:spacing.lg,marginTop:spacing.sm},eyebrow:{color:colors.primary,fontWeight:'800',fontSize:12,letterSpacing:1.1},heroTitle:{color:colors.text,fontSize:30,lineHeight:36,fontWeight:'800',marginTop:6},heroText:{color:colors.muted,fontSize:16,lineHeight:23,marginTop:6},bodyText:{color:colors.muted,fontSize:16,lineHeight:24,marginTop:6},sectionTitle:{color:colors.text,fontWeight:'800',fontSize:19,marginTop:spacing.sm},
  grid:{flexDirection:'row',flexWrap:'wrap',gap:spacing.md},staggerItem:{width:'47%'},homeCard:{minHeight:145,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md},homeIcon:{fontSize:27,marginBottom:15},cardTitle:{color:colors.text,fontWeight:'800',fontSize:16},cardSubtitle:{color:colors.muted,fontSize:13,lineHeight:19,marginTop:5},specialistRole:{color:colors.primary,fontSize:12,fontWeight:'800',marginTop:5},stack:{gap:spacing.sm},
  toolRow:{minHeight:76,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md,flexDirection:'row',alignItems:'center',gap:14},toolIconBox:{width:44,height:44,borderRadius:13,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},toolIcon:{color:colors.primary,fontWeight:'800',fontSize:15},chevron:{color:colors.muted,fontSize:28},
  referenceCard:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md},linkText:{color:colors.primary,fontWeight:'800',fontSize:13,marginTop:12},infoCard:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md,gap:8},pendingCard:{backgroundColor:colors.primarySoft,borderRadius:radius.md,padding:spacing.md,borderWidth:1,borderColor:'#C8E0E8'},warningCard:{backgroundColor:colors.warningSoft,borderRadius:radius.md,padding:spacing.md,borderWidth:1,borderColor:'#F0D59A'},
  emergencyButton:{backgroundColor:colors.dangerSoft,borderColor:'#F3C0BC',borderWidth:1,borderRadius:radius.md,padding:spacing.lg,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},emergencyEyebrow:{color:colors.danger,fontSize:12,letterSpacing:1,fontWeight:'800'},emergencyTitle:{color:colors.text,fontSize:17,fontWeight:'800',marginTop:5},emergencyArrow:{color:colors.danger,fontSize:30},backButton:{alignSelf:'flex-start',paddingVertical:8,paddingRight:12},backButtonText:{color:colors.primary,fontWeight:'800',fontSize:16},
  zoneCard:{borderRadius:radius.md,padding:spacing.md,borderWidth:1},greenZone:{backgroundColor:colors.successSoft,borderColor:'#B9DDBB'},yellowZone:{backgroundColor:colors.warningSoft,borderColor:'#F0D59A'},redZone:{backgroundColor:colors.dangerSoft,borderColor:'#F3C0BC'},zoneLabel:{fontSize:11,letterSpacing:1,fontWeight:'900'},greenLabel:{color:colors.success},yellowLabel:{color:colors.warning},redLabel:{color:colors.danger},zoneTitle:{color:colors.text,fontWeight:'800',fontSize:17,marginTop:5},zoneText:{color:colors.muted,fontSize:14,lineHeight:21,marginTop:5},
  befastCard:{backgroundColor:colors.surface,borderRadius:radius.lg,borderWidth:1,borderColor:colors.border,padding:spacing.md,gap:spacing.sm},befastRow:{flexDirection:'row',gap:14,alignItems:'center',paddingVertical:8},befastLetterBox:{width:42,height:42,borderRadius:12,backgroundColor:colors.dangerSoft,alignItems:'center',justifyContent:'center'},befastLetter:{color:colors.danger,fontWeight:'900',fontSize:20},emergencyNotice:{borderRadius:radius.md,backgroundColor:colors.danger,padding:spacing.lg},emergencyNoticeTitle:{color:'#fff',fontSize:19,fontWeight:'900'},emergencyNoticeText:{color:'#fff',fontSize:14,lineHeight:21,marginTop:6},
  formCard:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md,gap:spacing.sm},input:{borderWidth:1,borderColor:colors.border,backgroundColor:colors.background,borderRadius:radius.sm,paddingHorizontal:14,paddingVertical:12,color:colors.text,fontSize:15},textArea:{minHeight:110,textAlignVertical:'top',borderWidth:1,borderColor:colors.border,backgroundColor:colors.background,borderRadius:radius.sm,padding:14,color:colors.text,fontSize:15},primaryButton:{backgroundColor:colors.primary,borderRadius:radius.md,paddingVertical:14,paddingHorizontal:18,alignItems:'center'},primaryButtonText:{color:'#fff',fontWeight:'800',fontSize:15},
  segmentRow:{flexDirection:'row',gap:8,marginTop:4},segmentButton:{flex:1,borderRadius:radius.sm,borderWidth:1,borderColor:colors.border,paddingVertical:10,alignItems:'center',backgroundColor:colors.background},segmentButtonActive:{borderColor:colors.primary,backgroundColor:colors.primarySoft},segmentText:{color:colors.muted,fontWeight:'700',fontSize:13},segmentTextActive:{color:colors.primary},progressCard:{backgroundColor:colors.primarySoft,borderRadius:radius.md,padding:spacing.md},savedNotice:{backgroundColor:colors.successSoft,borderRadius:radius.md,padding:spacing.md,borderWidth:1,borderColor:'#B9DDBB'},savedNoticeText:{color:colors.success,fontWeight:'800',fontSize:13},
  checklistRow:{flexDirection:'row',gap:12,alignItems:'flex-start',backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:spacing.md},checkbox:{width:24,height:24,borderRadius:7,borderWidth:1,borderColor:colors.border,alignItems:'center',justifyContent:'center',marginTop:1},checkboxChecked:{backgroundColor:colors.primary,borderColor:colors.primary},checkboxMark:{color:'#fff',fontWeight:'900'},checklistText:{flex:1,color:colors.text,fontSize:14,lineHeight:21},bulletRow:{flexDirection:'row',gap:10,alignItems:'flex-start'},bulletDot:{color:colors.primary,fontSize:18,lineHeight:21},bulletText:{flex:1,color:colors.text,fontSize:14,lineHeight:21},removeText:{color:colors.danger,fontWeight:'800',fontSize:12},rowBetween:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:10},unitText:{color:colors.muted,fontSize:12,fontWeight:'700'},referenceText:{color:colors.primary,fontSize:12,fontWeight:'700'},disclaimer:{color:colors.muted,fontSize:12,lineHeight:18,marginTop:spacing.md},
});

import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { actionZones, careAreas, copdOverview, dailyTools } from './src/content';
import {
  appointmentChecklist,
  copdAppointmentQuestions,
  journalPrompts,
  medicationSafetyNotes,
  neurologyAppointmentQuestions,
  specialistReferences,
} from './src/careToolkit';
import { colors, radius, spacing } from './src/theme';

type Screen = 'home' | 'copd' | 'emergency' | 'journal' | 'medications' | 'care-team' | 'appointments';
type CheckInStatus = 'usual' | 'better' | 'worse';

type JournalEntry = {
  id: string;
  createdAt: string;
  statusByPrompt: Record<string, CheckInStatus>;
  note: string;
};

type MedicationItem = {
  id: string;
  name: string;
  details: string;
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [medications, setMedications] = useState<MedicationItem[]>([]);

  const navigate = (next: Screen) => setScreen(next);
  const backHome = () => setScreen('home');

  switch (screen) {
    case 'copd':
      return <CopdScreen onBack={backHome} />;
    case 'emergency':
      return <EmergencyScreen onBack={backHome} />;
    case 'journal':
      return <JournalScreen entries={journalEntries} onBack={backHome} onSave={setJournalEntries} />;
    case 'medications':
      return <MedicationScreen items={medications} onBack={backHome} onChange={setMedications} />;
    case 'care-team':
      return <CareTeamScreen onBack={backHome} />;
    case 'appointments':
      return <AppointmentScreen onBack={backHome} />;
    default:
      return <HomeScreen onNavigate={navigate} />;
  }
}

function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function HomeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const handleDailyTool = (id: string) => {
    if (id === 'checkin') onNavigate('journal');
    if (id === 'meds') onNavigate('medications');
    if (id === 'team') onNavigate('care-team');
    if (id === 'appointments') onNavigate('appointments');
  };

  return (
    <ScreenShell>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>EV</Text>
        </View>
        <View>
          <Text style={styles.brandName}>EnVizion Life</Text>
          <Text style={styles.brandSubtitle}>Digital Caregiver Toolkit</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>CARE AT A GLANCE</Text>
        <Text style={styles.heroTitle}>Good evening 👋</Text>
        <Text style={styles.heroText}>How can we support care today?</Text>
      </View>

      <Text style={styles.sectionTitle}>Care areas</Text>
      <View style={styles.grid}>
        {careAreas.map((area) => (
          <Pressable
            accessibilityRole="button"
            key={area.id}
            onPress={area.id === 'lungs' ? () => onNavigate('copd') : undefined}
            style={({ pressed }) => [styles.careCard, pressed && styles.pressed]}
          >
            <Text style={styles.careIcon}>{area.icon}</Text>
            <Text style={styles.cardTitle}>{area.title}</Text>
            <Text style={styles.cardSubtitle}>{area.subtitle}</Text>
            {area.id !== 'lungs' && <Text style={styles.comingSoon}>Reference guide coming next</Text>}
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Daily tools</Text>
      <View style={styles.stack}>
        {dailyTools.map((tool) => (
          <Pressable
            accessibilityRole="button"
            key={tool.id}
            onPress={() => handleDailyTool(tool.id)}
            style={({ pressed }) => [styles.toolRow, pressed && styles.pressed]}
          >
            <View style={styles.toolIconBox}>
              <Text style={styles.toolIcon}>{tool.icon}</Text>
            </View>
            <View style={styles.flexOne}>
              <Text style={styles.cardTitle}>{tool.title}</Text>
              <Text style={styles.cardSubtitle}>{tool.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open emergency help"
        onPress={() => onNavigate('emergency')}
        style={({ pressed }) => [styles.emergencyButton, pressed && styles.pressed]}
      >
        <View style={styles.flexOne}>
          <Text style={styles.emergencyEyebrow}>EMERGENCY HELP</Text>
          <Text style={styles.emergencyTitle}>Warning signs and what to do</Text>
        </View>
        <Text style={styles.emergencyArrow}>›</Text>
      </Pressable>

      <EducationalDisclaimer />
    </ScreenShell>
  );
}

function JournalScreen({
  entries,
  onBack,
  onSave,
}: {
  entries: JournalEntry[];
  onBack: () => void;
  onSave: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}) {
  const [statusByPrompt, setStatusByPrompt] = useState<Record<string, CheckInStatus>>({});
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const completeCount = Object.keys(statusByPrompt).length;

  const saveEntry = () => {
    if (!completeCount && !note.trim()) return;

    onSave((current) => [
      {
        id: `${Date.now()}`,
        createdAt: new Date().toLocaleString(),
        statusByPrompt,
        note: note.trim(),
      },
      ...current,
    ]);
    setStatusByPrompt({});
    setNote('');
    setSaved(true);
  };

  return (
    <ScreenShell>
      <BackButton onPress={onBack} />
      <Text style={styles.eyebrow}>HEALTH JOURNAL</Text>
      <Text style={styles.heroTitle}>Today’s check-in</Text>
      <Text style={styles.bodyText}>
        Capture changes from the person’s usual baseline so they are easier to discuss with the healthcare team.
      </Text>

      <View style={styles.progressCard}>
        <Text style={styles.cardTitle}>Check-in progress</Text>
        <Text style={styles.cardSubtitle}>{completeCount} of {journalPrompts.length} areas reviewed</Text>
      </View>

      {journalPrompts.map((prompt) => (
        <View key={prompt.id} style={styles.formCard}>
          <Text style={styles.cardTitle}>{prompt.label}</Text>
          <Text style={styles.cardSubtitle}>{prompt.helper}</Text>
          <View style={styles.segmentRow}>
            {(['usual', 'better', 'worse'] as CheckInStatus[]).map((status) => {
              const active = statusByPrompt[prompt.id] === status;
              return (
                <Pressable
                  accessibilityRole="button"
                  key={status}
                  onPress={() => {
                    setSaved(false);
                    setStatusByPrompt((current) => ({ ...current, [prompt.id]: status }));
                  }}
                  style={[styles.segmentButton, active && styles.segmentButtonActive]}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {status === 'usual' ? 'Usual' : status === 'better' ? 'Better' : 'Worse'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>Caregiver note</Text>
        <Text style={styles.cardSubtitle}>Add context, examples, questions, or anything that changed today.</Text>
        <TextInput
          multiline
          onChangeText={(value) => {
            setSaved(false);
            setNote(value);
          }}
          placeholder="Write a note..."
          placeholderTextColor={colors.muted}
          style={styles.textArea}
          value={note}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={saveEntry}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
      >
        <Text style={styles.primaryButtonText}>Save check-in</Text>
      </Pressable>

      {saved && <Text style={styles.successMessage}>Check-in saved on this device for the current prototype session.</Text>}

      {entries.length > 0 && (
        <View style={styles.stack}>
          <Text style={styles.sectionTitle}>Recent check-ins</Text>
          {entries.slice(0, 3).map((entry) => (
            <View key={entry.id} style={styles.toolRow}>
              <View style={styles.flexOne}>
                <Text style={styles.cardTitle}>{entry.createdAt}</Text>
                <Text style={styles.cardSubtitle}>
                  {Object.keys(entry.statusByPrompt).length} areas reviewed{entry.note ? ` • ${entry.note}` : ''}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <EducationalDisclaimer />
    </ScreenShell>
  );
}

function MedicationScreen({
  items,
  onBack,
  onChange,
}: {
  items: MedicationItem[];
  onBack: () => void;
  onChange: React.Dispatch<React.SetStateAction<MedicationItem[]>>;
}) {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');

  const addMedication = () => {
    if (!name.trim()) return;
    onChange((current) => [
      ...current,
      { id: `${Date.now()}`, name: name.trim(), details: details.trim() },
    ]);
    setName('');
    setDetails('');
  };

  return (
    <ScreenShell>
      <BackButton onPress={onBack} />
      <Text style={styles.eyebrow}>MEDICATION LIST</Text>
      <Text style={styles.heroTitle}>Keep one current list</Text>
      <Text style={styles.bodyText}>
        Organize medicines and supplements for care conversations. This prototype does not recommend or change treatment.
      </Text>

      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>Add an item</Text>
        <TextInput
          onChangeText={setName}
          placeholder="Medicine or supplement name"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={name}
        />
        <TextInput
          onChangeText={setDetails}
          placeholder="Dose, schedule, purpose, or caregiver note"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={details}
        />
        <Pressable onPress={addMedication} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonText}>Add to list</Text>
        </Pressable>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.cardTitle}>No medicines added yet</Text>
          <Text style={styles.cardSubtitle}>Add only the person’s actual current medicines and supplements.</Text>
        </View>
      ) : (
        <View style={styles.stack}>
          {items.map((item) => (
            <View key={item.id} style={styles.toolRow}>
              <View style={styles.rxBadge}><Text style={styles.rxText}>Rx</Text></View>
              <View style={styles.flexOne}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.details || 'No additional note'}</Text>
              </View>
              <Pressable
                accessibilityLabel={`Remove ${item.name}`}
                onPress={() => onChange((current) => current.filter((med) => med.id !== item.id))}
              >
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Medication safety</Text>
      <View style={styles.infoCard}>
        {medicationSafetyNotes.map((note) => <Bullet key={note} text={note} />)}
      </View>

      <EducationalDisclaimer />
    </ScreenShell>
  );
}

function CareTeamScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell>
      <BackButton onPress={onBack} />
      <Text style={styles.eyebrow}>CARE TEAM DIRECTORY</Text>
      <Text style={styles.heroTitle}>Know who manages what</Text>
      <Text style={styles.bodyText}>
        Use the directory to understand specialist roles. Saved names, phone numbers, and personal care-team contacts will be added when the backend profile layer is connected.
      </Text>

      <View style={styles.stack}>
        {specialistReferences.map((specialist) => (
          <View key={specialist.id} style={styles.specialistCard}>
            <View style={styles.specialistTopRow}>
              <View style={styles.specialistIcon}><Text style={styles.specialistIconText}>+</Text></View>
              <View style={styles.flexOne}>
                <Text style={styles.cardTitle}>{specialist.title}</Text>
                <Text style={styles.specialistRole}>{specialist.role}</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>{specialist.focus}</Text>
          </View>
        ))}
      </View>

      <EducationalDisclaimer />
    </ScreenShell>
  );
}

function AppointmentScreen({ onBack }: { onBack: () => void }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [questionMode, setQuestionMode] = useState<'copd' | 'neurology'>('copd');

  const questions = useMemo(
    () => questionMode === 'copd' ? copdAppointmentQuestions : neurologyAppointmentQuestions,
    [questionMode],
  );

  return (
    <ScreenShell>
      <BackButton onPress={onBack} />
      <Text style={styles.eyebrow}>APPOINTMENT PREP</Text>
      <Text style={styles.heroTitle}>Walk in prepared</Text>
      <Text style={styles.bodyText}>
        Gather the information caregivers are encouraged to bring and keep important questions in one place.
      </Text>

      <Text style={styles.sectionTitle}>Before the visit</Text>
      <View style={styles.stack}>
        {appointmentChecklist.map((item, index) => (
          <Pressable
            key={item}
            onPress={() => setChecked((current) => ({ ...current, [index]: !current[index] }))}
            style={({ pressed }) => [styles.checklistRow, pressed && styles.pressed]}
          >
            <View style={[styles.checkbox, checked[index] && styles.checkboxChecked]}>
              {checked[index] && <Text style={styles.checkboxMark}>✓</Text>}
            </View>
            <Text style={styles.checklistText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Questions to ask</Text>
      <View style={styles.segmentRowWide}>
        <Pressable
          onPress={() => setQuestionMode('copd')}
          style={[styles.topicButton, questionMode === 'copd' && styles.topicButtonActive]}
        >
          <Text style={[styles.topicButtonText, questionMode === 'copd' && styles.topicButtonTextActive]}>COPD</Text>
        </Pressable>
        <Pressable
          onPress={() => setQuestionMode('neurology')}
          style={[styles.topicButton, questionMode === 'neurology' && styles.topicButtonActive]}
        >
          <Text style={[styles.topicButtonText, questionMode === 'neurology' && styles.topicButtonTextActive]}>Neurology</Text>
        </Pressable>
      </View>

      <View style={styles.infoCard}>
        {questions.map((question) => <Bullet key={question} text={question} />)}
      </View>

      <EducationalDisclaimer />
    </ScreenShell>
  );
}

function CopdScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell>
      <BackButton onPress={onBack} />
      <View style={styles.conditionHeader}>
        <Text style={styles.conditionIcon}>🫁</Text>
        <View style={styles.flexOne}>
          <Text style={styles.eyebrow}>LUNG HEALTH</Text>
          <Text style={styles.heroTitle}>{copdOverview.title}</Text>
        </View>
      </View>

      <Text style={styles.bodyText}>{copdOverview.description}</Text>

      <Text style={styles.sectionTitle}>Explore</Text>
      <View style={styles.stack}>
        {copdOverview.sections.map((section) => (
          <View key={section} style={styles.sectionRow}>
            <Text style={styles.sectionRowText}>{section}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Action plan preview</Text>
      <View style={styles.stack}>
        {actionZones.map((zone) => {
          const zoneStyle = zone.id === 'green' ? styles.greenZone : zone.id === 'yellow' ? styles.yellowZone : styles.redZone;
          const labelStyle = zone.id === 'green' ? styles.greenLabel : zone.id === 'yellow' ? styles.yellowLabel : styles.redLabel;
          return (
            <View key={zone.id} style={[styles.zoneCard, zoneStyle]}>
              <Text style={[styles.zoneLabel, labelStyle]}>{zone.label}</Text>
              <Text style={styles.zoneTitle}>{zone.title}</Text>
              <Text style={styles.zoneText}>{zone.summary}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.disclaimer}>
        Use action guidance together with the person’s individualized COPD action plan. Do not independently change medication or oxygen instructions.
      </Text>
    </ScreenShell>
  );
}

function EmergencyScreen({ onBack }: { onBack: () => void }) {
  const signs = [
    ['B', 'Balance', 'Sudden loss of balance or coordination'],
    ['E', 'Eyes', 'Sudden blurred, double, or lost vision'],
    ['F', 'Face', 'One side droops or feels numb'],
    ['A', 'Arm', 'Sudden weakness or numbness'],
    ['S', 'Speech', 'Slurred, strange, or difficult speech'],
    ['T', 'Time', 'Contact emergency services immediately'],
  ];

  return (
    <ScreenShell>
      <BackButton onPress={onBack} />
      <Text style={styles.eyebrow}>EMERGENCY TOOLS</Text>
      <Text style={styles.heroTitle}>B.E. F.A.S.T.</Text>
      <Text style={styles.bodyText}>
        Sudden stroke or TIA warning signs require emergency assessment even if the symptoms improve or go away.
      </Text>

      <View style={styles.befastCard}>
        {signs.map(([letter, title, detail]) => (
          <View key={letter} style={styles.befastRow}>
            <View style={styles.befastLetterBox}><Text style={styles.befastLetter}>{letter}</Text></View>
            <View style={styles.flexOne}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSubtitle}>{detail}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.emergencyNotice}>
        <Text style={styles.emergencyNoticeTitle}>Emergency</Text>
        <Text style={styles.emergencyNoticeText}>
          For sudden stroke warning signs or other life-threatening symptoms, contact local emergency services immediately.
        </Text>
      </View>
    </ScreenShell>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function EducationalDisclaimer() {
  return (
    <Text style={styles.disclaimer}>
      Educational and care-coordination support only. This toolkit does not replace professional medical advice, diagnosis, treatment, an individualized care plan, or emergency services.
    </Text>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
      <Text style={styles.backButtonText}>‹ Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  page: { padding: spacing.lg, paddingBottom: 48, gap: spacing.md },
  flexOne: { flex: 1 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandMark: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  brandMarkText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  brandName: { color: colors.text, fontSize: 18, fontWeight: '800' },
  brandSubtitle: { color: colors.muted, fontSize: 13, marginTop: 2 },
  hero: { backgroundColor: colors.primarySoft, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.sm },
  eyebrow: { color: colors.primary, fontWeight: '800', fontSize: 12, letterSpacing: 1.1 },
  heroTitle: { color: colors.text, fontSize: 30, lineHeight: 36, fontWeight: '800', marginTop: 8 },
  heroText: { color: colors.muted, fontSize: 17, lineHeight: 24, marginTop: 6 },
  bodyText: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  sectionTitle: { color: colors.text, fontWeight: '800', fontSize: 19, marginTop: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  careCard: { width: '47%', minHeight: 156, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md },
  careIcon: { fontSize: 26, marginBottom: 14 },
  cardTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },
  cardSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
  comingSoon: { color: colors.primary, fontSize: 11, fontWeight: '700', marginTop: 10 },
  stack: { gap: spacing.sm },
  toolRow: { minHeight: 76, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 14 },
  toolIconBox: { width: 44, height: 44, borderRadius: 13, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  toolIcon: { color: colors.primary, fontWeight: '800', fontSize: 16 },
  chevron: { color: colors.muted, fontSize: 28, lineHeight: 30 },
  emergencyButton: { backgroundColor: colors.dangerSoft, borderColor: '#F3C0BC', borderWidth: 1, borderRadius: radius.md, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  emergencyEyebrow: { color: colors.danger, fontSize: 12, letterSpacing: 1, fontWeight: '800' },
  emergencyTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginTop: 5 },
  emergencyArrow: { color: colors.danger, fontSize: 30 },
  disclaimer: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: spacing.md },
  pressed: { opacity: 0.7 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 12 },
  backButtonText: { color: colors.primary, fontWeight: '800', fontSize: 16 },
  progressCard: { backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md },
  formCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.sm },
  segmentRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  segmentButton: { flex: 1, paddingVertical: 10, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.background },
  segmentButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  segmentText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  segmentTextActive: { color: '#FFFFFF' },
  input: { minHeight: 48, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, color: colors.text, backgroundColor: colors.background },
  textArea: { minHeight: 110, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, padding: 14, color: colors.text, backgroundColor: colors.background, textAlignVertical: 'top' },
  primaryButton: { minHeight: 50, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  successMessage: { color: colors.success, fontSize: 13, fontWeight: '700' },
  emptyState: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderStyle: 'dashed', borderRadius: radius.md, padding: spacing.lg },
  rxBadge: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  rxText: { color: colors.primary, fontWeight: '800' },
  removeText: { color: colors.danger, fontSize: 12, fontWeight: '700' },
  infoCard: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, gap: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  bullet: { color: colors.primary, fontSize: 18, lineHeight: 21 },
  bulletText: { flex: 1, color: colors.muted, fontSize: 14, lineHeight: 21 },
  specialistCard: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, gap: 10 },
  specialistTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  specialistIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  specialistIconText: { color: colors.primary, fontSize: 24, fontWeight: '700' },
  specialistRole: { color: colors.primary, fontSize: 12, fontWeight: '700', marginTop: 3 },
  checklistRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md },
  checkbox: { width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxMark: { color: '#FFFFFF', fontWeight: '900' },
  checklistText: { flex: 1, color: colors.text, fontSize: 14, lineHeight: 20 },
  segmentRowWide: { flexDirection: 'row', gap: 10 },
  topicButton: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, alignItems: 'center', backgroundColor: colors.surface },
  topicButtonActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  topicButtonText: { color: colors.muted, fontWeight: '700' },
  topicButtonTextActive: { color: colors.primary },
  conditionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  conditionIcon: { fontSize: 42 },
  sectionRow: { minHeight: 58, paddingHorizontal: spacing.md, paddingVertical: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionRowText: { color: colors.text, fontSize: 15, fontWeight: '700' },
  zoneCard: { borderRadius: radius.md, padding: spacing.md, borderWidth: 1 },
  greenZone: { backgroundColor: colors.successSoft, borderColor: '#B9DDBB' },
  yellowZone: { backgroundColor: colors.warningSoft, borderColor: '#F0D59A' },
  redZone: { backgroundColor: colors.dangerSoft, borderColor: '#F3C0BC' },
  zoneLabel: { fontSize: 11, letterSpacing: 1, fontWeight: '900' },
  greenLabel: { color: colors.success },
  yellowLabel: { color: colors.warning },
  redLabel: { color: colors.danger },
  zoneTitle: { color: colors.text, fontWeight: '800', fontSize: 17, marginTop: 5 },
  zoneText: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 5 },
  befastCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.sm },
  befastRow: { flexDirection: 'row', gap: 14, alignItems: 'center', paddingVertical: 8 },
  befastLetterBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center' },
  befastLetter: { color: colors.danger, fontWeight: '900', fontSize: 20 },
  emergencyNotice: { borderRadius: radius.md, backgroundColor: colors.danger, padding: spacing.lg, marginTop: spacing.sm },
  emergencyNoticeTitle: { color: '#FFFFFF', fontSize: 19, fontWeight: '900' },
  emergencyNoticeText: { color: '#FFFFFF', fontSize: 14, lineHeight: 21, marginTop: 6 },
});

import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { actionZones, careAreas, copdOverview, dailyTools } from './src/content';
import { colors, radius, spacing } from './src/theme';

type Screen = 'home' | 'copd' | 'emergency';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  if (screen === 'copd') {
    return <CopdScreen onBack={() => setScreen('home')} />;
  }

  if (screen === 'emergency') {
    return <EmergencyScreen onBack={() => setScreen('home')} />;
  }

  return <HomeScreen onOpenCopd={() => setScreen('copd')} onEmergency={() => setScreen('emergency')} />;
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

function HomeScreen({ onOpenCopd, onEmergency }: { onOpenCopd: () => void; onEmergency: () => void }) {
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
            onPress={area.id === 'lungs' ? onOpenCopd : undefined}
            style={({ pressed }) => [styles.careCard, pressed && styles.pressed]}
          >
            <Text style={styles.careIcon}>{area.icon}</Text>
            <Text style={styles.cardTitle}>{area.title}</Text>
            <Text style={styles.cardSubtitle}>{area.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Daily tools</Text>
      <View style={styles.stack}>
        {dailyTools.map((tool) => (
          <Pressable key={tool.id} style={({ pressed }) => [styles.toolRow, pressed && styles.pressed]}>
            <View style={styles.toolIconBox}>
              <Text style={styles.toolIcon}>{tool.icon}</Text>
            </View>
            <View style={styles.toolText}>
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
        onPress={onEmergency}
        style={({ pressed }) => [styles.emergencyButton, pressed && styles.pressed]}
      >
        <View>
          <Text style={styles.emergencyEyebrow}>EMERGENCY HELP</Text>
          <Text style={styles.emergencyTitle}>Warning signs and what to do</Text>
        </View>
        <Text style={styles.emergencyArrow}>›</Text>
      </Pressable>

      <Text style={styles.disclaimer}>
        Educational and care-coordination support only. Follow the individual healthcare plan and use emergency services for severe or life-threatening symptoms.
      </Text>
    </ScreenShell>
  );
}

function CopdScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell>
      <BackButton onPress={onBack} />

      <View style={styles.conditionHeader}>
        <Text style={styles.conditionIcon}>🫁</Text>
        <View style={styles.conditionHeaderText}>
          <Text style={styles.eyebrow}>LUNG HEALTH</Text>
          <Text style={styles.heroTitle}>{copdOverview.title}</Text>
        </View>
      </View>

      <Text style={styles.bodyText}>{copdOverview.description}</Text>

      <Text style={styles.sectionTitle}>Explore</Text>
      <View style={styles.stack}>
        {copdOverview.sections.map((section) => (
          <Pressable key={section} style={({ pressed }) => [styles.sectionRow, pressed && styles.pressed]}>
            <Text style={styles.sectionRowText}>{section}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Action plan preview</Text>
      <View style={styles.stack}>
        {actionZones.map((zone) => {
          const zoneStyle =
            zone.id === 'green'
              ? styles.greenZone
              : zone.id === 'yellow'
                ? styles.yellowZone
                : styles.redZone;
          const labelStyle =
            zone.id === 'green'
              ? styles.greenLabel
              : zone.id === 'yellow'
                ? styles.yellowLabel
                : styles.redLabel;

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
        Use action guidance together with the person's individualized care plan. The app should not independently change medication or oxygen instructions.
      </Text>
    </ScreenShell>
  );
}

function EmergencyScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell>
      <BackButton onPress={onBack} />
      <Text style={styles.eyebrow}>EMERGENCY TOOLS</Text>
      <Text style={styles.heroTitle}>Stroke warning signs</Text>
      <Text style={styles.bodyText}>
        Sudden stroke-like symptoms require emergency assessment, even if they improve.
      </Text>

      <View style={styles.befastCard}>
        {[
          ['B', 'Balance', 'Sudden loss of balance or coordination'],
          ['E', 'Eyes', 'Sudden vision change'],
          ['F', 'Face', 'One side droops or feels numb'],
          ['A', 'Arm', 'Sudden weakness or numbness'],
          ['S', 'Speech', 'Slurred, strange or difficult speech'],
          ['T', 'Time', 'Call emergency services immediately'],
        ].map(([letter, title, detail]) => (
          <View key={letter} style={styles.befastRow}>
            <View style={styles.befastLetterBox}>
              <Text style={styles.befastLetter}>{letter}</Text>
            </View>
            <View style={styles.toolText}>
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

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
      <Text style={styles.backButtonText}>‹ Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    padding: spacing.lg,
    paddingBottom: 48,
    gap: spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  brandName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  brandSubtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  hero: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  eyebrow: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1.1,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    marginTop: 8,
  },
  heroText: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 24,
    marginTop: 6,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 19,
    marginTop: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  careCard: {
    width: '47%',
    minHeight: 142,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  careIcon: {
    fontSize: 26,
    marginBottom: 14,
  },
  cardTitle: {
    color: colors.text,
    fontWeight: '750',
    fontSize: 16,
  },
  cardSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  stack: {
    gap: spacing.sm,
  },
  toolRow: {
    minHeight: 76,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  toolIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolIcon: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  toolText: {
    flex: 1,
  },
  chevron: {
    color: colors.muted,
    fontSize: 28,
    lineHeight: 30,
  },
  emergencyButton: {
    backgroundColor: colors.dangerSoft,
    borderColor: '#F3C0BC',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  emergencyEyebrow: {
    color: colors.danger,
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '800',
  },
  emergencyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 5,
  },
  emergencyArrow: {
    color: colors.danger,
    fontSize: 30,
  },
  disclaimer: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 12,
  },
  backButtonText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  conditionIcon: {
    fontSize: 42,
  },
  conditionHeaderText: {
    flex: 1,
  },
  bodyText: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  sectionRow: {
    minHeight: 58,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionRowText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  zoneCard: {
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
  },
  greenZone: {
    backgroundColor: colors.successSoft,
    borderColor: '#B9DDBB',
  },
  yellowZone: {
    backgroundColor: colors.warningSoft,
    borderColor: '#F0D59A',
  },
  redZone: {
    backgroundColor: colors.dangerSoft,
    borderColor: '#F3C0BC',
  },
  zoneLabel: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '900',
  },
  greenLabel: {
    color: colors.success,
  },
  yellowLabel: {
    color: colors.warning,
  },
  redLabel: {
    color: colors.danger,
  },
  zoneTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 17,
    marginTop: 5,
  },
  zoneText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },
  befastCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  befastRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    paddingVertical: 8,
  },
  befastLetterBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  befastLetter: {
    color: colors.danger,
    fontWeight: '900',
    fontSize: 20,
  },
  emergencyNotice: {
    borderRadius: radius.md,
    backgroundColor: colors.danger,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  emergencyNoticeTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  emergencyNoticeText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
});

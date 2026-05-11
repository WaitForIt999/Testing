import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { FIRST_AID_GUIDES, FirstAidGuide } from '../data/firstAid';

export default function FirstAidScreen() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<FirstAidGuide | null>(null);

  if (selected) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelected(null)}>
            <Text style={styles.backText}>← {t('common.back')}</Text>
          </TouchableOpacity>

          <Text style={styles.guideIcon}>{selected.icon}</Text>
          <Text style={styles.guideTitle}>{t(`firstAid.guides.${selected.key}`)}</Text>

          <Section title={t('common.steps')} color="#2980B9">
            {selected.steps.map((step, i) => (
              <View key={i} style={styles.step}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </Section>

          <Section title={t('common.doNot')} color="#E74C3C">
            {selected.doNot.map((item, i) => (
              <Text key={i} style={styles.doNotText}>• {item}</Text>
            ))}
          </Section>

          <Section title={t('common.seekHelp')} color="#E67E22">
            {selected.seekHelp.map((item, i) => (
              <Text key={i} style={styles.seekHelpText}>• {item}</Text>
            ))}
          </Section>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>{t('firstAid.title')}</Text>
        <View style={styles.grid}>
          {FIRST_AID_GUIDES.map((guide) => (
            <TouchableOpacity
              key={guide.key}
              style={styles.card}
              onPress={() => setSelected(guide)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardIcon}>{guide.icon}</Text>
              <Text style={styles.cardTitle}>{t(`firstAid.guides.${guide.key}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <View style={[styles.section, { borderLeftColor: color }]}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIcon: { fontSize: 40, marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', textAlign: 'center' },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 16, color: '#2980B9', fontWeight: '600' },
  guideIcon: { fontSize: 60, textAlign: 'center', marginBottom: 8 },
  guideTitle: { fontSize: 26, fontWeight: '800', color: '#1A1A2E', textAlign: 'center', marginBottom: 24 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
  step: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2980B9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  stepText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 21 },
  doNotText: { fontSize: 14, color: '#E74C3C', lineHeight: 22 },
  seekHelpText: { fontSize: 14, color: '#D35400', lineHeight: 22 },
});

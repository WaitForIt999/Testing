import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SYMPTOMS, triage, TriageLevel } from '../data/triage';

const LEVEL_STYLE: Record<TriageLevel, { bg: string; border: string; text: string }> = {
  emergency: { bg: '#FDECEA', border: '#E74C3C', text: '#C0392B' },
  urgent: { bg: '#FEF9E7', border: '#F39C12', text: '#D68910' },
  monitor: { bg: '#EAFAF1', border: '#2ECC71', text: '#1E8449' },
};

export default function SymptomCheckerScreen() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<TriageLevel | null>(null);

  const toggle = (key: string) => {
    setResult(null);
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const check = () => {
    if (selected.length === 0) {
      Alert.alert('', t('symptoms.noSelection'));
      return;
    }
    setResult(triage(selected));
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>{t('symptoms.selectSymptoms')}</Text>

        <View style={styles.symptomList}>
          {SYMPTOMS.map((s) => {
            const isSelected = selected.includes(s.key);
            return (
              <TouchableOpacity
                key={s.key}
                style={[styles.symptomItem, isSelected && styles.symptomSelected]}
                onPress={() => toggle(s.key)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.symptomLabel, isSelected && styles.symptomLabelSelected]}>
                  {t(`symptoms.symptoms.${s.key}`)}
                </Text>
                {s.weight === 'emergency' && (
                  <Text style={styles.badge}>🚨</Text>
                )}
                {s.weight === 'urgent' && (
                  <Text style={styles.badge}>⚠️</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {result && (
          <View style={[styles.result, {
            backgroundColor: LEVEL_STYLE[result].bg,
            borderColor: LEVEL_STYLE[result].border,
          }]}>
            <Text style={[styles.resultTitle, { color: LEVEL_STYLE[result].text }]}>
              {t('symptoms.result')}
            </Text>
            <Text style={[styles.resultText, { color: LEVEL_STYLE[result].text }]}>
              {t(`symptoms.${result}`)}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.checkBtn} onPress={check}>
          <Text style={styles.checkBtnText}>{t('symptoms.checkNow')}</Text>
        </TouchableOpacity>

        {result && (
          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetBtnText}>↺ Reset</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 18 },
  symptomList: { gap: 10 },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  symptomSelected: {
    borderColor: '#2980B9',
    backgroundColor: '#EBF5FB',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CCC',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { borderColor: '#2980B9', backgroundColor: '#2980B9' },
  checkmark: { color: '#fff', fontWeight: '800', fontSize: 14 },
  symptomLabel: { flex: 1, fontSize: 15, color: '#444' },
  symptomLabelSelected: { color: '#1A5276', fontWeight: '600' },
  badge: { fontSize: 18 },
  result: {
    marginTop: 24,
    padding: 18,
    borderRadius: 14,
    borderWidth: 2,
  },
  resultTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  resultText: { fontSize: 17, fontWeight: '600', lineHeight: 24 },
  checkBtn: {
    marginTop: 24,
    backgroundColor: '#E74C3C',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  checkBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  resetBtn: {
    marginTop: 12,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CCC',
  },
  resetBtnText: { color: '#666', fontSize: 15 },
});

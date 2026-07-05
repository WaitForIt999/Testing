import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'sw', label: 'Kiswahili', flag: '🌍' },
];

export default function SettingsScreen() {
  const { t, i18n: i18nHook } = useTranslation();
  const currentLang = i18nHook.language;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>{t('settings.selectLanguage')}</Text>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.langItem, currentLang === lang.code && styles.langSelected]}
            onPress={() => i18n.changeLanguage(lang.code)}
            activeOpacity={0.8}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text style={[styles.langLabel, currentLang === lang.code && styles.langLabelSelected]}>
              {lang.label}
            </Text>
            {currentLang === lang.code && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { padding: 20 },
  heading: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 20 },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  langSelected: { borderColor: '#2980B9', backgroundColor: '#EBF5FB' },
  flag: { fontSize: 28, marginRight: 14 },
  langLabel: { flex: 1, fontSize: 17, color: '#444' },
  langLabelSelected: { color: '#1A5276', fontWeight: '700' },
  check: { fontSize: 20, color: '#2980B9', fontWeight: '800' },
});

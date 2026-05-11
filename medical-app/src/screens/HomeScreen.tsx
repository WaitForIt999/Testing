import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';

const MODULES = [
  { key: 'symptomChecker', icon: '🩺', screen: 'SymptomChecker', color: '#E74C3C' },
  { key: 'firstAid', icon: '🚑', screen: 'FirstAid', color: '#E67E22' },
  { key: 'medications', icon: '💊', screen: 'Medications', color: '#2980B9' },
  { key: 'childHealth', icon: '👶', screen: 'ChildHealth', color: '#27AE60' },
];

export default function HomeScreen({ navigation }: any) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('home.title')}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>

        <View style={styles.grid}>
          {MODULES.map((mod) => (
            <TouchableOpacity
              key={mod.key}
              style={[styles.card, { borderLeftColor: mod.color }]}
              onPress={() => navigation.navigate(mod.screen)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardIcon}>{mod.icon}</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{t(`home.${mod.key}`)}</Text>
                <Text style={styles.cardDesc}>{t(`home.${mod.key}Desc`)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>{t('home.disclaimer')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 28, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: '#1A1A2E', letterSpacing: 0.5 },
  subtitle: { fontSize: 15, color: '#666', marginTop: 4 },
  grid: { gap: 14 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIcon: { fontSize: 36, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E' },
  cardDesc: { fontSize: 13, color: '#888', marginTop: 3 },
  disclaimer: {
    marginTop: 32,
    padding: 14,
    backgroundColor: '#FFF3CD',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F0AD4E',
  },
  disclaimerText: { fontSize: 12, color: '#856404', lineHeight: 18 },
});

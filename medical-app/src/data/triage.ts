export type TriageLevel = 'emergency' | 'urgent' | 'monitor';

export interface Symptom {
  key: string;
  weight: TriageLevel;
}

// Rule-based triage — no AI, no hallucination risk
// Based on WHO IMCI guidelines (public domain)
export const SYMPTOMS: Symptom[] = [
  { key: 'unconscious', weight: 'emergency' },
  { key: 'convulsions', weight: 'emergency' },
  { key: 'chestPain', weight: 'emergency' },
  { key: 'diffBreathing', weight: 'emergency' },
  { key: 'bleeding', weight: 'emergency' },
  { key: 'stiffNeck', weight: 'emergency' },
  { key: 'highFever', weight: 'urgent' },
  { key: 'severeHeadache', weight: 'urgent' },
  { key: 'severeAbdominalPain', weight: 'urgent' },
  { key: 'yellowSkin', weight: 'urgent' },
  { key: 'fever', weight: 'monitor' },
  { key: 'vomiting', weight: 'monitor' },
  { key: 'diarrhea', weight: 'monitor' },
  { key: 'rash', weight: 'monitor' },
  { key: 'cough', weight: 'monitor' },
];

export function triage(selectedKeys: string[]): TriageLevel {
  if (selectedKeys.length === 0) return 'monitor';

  const levels = selectedKeys.map(
    (key) => SYMPTOMS.find((s) => s.key === key)?.weight ?? 'monitor'
  );

  if (levels.includes('emergency')) return 'emergency';
  if (levels.includes('urgent')) return 'urgent';
  return 'monitor';
}

export interface FirstAidGuide {
  key: string;
  icon: string;
  steps: string[];
  doNot: string[];
  seekHelp: string[];
}

// Content sourced from WHO/Red Cross open guidelines
export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  {
    key: 'burns',
    icon: '🔥',
    steps: [
      'Cool the burn under cool (not cold/icy) running water for at least 10 minutes.',
      'Remove clothing/jewellery near the burn unless stuck to the skin.',
      'Cover loosely with clean non-fluffy material (cling film or clean plastic bag).',
      'Do not burst any blisters.',
    ],
    doNot: [
      'Do NOT apply butter, oil, toothpaste or ice.',
      'Do NOT use fluffy materials such as cotton wool.',
    ],
    seekHelp: [
      'Burns larger than the casualty\'s hand.',
      'Burns on face, hands, feet, genitals or a joint.',
      'Deep burns (white or brown/black skin).',
      'Burns in children or elderly.',
    ],
  },
  {
    key: 'choking',
    icon: '😮',
    steps: [
      'Encourage the person to keep coughing if they can.',
      'Give up to 5 firm back blows between the shoulder blades with the heel of your hand.',
      'Check the mouth each time — remove any visible obstruction.',
      'If back blows fail, give up to 5 abdominal thrusts (Heimlich maneuver).',
      'Alternate 5 back blows and 5 abdominal thrusts.',
      'If the person becomes unconscious, call for help and start CPR.',
    ],
    doNot: [
      'Do NOT perform abdominal thrusts on infants under 1 year old — use back blows and chest thrusts only.',
      'Do NOT do blind finger sweeps in the mouth.',
    ],
    seekHelp: [
      'The obstruction is not cleared after repeated attempts.',
      'The person loses consciousness.',
      'The person had a severe choking episode even if resolved.',
    ],
  },
  {
    key: 'snakeBite',
    icon: '🐍',
    steps: [
      'Keep the victim calm and still — movement spreads venom faster.',
      'Immobilize the bitten limb and keep it below heart level.',
      'Remove watches, rings, tight clothing from the affected area.',
      'Mark the edge of any swelling with a pen and record the time.',
      'Get to a hospital as quickly as possible — antivenom is the only treatment.',
    ],
    doNot: [
      'Do NOT cut the wound or try to suck out venom.',
      'Do NOT apply a tourniquet or ice.',
      'Do NOT give alcohol or aspirin.',
      'Do NOT try to catch or kill the snake.',
    ],
    seekHelp: [
      'ALL snakebites should be evaluated at a hospital immediately.',
      'Symptoms: swelling, pain, numbness, blurred vision, difficulty breathing.',
    ],
  },
  {
    key: 'wounds',
    icon: '🩹',
    steps: [
      'Apply firm pressure with a clean cloth for at least 10 minutes.',
      'Do not remove the cloth — add more on top if soaked through.',
      'Once bleeding stops, clean the wound with clean water.',
      'Cover with a clean bandage or cloth.',
      'If wound is deep or gaping, seek medical help for stitches.',
    ],
    doNot: [
      'Do NOT remove embedded objects — bandage around them.',
      'Do NOT use dirty cloth or leaves on the wound.',
    ],
    seekHelp: [
      'Bleeding does not stop after 15 minutes of firm pressure.',
      'Wound is deep, jagged, or gaping.',
      'Signs of infection: redness, warmth, swelling, pus, fever.',
      'Wound from an animal bite.',
    ],
  },
  {
    key: 'malaria',
    icon: '🦟',
    steps: [
      'Malaria symptoms: fever, chills, sweating, headache, nausea/vomiting.',
      'Symptoms appear 7–30 days after a mosquito bite.',
      'Take temperature — malaria fever often comes in cycles.',
      'Seek a malaria test (RDT) at a clinic or health post.',
      'If diagnosed, complete the full course of treatment prescribed.',
    ],
    doNot: [
      'Do NOT stop medication early even if you feel better.',
      'Do NOT rely on herbal remedies instead of prescribed treatment.',
    ],
    seekHelp: [
      'High fever in a child under 5 — seek help IMMEDIATELY.',
      'Severe headache, stiff neck, confusion, or convulsions.',
      'Difficulty breathing or severe vomiting.',
      'Jaundice (yellow eyes/skin).',
    ],
  },
  {
    key: 'dehydration',
    icon: '💧',
    steps: [
      'Give the person Oral Rehydration Salts (ORS) if available.',
      'If no ORS: mix 1 liter clean water + 6 teaspoons sugar + ½ teaspoon salt.',
      'Give small sips frequently — do not force large amounts.',
      'For infants: continue breastfeeding plus ORS.',
      'Monitor for improvement — urination should resume within a few hours.',
    ],
    doNot: [
      'Do NOT give sugary drinks (cola, juice) as they worsen diarrhea.',
      'Do NOT withhold fluids — this makes dehydration worse.',
    ],
    seekHelp: [
      'No urination for more than 8 hours.',
      'Sunken eyes, dry mouth, rapid heartbeat.',
      'Confusion or loss of consciousness.',
      'Infant with sunken fontanelle (soft spot on head).',
      'Blood in stools.',
    ],
  },
];

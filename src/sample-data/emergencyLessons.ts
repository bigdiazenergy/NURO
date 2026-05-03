export interface EmergencyStep {
  id: string;
  text: string;
  detail?: string;
}

export interface EmergencyLesson {
  id: string;
  title: string;
  icon: string;
  category: 'cardiac' | 'breathing' | 'neurological' | 'trauma' | 'environmental' | 'mental';
  severity: 'critical' | 'serious' | 'moderate';
  disclaimer?: string;
  steps: EmergencyStep[];
  doNotDo?: string[];
}

export const EMERGENCY_LESSONS: EmergencyLesson[] = [
  {
    id: 'cpr-adult',
    title: 'CPR (Adult)',
    icon: '❤️',
    category: 'cardiac',
    severity: 'critical',
    disclaimer:
      'This guide is for reference only. Take a certified CPR class for hands-on training.',
    steps: [
      {
        id: 'cpr-1',
        text: 'Check scene safety',
        detail: 'Make sure the area is safe for you to approach. Look for traffic, fire, gas leaks, or other hazards before moving toward the person.',
      },
      {
        id: 'cpr-2',
        text: 'Call 911',
        detail: 'Call immediately — or have someone else call while you start CPR. Put the phone on speaker.',
      },
      {
        id: 'cpr-3',
        text: 'Check responsiveness',
        detail: 'Tap the person firmly on the shoulder and shout "Are you okay?" If no response, they need CPR.',
      },
      {
        id: 'cpr-4',
        text: 'Position person on their back',
        detail: 'Carefully roll them onto a firm, flat surface. Do not place them on a bed or soft surface — compressions need resistance.',
      },
      {
        id: 'cpr-5',
        text: 'Tilt head, lift chin',
        detail: 'Place one hand on the forehead and two fingers under the chin. Gently tilt the head back to open the airway.',
      },
      {
        id: 'cpr-6',
        text: 'Check breathing for 10 seconds',
        detail: 'Look for chest rise, listen for breath sounds, and feel for air on your cheek. Occasional gasping is NOT normal breathing.',
      },
      {
        id: 'cpr-7',
        text: 'Start chest compressions — 30 hard, fast pushes',
        detail: 'Place the heel of your hand on the center of the chest (on the breastbone). Push down at least 2 inches. Go hard and fast — 100–120 BPM. Let the chest fully recoil between compressions.',
      },
      {
        id: 'cpr-8',
        text: 'Give 2 rescue breaths',
        detail: 'Pinch the nose shut. Make a complete seal over the mouth. Give a breath over 1 second — just enough to see the chest rise. If the chest does not rise, reposition the head and try again.',
      },
      {
        id: 'cpr-9',
        text: 'Repeat: 30 compressions, 2 breaths',
        detail: 'Continue this cycle without stopping. If an AED is available, use it as soon as it arrives. Keep going until paramedics take over or the person shows clear signs of life.',
      },
    ],
    doNotDo: [
      "Don't stop unless the person revives or help takes over",
      "Don't compress too slowly — keep the beat (100–120 BPM)",
      "Don't give up — CPR saves lives",
    ],
  },

  {
    id: 'choking-adult',
    title: 'Choking (Adult)',
    icon: '🤚',
    category: 'breathing',
    severity: 'critical',
    steps: [
      {
        id: 'choke-1',
        text: 'Ask "Are you choking?"',
        detail: 'If they can speak, cough, or breathe — do not intervene yet. Encourage them to keep coughing forcefully.',
      },
      {
        id: 'choke-2',
        text: 'If they cannot speak or breathe: give 5 firm back blows',
        detail: 'Lean them forward slightly. Use the heel of your hand to strike firmly between the shoulder blades 5 times.',
      },
      {
        id: 'choke-3',
        text: 'Give 5 abdominal thrusts (Heimlich maneuver)',
        detail: 'Stand behind them. Place a fist just above the navel. Grab your fist with your other hand and pull sharply inward and upward 5 times.',
      },
      {
        id: 'choke-4',
        text: 'Alternate 5 back blows and 5 abdominal thrusts',
        detail: 'Keep alternating until the object is dislodged or they lose consciousness.',
      },
      {
        id: 'choke-5',
        text: 'If they become unconscious: call 911 and begin CPR',
        detail: 'Lower them carefully to the ground. Begin CPR. Before giving rescue breaths, look in the mouth — only remove an object if you can clearly see it.',
      },
    ],
    doNotDo: [
      "Don't do blind finger sweeps in the mouth — this can push the object deeper",
      "Don't interfere if they can still cough forcefully",
    ],
  },

  {
    id: 'heart-attack',
    title: 'Heart Attack',
    icon: '💔',
    category: 'cardiac',
    severity: 'critical',
    steps: [
      {
        id: 'ha-1',
        text: 'Recognize the signs',
        detail: 'Chest pain or pressure, pain spreading to the left arm, jaw, or back, shortness of breath, sweating, nausea, or lightheadedness.',
      },
      {
        id: 'ha-2',
        text: 'Call 911 immediately',
        detail: 'Do not wait to see if it passes. Every minute without treatment causes more heart damage.',
      },
      {
        id: 'ha-3',
        text: 'Keep the person calm and seated',
        detail: 'Help them sit or lie down in the most comfortable position. Reassure them that help is on the way.',
      },
      {
        id: 'ha-4',
        text: 'Loosen tight clothing',
        detail: 'Loosen belts, collar buttons, or anything restricting the chest.',
      },
      {
        id: 'ha-5',
        text: 'Give aspirin if available and not allergic',
        detail: 'One regular aspirin (325 mg) or four baby aspirin (81 mg each). Have them chew it — do not swallow whole. Only if they are not allergic and can swallow safely.',
      },
      {
        id: 'ha-6',
        text: 'Do NOT let them drive themselves',
        detail: 'Even if they insist they are fine. Wait for the ambulance.',
      },
      {
        id: 'ha-7',
        text: 'Be ready to do CPR if they become unresponsive',
        detail: 'If they stop breathing and become unresponsive, begin CPR immediately.',
      },
    ],
    doNotDo: [
      "Don't wait to see if symptoms pass — time is muscle",
      "Don't let them say 'I'm fine' and dismiss it",
    ],
  },

  {
    id: 'stroke',
    title: 'Stroke',
    icon: '🧠',
    category: 'neurological',
    severity: 'critical',
    steps: [
      {
        id: 'str-1',
        text: 'Use the FAST test',
        detail: 'F — Face drooping (ask them to smile — is one side uneven?). A — Arm weakness (can they raise both arms?). S — Speech difficulty (is speech slurred or strange?). T — Time to call 911.',
      },
      {
        id: 'str-2',
        text: 'Call 911 immediately',
        detail: 'Stroke treatment is time-critical. There are clot-busting treatments that only work within a few hours of symptom onset.',
      },
      {
        id: 'str-3',
        text: 'Note the exact time symptoms started',
        detail: 'Doctors MUST know this. Write it down if you can. This determines which treatments are available.',
      },
      {
        id: 'str-4',
        text: 'Keep the person still and calm',
        detail: 'Have them sit or lie down in a comfortable position. Do not let them walk around.',
      },
      {
        id: 'str-5',
        text: 'Do NOT give food or water',
        detail: 'A stroke can affect the ability to swallow. Giving fluids can cause choking or aspiration.',
      },
    ],
    doNotDo: [
      "Don't give aspirin — unlike a heart attack, aspirin can worsen some strokes",
      "Don't let them sleep it off",
    ],
  },

  {
    id: 'fainting',
    title: 'Fainting',
    icon: '💫',
    category: 'neurological',
    severity: 'moderate',
    steps: [
      {
        id: 'faint-1',
        text: 'Lower them safely to the ground',
        detail: 'If you sense they are about to faint, ease them down. Try to prevent them from falling and hitting their head.',
      },
      {
        id: 'faint-2',
        text: 'Lay them on their back',
        detail: 'A flat position helps blood flow return to the brain.',
      },
      {
        id: 'faint-3',
        text: 'Elevate their legs about 12 inches if possible',
        detail: 'This helps increase blood flow to the brain. Use a folded jacket or bag.',
      },
      {
        id: 'faint-4',
        text: 'Loosen tight clothing',
        detail: 'Loosen collars, belts, or anything tight around the neck or chest.',
      },
      {
        id: 'faint-5',
        text: 'Check breathing',
        detail: 'Watch for normal breathing. If they stop breathing, begin CPR and call 911.',
      },
      {
        id: 'faint-6',
        text: 'Call 911 if unconscious more than 1 minute or if they hit their head',
        detail: 'Also call 911 if they are pregnant, over 50, have heart disease, or if fainting is unexplained and recurring.',
      },
      {
        id: 'faint-7',
        text: 'Stay with them as they recover',
        detail: 'Most people recover within 1–2 minutes. Help them sit up slowly. Offer water only once they are fully alert.',
      },
    ],
    doNotDo: [
      "Don't prop them up in a chair — keep them flat",
      "Don't give water until they are fully conscious",
    ],
  },

  {
    id: 'severe-bleeding',
    title: 'Severe Bleeding',
    icon: '🩸',
    category: 'trauma',
    severity: 'critical',
    steps: [
      {
        id: 'bleed-1',
        text: 'Call 911 for severe or uncontrolled bleeding',
        detail: 'Call immediately if bleeding is heavy, spurting, or won\'t slow down.',
      },
      {
        id: 'bleed-2',
        text: 'Put on gloves if available',
        detail: 'Protect yourself from bloodborne illness. Use latex or nitrile gloves from a first-aid kit.',
      },
      {
        id: 'bleed-3',
        text: 'Apply firm, direct pressure with a clean cloth',
        detail: 'Press down firmly and continuously. Use a clean cloth, gauze, or clothing. Do not use tissues.',
      },
      {
        id: 'bleed-4',
        text: 'Do NOT lift the cloth — add more on top',
        detail: 'Lifting the cloth disrupts the clot forming underneath. If the cloth soaks through, add more material on top.',
      },
      {
        id: 'bleed-5',
        text: 'Keep pressure for at least 10 minutes',
        detail: 'Do not check the wound during this time. Maintain steady, firm pressure.',
      },
      {
        id: 'bleed-6',
        text: 'For a limb: apply a tourniquet if bleeding won\'t stop',
        detail: 'Place the tourniquet 2 inches above the wound (not on a joint). Tighten until bleeding stops. Note the time applied — this is critical information for paramedics.',
      },
      {
        id: 'bleed-7',
        text: 'Keep the person warm and calm',
        detail: 'Lay them down if possible. Cover them with a blanket. Shock is a risk with heavy blood loss.',
      },
    ],
    doNotDo: [
      "Don't remove the cloth — adding more on top maintains the clot",
      "Don't use a tourniquet if direct pressure is working",
    ],
  },

  {
    id: 'anaphylaxis',
    title: 'Severe Allergic Reaction',
    icon: '⚠️',
    category: 'trauma',
    severity: 'critical',
    steps: [
      {
        id: 'ana-1',
        text: 'Recognize the signs',
        detail: 'Hives or skin rash, swelling of face or throat, difficulty breathing or wheezing, dizziness, vomiting, or a rapid/weak pulse.',
      },
      {
        id: 'ana-2',
        text: 'Call 911 immediately',
        detail: 'Anaphylaxis can be fatal within minutes. Call even if the person says they feel okay — symptoms can rapidly worsen.',
      },
      {
        id: 'ana-3',
        text: 'Use an epinephrine auto-injector (EpiPen) if available',
        detail: 'Inject into the outer thigh (can be injected through clothing). Hold in place for 3 seconds. Note the time of injection.',
      },
      {
        id: 'ana-4',
        text: 'Position the person correctly',
        detail: 'If breathing is okay — lay them down with legs elevated. If they are having trouble breathing — sit them upright. If unconscious and not breathing — begin CPR.',
      },
      {
        id: 'ana-5',
        text: 'A second EpiPen dose can be given after 5–15 minutes if symptoms return',
        detail: 'Only if a second auto-injector is available and symptoms worsen again.',
      },
      {
        id: 'ana-6',
        text: 'Stay with them until paramedics arrive',
        detail: 'Symptoms can return even after epinephrine. Hospital monitoring is required.',
      },
    ],
    doNotDo: [
      "Don't use antihistamines (like Benadryl) alone — they're far too slow for anaphylaxis",
      "Don't stand them up if they are feeling dizzy",
    ],
  },

  {
    id: 'panic-attack',
    title: 'Panic Attack',
    icon: '🫁',
    category: 'mental',
    severity: 'moderate',
    steps: [
      {
        id: 'panic-1',
        text: 'Stay calm yourself',
        detail: 'Your calm is contagious. If you panic too, it escalates theirs. Speak in a slow, steady, low voice.',
      },
      {
        id: 'panic-2',
        text: 'Say: "You are safe. This will pass."',
        detail: 'Keep your words simple and reassuring. Repeat it calmly if needed. Avoid over-explaining.',
      },
      {
        id: 'panic-3',
        text: 'Guide slow breathing',
        detail: 'Breathe together with them: breathe in slowly for 4 counts, hold for 4 counts, breathe out for 6 counts. Repeat until they settle.',
      },
      {
        id: 'panic-4',
        text: 'Move to a quieter space if possible',
        detail: 'Reduce sensory input — lower the noise, dim the lights if you can, get away from crowds.',
      },
      {
        id: 'panic-5',
        text: 'Stay present until symptoms fully pass',
        detail: 'Panic attacks almost always peak within 10 minutes and always pass. Your presence matters — don\'t leave them alone.',
      },
    ],
    doNotDo: [
      "Don't say 'calm down' — it doesn't help and can make things worse",
      "Don't leave them alone",
      "Don't say 'there's nothing to be wrong' — it dismisses their experience",
    ],
  },

  {
    id: 'fire-evacuation',
    title: 'Fire / Evacuation',
    icon: '🔥',
    category: 'environmental',
    severity: 'serious',
    steps: [
      {
        id: 'fire-1',
        text: 'Yell "FIRE!" to alert everyone nearby',
        detail: 'Alert others immediately. Seconds matter.',
      },
      {
        id: 'fire-2',
        text: 'Pull the fire alarm if available',
        detail: 'Look for red pull stations on walls near exits and stairwells.',
      },
      {
        id: 'fire-3',
        text: 'Call 911',
        detail: 'Even if the alarm is going off, call 911 to confirm they know the address.',
      },
      {
        id: 'fire-4',
        text: 'Get low — smoke rises',
        detail: 'Crawl or stay low to the ground where the air is cleaner. Cover your nose and mouth with fabric if possible.',
      },
      {
        id: 'fire-5',
        text: 'Feel doors with the back of your hand before opening',
        detail: 'If the door is hot, do not open it — fire is on the other side. Find another exit or shelter in place.',
      },
      {
        id: 'fire-6',
        text: 'Use stairwells, never elevators',
        detail: 'Elevators can fail in fires and can open directly into flames. Always use stairs.',
      },
      {
        id: 'fire-7',
        text: 'Close doors behind you to slow the fire',
        detail: 'Closed doors dramatically slow the spread of fire and smoke.',
      },
      {
        id: 'fire-8',
        text: 'Meet at your designated meeting point',
        detail: 'Go to the pre-arranged meeting spot outside. Account for everyone. Wait for emergency services.',
      },
    ],
    doNotDo: [
      "Don't use elevators — ever",
      "Don't go back inside for anything — not belongings, not phones, not pets",
    ],
  },
];

export function getEmergencyLessonById(id: string): EmergencyLesson | undefined {
  return EMERGENCY_LESSONS.find((l) => l.id === id);
}

export function getEmergencyLessonsByCategory(
  category: EmergencyLesson['category']
): EmergencyLesson[] {
  return EMERGENCY_LESSONS.filter((l) => l.category === category);
}

export function getCriticalLessons(): EmergencyLesson[] {
  return EMERGENCY_LESSONS.filter((l) => l.severity === 'critical');
}

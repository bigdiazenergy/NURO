import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    category: 'appointments',
    title: 'How to make a doctor appointment',
    summary: 'Find the right number, know what to say, and get a time that works for you.',
    estimatedMinutes: 10,
    tags: ['phone', 'doctor', 'health'],
    steps: [
      {
        id: 's1-1',
        text: 'Find the clinic\'s phone number',
        detail:
          'Check the back of your insurance card, a previous appointment card, or search the clinic name online. Save the number in your phone contacts so you have it next time.',
      },
      {
        id: 's1-2',
        text: 'Gather your information before calling',
        detail:
          'Have your date of birth, insurance card, and a rough idea of why you need the appointment. You do not need to explain everything — "a routine check-up" or "I have a concern I\'d like to discuss" is enough.',
      },
      {
        id: 's1-3',
        text: 'Call during business hours',
        detail:
          'Most clinics are open Monday–Friday, 8am–5pm. Avoid calling right at opening time if you can — lines tend to be busiest then.',
      },
      {
        id: 's1-4',
        text: 'Introduce yourself and state your reason',
        detail:
          'Say your name, that you are a patient, and that you would like to schedule an appointment. You do not need to give a detailed explanation.',
      },
      {
        id: 's1-5',
        text: 'Ask about available times',
        detail:
          'If the first time offered does not work, it is fine to say "Is there anything later in the week?" or "Do you have mornings available?"',
      },
      {
        id: 's1-6',
        text: 'Confirm and write it down',
        detail:
          'Repeat the date and time back to make sure you heard correctly. Write it in your calendar or phone immediately. Ask if there is anything you need to bring.',
      },
    ],
    checklist: [
      {
        id: 'cl1-1',
        text: 'Insurance card',
        detail: 'Have it in front of you before you call.',
      },
      {
        id: 'cl1-2',
        text: 'Your date of birth',
        detail: 'They will almost always ask for this.',
      },
      {
        id: 'cl1-3',
        text: 'The reason for your visit written down',
        detail: 'One sentence is enough. You do not need details.',
      },
      {
        id: 'cl1-4',
        text: 'A few dates/times that work for you',
        detail: 'Knowing your schedule ahead of time makes the call faster.',
      },
      {
        id: 'cl1-5',
        text: 'Something to write with',
        detail: 'To write down the appointment date and time.',
      },
    ],
    scripts: [
      {
        id: 'sc1-1',
        title: 'Calling to make an appointment',
        context:
          'Use this when you call the clinic. The receptionist will usually answer and ask how they can help.',
        lines: [
          'Hi, my name is [your name]. I\'m a patient there and I\'d like to make an appointment with Dr. [doctor\'s name].',
          'It\'s for [brief reason — e.g., a routine check-up / a concern I\'d like to discuss].',
          'My date of birth is [date of birth].',
          'Do you have anything available [time preference — e.g., this week / in the mornings / after 2pm]?',
          '[After they offer a time] That works. Can you confirm the date and time for me?',
          'Is there anything I need to bring or do before the appointment?',
          'Thank you. I\'ll see you then.',
        ],
        alternates: [
          'If the doctor is not available: "Is there another doctor in the practice I could see?"',
          'If you need to reschedule: "Actually, could I check a different day? That one doesn\'t work for me."',
          'If they ask for more detail: "I\'d prefer to discuss it with the doctor directly."',
        ],
      },
    ],
  },

  {
    id: 'lesson-2',
    category: 'appointments',
    title: 'What to bring to an appointment',
    summary: 'A clear checklist so you arrive prepared and the visit goes smoothly.',
    estimatedMinutes: 8,
    tags: ['preparation', 'doctor', 'documents'],
    steps: [
      {
        id: 's2-1',
        text: 'The day before: gather your documents',
        detail:
          'Find your insurance card and a valid photo ID (driver\'s license or state ID). Put them somewhere visible so you do not forget them.',
      },
      {
        id: 's2-2',
        text: 'Write down your current medications',
        detail:
          'Include the name and dosage of each medication you take. If you are not sure of the details, bring the bottles themselves.',
      },
      {
        id: 's2-3',
        text: 'Write down any questions or concerns',
        detail:
          'It is easy to forget things once you are in the exam room. Writing them down means you can hand the list to the doctor or read from it.',
      },
      {
        id: 's2-4',
        text: 'Confirm the address and save it',
        detail:
          'Look up the address the night before. Save it in your maps app so you do not have to search while rushing.',
      },
      {
        id: 's2-5',
        text: 'The morning of: charge your phone',
        detail:
          'You may need it for navigation, to look something up, or to fill out forms digitally.',
      },
      {
        id: 's2-6',
        text: 'Arrive 10–15 minutes early if it is a new clinic',
        detail:
          'New patients often have paperwork to fill out. Arriving early avoids a rushed start.',
      },
    ],
    checklist: [
      {
        id: 'cl2-1',
        text: 'Insurance card',
      },
      {
        id: 'cl2-2',
        text: 'Photo ID (driver\'s license or state ID)',
      },
      {
        id: 'cl2-3',
        text: 'List of current medications and dosages',
        detail: 'Or bring the bottles if you are unsure of the details.',
      },
      {
        id: 'cl2-4',
        text: 'Written questions for the doctor',
        detail: 'Even two or three questions is helpful.',
      },
      {
        id: 'cl2-5',
        text: 'Phone charged to at least 50%',
      },
      {
        id: 'cl2-6',
        text: 'Address saved in maps app',
      },
    ],
    scripts: [
      {
        id: 'sc2-1',
        title: 'Checking in at the front desk',
        context: 'When you arrive, walk up to the front desk and say:',
        lines: [
          'Hi, I have an appointment today. My name is [your name].',
          '[If they ask] My date of birth is [date of birth].',
          '[If they ask for insurance] Here is my insurance card.',
          '[If there is paperwork] Is there anything I need to fill out?',
        ],
        alternates: [
          'If you are early: "I\'m a little early — is that okay, or should I wait?"',
          'If you are running late: "I\'m sorry, I\'m running a few minutes behind for my [time] appointment with Dr. [name]."',
        ],
      },
    ],
  },

  {
    id: 'lesson-3',
    category: 'money',
    title: 'What a bill due date means',
    summary: 'Understand exactly what happens when you pay early, on time, or late.',
    estimatedMinutes: 12,
    tags: ['bills', 'due dates', 'credit'],
    steps: [
      {
        id: 's3-1',
        text: 'What "due date" means',
        detail:
          'The due date is the last day you can pay a bill without any penalty. If the due date is the 15th, you need to pay by the end of that day.',
      },
      {
        id: 's3-2',
        text: 'Paying before the due date',
        detail:
          'Paying early is always fine. The money leaves your account sooner, but there is no penalty and no benefit to waiting.',
      },
      {
        id: 's3-3',
        text: 'Paying on the due date',
        detail:
          'Paying on the due date is on time. This is the same as paying early — no penalty. Some people pay on the due date to keep money in their account a little longer.',
      },
      {
        id: 's3-4',
        text: 'Paying after the due date',
        detail:
          'If you pay even one day late, most companies charge a late fee. This is usually $25–$40. For credit cards, a late payment can also lower your credit score.',
      },
      {
        id: 's3-5',
        text: 'How to track due dates',
        detail:
          'The simplest method: when a bill arrives, add the due date to your phone calendar with an alert 3 days before. That gives you time to pay without rushing.',
      },
      {
        id: 's3-6',
        text: 'Setting up autopay',
        detail:
          'Many companies let you set up automatic payment so the bill is paid on the same day each month without you doing anything. Check your account settings or call to ask about it.',
      },
    ],
    checklist: [
      {
        id: 'cl3-1',
        text: 'Find the due date on your current bills',
        detail: 'It is usually printed near the top of the bill.',
      },
      {
        id: 'cl3-2',
        text: 'Add each due date to your calendar',
        detail: 'With a 3-day reminder.',
      },
      {
        id: 'cl3-3',
        text: 'Check if autopay is available',
        detail: 'Log into the account or call the company.',
      },
      {
        id: 'cl3-4',
        text: 'Know the late fee amount for each bill',
        detail: 'Usually listed in the terms or on the bill itself.',
      },
    ],
    scripts: [],
  },

  {
    id: 'lesson-4',
    category: 'money',
    title: 'Debit vs credit in plain English',
    summary: 'The difference between your own money and borrowed money, and when to use each.',
    estimatedMinutes: 10,
    tags: ['debit', 'credit', 'banking', 'basics'],
    steps: [
      {
        id: 's4-1',
        text: 'Debit card: spending your own money',
        detail:
          'When you use a debit card, money comes directly out of your bank account right away. If you have $200 in your account and spend $50, you now have $150. You can only spend what you have.',
      },
      {
        id: 's4-2',
        text: 'Credit card: borrowing money you pay back later',
        detail:
          'When you use a credit card, the credit card company pays for your purchase. You then owe that amount to the company. At the end of the month, you receive a bill for what you spent.',
      },
      {
        id: 's4-3',
        text: 'What happens if you do not pay your credit card bill',
        detail:
          'If you only pay part of what you owe, the rest carries over to next month with added interest — meaning you owe more than you originally spent. Paying the full balance each month avoids interest charges.',
      },
      {
        id: 's4-4',
        text: 'What overdraft means',
        detail:
          'Overdraft happens when you try to spend more than what is in your bank account. Your bank may cover it — but charge you a fee, often $25–$35 per transaction. Some banks let you turn this off so the card just declines instead.',
      },
      {
        id: 's4-5',
        text: 'When debit is the simpler choice',
        detail:
          'For everyday purchases — groceries, gas, coffee — debit is straightforward. You spend only what you have. There is no bill to remember at the end of the month.',
      },
      {
        id: 's4-6',
        text: 'When credit can be useful',
        detail:
          'Credit cards offer fraud protection and can help build your credit score over time — but only if you pay the full balance each month. If keeping track of a second bill feels hard right now, stick with debit.',
      },
    ],
    checklist: [
      {
        id: 'cl4-1',
        text: 'Know which cards in your wallet are debit vs credit',
        detail: 'It usually says "DEBIT" on the front.',
      },
      {
        id: 'cl4-2',
        text: 'Know your current bank account balance',
        detail: 'Check your bank app.',
      },
      {
        id: 'cl4-3',
        text: 'Check if overdraft protection is on or off on your account',
        detail: 'You can usually find this in your bank app settings or by calling your bank.',
      },
    ],
    scripts: [],
  },

  {
    id: 'lesson-5',
    category: 'daily-living',
    title: 'A simple weekly laundry routine',
    summary: 'Sort, wash, dry, and put away — a step-by-step approach that makes laundry manageable.',
    estimatedMinutes: 15,
    tags: ['laundry', 'routine', 'cleaning'],
    steps: [
      {
        id: 's5-1',
        text: 'Sort your clothes into two piles',
        detail:
          'Dark clothes (black, navy, dark grey, dark colors) in one pile. Light clothes (white, cream, light grey, pastels) in another. This prevents colors from bleeding onto lighter items.',
      },
      {
        id: 's5-2',
        text: 'Check pockets before loading',
        detail:
          'Empty all pockets. Tissues, paper, and coins can damage clothes or the machine. This takes 30 seconds and prevents problems.',
      },
      {
        id: 's5-3',
        text: 'Load the washer and add detergent',
        detail:
          'Do not overfill — clothes need room to move. For liquid detergent, use the measuring cap and fill to the line marked for your load size. For pods, place one pod in the drum before adding clothes.',
      },
      {
        id: 's5-4',
        text: 'Choose the right setting',
        detail:
          'For most everyday clothes: cold water, normal cycle. Cold water is gentler and uses less energy. Hot water is for towels, bedding, or items that need sanitizing.',
      },
      {
        id: 's5-5',
        text: 'Move clothes to the dryer promptly',
        detail:
          'Clothes left wet in the washer for more than an hour or two can start to smell. Set a phone alarm for when the cycle ends.',
      },
      {
        id: 's5-6',
        text: 'Dry on medium heat for most items',
        detail:
          'High heat can shrink clothes. Medium heat is safe for most fabrics. Check labels for anything that says "lay flat to dry" or "hang dry."',
      },
      {
        id: 's5-7',
        text: 'Fold or hang clothes while still slightly warm',
        detail:
          'Folding warm clothes immediately reduces wrinkles. Even folding one item at a time as you remove it from the dryer works.',
      },
    ],
    checklist: [
      {
        id: 'cl5-1',
        text: 'Laundry detergent (enough for the load)',
      },
      {
        id: 'cl5-2',
        text: 'Pockets checked and emptied',
      },
      {
        id: 'cl5-3',
        text: 'Clothes sorted (darks and lights separated)',
      },
      {
        id: 'cl5-4',
        text: 'Dryer sheet or dryer balls (optional)',
        detail: 'Reduces static and softens fabrics.',
      },
      {
        id: 'cl5-5',
        text: 'Phone alarm set for end of wash cycle',
      },
    ],
    scripts: [],
  },

  {
    id: 'lesson-6',
    category: 'daily-living',
    title: 'How to grocery shop for a few days',
    summary: 'Check what you have, make a simple list, and get in and out without overspending.',
    estimatedMinutes: 12,
    tags: ['groceries', 'shopping', 'food', 'planning'],
    steps: [
      {
        id: 's6-1',
        text: 'Check what you already have',
        detail:
          'Before making a list, look in your fridge and pantry. Check what needs to be used up soon. This avoids buying duplicates and wastes less food.',
      },
      {
        id: 's6-2',
        text: 'Plan 3–4 simple meals',
        detail:
          'You do not need a full weekly meal plan. Even knowing "I will make pasta twice and eggs in the morning" is enough to build a list from.',
      },
      {
        id: 's6-3',
        text: 'Write your list organized by store section',
        detail:
          'Group items by section: produce (fruits and vegetables), dairy (milk, eggs, cheese), bread/grains, pantry (canned goods, pasta), and frozen. This means fewer trips back across the store.',
      },
      {
        id: 's6-4',
        text: 'Bring the list and stick to it',
        detail:
          'The list is there to reduce decision fatigue in the store. If something is not on the list, give yourself one moment to decide — then either add it mentally and move on, or skip it.',
      },
      {
        id: 's6-5',
        text: 'Check unit prices when comparing similar products',
        detail:
          'The shelf tag often shows a price per ounce or per unit. The bigger size is not always cheaper per unit. A few seconds of comparison can save money.',
      },
      {
        id: 's6-6',
        text: 'Review before checkout',
        detail:
          'A quick look at the items in your cart before the register catches anything you grabbed by mistake.',
      },
    ],
    checklist: [
      {
        id: 'cl6-1',
        text: 'Check fridge and pantry before writing the list',
      },
      {
        id: 'cl6-2',
        text: 'Written list organized by section',
        detail: 'Produce, dairy, bread, pantry, frozen.',
      },
      {
        id: 'cl6-3',
        text: 'Reusable bag or plan to buy bags at checkout',
      },
      {
        id: 'cl6-4',
        text: 'Know your rough budget for this trip',
      },
      {
        id: 'cl6-5',
        text: 'Bring or charge your payment method',
      },
    ],
    scripts: [],
  },

  {
    id: 'lesson-7',
    category: 'communication',
    title: 'How to call and ask a question when confused',
    summary: 'A step-by-step approach to making calls when you need information or help.',
    estimatedMinutes: 10,
    tags: ['phone calls', 'communication', 'asking for help'],
    steps: [
      {
        id: 's7-1',
        text: 'Write your question down before calling',
        detail:
          'Even one sentence. "I need to know when my package will arrive" or "I want to ask about my bill amount." Having it written down means you will not forget mid-call.',
      },
      {
        id: 's7-2',
        text: 'Find the right number',
        detail:
          'Look on the company\'s website, on a bill or receipt, or on a previous email from them. Avoid numbers from random search results — go to the official site.',
      },
      {
        id: 's7-3',
        text: 'Call during business hours',
        detail:
          'Most companies have phone support Monday–Friday, 9am–5pm. Some have extended hours. Check the website if unsure.',
      },
      {
        id: 's7-4',
        text: 'Navigate the phone menu',
        detail:
          'Press the number that most closely matches your reason. If nothing fits, pressing 0 or saying "representative" sometimes connects you to a person.',
      },
      {
        id: 's7-5',
        text: 'Introduce yourself and ask your question clearly',
        detail:
          'State your name, any account number if relevant, and then ask your question directly. You do not need to explain everything at once — just start with the main question.',
      },
      {
        id: 's7-6',
        text: 'Write down the answer and who you spoke with',
        detail:
          'Note the name of the person who helped you and what they said. If you need to call back, this information is useful.',
      },
    ],
    checklist: [
      {
        id: 'cl7-1',
        text: 'Question written down before calling',
      },
      {
        id: 'cl7-2',
        text: 'Correct phone number from official source',
      },
      {
        id: 'cl7-3',
        text: 'Account number or reference number if needed',
      },
      {
        id: 'cl7-4',
        text: 'Pen and paper or notes app to write down the answer',
      },
    ],
    scripts: [
      {
        id: 'sc7-1',
        title: 'Calling to ask a question',
        context:
          'Use this when you reach a person. You can read directly from this or use it as a guide.',
        lines: [
          'Hi, my name is [your name].',
          'I have a question about [topic — e.g., my account / a recent bill / an order].',
          '[If they ask for account info] My account number is [number]. My date of birth is [date].',
          'My question is: [your question, as you wrote it down].',
          '[After they answer] Can I confirm — [repeat what they said back to them]?',
          'Thank you. Can I get your name in case I need to follow up?',
        ],
        alternates: [
          'If you do not understand the answer: "I want to make sure I understood that correctly. Could you say that again more slowly?"',
          'If they cannot help: "Is there someone else I should speak with about this?"',
          'If you feel overwhelmed: "Can I call back? I want to make sure I write this down correctly."',
        ],
      },
    ],
  },

  {
    id: 'lesson-8',
    category: 'daily-living',
    title: 'How to set up a simple weekly reset routine',
    summary: 'Pick one time a week to reset your space and prepare for what is ahead.',
    estimatedMinutes: 10,
    tags: ['routine', 'reset', 'planning', 'habits'],
    steps: [
      {
        id: 's8-1',
        text: 'Pick a day and time for your weekly reset',
        detail:
          'Sunday evening works for many people because it sets up the week ahead. But the best day is whatever day you can actually do it. Choose a time you are usually home and not too tired.',
      },
      {
        id: 's8-2',
        text: 'Decide what "reset" means for you',
        detail:
          'A reset does not mean a deep clean. It is a short, predictable routine — maybe 20–40 minutes — that leaves you feeling prepared. Write down 4–6 specific things you want to do each week.',
      },
      {
        id: 's8-3',
        text: 'Start with one surface or one area',
        detail:
          'Clear the kitchen counter, or just the bathroom sink area. One cleared surface has an outsized effect on how tidy a space feels.',
      },
      {
        id: 's8-4',
        text: 'Do laundry if it has piled up',
        detail:
          'You do not need to do laundry every reset — only when it is needed. Adding it to the same window each week means it does not pile up unnoticed.',
      },
      {
        id: 's8-5',
        text: 'Check your calendar for next week',
        detail:
          'Look at what is coming up. Any appointments? Anything you need to prepare for? Knowing ahead of time reduces last-minute stress.',
      },
      {
        id: 's8-6',
        text: 'Prep anything for the next day',
        detail:
          'Lay out clothes, pack a bag, or prep something for breakfast. This takes 5 minutes and makes mornings easier.',
      },
    ],
    checklist: [
      {
        id: 'cl8-1',
        text: 'Clear one surface (kitchen counter or bathroom)',
      },
      {
        id: 'cl8-2',
        text: 'Do laundry if needed',
      },
      {
        id: 'cl8-3',
        text: 'Check calendar for next week',
        detail: 'Any appointments, deadlines, or things to prepare for.',
      },
      {
        id: 'cl8-4',
        text: 'Prep anything needed for tomorrow morning',
      },
      {
        id: 'cl8-5',
        text: 'Quick tidy of living or bedroom area',
        detail: 'Put things back where they belong — does not need to be perfect.',
      },
    ],
    scripts: [],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getLessonsByCategory(category: string): Lesson[] {
  return LESSONS.filter((l) => l.category === category);
}

export const XP_PER_LEVEL = 100;

export const AREAS = [
  { key: 'health', name: 'Health', symbol: '✦', note: 'Energy, sleep, movement' },
  { key: 'education', name: 'Learning', symbol: '⌘', note: 'Study, skills, curiosity' },
  { key: 'mindset', name: 'Mindset', symbol: '☾', note: 'Calm, courage, focus' },
  { key: 'career', name: 'Career', symbol: '↗', note: 'Work, projects, direction' },
  { key: 'relationships', name: 'People', symbol: '♡', note: 'Friendship, care, connection' },
  { key: 'creativity', name: 'Creativity', symbol: '✧', note: 'Hobbies, art, making things' }
];

export const ARCHETYPES = {
  health: {
    name: 'Kairo',
    title: 'The Ember Vanguard',
    realm: 'The Wildspark Frontier',
    accent: '#ffb56e',
    secondary: '#ff6686',
    outfit: '#6b375d',
    deepOutfit: '#342343',
    hair: '#202841',
    hairStyle: 'spike',
    line: 'The first step is a spark. The next is yours to choose.'
  },
  education: {
    name: 'Neri',
    title: 'The Star Archivist',
    realm: 'The Astral Archive',
    accent: '#c4a7ff',
    secondary: '#79bfff',
    outfit: '#57467e',
    deepOutfit: '#292344',
    hair: '#292842',
    hairStyle: 'long',
    line: 'Every question opens a door the world forgot to lock.'
  },
  mindset: {
    name: 'Yuna',
    title: 'The Moonwake Seer',
    realm: 'The Quiet Moonwell',
    accent: '#9abaff',
    secondary: '#d2aaff',
    outfit: '#375780',
    deepOutfit: '#202a4c',
    hair: '#252c48',
    hairStyle: 'soft',
    line: 'A small light is still enough to find your way.'
  },
  career: {
    name: 'Ren',
    title: 'The Wayfinder',
    realm: 'The Ember March',
    accent: '#ffd181',
    secondary: '#ff9277',
    outfit: '#805238',
    deepOutfit: '#402f36',
    hair: '#3b2c41',
    hairStyle: 'sweep',
    line: 'The path appears beneath the step you choose.'
  },
  relationships: {
    name: 'Hana',
    title: 'The Heartwood Weaver',
    realm: 'The Heartwood',
    accent: '#ffacc9',
    secondary: '#d897ff',
    outfit: '#834967',
    deepOutfit: '#402844',
    hair: '#433046',
    hairStyle: 'twin',
    line: 'Small acts of care can change an entire world.'
  },
  creativity: {
    name: 'Aeri',
    title: 'The Dreamsmith',
    realm: 'The Unwritten Sea',
    accent: '#80e2ff',
    secondary: '#a594ff',
    outfit: '#36748c',
    deepOutfit: '#203c60',
    hair: '#263550',
    hairStyle: 'wild',
    line: 'Make the first mark. The rest of the page can wait.'
  }
};

export const STAKES = {
  soft: {
    name: 'Soft',
    symbol: '◇',
    wards: 3,
    penalty: 5,
    subtitle: 'A gentle beginning',
    detail: '3 ward stones · −5 XP if none remain'
  },
  steady: {
    name: 'Steady',
    symbol: '⬡',
    wards: 2,
    penalty: 10,
    subtitle: 'A balanced promise',
    detail: '2 ward stones · −10 XP if none remain'
  },
  iron: {
    name: 'Iron',
    symbol: '◆',
    wards: 1,
    penalty: 20,
    subtitle: 'A bold undertaking',
    detail: '1 ward stone · −20 XP if none remain'
  }
};

export const STAT_ITEMS = [
  { key: 'vitality', name: 'Vitality', symbol: '✦' },
  { key: 'focus', name: 'Focus', symbol: '⌘' },
  { key: 'heart', name: 'Heart', symbol: '♡' },
  { key: 'resolve', name: 'Resolve', symbol: '↗' }
];

const AREA_STATS = {
  health: 'vitality',
  education: 'focus',
  mindset: 'heart',
  career: 'resolve',
  relationships: 'heart',
  creativity: 'focus'
};

const MAIN_QUESTS = {
  health: [
    { title: 'Wake the body', action: 'Take a gentle walk, stretch, or do movement that feels right for you today.' },
    { title: 'Tend your energy', action: 'Choose one small thing that helps you feel cared for: water, a meal, rest, or fresh air.' },
    { title: 'Build a softer landing', action: 'Make one small choice that could help you wind down later.' },
    { title: 'Step into daylight', action: 'Spend a few minutes outside or near a window and let your body change pace.' }
  ],
  education: [
    { title: 'Open the archive', action: 'Give one learning task a focused start. Put away one distraction and begin.' },
    { title: 'Test your memory', action: 'Write down three things you remember before looking at your notes.' },
    { title: 'Follow a question', action: 'Find one thing you do not understand yet and spend a little time exploring it.' },
    { title: 'Practice the spell', action: 'Do one small exercise, example, or repetition instead of waiting to feel ready.' }
  ],
  mindset: [
    { title: 'Read your inner weather', action: 'Write a few honest lines about how today is feeling. No perfect words needed.' },
    { title: 'Visit the moonwell', action: 'Take a few slower breaths and give yourself a quiet moment.' },
    { title: 'Keep one small promise', action: 'Choose one manageable action and follow it through.' },
    { title: 'Find the hidden glimmer', action: 'Name one small thing you did today that you want to give yourself credit for.' }
  ],
  career: [
    { title: 'Move one priority forward', action: 'Give one useful work or project task a focused beginning.' },
    { title: 'Clear the brambles', action: 'Make one small part of your workspace or task list easier to use.' },
    { title: 'Build a useful skill', action: 'Spend a little time practicing a skill that matters to you.' },
    { title: 'Mark the next trail', action: 'Write the single next action for a project you care about.' }
  ],
  relationships: [
    { title: 'Send a little warmth', action: 'Send a kind message or check in with someone you value.' },
    { title: 'Offer your attention', action: 'Give someone a few minutes of conversation without multitasking.' },
    { title: 'Name what you appreciate', action: 'Tell someone one specific thing you appreciate about them.' },
    { title: 'Make room at the hearth', action: 'Make a little space for someone important to you.' }
  ],
  creativity: [
    { title: 'Make a tiny draft', action: 'Create a small, imperfect first version of something.' },
    { title: 'Practice your craft', action: 'Repeat one useful skill from your creative practice.' },
    { title: 'Gather a spark', action: 'Save an idea, image, sound, or note that makes you curious.' },
    { title: 'Leave a trace', action: 'Save a record of something you made, practiced, or tried.' }
  ]
};

const SIDE_QUESTS = {
  health: 'Take a short walk, stretch, or choose one gentle movement break.',
  education: 'Review one note or learn one small thing that interests you.',
  mindset: 'Write a few honest lines or take a quiet pause.',
  career: 'Make the next action on one task easier to see.',
  relationships: 'Send someone a warm message or make time for a real conversation.',
  creativity: 'Make, sketch, practice, or play without worrying about the result.'
};

const RITUALS = {
  time: {
    title: 'Open the two-minute portal',
    detail: 'Begin the smallest part of a task for two minutes. You are allowed to stop after that.'
  },
  energy: {
    title: 'Recharge at the campfire',
    detail: 'Take a short pause, drink some water, or rest. Recovery can be a real step.'
  },
  overwhelm: {
    title: 'Shrink the quest',
    detail: 'Write the next action smaller than feels necessary, then do only that one thing.'
  },
  distraction: {
    title: 'Silence one mimic',
    detail: 'Put one distraction out of reach for a few minutes while you start your quest.'
  },
  uncertainty: {
    title: 'Ask the map one question',
    detail: 'Write down the next action you can take, even if it is not the perfect one.'
  },
  consistency: {
    title: 'Light a return candle',
    detail: 'Reopen something you care about and give it two minutes. There is no streak to protect.'
  }
};

const DAY_BEATS = [
  'Cross the threshold',
  'Gather your supplies',
  'Follow the lantern',
  'Meet the mini-boss',
  'Make camp',
  'Claim a relic',
  'Return with a spark'
];

export function getAreaName(key) {
  return AREAS.find((area) => area.key === key)?.name || 'Growth';
}

export function getArchetype(profile) {
  return ARCHETYPES[profile?.primaryGoal] || ARCHETYPES.mindset;
}

export function getLevel(xp = 0) {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
}

export function getStartingStats(profile = {}) {
  const sleep = {
    under6: -5,
    '6to7': 0,
    '7to8': 5,
    over8: 5
  }[profile.sleep] ?? 0;

  const energy = {
    low: -5,
    steady: 0,
    high: 5
  }[profile.energy] ?? 0;

  const movement = {
    rarely: 0,
    sometimes: 5,
    often: 10
  }[profile.movement] ?? 0;

  const stress = {
    low: 5,
    medium: 0,
    high: -5
  }[profile.stress] ?? 0;

  return {
    vitality: Math.min(70, Math.max(20, 38 + sleep + energy + movement)),
    focus: Math.min(70, Math.max(20, 42 + energy + stress)),
    heart: Math.min(70, Math.max(20, 44 + stress)),
    resolve: Math.min(70, Math.max(20, 35 + movement))
  };
}

export function makeQuests(profile, day) {
  const mainArea = profile?.primaryGoal || profile?.areas?.[0] || 'mindset';
  const mainQuest = (MAIN_QUESTS[mainArea] || MAIN_QUESTS.mindset)[(day - 1) % 4];
  const minutes = Number(profile?.dailyMinutes || 10);
  const goal = profile?.goalDetail?.trim();
  const hobby = profile?.hobby?.trim();
  const otherArea = (profile?.areas || []).find((area) => area !== mainArea);
  const ritual = RITUALS[profile?.obstacle] || RITUALS.time;

  const first = {
    id: `day-${day}-main`,
    kicker: `MAIN QUEST · ${getAreaName(mainArea).toUpperCase()} · ${DAY_BEATS[(day - 1) % DAY_BEATS.length].toUpperCase()}`,
    title: mainQuest.title,
    detail: `${mainQuest.action}${goal ? ` Keep it connected to your goal: “${goal}”` : ''}`,
    minutes,
    xp: 10,
    stat: AREA_STATS[mainArea] || 'resolve',
    tone: mainArea,
    symbol: '✦'
  };

  const second = hobby
    ? {
        id: `day-${day}-hobby`,
        kicker: 'HOBBY SIDE QUEST · JUST FOR YOU',
        title: `Make room for ${hobby}`,
        detail: `Spend ${Math.min(minutes, 15)} minutes making, practicing, learning, or playing. Keep the bar low enough that it still feels like yours.`,
        minutes: Math.min(minutes, 15),
        xp: 10,
        stat: 'focus',
        tone: 'hobby',
        symbol: '✧'
      }
    : {
        id: `day-${day}-side`,
        kicker: `SIDE QUEST · ${getAreaName(otherArea || mainArea).toUpperCase()}`,
        title: 'Explore a side path',
        detail: SIDE_QUESTS[otherArea || mainArea] || SIDE_QUESTS.mindset,
        minutes: Math.min(minutes, 10),
        xp: 10,
        stat: AREA_STATS[otherArea || mainArea] || 'heart',
        tone: otherArea || mainArea,
        symbol: '⌁'
      };

  const third = {
    id: `day-${day}-ritual`,
    kicker: 'CAMPFIRE RITUAL · A SMALL RESET',
    title: ritual.title,
    detail: ritual.detail,
    minutes: 2,
    xp: 10,
    stat: 'heart',
    tone: 'ritual',
    symbol: '☾'
  };

  return [first, second, third];
}

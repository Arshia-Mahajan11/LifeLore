export const XP_PER_LEVEL = 150;

export const LIFE_PATHS = [
  {
    id: 'academic',
    title: 'The Academic / Scholar',
    subtitle: 'Exams, deep research, intense reading, monk study blocks',
    icon: '📚',
    defaultStat: 'FOCUS'
  },
  {
    id: 'builder',
    title: 'The Builder / Developer',
    subtitle: 'Software, startups, technical mastery, coding sprints',
    icon: '💻',
    defaultStat: 'FOCUS'
  },
  {
    id: 'warrior',
    title: 'The Athlete / Gym Rat',
    subtitle: 'Hypertrophy, combat conditioning, strength PRs, athletic cuts',
    icon: '🥊',
    defaultStat: 'STRENGTH'
  },
  {
    id: 'creative',
    title: 'The Artisan / Creator',
    subtitle: 'Digital art, 3D, writing, animation, music production',
    icon: '🎨',
    defaultStat: 'WISDOM'
  },
  {
    id: 'monarch',
    title: 'The Operator / High Achiever',
    subtitle: 'Career ascendance, business growth, ruthlessly locked-in discipline',
    icon: '⚔️',
    defaultStat: 'DISCIPLINE'
  }
];

export const HEROES = {
  jinwoo: {
    id: 'jinwoo',
    name: 'Sung Jin-woo',
    anime: 'Solo Leveling',
    title: 'Shadow Monarch',
    aura: '#00e5ff',
    themeStat: 'DISCIPLINE',
    avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=700&auto=format&fit=crop&q=80',
    quote: 'Arise. In this arc, you rewrite your limits from nothing.'
  },
  yor: {
    id: 'yor',
    name: 'Yor / Shadow Blade',
    anime: 'Spy × Assassin Arc',
    title: 'Thorn Sovereign',
    aura: '#ff2d55',
    themeStat: 'FOCUS',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&auto=format&fit=crop&q=80',
    quote: 'Quiet elegance hiding razor-sharp execution.'
  },
  toji: {
    id: 'toji',
    name: 'Toji / Raw Striker',
    anime: 'Jujutsu Arc',
    title: 'Zero Cursed Physique',
    aura: '#ff9100',
    themeStat: 'STRENGTH',
    avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=700&auto=format&fit=crop&q=80',
    quote: 'No excuses. Pure physical and mental dominance.'
  },
  isagi: {
    id: 'isagi',
    name: 'Yoichi Isagi',
    anime: 'Blue Lock',
    title: 'Metavision Striker',
    aura: '#22c55e',
    themeStat: 'CONFIDENCE',
    avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=700&auto=format&fit=crop&q=80',
    quote: 'Devour your weakness to awaken a sharper vision.'
  }
};

export function buildDynamicQuests(profile, level = 1) {
  const quests = [];
  const hours = profile.focusHours || 3;
  const isHard = level >= 3;

  // 1. Core Focus Quest (Adaptive to Path)
  switch (profile.path) {
    case 'academic':
      quests.push({
        id: 'q-core',
        title: `${hours}h Deep Study Block`,
        tag: 'Academic Mastery',
        stat: 'FOCUS',
        duration: `${hours} hrs`,
        xp: hours * 15,
        bg: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'
      });
      break;
    case 'builder':
      quests.push({
        id: 'q-core',
        title: `${hours}h Deep Coding & System Build`,
        tag: 'Engineering Arc',
        stat: 'FOCUS',
        duration: `${hours} hrs`,
        xp: hours * 15,
        bg: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
      });
      break;
    case 'warrior':
      quests.push({
        id: 'q-core',
        title: isHard ? 'High-Volume Hypertrophy + Sprints' : 'Heavy Weight Training (1h)',
        tag: 'Physical Domination',
        stat: 'STRENGTH',
        duration: '75 mins',
        xp: 60,
        bg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
      });
      break;
    case 'creative':
      quests.push({
        id: 'q-core',
        title: `${hours}h Focused Craft & Creation`,
        tag: 'Master Artisan',
        stat: 'WISDOM',
        duration: `${hours} hrs`,
        xp: hours * 15,
        bg: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80'
      });
      break;
    default:
      quests.push({
        id: 'q-core',
        title: `${hours}h High-Leverage Execution`,
        tag: 'Monarch Focus',
        stat: 'DISCIPLINE',
        duration: `${hours} hrs`,
        xp: hours * 15,
        bg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
      });
  }

  // 2. Physical & Movement Trial
  if (profile.path !== 'warrior') {
    quests.push({
      id: 'q-workout',
      title: profile.workoutType === 'gym' ? 'Intense Gym Training (1h)' : 'Calisthenics & 10k Steps',
      tag: 'Body Armor',
      stat: 'STRENGTH',
      duration: '45 mins',
      xp: 45,
      bg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80'
    });
  } else {
    quests.push({
      id: 'q-conditioning',
      title: 'Zone-2 Cardio + Cold Shower Recovery',
      tag: 'Vascular Engine',
      stat: 'DISCIPLINE',
      duration: '35 mins',
      xp: 45,
      bg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80'
    });
  }

  // 3. Skin Care & Glow-up
  quests.push({
    id: 'q-glow',
    title: profile.glowGoal ? `Glow Protocol: ${profile.glowGoal}` : 'Cleanser, Ice Face & 3L Water',
    tag: 'Aesthetic Radiance',
    stat: 'GLOW',
    duration: '15 mins',
    xp: 35,
    bg: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
  });

  // 4. Recovery & Anti-Distraction
  quests.push({
    id: 'q-discipline',
    title: profile.weakness === 'screens' ? 'Strict Screen Blackout after 10 PM' : 'In Bed Before 11:00 PM (Zero Feeds)',
    tag: 'Mindset Protocol',
    stat: 'DISCIPLINE',
    duration: 'Night Habit',
    xp: 40,
    bg: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80'
  });

  // 5. Protected Passion / Side Quest
  if (profile.hobby && profile.hobby.trim()) {
    quests.push({
      id: 'q-hobby',
      title: `Sanctuary: ${profile.hobby.trim()}`,
      tag: 'Soul Quest',
      stat: 'WISDOM',
      duration: '30 mins',
      xp: 35,
      bg: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80'
    });
  }

  return quests;
}

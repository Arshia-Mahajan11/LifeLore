export const XP_PER_LEVEL = 150;

export const HEROES = {
  jinwoo: {
    id: 'jinwoo',
    name: 'Sung Jin-woo',
    anime: 'Solo Leveling',
    title: 'Shadow Monarch',
    aura: '#00e5ff',
    themeStat: 'DISCIPLINE',
    avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=700&auto=format&fit=crop&q=80',
    quote: 'Arise. In this arc, you rewrite your own limits.'
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
    quote: 'No excuses. Pure physical dominance.'
  },
  isagi: {
    id: 'isagi',
    name: 'Yoichi Isagi',
    anime: 'Blue Lock',
    title: 'Metavision Striker',
    aura: '#22c55e',
    themeStat: 'CONFIDENCE',
    avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=700&auto=format&fit=crop&q=80',
    quote: 'Devour today’s version of you to awaken tomorrow.'
  }
};

export function buildQuests(studyHours = 4, workoutGoal = '1h', level = 1, hobby = '') {
  const isHard = level >= 3;

  return [
    {
      id: 'q-study',
      title: `${studyHours}h Focused Deep Work`,
      tag: 'Academic Trial',
      stat: 'FOCUS',
      duration: `${studyHours} hrs`,
      xp: studyHours * 15,
      bg: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'q-skincare',
      title: 'Glass Skin & Ice Hydration',
      tag: 'Glow-Up Arc',
      stat: 'GLOW',
      duration: '10 mins',
      xp: 35,
      bg: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'q-workout',
      title: isHard ? 'Heavy Gym Training + Cardio' : 'Bodyweight & Strength (1h)',
      tag: 'Physical Mastery',
      stat: 'STRENGTH',
      duration: '1 hr',
      xp: 50,
      bg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'q-sleep',
      title: 'In Bed by 10:45 PM (Deep Sleep)',
      tag: 'Recovery',
      stat: 'DISCIPLINE',
      duration: 'Night Protocol',
      xp: 30,
      bg: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'q-hobby',
      title: hobby && hobby.trim() ? `Creative Skill: ${hobby}` : 'Meditation & Screen Detox',
      tag: 'Side Quest',
      stat: 'WISDOM',
      duration: '30 mins',
      xp: 35,
      bg: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80'
    }
  ];
}

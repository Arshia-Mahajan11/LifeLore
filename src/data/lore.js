export const XP_PER_LEVEL = 150;

export const ARCHETYPES = {
  discipline: {
    id: 'jinwoo',
    name: 'Sung Jin-woo',
    anime: 'Solo Leveling (Winter Arc)',
    title: 'Shadow Monarch',
    themeStat: 'DISCIPLINE',
    auraColor: '#00e5ff',
    stages: {
      base: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      awakened: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      monarch: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
    },
    line: 'Arise. Turn comfort into an awakening.'
  },
  strength: {
    id: 'ippo',
    name: 'Ippo Makunouchi',
    anime: 'Hajime no Ippo',
    title: 'Dempsey Roller',
    themeStat: 'STRENGTH',
    auraColor: '#ff3d00',
    stages: {
      base: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      awakened: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&auto=format&fit=crop&q=80',
      monarch: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80'
    },
    line: 'What does it mean to be strong? You find out every day.'
  },
  focus: {
    id: 'isagi',
    name: 'Yoichi Isagi',
    anime: 'Blue Lock',
    title: 'Spatial Vision Striker',
    themeStat: 'FOCUS',
    auraColor: '#22c55e',
    stages: {
      base: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
      awakened: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
      monarch: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&auto=format&fit=crop&q=80'
    },
    line: 'Devour your weakness and reconstruct your goal piece by piece.'
  },
  mindset: {
    name: 'Hinata & Kageyama',
    id: 'haikyuu',
    anime: 'Haikyuu!!',
    title: 'Freak Quick Duo',
    themeStat: 'CONFIDENCE',
    auraColor: '#f59e0b',
    stages: {
      base: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
      awakened: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
      monarch: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80'
    },
    line: 'The future belongs to those who jump higher than their doubts.'
  }
};

export function matchArchetype(goal) {
  if (goal === 'strength') return ARCHETYPES.strength;
  if (goal === 'focus' || goal === 'hardcore_study') return ARCHETYPES.focus;
  if (goal === 'mindset') return ARCHETYPES.mindset;
  return ARCHETYPES.discipline;
}

export function generateDynamicQuests(level = 1, studyHours = '6', hobby = '') {
  const isHighLevel = level >= 5;
  const isMidLevel = level >= 3;

  // Custom Study Hours based on their chosen 5h, 6h, or 8h+ answer
  const studyHoursNum = parseInt(studyHours, 10) || 6;
  const studyTitle = `${studyHoursNum}h Hardcore Study Arc`;
  const studyDuration = `0 / ${studyHoursNum} hrs`;

  return [
    {
      id: 'q-study',
      title: studyTitle,
      type: 'Daily',
      difficulty: studyHoursNum >= 6 ? 'Extreme' : 'Hard',
      duration: studyDuration,
      stat: 'FOCUS',
      xp: studyHoursNum * 15,
      bg: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'q-skincare',
      title: 'Skin Care & Looksmaxing Glow',
      type: 'Daily Glow',
      difficulty: 'Easy',
      duration: 'Morning & Night Cleanser + Moisturizer',
      stat: 'WISDOM',
      xp: 40,
      glowUp: true,
      bg: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'q-workout',
      title: isHighLevel ? 'Intense Gym Training 1.5h' : 'Workout 1h (Strength)',
      type: 'Daily',
      difficulty: isHighLevel ? 'Extreme' : 'Hard',
      duration: '0 / 1 hr',
      stat: 'STRENGTH',
      xp: isHighLevel ? 75 : 50,
      bg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'q-screentime',
      title: isHighLevel ? 'Screentime < 2hr' : 'Screentime < 4hr',
      type: 'Daily',
      difficulty: 'Medium',
      duration: 'Daily tracker',
      stat: 'DISCIPLINE',
      xp: 45,
      bg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'q-hobby',
      title: hobby && hobby.trim() ? `Arc Mastery: ${hobby}` : 'Night Meditation & Rest',
      type: 'Side Quest',
      difficulty: 'Easy',
      duration: '30 mins',
      stat: 'CONFIDENCE',
      xp: 35,
      bg: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80'
    }
  ];
}

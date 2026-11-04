export const XP_PER_LEVEL = 150;

export const CHARACTERS = {
  discipline: {
    id: 'jinwoo',
    name: 'Sung Jin-woo',
    anime: 'Solo Leveling',
    title: 'Shadow Monarch',
    themeStat: 'DIS',
    auraColor: '#00e5ff',
    stages: {
      base: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      awakened: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      monarch: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
    },
    line: 'I will become stronger. No matter what it takes.'
  },
  strength: {
    id: 'tanjiro',
    name: 'Tanjiro Kamado',
    anime: 'Demon Slayer',
    title: 'Sun Breathing Swordsman',
    themeStat: 'STR',
    auraColor: '#00e676',
    stages: {
      base: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
      awakened: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      monarch: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
    },
    line: 'Work your muscles, keep your breathing steady, and never give up.'
  },
  vitality: {
    id: 'naruto',
    name: 'Naruto Uzumaki',
    anime: 'Naruto Shippuden',
    title: 'Nine-Tails Jinchuriki',
    themeStat: 'CON',
    auraColor: '#ff9100',
    stages: {
      base: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
      awakened: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      monarch: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80'
    },
    line: 'I never go back on my word. That is my ninja way!'
  },
  focus: {
    id: 'loid',
    name: 'Loid Forger',
    anime: 'Spy × Family',
    title: 'Agent Twilight',
    themeStat: 'FOC',
    auraColor: '#c084fc',
    stages: {
      base: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      awakened: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      monarch: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80'
    },
    line: 'Precision and calm execution outmatch brute force every time.'
  }
};

export function determineCharacter(goal) {
  switch (goal) {
    case 'fitness':
      return CHARACTERS.strength;
    case 'studies':
      return CHARACTERS.focus;
    case 'habits':
      return CHARACTERS.vitality;
    default:
      return CHARACTERS.discipline;
  }
}

export function generateDynamicQuests(level = 1, goal = 'habits', hobby = '') {
  const isHighLevel = level >= 5;
  const isMidLevel = level >= 3;

  const workoutQuest = {
    id: 'q-workout',
    title: isHighLevel ? 'Extreme Workout 1.5h' : isMidLevel ? 'Intense Training 1h' : 'Starter Workout 45m',
    type: 'Daily',
    difficulty: isHighLevel ? 'Extreme' : isMidLevel ? 'Hard' : 'Medium',
    duration: isHighLevel ? '1.5 hrs' : '1 hr',
    stat: 'STR',
    xp: isHighLevel ? 80 : isMidLevel ? 50 : 35,
    bg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
  };

  const sleepQuest = {
    id: 'q-sleep',
    title: isHighLevel ? 'Strict Sleep: In Bed by 10:30 PM' : 'In bed by 11:00 PM',
    type: 'Daily',
    difficulty: 'Easy',
    duration: 'Night Routine',
    stat: 'CON',
    xp: 30,
    bg: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80'
  };

  const focusQuest = {
    id: 'q-focus',
    title: isHighLevel ? 'Deep Work Session (2h)' : isMidLevel ? 'Focused Study (1h)' : 'Focus Block (30m)',
    type: 'Daily',
    difficulty: isHighLevel ? 'Hard' : 'Medium',
    duration: isHighLevel ? '2 hrs' : '1 hr',
    stat: 'FOC',
    xp: isHighLevel ? 75 : 45,
    bg: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'
  };

  const hobbyQuest = hobby.trim()
    ? {
        id: 'q-hobby',
        title: `Hobby: ${hobby}`,
        type: 'Side Quest',
        difficulty: 'Easy',
        duration: '20 mins',
        stat: 'WIS',
        xp: 40,
        bg: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80'
      }
    : {
        id: 'q-routine',
        title: 'Hydration & Cold Splash',
        type: 'Daily',
        difficulty: 'Easy',
        duration: '5 mins',
        stat: 'DIS',
        xp: 25,
        bg: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
      };

  return [workoutQuest, sleepQuest, focusQuest, hobbyQuest];
}

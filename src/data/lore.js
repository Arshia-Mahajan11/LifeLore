export const XP_PER_LEVEL = 100;

export const CHARACTERS = [
  {
    id: 'jinwoo',
    name: 'Ethan / Shadow Monarch',
    anime: 'Solo Leveling Style',
    auraColor: '#00e5ff',
    avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    title: 'Shadow Monarch',
    quote: 'I will become stronger. No matter what it takes.'
  },
  {
    id: 'tanjiro',
    name: 'Tanjiro Kamado',
    anime: 'Demon Slayer',
    auraColor: '#00e676',
    avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    title: 'Sun Breathing Swordsman',
    quote: 'No matter how many people you may lose, you have no choice but to go on living.'
  },
  {
    id: 'naruto',
    name: 'Naruto Uzumaki',
    anime: 'Naruto Shippuden',
    auraColor: '#ff9100',
    avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    title: 'Seventh Hokage',
    quote: 'I never go back on my word. That is my ninja way!'
  },
  {
    id: 'loid',
    name: 'Loid Forger',
    anime: 'Spy × Family',
    auraColor: '#ff4081',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    title: 'Agent Twilight',
    quote: 'A spy does not rest until Operation Strix is complete.'
  }
];

export const INITIAL_QUESTS = [
  {
    id: 'q-workout',
    title: 'Workout 1h',
    type: 'Daily',
    difficulty: 'Hard',
    duration: '0 / 1hrs',
    stat: 'STR',
    xp: 50,
    bg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'q-sleep',
    title: 'In bed by 11PM',
    type: 'Daily',
    difficulty: 'Easy',
    duration: 'Target 11PM',
    stat: 'CON',
    xp: 30,
    bg: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'q-skin',
    title: 'Skin care',
    type: 'Daily',
    difficulty: 'Easy',
    duration: 'Morning & Night',
    stat: 'WIS',
    xp: 25,
    bg: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'q-study',
    title: 'Study 1h',
    type: 'Daily',
    difficulty: 'Medium',
    duration: '0 / 1hrs',
    stat: 'FOC',
    xp: 45,
    bg: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'q-meditate',
    title: 'Meditation & Calm',
    type: 'Daily',
    difficulty: 'Easy',
    duration: '15 mins',
    stat: 'DIS',
    xp: 20,
    bg: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'
  }
];

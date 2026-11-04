import { useEffect, useId, useMemo, useRef, useState } from 'react';
import './styles.css';

const STORAGE_KEY = 'reset-arc-save-v1';
const XP_PER_LEVEL = 50;
const STAT_GAIN_PER_QUEST = 4;

const AREA_LIST = [
  {
    key: 'health',
    label: 'Health',
    icon: '✦',
    description: 'Movement, sleep, nutrition, energy'
  },
  {
    key: 'education',
    label: 'Education',
    icon: '⌘',
    description: 'Study, learning, skills, focus'
  },
  {
    key: 'mindset',
    label: 'Mindset',
    icon: '◌',
    description: 'Confidence, calm, habits, self-trust'
  },
  {
    key: 'career',
    label: 'Career',
    icon: '↗',
    description: 'Work, projects, direction, progress'
  },
  {
    key: 'relationships',
    label: 'Relationships',
    icon: '♡',
    description: 'Connection, kindness, communication'
  },
  {
    key: 'creativity',
    label: 'Creativity',
    icon: '✧',
    description: 'Making, practicing, sharing ideas'
  }
];

const AREA_BY_KEY = Object.fromEntries(
  AREA_LIST.map((area) => [area.key, area])
);

const PERSONAS = {
  health: {
    character: 'Aoi',
    role: 'The Pulsekeeper',
    accent: '#64e4d2',
    shade: '#216e71',
    hair: '#244653',
    outfit: '#286c70',
    tagline: 'Small promises build a stronger rhythm.'
  },
  education: {
    character: 'Rin',
    role: 'The Star Scholar',
    accent: '#b8a0ff',
    shade: '#5543a2',
    hair: '#34284f',
    outfit: '#544b83',
    tagline: 'Every focused minute opens another door.'
  },
  mindset: {
    character: 'Mika',
    role: 'The Stillfire',
    accent: '#8db4ff',
    shade: '#355b9b',
    hair: '#293957',
    outfit: '#3a5a83',
    tagline: 'You can be a work in progress and still be proud.'
  },
  career: {
    character: 'Kai',
    role: 'The Wayfinder',
    accent: '#ffc27b',
    shade: '#9c623c',
    hair: '#513642',
    outfit: '#815137',
    tagline: 'Direction is created by the next step.'
  },
  relationships: {
    character: 'Hana',
    role: 'The Heartweaver',
    accent: '#ff9dbb',
    shade: '#a34469',
    hair: '#553246',
    outfit: '#8a4966',
    tagline: 'Connection grows through small acts of care.'
  },
  creativity: {
    character: 'Sora',
    role: 'The Dreamsmith',
    accent: '#79d9ff',
    shade: '#387ca4',
    hair: '#283e5a',
    outfit: '#376d91',
    tagline: 'Make one small thing. Then make the next.'
  }
};

const STAKES = {
  soft: {
    label: 'Soft',
    shields: 3,
    penalty: 5,
    symbol: '◇',
    description: 'Room to find your rhythm',
    detail: '3 shields · −5 XP if no shields remain'
  },
  steady: {
    label: 'Steady',
    shields: 2,
    penalty: 10,
    symbol: '⬡',
    description: 'A balanced commitment',
    detail: '2 shields · −10 XP if no shields remain'
  },
  iron: {
    label: 'Iron',
    shields: 1,
    penalty: 20,
    symbol: '◆',
    description: 'A tougher, focused challenge',
    detail: '1 shield · −20 XP if no shields remain'
  }
};

const STAT_ITEMS = [
  { key: 'vitality', label: 'Vitality', icon: '✦' },
  { key: 'focus', label: 'Focus', icon: '⌘' },
  { key: 'resolve', label: 'Resolve', icon: '↗' },
  { key: 'balance', label: 'Balance', icon: '◌' }
];

const EMPTY_PROFILE = {
  name: '',
  lifeStage: 'school',
  areas: ['health', 'education'],
  primaryGoal: 'health',
  goalDetail: '',
  focusDetail: '',
  why: '',
  sleepHours: 7,
  movement: 'rarely',
  energy: 3,
  stress: 3,
  screenTime: '4-6',
  routine: 'sometimes',
  obstacle: 'time',
  dailyMinutes: '15',
  bestTime: 'morning'
};

const FOCUS_PROMPTS = {
  health: {
    label: 'What health focus matters most right now?',
    placeholder: 'Choose a health focus',
    options: [
      'Improve my sleep',
      'Move more often',
      'Build strength',
      'Eat more intentionally',
      'Increase my energy',
      'Reduce stress'
    ]
  },
  education: {
    label: 'What are you learning or studying?',
    placeholder: 'For example: biology, Japanese, a certification'
  },
  mindset: {
    label: 'What inner skill are you building?',
    placeholder: 'Choose a mindset focus',
    options: [
      'Confidence',
      'Focus',
      'Calm',
      'Self-compassion',
      'Consistency',
      'Managing stress'
    ]
  },
  career: {
    label: 'What would you like to move forward?',
    placeholder: 'For example: a portfolio, job search, work skill'
  },
  relationships: {
    label: 'What kind of connection do you want to grow?',
    placeholder: 'For example: family time, communication, friendships'
  },
  creativity: {
    label: 'What would you like to make or practice?',
    placeholder: 'For example: drawing, music, writing, photography'
  }
};

const QUEST_BANK = {
  health: [
    {
      title: 'Get your body moving',
      detail: 'Take a walk, stretch, or do a little movement that feels right.',
      stat: 'vitality'
    },
    {
      title: 'Fuel your energy',
      detail: 'Make one thoughtful choice that helps you feel looked after.',
      stat: 'vitality'
    },
    {
      title: 'Protect your wind-down',
      detail: 'Give yourself a few screen-free minutes before bed.',
      stat: 'balance'
    },
    {
      title: 'Make hydration easy',
      detail: 'Keep water nearby and take a proper pause to drink.',
      stat: 'vitality'
    }
  ],
  education: [
    {
      title: 'Start a focus sprint',
      detail: 'Work on one learning task without switching tabs or tasks.',
      stat: 'focus'
    },
    {
      title: 'Review what you learned',
      detail: 'Write down three things you remember from your last study session.',
      stat: 'focus'
    },
    {
      title: 'Ask one good question',
      detail: 'Find one point you do not understand and investigate it.',
      stat: 'resolve'
    },
    {
      title: 'Practice a small skill',
      detail: 'Do a short exercise instead of waiting to feel fully ready.',
      stat: 'focus'
    }
  ],
  mindset: [
    {
      title: 'Name what is on your mind',
      detail: 'Write a few honest lines without trying to make them perfect.',
      stat: 'balance'
    },
    {
      title: 'Take a quiet reset',
      detail: 'Pause for a few slow breaths and notice how you feel.',
      stat: 'balance'
    },
    {
      title: 'Keep one small promise',
      detail: 'Choose a manageable action and follow it through.',
      stat: 'resolve'
    },
    {
      title: 'Notice a small win',
      detail: 'Give yourself credit for one thing you did today.',
      stat: 'balance'
    }
  ],
  career: [
    {
      title: 'Move one priority forward',
      detail: 'Give one useful work or career task a focused start.',
      stat: 'resolve'
    },
    {
      title: 'Clear one point of friction',
      detail: 'Organize one small part of your workspace or task list.',
      stat: 'resolve'
    },
    {
      title: 'Build a useful skill',
      detail: 'Spend a little time practicing a skill that matters to you.',
      stat: 'focus'
    },
    {
      title: 'Make the next step obvious',
      detail: 'Write down the single next action for a project you care about.',
      stat: 'resolve'
    }
  ],
  relationships: [
    {
      title: 'Make a thoughtful connection',
      detail: 'Send a kind message or check in with someone you value.',
      stat: 'balance'
    },
    {
      title: 'Give someone your attention',
      detail: 'Have a short conversation without multitasking.',
      stat: 'balance'
    },
    {
      title: 'Show appreciation',
      detail: 'Tell someone one specific thing you appreciate about them.',
      stat: 'resolve'
    },
    {
      title: 'Make space for connection',
      detail: 'Create a little time for someone important to you.',
      stat: 'balance'
    }
  ],
  creativity: [
    {
      title: 'Make a small thing',
      detail: 'Create something without judging whether it is finished or good.',
      stat: 'focus'
    },
    {
      title: 'Practice your craft',
      detail: 'Spend a little time repeating one useful creative skill.',
      stat: 'focus'
    },
    {
      title: 'Collect inspiration',
      detail: 'Save an idea, image, sound, or note that sparks your curiosity.',
      stat: 'balance'
    },
    {
      title: 'Share or save your progress',
      detail: 'Keep a record of something you made or practiced today.',
      stat: 'resolve'
    }
  ]
};

const RESET_QUESTS = [
  {
    title: 'Set tomorrow up',
    detail: 'Spend five minutes making one part of tomorrow easier.',
    stat: 'resolve'
  },
  {
    title: 'Give your attention a breather',
    detail: 'Take a short screen-free pause and notice how you feel.',
    stat: 'balance'
  },
  {
    title: 'Close the day kindly',
    detail: 'Write down one thing you did today that you want to repeat.',
    stat: 'balance'
  },
  {
    title: 'Reset one small space',
    detail: 'Make one corner of your environment easier to return to.',
    stat: 'resolve'
  }
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function areaLabel(key) {
  return AREA_BY_KEY[key]?.label || 'Growth';
}

function getPersona(profile) {
  return PERSONAS[profile?.primaryGoal] || PERSONAS.mindset;
}

function getLevel(xp = 0) {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
}

function getInitialStats(profile) {
  const sleep = Number(profile.sleepHours || 7);
  const energy = Number(profile.energy || 3);
  const stress = Number(profile.stress || 3);

  const movementScore = {
    rarely: 0,
    '1-2': 4,
    '3-4': 8,
    '5+': 12
  }[profile.movement] ?? 0;

  const routineScore = {
    inconsistent: 0,
    sometimes: 6,
    steady: 12
  }[profile.routine] ?? 0;

  const screenScore = {
    under2: 8,
    '2-4': 4,
    '4-6': 0,
    '6+': -4
  }[profile.screenTime] ?? 0;

  return {
    vitality: clamp(
      Math.round(34 + (sleep - 6) * 4 + movementScore + (energy - 3) * 3),
      20,
      70
    ),
    focus: clamp(
      Math.round(38 + (energy - 3) * 3 + screenScore),
      20,
      70
    ),
    resolve: clamp(
      Math.round(
        34 +
          routineScore +
          (profile.obstacle === 'motivation' ? -3 : 0)
      ),
      20,
      70
    ),
    balance: clamp(
      Math.round(40 + (3 - stress) * 4 + (sleep >= 7 ? 3 : 0)),
      20,
      70
    )
  };
}

function makeDailyQuests(profile, day) {
  const mainKey = profile?.primaryGoal || 'mindset';
  const mainBank = QUEST_BANK[mainKey] || QUEST_BANK.mindset;
  const mainTemplate = mainBank[(day - 1) % mainBank.length];

  const secondaryAreas = (profile?.areas || []).filter(
    (area) => area !== mainKey
  );

  const secondaryKey =
    secondaryAreas.length > 0
      ? secondaryAreas[(day - 1) % secondaryAreas.length]
      : mainKey === 'health'
        ? 'mindset'
        : 'health';

  const secondaryBank = QUEST_BANK[secondaryKey] || QUEST_BANK.health;
  const secondaryTemplate =
    secondaryBank[(day + 1) % secondaryBank.length];

  const resetTemplate = RESET_QUESTS[(day - 1) % RESET_QUESTS.length];
  const goal = profile?.goalDetail?.trim();
  const focus = profile?.focusDetail?.trim();
  const minutes = Number(profile?.dailyMinutes || 15);

  const personalDetail = goal
    ? `${focus ? `${focus}: ` : ''}Give “${goal}” ${minutes} focused minutes. Break it into one small, finishable step.`
    : mainTemplate.detail;

  return [
    {
      id: `day-${day}-main`,
      title: goal ? 'Move your main goal forward' : mainTemplate.title,
      detail: personalDetail,
      category: mainKey,
      stat: mainTemplate.stat,
      xp: 10
    },
    {
      id: `day-${day}-support`,
      title: secondaryTemplate.title,
      detail: secondaryTemplate.detail,
      category: secondaryKey,
      stat: secondaryTemplate.stat,
      xp: 10
    },
    {
      id: `day-${day}-reset`,
      title: resetTemplate.title,
      detail: resetTemplate.detail,
      category: 'reset',
      stat: resetTemplate.stat,
      xp: 10
    }
  ];
}

function readSavedData() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function formatDate(dateString) {
  if (!dateString) {
    return 'Today';
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  } catch {
    return 'Today';
  }
}

function SiteHeader({ challenge, showRestart, onRestart }) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">
          ✦
        </div>
        <div>
          <div className="brand-name">
            RESET<span>ARC</span>
          </div>
          <div className="brand-caption">BUILD THE NEXT YOU</div>
        </div>
      </div>

      <div className="topbar-right">
        {challenge ? (
          <div className="header-challenge">
            <span className="live-dot" />
            <span>
              DAY {challenge.currentDay} / {challenge.duration}
            </span>
            <span className="header-divider" />
            <strong>{challenge.xp} XP</strong>
          </div>
        ) : (
          <div className="topbar-note">A SMALL-STEP RPG FOR REAL LIFE</div>
        )}

        {showRestart && (
          <button className="header-reset" type="button" onClick={onRestart}>
            <span aria-hidden="true">↺</span>
            <span>Start over</span>
          </button>
        )}
      </div>
    </header>
  );
}

function AnimeAvatar({ profile, level = 1, className = '' }) {
  const persona = getPersona(profile);
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const awakened = level >= 5;
  const geared = level >= 3;
  const crowned = level >= 7;

  const stageLabel = crowned
    ? 'ASCENDED'
    : awakened
      ? 'AWAKENED'
      : geared
        ? 'GEARED'
        : 'ROOKIE';

  return (
    <div
      className={`avatar-wrap ${className}`}
      style={{ '--avatar-accent': persona.accent }}
    >
      <svg
        className="anime-avatar"
        viewBox="0 0 260 300"
        role="img"
        aria-label={`${persona.character}, ${persona.role}, level ${level}`}
      >
        <defs>
          <radialGradient id={`${uid}-halo`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor={persona.accent} stopOpacity="0.32" />
            <stop offset="100%" stopColor={persona.accent} stopOpacity="0" />
          </radialGradient>

          <linearGradient
            id={`${uid}-cape`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor={persona.accent} />
            <stop offset="100%" stopColor={persona.shade} />
          </linearGradient>

          <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        <circle cx="130" cy="140" r="116" fill={`url(#${uid}-halo)`} />

        {awakened && (
          <g className="avatar-aura">
            <circle
              cx="130"
              cy="137"
              r="94"
              fill="none"
              stroke={persona.accent}
              strokeWidth="3"
              opacity="0.34"
              filter={`url(#${uid}-glow)`}
            />
            <circle
              cx="130"
              cy="137"
              r="86"
              fill="none"
              stroke={persona.accent}
              strokeWidth="1.5"
              strokeDasharray="4 9"
              opacity="0.7"
            />
            <path
              d="M130 27 L130 12 M210 73 L222 64 M50 73 L38 64 M220 151 L238 151 M40 151 L22 151"
              stroke={persona.accent}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>
        )}

        {awakened && (
          <path
            d="M77 151 Q130 176 183 151 L218 256 Q130 234 42 256 Z"
            fill={`url(#${uid}-cape)`}
            opacity="0.88"
            stroke={persona.accent}
            strokeWidth="1.5"
          />
        )}

        <ellipse
          cx="130"
          cy="271"
          rx="76"
          ry="11"
          fill="#02060d"
          opacity="0.42"
        />

        <path
          d="M83 174 Q92 155 113 154 L147 154 Q169 156 178 174 L194 250 Q130 274 66 250 Z"
          fill={persona.outfit}
          stroke="#101827"
          strokeWidth="3"
        />

        <path
          d="M83 180 Q66 185 61 207 L57 235 Q72 243 83 237 L96 195 Z"
          fill={persona.shade}
          stroke="#101827"
          strokeWidth="3"
        />

        <path
          d="M177 180 Q194 185 199 207 L203 235 Q188 243 177 237 L164 195 Z"
          fill={persona.shade}
          stroke="#101827"
          strokeWidth="3"
        />

        <path
          d="M112 149 L112 180 Q130 194 148 180 L148 149"
          fill="#edb99f"
          stroke="#172033"
          strokeWidth="2"
        />

        <path
          d="M107 181 L130 204 L153 181"
          fill="none"
          stroke={persona.accent}
          strokeWidth="3"
          opacity="0.9"
        />

        <path
          d="M91 214 Q130 231 169 214"
          fill="none"
          stroke="#f6e2b7"
          strokeWidth="2"
          opacity="0.72"
        />

        <path
          d="M75 96 Q61 45 99 25 Q133 7 166 28 Q199 50 185 105 L177 148 Q159 132 154 107 L102 108 Q99 135 81 150 Z"
          fill={persona.hair}
          stroke="#141a29"
          strokeWidth="3"
        />

        <circle cx="82" cy="106" r="10" fill="#efbea5" />
        <circle cx="178" cy="106" r="10" fill="#efbea5" />

        <ellipse
          cx="130"
          cy="101"
          rx="47"
          ry="57"
          fill="#f3c6aa"
          stroke="#172033"
          strokeWidth="3"
        />

        <path
          d="M87 84 Q91 37 130 35 Q174 34 177 84 Q166 69 153 67 Q143 82 132 78 Q117 91 104 73 Q97 83 87 84 Z"
          fill={persona.hair}
          stroke="#141a29"
          strokeWidth="2"
        />

        <path
          d="M88 78 Q91 48 112 41 Q103 63 106 81 Z"
          fill={persona.hair}
          opacity="0.96"
        />

        <ellipse cx="111" cy="106" rx="10" ry="13" fill="#fff7ec" />
        <ellipse cx="149" cy="106" rx="10" ry="13" fill="#fff7ec" />
        <ellipse cx="112" cy="108" rx="5.5" ry="8" fill={persona.accent} />
        <ellipse cx="148" cy="108" rx="5.5" ry="8" fill={persona.accent} />
        <circle cx="113" cy="109" r="2.6" fill="#172033" />
        <circle cx="149" cy="109" r="2.6" fill="#172033" />
        <circle cx="114.5" cy="105.5" r="2" fill="#ffffff" />
        <circle cx="150.5" cy="105.5" r="2" fill="#ffffff" />

        <path
          d="M105 93 Q112 88 119 93 M141 93 Q148 88 155 93"
          fill="none"
          stroke={persona.hair}
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M130 112 L127 122"
          fill="none"
          stroke="#cf8f7c"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        <path
          d="M121 132 Q130 139 139 132"
          fill="none"
          stroke="#9f4e60"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <ellipse cx="99" cy="122" rx="8" ry="3" fill="#ef8d91" opacity="0.22" />
        <ellipse cx="160" cy="122" rx="8" ry="3" fill="#ef8d91" opacity="0.22" />

        {geared && (
          <g className="avatar-gear">
            <path
              d="M80 177 Q91 165 104 172 L98 196 Q85 200 73 190 Z"
              fill="#e7c77f"
              stroke="#fff0c0"
              strokeWidth="2"
            />
            <path
              d="M180 177 Q169 165 156 172 L162 196 Q175 200 187 190 Z"
              fill="#e7c77f"
              stroke="#fff0c0"
              strokeWidth="2"
            />
            <path
              d="M96 184 L130 205 L164 184"
              fill="none"
              stroke="#f5db9a"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="130" cy="205" r="6" fill={persona.accent} />
          </g>
        )}

        {crowned && (
          <g className="avatar-crown">
            <path
              d="M103 38 L107 19 L120 31 L130 13 L140 31 L153 19 L157 40 Z"
              fill="#ffd982"
              stroke="#fff2c2"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M105 40 L155 40"
              stroke="#fff2c2"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="130" cy="28" r="3" fill={persona.accent} />
          </g>
        )}
      </svg>

      <div className="avatar-rank">{stageLabel}</div>
    </div>
  );
}

function LandingScreen({ onStart }) {
  const demoProfile = {
    primaryGoal: 'creativity',
    areas: ['creativity', 'mindset']
  };

  return (
    <main>
      <section className="landing-hero">
        <div className="landing-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            YOUR NEXT CHAPTER STARTS SMALL
          </div>

          <h1>
            Turn the life you want into your <em>next arc.</em>
          </h1>

          <p className="landing-lede">
            Build a challenge around your real goals, complete small daily
            quests, and watch your character grow alongside you.
          </p>

          <div className="landing-actions">
            <button className="button button-primary button-large" onClick={onStart}>
              Build my reset
              <span aria-hidden="true">↗</span>
            </button>
            <span className="landing-no-pressure">No perfect days required.</span>
          </div>

          <div className="landing-mini-stats">
            <div>
              <strong>01</strong>
              <span>Know your starting point</span>
            </div>
            <div>
              <strong>02</strong>
              <span>Sign your own challenge</span>
            </div>
            <div>
              <strong>03</strong>
              <span>Level up through action</span>
            </div>
          </div>
        </div>

        <div className="hero-art-wrap">
          <div className="hero-art-card">
            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />
            <div className="hero-art-label">
              <span className="status-pip" />
              CHARACTER PREVIEW
            </div>

            <AnimeAvatar profile={demoProfile} level={5} className="hero-avatar" />

            <div className="hero-character-caption">
              <div>
                <span className="eyebrow">YOUR GROWTH COMPANION</span>
                <h2>Sora</h2>
                <p>The Dreamsmith</p>
              </div>
              <div className="hero-level">LVL 05</div>
            </div>

            <div className="hero-art-footnote">
              The character is original artwork made from in-app SVG shapes.
            </div>
          </div>
        </div>
      </section>

      <section className="landing-feature-grid">
        <article className="feature-card">
          <div className="feature-icon">⌘</div>
          <span className="eyebrow">01 / YOUR BLUEPRINT</span>
          <h3>Start with your real life.</h3>
          <p>
            Reflect on your energy, routine, obstacles, and the goals you
            genuinely want to work on.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-icon">✍</div>
          <span className="eyebrow">02 / YOUR CONTRACT</span>
          <h3>Choose a challenge you can own.</h3>
          <p>
            Choose 7, 21, or 30 days, select a stake, and sign with your
            finger or mouse.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-icon">✦</div>
          <span className="eyebrow">03 / YOUR EVOLUTION</span>
          <h3>Small quests. Visible growth.</h3>
          <p>
            Earn XP, grow your stats, use shields when a day is tough, and
            unlock character upgrades.
          </p>
        </article>
      </section>

      <div className="landing-note">
        <span>✧</span>
        Your reset is personal. Your progress stays in this browser.
      </div>
    </main>
  );
}

function IntakeScreen({ initialProfile, onContinue, onBack }) {
  const [draft, setDraft] = useState(() => ({
    ...EMPTY_PROFILE,
    ...(initialProfile || {}),
    areas:
      initialProfile?.areas?.length > 0
        ? initialProfile.areas
        : EMPTY_PROFILE.areas
  }));
  const [error, setError] = useState('');

  const persona = getPersona(draft);
  const prompt =
    FOCUS_PROMPTS[draft.primaryGoal] || FOCUS_PROMPTS.mindset;

  function updateField(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError('');
  }

  function toggleArea(key) {
    setDraft((current) => {
      const exists = current.areas.includes(key);

      if (exists && current.areas.length === 1) {
        setError('Choose at least one growth area.');
        return current;
      }

      if (!exists && current.areas.length >= 3) {
        setError('Choose up to three areas so your challenge stays focused.');
        return current;
      }

      const areas = exists
        ? current.areas.filter((area) => area !== key)
        : [...current.areas, key];

      const primaryGoal = areas.includes(current.primaryGoal)
        ? current.primaryGoal
        : areas[0];

      return {
        ...current,
        areas,
        primaryGoal,
        focusDetail:
          primaryGoal !== current.primaryGoal ? '' : current.focusDetail
      };
    });

    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!draft.name.trim()) {
      setError('Add a name or nickname for your character profile.');
      return;
    }

    if (!draft.areas.length) {
      setError('Choose at least one growth area.');
      return;
    }

    if (!draft.focusDetail.trim()) {
      setError('Add a little detail about your main focus.');
      return;
    }

    if (!draft.goalDetail.trim()) {
      setError('Describe what progress would look like for you.');
      return;
    }

    onContinue({
      ...draft,
      name: draft.name.trim(),
      goalDetail: draft.goalDetail.trim(),
      focusDetail: draft.focusDetail.trim(),
      why: draft.why.trim()
    });
  }

  return (
    <main>
      <div className="page-intro">
        <div>
          <div className="eyebrow">01 / YOUR STARTING POINT</div>
          <h1>Build your personal blueprint.</h1>
          <p>
            There is no ideal starting point. The better we understand your
            real routine, the more useful your quests can be.
          </p>
        </div>
        <button className="text-button" type="button" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="two-column-layout">
        <form className="form-stack" onSubmit={handleSubmit} noValidate>
          <section className="surface form-section">
            <div className="section-heading">
              <span className="section-number">01</span>
              <div>
                <h2>Your current chapter</h2>
                <p>A few details about the life you are starting from.</p>
              </div>
            </div>

            <div className="form-grid">
              <label className="field" htmlFor="profile-name">
                <span>What should we call you?</span>
                <input
                  id="profile-name"
                  value={draft.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Name or nickname"
                  maxLength={30}
                />
              </label>

              <label className="field" htmlFor="life-stage">
                <span>What does this season look like?</span>
                <select
                  id="life-stage"
                  value={draft.lifeStage}
                  onChange={(event) => updateField('lifeStage', event.target.value)}
                >
                  <option value="school">School or college</option>
                  <option value="working">Working</option>
                  <option value="transition">Between chapters</option>
                  <option value="caregiving">Caregiving or family-focused</option>
                  <option value="other">Something else</option>
                </select>
              </label>

              <div className="field">
                <label htmlFor="sleep-hours">Usual sleep on a typical night</label>
                <div className="range-row">
                  <input
                    id="sleep-hours"
                    type="range"
                    min="4"
                    max="10"
                    value={draft.sleepHours}
                    onChange={(event) => updateField('sleepHours', event.target.value)}
                  />
                  <span className="range-value">{draft.sleepHours}h</span>
                </div>
                <span className="field-hint">An estimate is completely fine.</span>
              </div>

              <label className="field" htmlFor="movement">
                <span>How often do you move your body?</span>
                <select
                  id="movement"
                  value={draft.movement}
                  onChange={(event) => updateField('movement', event.target.value)}
                >
                  <option value="rarely">Not very often right now</option>
                  <option value="1-2">About 1–2 days per week</option>
                  <option value="3-4">About 3–4 days per week</option>
                  <option value="5+">Most days</option>
                </select>
              </label>

              <div className="field">
                <label htmlFor="energy">How has your energy been lately?</label>
                <div className="range-row">
                  <input
                    id="energy"
                    type="range"
                    min="1"
                    max="5"
                    value={draft.energy}
                    onChange={(event) => updateField('energy', event.target.value)}
                  />
                  <span className="range-value">{draft.energy} / 5</span>
                </div>
                <div className="range-ends">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div className="field">
                <label htmlFor="stress">How much stress are you carrying?</label>
                <div className="range-row">
                  <input
                    id="stress"
                    type="range"
                    min="1"
                    max="5"
                    value={draft.stress}
                    onChange={(event) => updateField('stress', event.target.value)}
                  />
                  <span className="range-value">{draft.stress} / 5</span>
                </div>
                <div className="range-ends">
                  <span>A little</span>
                  <span>A lot</span>
                </div>
              </div>

              <label className="field" htmlFor="screen-time">
                <span>Typical non-work screen time</span>
                <select
                  id="screen-time"
                  value={draft.screenTime}
                  onChange={(event) => updateField('screenTime', event.target.value)}
                >
                  <option value="under2">Under 2 hours</option>
                  <option value="2-4">2–4 hours</option>
                  <option value="4-6">4–6 hours</option>
                  <option value="6+">More than 6 hours</option>
                </select>
              </label>

              <label className="field" htmlFor="routine">
                <span>How would you describe your routine?</span>
                <select
                  id="routine"
                  value={draft.routine}
                  onChange={(event) => updateField('routine', event.target.value)}
                >
                  <option value="inconsistent">It changes a lot</option>
                  <option value="sometimes">Some parts are consistent</option>
                  <option value="steady">I have a steady routine</option>
                </select>
              </label>
            </div>
          </section>

          <section className="surface form-section">
            <div className="section-heading">
              <span className="section-number">02</span>
              <div>
                <h2>Choose what you want to grow</h2>
                <p>
                  Choose up to three areas. Your first choice becomes the
                  inspiration for your character.
                </p>
              </div>
            </div>

            <div className="area-select-grid">
              {AREA_LIST.map((area) => {
                const selected = draft.areas.includes(area.key);

                return (
                  <button
                    className={`area-choice ${selected ? 'selected' : ''}`}
                    type="button"
                    key={area.key}
                    aria-pressed={selected}
                    onClick={() => toggleArea(area.key)}
                  >
                    <span className="area-choice-icon">{area.icon}</span>
                    <strong>{area.label}</strong>
                    <small>{area.description}</small>
                    {selected && <span className="selected-label">SELECTED</span>}
                  </button>
                );
              })}
            </div>

            <div className="form-grid goal-fields">
              <label className="field" htmlFor="primary-goal">
                <span>Your main focus</span>
                <select
                  id="primary-goal"
                  value={draft.primaryGoal}
                  onChange={(event) => {
                    updateField('primaryGoal', event.target.value);
                    updateField('focusDetail', '');
                  }}
                >
                  {draft.areas.map((area) => (
                    <option key={area} value={area}>
                      {areaLabel(area)}
                    </option>
                  ))}
                </select>
              </label>

              <div className="field">
                <label htmlFor="focus-detail">{prompt.label}</label>
                {prompt.options ? (
                  <select
                    id="focus-detail"
                    value={draft.focusDetail}
                    onChange={(event) =>
                      updateField('focusDetail', event.target.value)
                    }
                  >
                    <option value="">{prompt.placeholder}</option>
                    {prompt.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="focus-detail"
                    value={draft.focusDetail}
                    onChange={(event) =>
                      updateField('focusDetail', event.target.value)
                    }
                    placeholder={prompt.placeholder}
                    maxLength={90}
                  />
                )}
              </div>

              <label className="field field-full" htmlFor="goal-detail">
                <span>What would progress look like for you?</span>
                <textarea
                  id="goal-detail"
                  value={draft.goalDetail}
                  onChange={(event) => updateField('goalDetail', event.target.value)}
                  placeholder="Be specific, but keep it realistic. For example: feel more energetic, finish a course, or draw three times a week."
                  rows="3"
                  maxLength={220}
                />
              </label>

              <label className="field field-full" htmlFor="why">
                <span>Why does this matter to you right now?</span>
                <textarea
                  id="why"
                  value={draft.why}
                  onChange={(event) => updateField('why', event.target.value)}
                  placeholder="A sentence to remind your future self."
                  rows="2"
                  maxLength={180}
                />
              </label>
            </div>
          </section>

          <section className="surface form-section">
            <div className="section-heading">
              <span className="section-number">03</span>
              <div>
                <h2>Make the challenge fit your day</h2>
                <p>Small enough to repeat is better than perfect on paper.</p>
              </div>
            </div>

            <div className="form-grid">
              <label className="field" htmlFor="obstacle">
                <span>What most often gets in your way?</span>
                <select
                  id="obstacle"
                  value={draft.obstacle}
                  onChange={(event) => updateField('obstacle', event.target.value)}
                >
                  <option value="time">Not enough time</option>
                  <option value="motivation">Motivation comes and goes</option>
                  <option value="stress">Stress or overwhelm</option>
                  <option value="distraction">Distractions</option>
                  <option value="unclear">Not knowing where to start</option>
                  <option value="energy">Low energy</option>
                </select>
              </label>

              <label className="field" htmlFor="daily-minutes">
                <span>Realistic time for a daily quest</span>
                <select
                  id="daily-minutes"
                  value={draft.dailyMinutes}
                  onChange={(event) =>
                    updateField('dailyMinutes', event.target.value)
                  }
                >
                  <option value="5">About 5 minutes</option>
                  <option value="15">About 15 minutes</option>
                  <option value="30">About 30 minutes</option>
                  <option value="45">About 45 minutes</option>
                </select>
              </label>

              <label className="field" htmlFor="best-time">
                <span>When would you like to do your quests?</span>
                <select
                  id="best-time"
                  value={draft.bestTime}
                  onChange={(event) => updateField('bestTime', event.target.value)}
                >
                  <option value="morning">Morning</option>
                  <option value="midday">Midday</option>
                  <option value="evening">Evening</option>
                  <option value="flexible">Whenever I can</option>
                </select>
              </label>
            </div>

            <div className="privacy-note">
              <span>◈</span>
              <p>
                Your answers are saved in this browser only. This app does not
                send them to a server.
              </p>
            </div>
          </section>

          {error && <div className="form-error">{error}</div>}

          <div className="form-submit-row">
            <span className="field-hint">
              Your plan can be gentle, focused, or somewhere in between.
            </span>
            <button className="button button-primary" type="submit">
              Create my character
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </form>

        <aside className="onboarding-aside">
          <div className="surface profile-preview">
            <span className="eyebrow">YOUR CHARACTER BLUEPRINT</span>
            <AnimeAvatar profile={draft} level={1} />
            <div className="preview-character-name">
              <h2>{persona.character}</h2>
              <span>{persona.role}</span>
            </div>
            <p className="persona-line">{persona.tagline}</p>
            <div className="preview-divider" />
            <div className="preview-focus">
              <span className="mini-label">MAIN FOCUS</span>
              <strong>{areaLabel(draft.primaryGoal)}</strong>
              <small>{draft.focusDetail || 'Choose a focus to shape your quests.'}</small>
            </div>
            <div className="preview-focus">
              <span className="mini-label">PLAYER</span>
              <strong>{draft.name || 'Your name'}</strong>
              <small>Your character grows from your actions—not from perfection.</small>
            </div>
          </div>

          <div className="aside-tip">
            <span className="aside-tip-icon">✧</span>
            <div>
              <strong>A useful reset is a kind one.</strong>
              <p>
                This is a reflection and habit-building app, not medical or
                mental health advice.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SignaturePad({ onChange, hasSignature }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const valueRef = useRef('');

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;

      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));

      const context = canvas.getContext('2d');
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineWidth = 3;
      context.strokeStyle = '#f0e9ff';
      context.fillStyle = '#f0e9ff';

      if (valueRef.current) {
        const image = new Image();
        const width = rect.width;
        const height = rect.height;

        image.onload = () => {
          const nextContext = canvas.getContext('2d');
          nextContext.setTransform(ratio, 0, 0, ratio, 0, 0);
          nextContext.drawImage(image, 0, 0, width, height);
        };

        image.src = valueRef.current;
      }
    }

    resizeCanvas();

    let observer;

    if (typeof window.ResizeObserver !== 'undefined') {
      observer = new window.ResizeObserver(resizeCanvas);
      observer.observe(canvas);
    } else {
      window.addEventListener('resize', resizeCanvas);
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  function pointFromEvent(event) {
    const rect = canvasRef.current.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function handlePointerDown(event) {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const point = pointFromEvent(event);

    event.preventDefault();
    canvas.setPointerCapture?.(event.pointerId);

    drawingRef.current = true;
    context.beginPath();
    context.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.moveTo(point.x, point.y);
  }

  function handlePointerMove(event) {
    if (!drawingRef.current) {
      return;
    }

    const context = canvasRef.current.getContext('2d');
    const point = pointFromEvent(event);

    context.lineTo(point.x, point.y);
    context.stroke();
  }

  function handlePointerUp(event) {
    if (!drawingRef.current) {
      return;
    }

    drawingRef.current = false;

    const canvas = canvasRef.current;
    canvas.releasePointerCapture?.(event.pointerId);

    const signature = canvas.toDataURL('image/png');
    valueRef.current = signature;
    onChange(signature);
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, rect.width, rect.height);
    valueRef.current = '';
    drawingRef.current = false;
    onChange('');
  }

  return (
    <div className="signature-area">
      <div className="signature-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="signature-canvas"
          aria-label="Draw your signature here"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        {!hasSignature && (
          <div className="signature-placeholder">
            Sign here with your finger or mouse
          </div>
        )}
        <div className="signature-rule" />
      </div>

      <div className="signature-tools">
        <span>{hasSignature ? 'Signature captured' : 'Your signature is required'}</span>
        <button className="text-button" type="button" onClick={clearSignature}>
          Clear signature
        </button>
      </div>
    </div>
  );
}

function ContractScreen({ profile, onStart, onEdit }) {
  const [duration, setDuration] = useState(21);
  const [stake, setStake] = useState('steady');
  const [signature, setSignature] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  const persona = getPersona(profile);

  function beginChallenge() {
    if (!signature) {
      setError('Draw your signature to accept the contract.');
      return;
    }

    if (!accepted) {
      setError('Please confirm that you understand the challenge rules.');
      return;
    }

    onStart({
      duration: Number(duration),
      stake,
      signature
    });
  }

  return (
    <main>
      <div className="page-intro">
        <div>
          <div className="eyebrow">02 / THE COMMITMENT</div>
          <h1>Choose your arc.</h1>
          <p>
            Pick a duration and a stake that feel challenging, but still
            realistic for your life.
          </p>
        </div>
        <button className="text-button" type="button" onClick={onEdit}>
          ← Edit my blueprint
        </button>
      </div>

      <div className="two-column-layout contract-layout">
        <div className="form-stack">
          <section className="surface form-section">
            <div className="section-heading">
              <span className="section-number">01</span>
              <div>
                <h2>Choose your duration</h2>
                <p>You can choose 7, 21, or 30 days.</p>
              </div>
            </div>

            <div className="duration-grid">
              {[7, 21, 30].map((days) => (
                <button
                  type="button"
                  key={days}
                  className={`duration-card ${duration === days ? 'selected' : ''}`}
                  aria-pressed={duration === days}
                  onClick={() => setDuration(days)}
                >
                  <strong>{days}</strong>
                  <span>days</span>
                  <small>
                    {days === 7
                      ? 'A fresh start'
                      : days === 21
                        ? 'Build a rhythm'
                        : 'A longer journey'}
                  </small>
                </button>
              ))}
            </div>
          </section>

          <section className="surface form-section">
            <div className="section-heading">
              <span className="section-number">02</span>
              <div>
                <h2>Choose your stake</h2>
                <p>
                  Stakes are in-app challenge rules. There is no money involved.
                </p>
              </div>
            </div>

            <div className="stake-grid">
              {Object.entries(STAKES).map(([key, option]) => (
                <button
                  type="button"
                  key={key}
                  className={`stake-card stake-${key} ${stake === key ? 'selected' : ''}`}
                  aria-pressed={stake === key}
                  onClick={() => setStake(key)}
                >
                  <span className="stake-symbol">{option.symbol}</span>
                  <strong>{option.label}</strong>
                  <span className="stake-description">{option.description}</span>
                  <small>{option.detail}</small>
                </button>
              ))}
            </div>

            <div className="rules-callout">
              <span>!</span>
              <p>
                If you complete fewer than half of a day’s quests, you use one
                shield. Once your shields are gone, that day’s rule deducts XP.
              </p>
            </div>
          </section>

          <section className="surface form-section signature-section">
            <div className="section-heading">
              <span className="section-number">03</span>
              <div>
                <h2>Sign your contract</h2>
                <p>
                  This is a promise to keep showing up—not a demand for perfect
                  days.
                </p>
              </div>
            </div>

            <div className="pledge-text">
              <span className="mini-label">MY RESET PLEDGE</span>
              <p>
                I, <strong>{profile.name}</strong>, will give myself a fair
                chance for <strong>{duration} days</strong>. I will take one
                small step at a time, and I will return when a day does not go
                to plan.
              </p>
            </div>

            <SignaturePad
              hasSignature={Boolean(signature)}
              onChange={(value) => {
                setSignature(value);
                setError('');
              }}
            />

            <label className="pledge-check">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => {
                  setAccepted(event.target.checked);
                  setError('');
                }}
              />
              <span className="custom-checkbox" aria-hidden="true">
                ✓
              </span>
              <span>
                I understand the quest, shield, and XP rules, and I accept this
                challenge.
              </span>
            </label>
          </section>

          {error && <div className="form-error">{error}</div>}

          <div className="form-submit-row">
            <span className="field-hint">
              You can pause or leave the app; your progress is saved on this device.
            </span>
            <button
              className="button button-primary"
              type="button"
              onClick={beginChallenge}
            >
              Sign &amp; begin
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>

        <aside className="contract-aside">
          <div className="surface contract-preview">
            <span className="eyebrow">YOUR ARC PREVIEW</span>
            <AnimeAvatar profile={profile} level={1} />
            <div className="preview-character-name">
              <h2>{persona.character}</h2>
              <span>{persona.role}</span>
            </div>
            <div className="contract-preview-details">
              <div>
                <span className="mini-label">DURATION</span>
                <strong>{duration} days</strong>
              </div>
              <div>
                <span className="mini-label">STAKE</span>
                <strong>{STAKES[stake].label}</strong>
              </div>
              <div>
                <span className="mini-label">STARTING SHIELDS</span>
                <strong>{STAKES[stake].shields}</strong>
              </div>
            </div>
            <p className="persona-line">{persona.tagline}</p>
          </div>

          <div className="aside-tip">
            <span className="aside-tip-icon">✧</span>
            <div>
              <strong>Small is still progress.</strong>
              <p>
                Your daily quest set is based on your focus, chosen time, and
                answers from your blueprint.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function StatBars({ stats, baseline }) {
  return (
    <div className="stat-list">
      {STAT_ITEMS.map((item) => {
        const value = Math.round(stats?.[item.key] ?? 0);
        const start =
          baseline == null
            ? null
            : Math.round(baseline?.[item.key] ?? value);
        const difference = start == null ? 0 : value - start;

        return (
          <div className="stat-row" key={item.key}>
            <div className="stat-heading">
              <span>
                <i>{item.icon}</i>
                {item.label}
              </span>
              <strong>
                {value}
                <small>/100</small>
              </strong>
            </div>

            <div
              className="stat-track"
              role="progressbar"
              aria-label={`${item.label} stat`}
              aria-valuenow={value}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <span style={{ width: `${value}%` }} />
            </div>

            {baseline != null && (
              <div className="stat-delta">
                {difference > 0
                  ? `+${difference} from your start`
                  : difference < 0
                    ? `${difference} from your start`
                    : 'Your starting point'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CharacterCard({ profile, challenge }) {
  const persona = getPersona(profile);
  const level = getLevel(challenge.xp);
  const progress = challenge.xp % XP_PER_LEVEL;
  const percent = (progress / XP_PER_LEVEL) * 100;
  const remaining = XP_PER_LEVEL - progress;

  const evolutionStages = [
    { level: 3, title: 'Gear' },
    { level: 5, title: 'Cape + aura' },
    { level: 7, title: 'Crown' }
  ];

  const growthLine =
    level >= 7
      ? 'Your character has reached their crowned form.'
      : level >= 5
        ? 'Your aura is awake. Keep going to earn the crown.'
        : level >= 3
          ? 'Your gear is taking shape. The next evolution is closer.'
          : 'Every completed quest brings your character closer to their first upgrade.';

  return (
    <section className="surface character-card">
      <div className="character-visual">
        <div className="character-visual-glow" />
        <AnimeAvatar profile={profile} level={level} />
      </div>

      <div className="character-info">
        <span className="eyebrow">YOUR GROWTH COMPANION</span>
        <div className="character-name-row">
          <div>
            <h2>{persona.character}</h2>
            <p>{persona.role}</p>
          </div>
          <div className="level-badge">
            <span>LVL</span>
            <strong>{level}</strong>
          </div>
        </div>

        <p className="character-tagline">{persona.tagline}</p>

        <div className="xp-header">
          <span>LEVEL {level} PROGRESS</span>
          <span>
            {progress} / {XP_PER_LEVEL} XP
          </span>
        </div>

        <div className="xp-track">
          <span style={{ width: `${percent}%` }} />
        </div>

        <div className="xp-caption">
          <span>{challenge.xp} total XP</span>
          <span>{remaining} XP to next level</span>
        </div>

        <p className="growth-line">{growthLine}</p>

        <div className="evolution-track">
          {evolutionStages.map((stage) => {
            const unlocked = level >= stage.level;

            return (
              <div
                key={stage.level}
                className={`evolution-step ${unlocked ? 'unlocked' : ''}`}
              >
                <span className="evolution-node">
                  {unlocked ? '✓' : stage.level}
                </span>
                <span>
                  <small>LEVEL {stage.level}</small>
                  <strong>{stage.title}</strong>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DayOutcome({ result, currentDay, duration, onNext, onResults }) {
  let consequence = 'No shield was needed today.';

  if (result.belowHalf && result.shieldUsed) {
    consequence = `A shield absorbed the low-clear day. ${result.shieldsRemaining} shield${result.shieldsRemaining === 1 ? '' : 's'} left.`;
  } else if (result.belowHalf && !result.shieldUsed && result.xpPenalty > 0) {
    consequence = `No shields remained, so ${result.xpPenalty} XP was deducted.`;
  } else if (result.belowHalf && !result.shieldUsed) {
    consequence = 'No shields remained. Your XP was already at zero, so no further XP could be deducted.';
  }

  return (
    <div className={`day-outcome ${result.belowHalf ? 'outcome-warning' : ''}`}>
      <div className="outcome-title-row">
        <span className="outcome-seal">{result.perfect ? '✦' : '✓'}</span>
        <div>
          <span className="eyebrow">DAY {currentDay} SEALED</span>
          <h3>{result.perfect ? 'Perfect clear.' : 'You showed up.'}</h3>
        </div>
      </div>

      <p className="outcome-copy">{consequence}</p>

      <div className="outcome-rewards">
        <div>
          <strong>+{result.questXP}</strong>
          <span>quest XP</span>
        </div>
        {result.bonusXP > 0 && (
          <div className="bonus-reward">
            <strong>+{result.bonusXP}</strong>
            <span>clear bonus</span>
          </div>
        )}
        {result.xpPenalty > 0 && (
          <div className="penalty-reward">
            <strong>−{result.xpPenalty}</strong>
            <span>XP penalty</span>
          </div>
        )}
        {result.shieldUsed && (
          <div>
            <strong>−1</strong>
            <span>shield used</span>
          </div>
        )}
      </div>

      {currentDay < duration ? (
        <button className="button button-primary outcome-button" onClick={onNext}>
          Start day {currentDay + 1}
          <span aria-hidden="true">→</span>
        </button>
      ) : (
        <button className="button button-primary outcome-button" onClick={onResults}>
          See my before &amp; after
          <span aria-hidden="true">↗</span>
        </button>
      )}
    </div>
  );
}

function QuestBoard({
  challenge,
  quests,
  record,
  onToggleQuest,
  onLockDay,
  onNextDay,
  onResults
}) {
  const completed = record.completed || [];
  const completedCount = quests.filter((quest) =>
    completed.includes(quest.id)
  ).length;
  const allDone = completedCount === quests.length;
  const progress = (completedCount / quests.length) * 100;

  return (
    <section className="surface quest-board">
      <div className="section-heading quest-board-heading">
        <span className="section-number quest-board-icon">✦</span>
        <div>
          <span className="eyebrow">DAILY MISSION BOARD</span>
          <h2>Today’s quests</h2>
          <p>
            {record.locked
              ? 'Your day is sealed. Take a moment to notice what you did.'
              : 'Choose the next small action, then mark it complete.'}
          </p>
        </div>
        <div className="quest-count">
          <strong>{completedCount}</strong>
          <span>/ {quests.length}</span>
        </div>
      </div>

      <div className="quest-progress-header">
        <span>DAILY PROGRESS</span>
        <span>{Math.round(progress)}%</span>
      </div>

      <div className="quest-progress-track">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="quest-list">
        {quests.map((quest) => {
          const isDone = completed.includes(quest.id);

          return (
            <button
              type="button"
              key={quest.id}
              className={`quest-row ${isDone ? 'quest-done' : ''}`}
              disabled={record.locked}
              onClick={() => onToggleQuest(quest.id)}
            >
              <span className="quest-check" aria-hidden="true">
                {isDone ? '✓' : ''}
              </span>

              <span className="quest-text">
                <span className="quest-category">
                  {quest.category === 'reset'
                    ? 'RESET RITUAL'
                    : areaLabel(quest.category)}
                </span>
                <strong>{quest.title}</strong>
                <small>{quest.detail}</small>
              </span>

              <span className="quest-xp">
                {isDone ? '+10' : '10'}
                <small>XP</small>
              </span>
            </button>
          );
        })}
      </div>

      {!record.locked ? (
        <>
          <div className={`bonus-callout ${allDone ? 'bonus-ready' : ''}`}>
            <span className="bonus-icon">{allDone ? '✦' : '＋'}</span>
            <p>
              {allDone
                ? 'All quests complete. Seal the day to claim your +20 XP clear bonus.'
                : 'Complete all 3 quests to earn a +20 XP clear bonus when you seal the day.'}
            </p>
          </div>

          <div className="lock-day-row">
            <div className="lock-day-hint">
              <strong>Ready to close the day?</strong>
              <span>
                Fewer than half complete uses a shield. No shields left means an
                XP deduction.
              </span>
            </div>
            <button className="button button-primary" onClick={onLockDay}>
              Seal today
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </>
      ) : (
        <DayOutcome
          result={record.result}
          currentDay={challenge.currentDay}
          duration={challenge.duration}
          onNext={onNextDay}
          onResults={onResults}
        />
      )}
    </section>
  );
}

function DayMap({ challenge }) {
  const days = Array.from({ length: challenge.duration }, (_, index) => index + 1);
  const completedDays = Object.values(challenge.days || {}).filter(
    (day) => day?.locked
  ).length;

  return (
    <section className="surface day-map">
      <div className="section-heading">
        <span className="section-number">↗</span>
        <div>
          <span className="eyebrow">YOUR CHALLENGE MAP</span>
          <h2>One day at a time.</h2>
          <p>
            {completedDays} of {challenge.duration} days sealed
          </p>
        </div>
      </div>

      <div className="day-grid">
        {days.map((day) => {
          const isDone = Boolean(challenge.days?.[day]?.locked);
          const isCurrent = day === challenge.currentDay && !isDone;
          const isFuture = day > challenge.currentDay;

          return (
            <div
              className={`day-token ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''}`}
              key={day}
              aria-label={`Day ${day}${isDone ? ', complete' : isCurrent ? ', current' : ', upcoming'}`}
              title={`Day ${day}${isDone ? ' · sealed' : isCurrent ? ' · current' : ' · upcoming'}`}
            >
              {isDone ? '✓' : day}
            </div>
          );
        })}
      </div>

      <div className="day-map-legend">
        <span><i className="legend-current" /> Current</span>
        <span><i className="legend-done" /> Sealed</span>
        <span><i className="legend-future" /> Upcoming</span>
      </div>
    </section>
  );
}

function ChallengeStatus({ challenge }) {
  const stake = STAKES[challenge.stake] || STAKES.steady;

  return (
    <section className="surface status-card">
      <div className="side-card-heading">
        <div>
          <span className="eyebrow">YOUR CONTRACT</span>
          <h3>{stake.label} stake</h3>
        </div>
        <span className="contract-seal">✦</span>
      </div>

      <div className="contract-status-line">
        <span>CHALLENGE</span>
        <strong>{challenge.duration} days</strong>
      </div>

      <div className="contract-status-line">
        <span>SIGNED</span>
        <strong>{formatDate(challenge.signedAt)}</strong>
      </div>

      <div className="shield-heading">
        <span>SHIELDS LEFT</span>
        <strong>{challenge.shields}</strong>
      </div>

      <div className="shield-list">
        {Array.from({ length: stake.shields }, (_, index) => {
          const available = index < challenge.shields;

          return (
            <span
              className={`shield-token ${available ? 'available' : 'spent'}`}
              key={index}
              title={available ? 'Available shield' : 'Used shield'}
            >
              ◆
            </span>
          );
        })}
      </div>

      <p className="side-card-note">
        Complete fewer than half of a day’s quests to use a shield. When none
        remain, your stake applies an XP deduction.
      </p>

      {challenge.signature && (
        <div className="saved-signature">
          <span className="mini-label">YOUR SIGNATURE</span>
          <img src={challenge.signature} alt="Your signed challenge contract" />
        </div>
      )}
    </section>
  );
}

function DashboardScreen({
  profile,
  challenge,
  onToggleQuest,
  onLockDay,
  onNextDay,
  onResults
}) {
  const dayRecord = challenge.days?.[challenge.currentDay] || {
    completed: [],
    locked: false,
    result: null
  };

  const quests = useMemo(
    () => makeDailyQuests(profile, challenge.currentDay),
    [profile, challenge.currentDay]
  );

  const persona = getPersona(profile);
  const completedDays = Object.values(challenge.days || {}).filter(
    (day) => day?.locked
  ).length;

  return (
    <main>
      <div className="page-intro dashboard-intro">
        <div>
          <div className="eyebrow">
            YOUR RESET IS LIVE · DAY {challenge.currentDay}
          </div>
          <h1>
            Show up for <em>today.</em>
          </h1>
          <p>
            {profile.name}, your focus is {areaLabel(profile.primaryGoal).toLowerCase()}.
            A small completed action still counts.
          </p>
        </div>

        <div className="dashboard-quick-stats">
          <div>
            <strong>{completedDays}</strong>
            <span>days sealed</span>
          </div>
          <div>
            <strong>{challenge.xp}</strong>
            <span>total XP</span>
          </div>
          <div>
            <strong>{challenge.shields}</strong>
            <span>shields left</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <CharacterCard profile={profile} challenge={challenge} />

          <QuestBoard
            challenge={challenge}
            quests={quests}
            record={dayRecord}
            onToggleQuest={onToggleQuest}
            onLockDay={onLockDay}
            onNextDay={onNextDay}
            onResults={onResults}
          />

          <DayMap challenge={challenge} />
        </div>

        <aside className="dashboard-side">
          <section className="surface stats-card">
            <div className="side-card-heading">
              <div>
                <span className="eyebrow">PLAYER STATS</span>
                <h3>Your bars are growing.</h3>
              </div>
              <span className="side-heading-icon">⌘</span>
            </div>

            <p className="side-card-note">
              Finishing a quest builds the stat connected to that action.
            </p>

            <StatBars
              stats={challenge.stats}
              baseline={challenge.initialStats}
            />
          </section>

          <ChallengeStatus challenge={challenge} />

          <section className="surface why-card">
            <span className="eyebrow">YOUR WHY</span>
            <div className="why-mark">“</div>
            <p>
              {profile.why ||
                'Your reason does not have to be impressive. It only needs to matter to you.'}
            </p>
            <div className="why-owner">
              <span className="why-dot" />
              {profile.name} · {persona.role}
            </div>
          </section>

          <div className="gentle-reminder">
            <span>✧</span>
            <p>
              A missed quest is information, not a verdict. Make the next step
              smaller and return when you can.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function CompareStats({ before, after }) {
  return (
    <div className="compare-stats">
      {STAT_ITEMS.map((item) => {
        const start = Math.round(before?.[item.key] ?? 0);
        const end = Math.round(after?.[item.key] ?? start);
        const difference = end - start;

        return (
          <div className="compare-stat-row" key={item.key}>
            <div className="compare-stat-heading">
              <span>{item.icon} {item.label}</span>
              <strong>
                {start}
                <span> → </span>
                {end}
              </strong>
            </div>

            <div className="compare-bars">
              <div className="compare-track before-track">
                <span style={{ width: `${start}%` }} />
              </div>
              <div className="compare-track after-track">
                <span style={{ width: `${end}%` }} />
              </div>
            </div>

            <small className={difference > 0 ? 'positive-delta' : ''}>
              {difference > 0
                ? `+${difference} growth`
                : difference < 0
                  ? `${difference} change`
                  : 'Your starting point held steady'}
            </small>
          </div>
        );
      })}
    </div>
  );
}

function ResultsScreen({ profile, challenge, onNewArc }) {
  const persona = getPersona(profile);
  const level = getLevel(challenge.xp);
  const lockedDays = Object.values(challenge.days || {}).filter(
    (day) => day?.locked
  );
  const perfectDays = lockedDays.filter((day) => day.result?.perfect).length;
  const completedQuests = challenge.totalQuestsCompleted || 0;

  return (
    <main className="results-page">
      <section className="results-heading">
        <div className="eyebrow">YOUR ARC · COMPLETE</div>
        <h1>
          Look how far <em>you came.</em>
        </h1>
        <p>
          Your transformation is not about becoming a different person. It is
          proof of the steps you chose to take.
        </p>
      </section>

      <section className="surface transformation-card">
        <div className="transformation-card-heading">
          <div>
            <span className="eyebrow">THE BEFORE &amp; AFTER</span>
            <h2>Your character’s next form.</h2>
          </div>
          <div className="completed-badge">
            <span>✓</span>
            ARC SEALED
          </div>
        </div>

        <div className="before-after-grid">
          <div className="transform-side transform-before">
            <span className="eyebrow">DAY 0 · BEFORE</span>
            <AnimeAvatar profile={profile} level={1} />
            <h3>{persona.character}</h3>
            <p>{persona.role}</p>
            <div className="transform-level">LEVEL 1 · ROOKIE</div>
          </div>

          <div className="transformation-arrow" aria-hidden="true">
            <span>→</span>
            <small>{challenge.xp} XP</small>
          </div>

          <div className="transform-side transform-after">
            <span className="eyebrow">DAY {challenge.duration} · AFTER</span>
            <AnimeAvatar profile={profile} level={level} />
            <h3>{persona.character}</h3>
            <p>{persona.role}</p>
            <div className="transform-level">
              LEVEL {level} · {level >= 7 ? 'ASCENDED' : level >= 5 ? 'AWAKENED' : level >= 3 ? 'GEARED' : 'GROWING'}
            </div>
          </div>
        </div>

        <div className="evolution-summary">
          <span>✦</span>
          {level >= 7
            ? 'You unlocked the gear, cape, aura, and crown.'
            : level >= 5
              ? 'You unlocked your gear, cape, and aura. Keep the arc going for the crown.'
              : level >= 3
                ? 'You unlocked your first gear upgrade. Your next form is waiting.'
                : 'Your first chapter is complete. Keep earning XP to unlock your character’s next form.'}
        </div>
      </section>

      <div className="results-lower-grid">
        <section className="surface results-stats-card">
          <div className="section-heading">
            <span className="section-number">✧</span>
            <div>
              <span className="eyebrow">YOUR STATS</span>
              <h2>Starting point to now.</h2>
            </div>
          </div>

          <div className="compare-legend">
            <span><i className="legend-before" /> Before</span>
            <span><i className="legend-after" /> After</span>
          </div>

          <CompareStats
            before={challenge.initialStats}
            after={challenge.stats}
          />
        </section>

        <section className="surface results-summary-card">
          <span className="eyebrow">ARC RECAP</span>
          <h2>{profile.name}, you kept moving.</h2>

          <div className="recap-number-grid">
            <div>
              <strong>{lockedDays.length}/{challenge.duration}</strong>
              <span>days sealed</span>
            </div>
            <div>
              <strong>{perfectDays}</strong>
              <span>perfect clears</span>
            </div>
            <div>
              <strong>{completedQuests}</strong>
              <span>quests completed</span>
            </div>
            <div>
              <strong>{challenge.xp}</strong>
              <span>final XP</span>
            </div>
          </div>

          <div className="recap-why">
            <span className="mini-label">YOUR ORIGINAL WHY</span>
            <p>
              {profile.why || 'You decided it was worth taking the first step.'}
            </p>
          </div>

          <p className="recap-closing">
            Keep what worked. Make the next chapter yours.
          </p>
        </section>
      </div>

      <div className="results-actions">
        <button className="button button-primary button-large" onClick={onNewArc}>
          Start a new arc
          <span aria-hidden="true">↗</span>
        </button>
        <span>Your progress and answers stay on this device.</span>
      </div>
    </main>
  );
}

function App() {
  const saved = useMemo(() => readSavedData(), []);
  const [profile, setProfile] = useState(saved.profile || null);
  const [challenge, setChallenge] = useState(saved.challenge || null);

  const initialScreen = saved.challenge
    ? saved.challenge.currentDay >= saved.challenge.duration &&
      saved.challenge.days?.[saved.challenge.currentDay]?.locked
      ? 'results'
      : 'dashboard'
    : saved.profile
      ? 'contract'
      : 'landing';

  const [screen, setScreen] = useState(initialScreen);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!profile && !challenge) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ profile, challenge })
      );
    } catch {
      // The app remains usable if browser storage is unavailable or full.
    }
  }, [profile, challenge]);

  function handleRestart() {
    const hasSavedProgress = Boolean(profile || challenge);

    if (
      hasSavedProgress &&
      !window.confirm(
        'Start a completely new arc? Your current profile and challenge will be erased from this browser.'
      )
    ) {
      return;
    }

    setProfile(null);
    setChallenge(null);
    setScreen('landing');
  }

  function handleProfileContinue(nextProfile) {
    setProfile(nextProfile);
    setChallenge(null);
    setScreen('contract');
  }

  function handleStartChallenge({ duration, stake, signature }) {
    if (!profile) {
      return;
    }

    const initialStats = getInitialStats(profile);

    setChallenge({
      duration,
      stake,
      shields: STAKES[stake].shields,
      xp: 0,
      currentDay: 1,
      days: {},
      stats: { ...initialStats },
      initialStats: { ...initialStats },
      totalQuestsCompleted: 0,
      signature,
      startedAt: new Date().toISOString(),
      signedAt: new Date().toISOString()
    });

    setScreen('dashboard');
  }

  function handleToggleQuest(questId) {
    if (!profile) {
      return;
    }

    setChallenge((previous) => {
      if (!previous) {
        return previous;
      }

      const day = previous.currentDay;
      const record = previous.days?.[day] || {
        completed: [],
        locked: false,
        result: null
      };

      if (record.locked) {
        return previous;
      }

      const quest = makeDailyQuests(profile, day).find(
        (item) => item.id === questId
      );

      if (!quest) {
        return previous;
      }

      const alreadyCompleted = record.completed.includes(questId);
      const completed = alreadyCompleted
        ? record.completed.filter((id) => id !== questId)
        : [...record.completed, questId];

      const direction = alreadyCompleted ? -1 : 1;
      const stats = {
        ...previous.stats,
        [quest.stat]: clamp(
          (previous.stats?.[quest.stat] ?? 0) +
            direction * STAT_GAIN_PER_QUEST,
          0,
          100
        )
      };

      return {
        ...previous,
        xp: Math.max(0, previous.xp + direction * quest.xp),
        stats,
        totalQuestsCompleted: Math.max(
          0,
          (previous.totalQuestsCompleted || 0) + direction
        ),
        days: {
          ...previous.days,
          [day]: {
            ...record,
            completed,
            locked: false,
            result: null
          }
        }
      };
    });
  }

  function handleLockDay() {
    if (!profile) {
      return;
    }

    setChallenge((previous) => {
      if (!previous) {
        return previous;
      }

      const day = previous.currentDay;
      const quests = makeDailyQuests(profile, day);
      const record = previous.days?.[day] || {
        completed: [],
        locked: false,
        result: null
      };

      if (record.locked) {
        return previous;
      }

      const completedCount = quests.filter((quest) =>
        record.completed.includes(quest.id)
      ).length;
      const perfect = completedCount === quests.length;
      const belowHalf = completedCount * 2 < quests.length;
      const questXP = quests
        .filter((quest) => record.completed.includes(quest.id))
        .reduce((total, quest) => total + quest.xp, 0);
      const bonusXP = perfect ? 20 : 0;

      let shields = previous.shields;
      let shieldUsed = false;
      let xpPenalty = 0;
      let penaltyTarget = 0;

      if (belowHalf) {
        if (shields > 0) {
          shields -= 1;
          shieldUsed = true;
        } else {
          penaltyTarget = STAKES[previous.stake].penalty;
          xpPenalty = Math.min(
            penaltyTarget,
            previous.xp + bonusXP
          );
        }
      }

      const xpAfter = Math.max(
        0,
        previous.xp + bonusXP - xpPenalty
      );

      const result = {
        completedCount,
        total: quests.length,
        perfect,
        belowHalf,
        questXP,
        bonusXP,
        shieldUsed,
        shieldsRemaining: shields,
        penaltyTarget,
        xpPenalty,
        xpAfter
      };

      return {
        ...previous,
        xp: xpAfter,
        shields,
        days: {
          ...previous.days,
          [day]: {
            ...record,
            locked: true,
            result,
            lockedAt: new Date().toISOString()
          }
        }
      };
    });
  }

  function handleNextDay() {
    setChallenge((previous) => {
      if (!previous) {
        return previous;
      }

      const currentRecord = previous.days?.[previous.currentDay];

      if (
        !currentRecord?.locked ||
        previous.currentDay >= previous.duration
      ) {
        return previous;
      }

      return {
        ...previous,
        currentDay: previous.currentDay + 1
      };
    });

    setScreen('dashboard');
  }

  function handleViewResults() {
    setScreen('results');
  }

  return (
    <div className="app-shell">
      <div className="ambient-glow ambient-glow-one" />
      <div className="ambient-glow ambient-glow-two" />

      <div className="shell-inner">
        <SiteHeader
          challenge={challenge}
          showRestart={Boolean(profile || challenge)}
          onRestart={handleRestart}
        />

        {screen === 'landing' && (
          <LandingScreen onStart={() => setScreen('intake')} />
        )}

        {screen === 'intake' && (
          <IntakeScreen
            initialProfile={profile}
            onContinue={handleProfileContinue}
            onBack={() => setScreen(profile ? 'contract' : 'landing')}
          />
        )}

        {screen === 'contract' && profile && (
          <ContractScreen
            profile={profile}
            onStart={handleStartChallenge}
            onEdit={() => setScreen('intake')}
          />
        )}

        {screen === 'dashboard' && profile && challenge && (
          <DashboardScreen
            profile={profile}
            challenge={challenge}
            onToggleQuest={handleToggleQuest}
            onLockDay={handleLockDay}
            onNextDay={handleNextDay}
            onResults={handleViewResults}
          />
        )}

        {screen === 'results' && profile && challenge && (
          <ResultsScreen
            profile={profile}
            challenge={challenge}
            onNewArc={handleRestart}
          />
        )}

        <footer className="site-footer">
          <span>RESET ARC</span>
          <span>Small steps count. Your data stays on this device.</span>
          <span>Not medical advice.</span>
        </footer>
      </div>
    </div>
  );
}

export default App;

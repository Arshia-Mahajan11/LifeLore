import { useEffect, useId, useMemo, useRef, useState } from 'react';
import './styles.css';

const STORAGE_KEY = 'lifelore-save-v1';
const XP_PER_LEVEL = 50;
const STAT_GAIN_PER_QUEST = 4;

const AREAS = [
  { key: 'health', name: 'Health', symbol: '✧', description: 'Energy, sleep, movement' },
  { key: 'education', name: 'Education', symbol: '⌘', description: 'Learning, study, skills' },
  { key: 'mindset', name: 'Mindset', symbol: '☾', description: 'Calm, confidence, focus' },
  { key: 'career', name: 'Career', symbol: '↗', description: 'Work, projects, direction' },
  { key: 'relationships', name: 'Relationships', symbol: '♡', description: 'Connection, care, trust' },
  { key: 'creativity', name: 'Creativity', symbol: '✦', description: 'Making, practicing, ideas' }
];

const ARCHETYPES = {
  health: {
    name: 'Astra',
    title: 'Starward Warden',
    region: 'The Verdant Reach',
    accent: '#91f0d8',
    cloak: '#286c70',
    cloakDark: '#174550',
    hair: '#233c50',
    tagline: 'A stronger rhythm begins with one kind promise.'
  },
  education: {
    name: 'Neri',
    title: 'Keeper of the Star Archive',
    region: 'The Star Archive',
    accent: '#c0a9ff',
    cloak: '#594b91',
    cloakDark: '#362c63',
    hair: '#332949',
    tagline: 'Every question is a door the world forgot to lock.'
  },
  mindset: {
    name: 'Mira',
    title: 'Moonwell Alchemist',
    region: 'The Moonwell Crossing',
    accent: '#91baff',
    cloak: '#405d99',
    cloakDark: '#283b68',
    hair: '#283653',
    tagline: 'Even a quiet light can guide you home.'
  },
  career: {
    name: 'Tarin',
    title: 'Ember Pathfinder',
    region: 'The Ember March',
    accent: '#ffc889',
    cloak: '#9a613f',
    cloakDark: '#64402e',
    hair: '#533642',
    tagline: 'The path appears beneath the step you choose.'
  },
  relationships: {
    name: 'Lumi',
    title: 'Heartwood Weaver',
    region: 'The Heartwood',
    accent: '#ffabc4',
    cloak: '#974968',
    cloakDark: '#60354e',
    hair: '#533044',
    tagline: 'Small acts of care can change an entire world.'
  },
  creativity: {
    name: 'Aeri',
    title: 'Dreamsmith of the Unwritten',
    region: 'The Unwritten Sea',
    accent: '#86ddff',
    cloak: '#397b99',
    cloakDark: '#28516f',
    hair: '#293d59',
    tagline: 'The first draft is a spell that makes the next one possible.'
  }
};

const STAKES = {
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
    subtitle: 'A balanced vow',
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

const STAT_ITEMS = [
  { key: 'vitality', name: 'Vitality', symbol: '✧' },
  { key: 'focus', name: 'Focus', symbol: '⌘' },
  { key: 'resolve', name: 'Resolve', symbol: '↗' },
  { key: 'harmony', name: 'Harmony', symbol: '☾' }
];

const PROFILE_DEFAULTS = {
  name: '',
  lifeStage: 'working',
  areas: ['health', 'education'],
  primaryGoal: 'health',
  focusDetail: '',
  goalDetail: '',
  why: '',
  sleepHours: '7',
  movement: '1-2',
  energy: '3',
  stress: '3',
  routine: 'sometimes',
  obstacle: 'time',
  dailyMinutes: '15',
  bestTime: 'morning'
};

const QUEST_BANK = {
  health: [
    { title: 'Wake the body', detail: 'Take a walk, stretch, or move in a way that feels right.', stat: 'vitality' },
    { title: 'Tend the wellspring', detail: 'Make one thoughtful choice that helps you feel looked after.', stat: 'vitality' },
    { title: 'Guard the night sky', detail: 'Give yourself a few quiet, screen-free minutes before bed.', stat: 'harmony' },
    { title: 'Drink from the spring', detail: 'Keep water nearby and pause to drink without rushing.', stat: 'vitality' }
  ],
  education: [
    { title: 'Open the archive', detail: 'Give one learning task a focused start.', stat: 'focus' },
    { title: 'Gather three fragments', detail: 'Write down three things you remember from a recent lesson.', stat: 'focus' },
    { title: 'Follow a question', detail: 'Explore one thing you do not understand yet.', stat: 'resolve' },
    { title: 'Practice the spell', detail: 'Repeat one small exercise instead of waiting to feel ready.', stat: 'focus' }
  ],
  mindset: [
    { title: 'Read the inner weather', detail: 'Write a few honest lines about what is on your mind.', stat: 'harmony' },
    { title: 'Visit the quiet moonwell', detail: 'Take a few slow breaths and notice how you feel.', stat: 'harmony' },
    { title: 'Keep a small vow', detail: 'Choose one manageable action and follow it through.', stat: 'resolve' },
    { title: 'Find the hidden glimmer', detail: 'Give yourself credit for one thing you did today.', stat: 'harmony' }
  ],
  career: [
    { title: 'Move the compass', detail: 'Give one useful work or career task a focused start.', stat: 'resolve' },
    { title: 'Clear the brambles', detail: 'Organize one small part of your workspace or task list.', stat: 'resolve' },
    { title: 'Train a useful skill', detail: 'Spend a little time practicing a skill that matters to you.', stat: 'focus' },
    { title: 'Mark the next trail', detail: 'Write down the single next action for a project you care about.', stat: 'resolve' }
  ],
  relationships: [
    { title: 'Send a little warmth', detail: 'Send a kind message or check in with someone you value.', stat: 'harmony' },
    { title: 'Offer your attention', detail: 'Have a short conversation without multitasking.', stat: 'harmony' },
    { title: 'Name what you appreciate', detail: 'Tell someone one specific thing you appreciate about them.', stat: 'resolve' },
    { title: 'Make room at the hearth', detail: 'Create a little time for someone important to you.', stat: 'harmony' }
  ],
  creativity: [
    { title: 'Make a small wonder', detail: 'Create something without judging whether it is finished or good.', stat: 'focus' },
    { title: 'Practice your craft', detail: 'Repeat one useful creative skill for a little while.', stat: 'focus' },
    { title: 'Gather a spark', detail: 'Save an idea, image, sound, or note that makes you curious.', stat: 'harmony' },
    { title: 'Leave a trace', detail: 'Save a record of something you made or practiced today.', stat: 'resolve' }
  ]
};

const RESET_QUESTS = [
  { title: 'Prepare the next page', detail: 'Spend five minutes making one part of tomorrow easier.', stat: 'resolve' },
  { title: 'Let the lantern rest', detail: 'Take a short screen-free pause and notice how you feel.', stat: 'harmony' },
  { title: 'Record a small victory', detail: 'Write down one thing from today you want to remember.', stat: 'harmony' },
  { title: 'Restore your camp', detail: 'Reset one small space so it is easier to return to.', stat: 'resolve' }
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getAreaName(key) {
  return AREAS.find((area) => area.key === key)?.name || 'Growth';
}

function getArchetype(profile) {
  return ARCHETYPES[profile?.primaryGoal] || ARCHETYPES.mindset;
}

function getLevel(xp = 0) {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
}

function getBaseStats(profile) {
  const sleep = Number(profile?.sleepHours || 7);
  const energy = Number(profile?.energy || 3);
  const stress = Number(profile?.stress || 3);

  const movement = {
    rarely: 0,
    '1-2': 5,
    '3-4': 9,
    '5+': 13
  }[profile?.movement] ?? 0;

  const routine = {
    inconsistent: 0,
    sometimes: 7,
    steady: 13
  }[profile?.routine] ?? 0;

  return {
    vitality: clamp(Math.round(35 + (sleep - 6) * 3 + movement + (energy - 3) * 3), 20, 70),
    focus: clamp(Math.round(39 + (energy - 3) * 3), 20, 70),
    resolve: clamp(Math.round(34 + routine), 20, 70),
    harmony: clamp(Math.round(43 + (3 - stress) * 4 + (sleep >= 7 ? 3 : 0)), 20, 70)
  };
}

function makeQuests(profile, day) {
  const mainKey = profile?.primaryGoal || 'mindset';
  const mainBank = QUEST_BANK[mainKey] || QUEST_BANK.mindset;
  const mainTemplate = mainBank[(day - 1) % mainBank.length];

  const secondaryAreas = (profile?.areas || []).filter((area) => area !== mainKey);
  const secondaryKey = secondaryAreas.length
    ? secondaryAreas[(day - 1) % secondaryAreas.length]
    : mainKey === 'health'
      ? 'mindset'
      : 'health';

  const secondaryBank = QUEST_BANK[secondaryKey] || QUEST_BANK.health;
  const secondaryTemplate = secondaryBank[(day + 1) % secondaryBank.length];
  const ritual = RESET_QUESTS[(day - 1) % RESET_QUESTS.length];

  const focus = profile?.focusDetail?.trim();
  const goal = profile?.goalDetail?.trim();
  const minutes = Number(profile?.dailyMinutes || 15);

  const personalQuest = {
    id: `day-${day}-main`,
    title: focus ? `Take a step toward ${focus}` : mainTemplate.title,
    detail: goal
      ? `Give your goal ${minutes} focused minutes. Begin with one small step: ${goal}`
      : mainTemplate.detail,
    category: mainKey,
    stat: mainTemplate.stat,
    xp: 10
  };

  return [
    personalQuest,
    {
      id: `day-${day}-support`,
      title: secondaryTemplate.title,
      detail: secondaryTemplate.detail,
      category: secondaryKey,
      stat: secondaryTemplate.stat,
      xp: 10
    },
    {
      id: `day-${day}-ritual`,
      title: ritual.title,
      detail: ritual.detail,
      category: 'ritual',
      stat: ritual.stat,
      xp: 10
    }
  ];
}

function readSave() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function formatDate(date) {
  if (!date) return 'Today';

  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  } catch {
    return 'Today';
  }
}

function Avatar({ profile, level = 1, className = '' }) {
  const archetype = getArchetype(profile);
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '') || 'lore';
  const hasGear = level >= 3;
  const hasAura = level >= 5;
  const hasCrown = level >= 7;
  const form = hasCrown ? 'CROWNED' : hasAura ? 'AWAKENED' : hasGear ? 'GEARED' : 'WANDERER';

  return (
    <div className={`avatar ${className}`} style={{ '--avatar-accent': archetype.accent }}>
      <svg
        className="avatar-svg"
        viewBox="0 0 250 290"
        role="img"
        aria-label={`${archetype.name}, ${archetype.title}, level ${level}`}
      >
        <defs>
          <radialGradient id={`${id}-glow`} cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor={archetype.accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={archetype.accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-cape`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={archetype.cloak} />
            <stop offset="100%" stopColor={archetype.cloakDark} />
          </linearGradient>
        </defs>

        <circle cx="125" cy="139" r="112" fill={`url(#${id}-glow)`} />

        {hasAura && (
          <g className="avatar-aura">
            <circle cx="125" cy="137" r="88" fill="none" stroke={archetype.accent} strokeWidth="1.5" strokeDasharray="3 8" opacity="0.75" />
            <circle cx="125" cy="137" r="99" fill="none" stroke={archetype.accent} strokeWidth="2" opacity="0.26" />
            <path d="M125 31V17 M206 72l11-9 M44 72 33 63 M217 146h14 M33 146H19" stroke={archetype.accent} strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {hasAura && (
          <path
            d="M76 151 Q125 175 174 151 L210 249 Q125 233 40 249 Z"
            fill={`url(#${id}-cape)`}
            stroke={archetype.accent}
            strokeWidth="1.4"
            opacity="0.9"
          />
        )}

        <ellipse cx="125" cy="267" rx="70" ry="10" fill="#020711" opacity="0.45" />

        <path d="M83 177 Q94 155 113 155h24q20 0 31 22l17 67q-60 23-120 0z" fill={archetype.cloak} stroke="#111a2b" strokeWidth="3" />
        <path d="M83 183q-19 7-22 26l-5 26q13 8 27 2l13-43z" fill={archetype.cloakDark} stroke="#111a2b" strokeWidth="3" />
        <path d="M167 183q19 7 22 26l5 26q-13 8-27 2l-13-43z" fill={archetype.cloakDark} stroke="#111a2b" strokeWidth="3" />

        <path d="M110 146v30q15 14 30 0v-30" fill="#eeb69e" stroke="#1a2333" strokeWidth="2" />
        <path d="M101 183l24 23 24-23" fill="none" stroke={archetype.accent} strokeWidth="3" />
        <path d="M94 218q31 14 62 0" fill="none" stroke="#f5dfb0" strokeWidth="2" opacity="0.75" />

        <path d="M79 99Q67 47 100 27q31-19 65 2 34 21 20 78l-8 42q-15-15-19-41h-65q-2 25-20 42z" fill={archetype.hair} stroke="#141b2a" strokeWidth="3" />
        <circle cx="81" cy="107" r="10" fill="#edbaa1" />
        <circle cx="169" cy="107" r="10" fill="#edbaa1" />
        <ellipse cx="125" cy="102" rx="45" ry="55" fill="#f2c4a8" stroke="#182234" strokeWidth="3" />

        <path d="M82 84q5-45 43-49 42-3 49 48-13-15-25-17-11 14-24 11-14 13-27-2-8 10-16 9z" fill={archetype.hair} stroke="#141b2a" strokeWidth="2" />
        <path d="M85 81q2-30 28-38-12 19-8 42z" fill={archetype.hair} />

        <ellipse cx="108" cy="106" rx="9" ry="12" fill="#fff7eb" />
        <ellipse cx="142" cy="106" rx="9" ry="12" fill="#fff7eb" />
        <ellipse cx="109" cy="108" rx="5" ry="7" fill={archetype.accent} />
        <ellipse cx="141" cy="108" rx="5" ry="7" fill={archetype.accent} />
        <circle cx="110" cy="109" r="2.5" fill="#172033" />
        <circle cx="142" cy="109" r="2.5" fill="#172033" />
        <circle cx="111" cy="105" r="1.8" fill="#fff" />
        <circle cx="143" cy="105" r="1.8" fill="#fff" />

        <path d="M100 94q8-6 15-1 M135 93q7-5 15 1" fill="none" stroke={archetype.hair} strokeWidth="3" strokeLinecap="round" />
        <path d="M125 112l-3 10 M117 132q8 7 16 0" fill="none" stroke="#a75f67" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="96" cy="123" rx="7" ry="3" fill="#ed7f87" opacity="0.22" />
        <ellipse cx="154" cy="123" rx="7" ry="3" fill="#ed7f87" opacity="0.22" />

        {hasGear && (
          <g>
            <path d="M80 178q12-12 25-5l-7 24q-14 5-25-6z" fill="#e4c47b" stroke="#fff0bd" strokeWidth="2" />
            <path d="M170 178q-12-12-25-5l7 24q14 5 25-6z" fill="#e4c47b" stroke="#fff0bd" strokeWidth="2" />
            <path d="M96 184l29 22 29-22" fill="none" stroke="#f5db9a" strokeWidth="5" strokeLinecap="round" />
            <circle cx="125" cy="206" r="6" fill={archetype.accent} />
          </g>
        )}

        {hasCrown && (
          <g>
            <path d="M99 40l5-19 14 13 7-20 9 20 14-13 4 19z" fill="#f8d47f" stroke="#fff0b4" strokeWidth="2" strokeLinejoin="round" />
            <path d="M101 42h48" stroke="#fff0b4" strokeWidth="3" strokeLinecap="round" />
            <circle cx="125" cy="30" r="3" fill={archetype.accent} />
          </g>
        )}
      </svg>
      <span className="avatar-rank">{form}</span>
    </div>
  );
}

function Header({ challenge, hasSave, onNewStory }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-sigil" aria-hidden="true">✦</div>
        <div>
          <div className="brand-name">Life<span>Lore</span></div>
          <div className="brand-caption">YOUR LIFE IS A GAME</div>
        </div>
      </div>

      <div className="header-actions">
        {challenge ? (
          <div className="chapter-indicator">
            <span className="tiny-star">✦</span>
            <span>CHAPTER {challenge.currentDay} / {challenge.duration}</span>
            <i />
            <strong>{challenge.xp} XP</strong>
          </div>
        ) : (
          <span className="header-whisper">A WORLD WRITTEN BY YOU</span>
        )}

        {hasSave && (
          <button className="new-story-button" type="button" onClick={onNewStory}>
            <span>↺</span> New story
          </button>
        )}
      </div>
    </header>
  );
}

function LandingScreen({ onStart }) {
  const demo = { primaryGoal: 'creativity' };

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="spark-dot" /> A DIFFERENT KIND OF ADVENTURE</div>
          <h1>Your life is a <em>game.</em></h1>
          <p className="hero-subtitle">
            Somewhere beyond the ordinary, a page is waiting for your name.
            Build a quest around the life you want—and meet the companion who
            will grow alongside you.
          </p>

          <div className="hero-actions">
            <button className="button button-primary button-large" onClick={onStart}>
              Enter the living story <span>↗</span>
            </button>
            <span className="hero-promise">No streaks. No perfect days. Just your next move.</span>
          </div>

          <div className="hero-chapters">
            <div><b>01</b><span>Discover your world</span></div>
            <div><b>02</b><span>Make a living oath</span></div>
            <div><b>03</b><span>Change your legend</span></div>
          </div>
        </div>

        <div className="hero-scene">
          <div className="scene-frame">
            <div className="scene-ring scene-ring-one" />
            <div className="scene-ring scene-ring-two" />
            <div className="scene-stars">✦ <span>✧</span> · ✦</div>
            <div className="scene-label"><span className="spark-dot" /> A COMPANION AWAITS</div>
            <Avatar profile={demo} level={5} className="hero-avatar" />
            <div className="scene-nameplate">
              <div>
                <span className="mini-label">DREAMSMITH OF THE UNWRITTEN</span>
                <h2>Aeri</h2>
                <p>Your story has not been written yet.</p>
              </div>
              <span className="scene-level">LVL 05</span>
            </div>
            <div className="scene-footnote">ORIGINAL CHARACTER ART · MADE OF SVG AND A LITTLE MAGIC</div>
          </div>
        </div>
      </section>

      <section className="world-intro">
        <div>
          <span className="eyebrow">NOT A CHECKLIST. A CHRONICLE.</span>
          <h2>There are other worlds inside your everyday life.</h2>
        </div>
        <p>
          Your goals become quests. Your effort becomes lore. Missed days are
          not the end of the tale—your map is always waiting when you return.
        </p>
      </section>

      <section className="feature-grid">
        <article className="feature-card">
          <div className="feature-mark">⌘</div>
          <span className="eyebrow">THE FIRST PAGE</span>
          <h3>Begin with your real life.</h3>
          <p>Shape your world from your goals, energy, routine, obstacles, and the changes you actually want.</p>
        </article>
        <article className="feature-card">
          <div className="feature-mark">✍</div>
          <span className="eyebrow">THE LIVING OATH</span>
          <h3>Make a promise in your own hand.</h3>
          <p>Choose your chapter length, draw your signature, and decide how many ward stones travel with you.</p>
        </article>
        <article className="feature-card">
          <div className="feature-mark">✦</div>
          <span className="eyebrow">THE NEXT FORM</span>
          <h3>Let the legend change.</h3>
          <p>Complete quests to earn XP, grow your stats, and unlock new forms for your anime-inspired companion.</p>
        </article>
      </section>

      <div className="landing-footnote"><span>✧</span> A personal adventure, saved on this device. Not another streak to keep alive.</div>
    </main>
  );
}

function OriginScreen({ initialProfile, onContinue, onBack }) {
  const [draft, setDraft] = useState(() => ({
    ...PROFILE_DEFAULTS,
    ...(initialProfile || {}),
    areas: initialProfile?.areas?.length ? initialProfile.areas : [...PROFILE_DEFAULTS.areas]
  }));
  const [error, setError] = useState('');

  const archetype = getArchetype(draft);
  const placeholders = {
    health: 'For example: sleep, gentle movement, strength, more energy',
    education: 'For example: biology, a new language, a certification',
    mindset: 'For example: confidence, focus, calm, self-trust',
    career: 'For example: a project, job search, skill, next direction',
    relationships: 'For example: family time, friendship, communication',
    creativity: 'For example: drawing, music, writing, making things'
  };

  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError('');
  }

  function toggleArea(key) {
    const selected = draft.areas.includes(key);

    if (selected && draft.areas.length === 1) {
      setError('Keep at least one realm in your story.');
      return;
    }

    if (!selected && draft.areas.length >= 3) {
      setError('Choose up to three realms to keep your first chapter focused.');
      return;
    }

    const areas = selected
      ? draft.areas.filter((item) => item !== key)
      : [...draft.areas, key];

    const primaryGoal = areas.includes(draft.primaryGoal) ? draft.primaryGoal : areas[0];

    setDraft((current) => ({
      ...current,
      areas,
      primaryGoal,
      focusDetail: primaryGoal !== current.primaryGoal ? '' : current.focusDetail
    }));
    setError('');
  }

  function submit(event) {
    event.preventDefault();

    if (!draft.name.trim()) {
      setError('Write a name or nickname for the story.');
      return;
    }
    if (!draft.focusDetail.trim()) {
      setError('Add a little detail about your main focus.');
      return;
    }
    if (!draft.goalDetail.trim()) {
      setError('Describe what progress might look like for you.');
      return;
    }

    onContinue({
      ...draft,
      name: draft.name.trim(),
      focusDetail: draft.focusDetail.trim(),
      goalDetail: draft.goalDetail.trim(),
      why: draft.why.trim()
    });
  }

  return (
    <main>
      <div className="page-heading">
        <div>
          <span className="eyebrow">THE FIRST PAGE · YOUR ORIGIN</span>
          <h1>Tell the world <em>where you are.</em></h1>
          <p>This is not a test and there is no “right” starting point. Your story begins with what is true today.</p>
        </div>
        <button className="text-link" type="button" onClick={onBack}>← Back to the threshold</button>
      </div>

      <div className="content-layout">
        <form className="form-stack" onSubmit={submit} noValidate>
          <section className="panel form-panel">
            <div className="panel-heading">
              <span className="chapter-number">I</span>
              <div>
                <h2>The life you’re arriving from</h2>
                <p>A few details help us make the quests fit your actual days.</p>
              </div>
            </div>

            <div className="field-grid">
              <label className="field">
                <span>What should the story call you?</span>
                <input value={draft.name} onChange={(e) => update('name', e.target.value)} placeholder="Name or nickname" maxLength={30} />
              </label>

              <label className="field">
                <span>What season of life are you in?</span>
                <select value={draft.lifeStage} onChange={(e) => update('lifeStage', e.target.value)}>
                  <option value="school">School or college</option>
                  <option value="working">Working</option>
                  <option value="transition">Between chapters</option>
                  <option value="caregiving">Caregiving or family-focused</option>
                  <option value="other">Something else</option>
                </select>
              </label>

              <div className="field">
                <label htmlFor="sleep-range">Usual sleep on a typical night</label>
                <div className="range-line">
                  <input id="sleep-range" type="range" min="4" max="10" value={draft.sleepHours} onChange={(e) => update('sleepHours', e.target.value)} />
                  <b>{draft.sleepHours} hours</b>
                </div>
                <small>An estimate is enough.</small>
              </div>

              <label className="field">
                <span>How often do you move your body?</span>
                <select value={draft.movement} onChange={(e) => update('movement', e.target.value)}>
                  <option value="rarely">Not very often right now</option>
                  <option value="1-2">About 1–2 days a week</option>
                  <option value="3-4">About 3–4 days a week</option>
                  <option value="5+">Most days</option>
                </select>
              </label>

              <div className="field">
                <label htmlFor="energy-range">How has your energy been?</label>
                <div className="range-line">
                  <input id="energy-range" type="range" min="1" max="5" value={draft.energy} onChange={(e) => update('energy', e.target.value)} />
                  <b>{draft.energy} / 5</b>
                </div>
                <small>Low <span className="range-spacer" /> High</small>
              </div>

              <div className="field">
                <label htmlFor="stress-range">How much stress are you carrying?</label>
                <div className="range-line">
                  <input id="stress-range" type="range" min="1" max="5" value={draft.stress} onChange={(e) => update('stress', e.target.value)} />
                  <b>{draft.stress} / 5</b>
                </div>
                <small>A little <span className="range-spacer" /> A lot</small>
              </div>

              <label className="field">
                <span>How steady is your routine?</span>
                <select value={draft.routine} onChange={(e) => update('routine', e.target.value)}>
                  <option value="inconsistent">It changes a lot</option>
                  <option value="sometimes">Some parts are consistent</option>
                  <option value="steady">I have a steady routine</option>
                </select>
              </label>

              <label className="field">
                <span>What tends to make things difficult?</span>
                <select value={draft.obstacle} onChange={(e) => update('obstacle', e.target.value)}>
                  <option value="time">Not enough time</option>
                  <option value="motivation">Motivation comes and goes</option>
                  <option value="stress">Stress or overwhelm</option>
                  <option value="distraction">Distractions</option>
                  <option value="unclear">Not knowing where to start</option>
                  <option value="energy">Low energy</option>
                </select>
              </label>
            </div>
          </section>

          <section className="panel form-panel">
            <div className="panel-heading">
              <span className="chapter-number">II</span>
              <div>
                <h2>Choose the realms you want to explore</h2>
                <p>Select up to three. Your first realm shapes your companion.</p>
              </div>
            </div>

            <div className="area-grid">
              {AREAS.map((area) => {
                const selected = draft.areas.includes(area.key);
                return (
                  <button
                    className={`area-card ${selected ? 'selected' : ''}`}
                    type="button"
                    key={area.key}
                    aria-pressed={selected}
                    onClick={() => toggleArea(area.key)}
                  >
                    <span className="area-symbol">{area.symbol}</span>
                    <strong>{area.name}</strong>
                    <small>{area.description}</small>
                    {selected && <span className="area-mark">IN YOUR STORY</span>}
                  </button>
                );
              })}
            </div>

            <div className="field-grid">
              <label className="field">
                <span>Which realm is your main quest?</span>
                <select value={draft.primaryGoal} onChange={(e) => {
                  update('primaryGoal', e.target.value);
                  update('focusDetail', '');
                }}>
                  {draft.areas.map((area) => <option key={area} value={area}>{getAreaName(area)}</option>)}
                </select>
              </label>

              <label className="field">
                <span>What specifically do you want to focus on?</span>
                <input
                  value={draft.focusDetail}
                  onChange={(e) => update('focusDetail', e.target.value)}
                  placeholder={placeholders[draft.primaryGoal] || 'Describe your focus'}
                  maxLength={90}
                />
              </label>

              <label className="field field-wide">
                <span>What would progress look like for you?</span>
                <textarea
                  value={draft.goalDetail}
                  onChange={(e) => update('goalDetail', e.target.value)}
                  placeholder="Keep it personal and realistic. For example: feel more rested, finish a course, or make time to draw."
                  rows="3"
                  maxLength={220}
                />
              </label>

              <label className="field field-wide">
                <span>Why does this matter to you right now?</span>
                <textarea
                  value={draft.why}
                  onChange={(e) => update('why', e.target.value)}
                  placeholder="Leave a note for the version of you who will read this later."
                  rows="2"
                  maxLength={180}
                />
              </label>
            </div>
          </section>

          <section className="panel form-panel">
            <div className="panel-heading">
              <span className="chapter-number">III</span>
              <div>
                <h2>Set the pace of your adventure</h2>
                <p>A small quest you can repeat is more powerful than a perfect plan.</p>
              </div>
            </div>

            <div className="field-grid">
              <label className="field">
                <span>Realistic time for a main quest</span>
                <select value={draft.dailyMinutes} onChange={(e) => update('dailyMinutes', e.target.value)}>
                  <option value="5">About 5 minutes</option>
                  <option value="15">About 15 minutes</option>
                  <option value="30">About 30 minutes</option>
                  <option value="45">About 45 minutes</option>
                </select>
              </label>

              <label className="field">
                <span>When might you explore?</span>
                <select value={draft.bestTime} onChange={(e) => update('bestTime', e.target.value)}>
                  <option value="morning">Morning</option>
                  <option value="midday">Midday</option>
                  <option value="evening">Evening</option>
                  <option value="flexible">Whenever I can</option>
                </select>
              </label>
            </div>

            <div className="privacy-note">
              <span>✧</span>
              <p>Your answers and progress are stored in this browser only. LifeLore does not send them to a server.</p>
            </div>
          </section>

          {error && <div className="error-message">{error}</div>}

          <div className="form-submit">
            <span>There is no perfect way to begin.</span>
            <button className="button button-primary" type="submit">Meet my companion <span>↗</span></button>
          </div>
        </form>

        <aside className="sticky-aside">
          <section className="panel companion-preview">
            <span className="eyebrow">A COMPANION IS TAKING SHAPE</span>
            <Avatar profile={draft} level={1} />
            <h2>{archetype.name}</h2>
            <p className="companion-title">{archetype.title}</p>
            <p className="companion-quote">{archetype.tagline}</p>
            <div className="preview-rule" />
            <div className="preview-detail">
              <span className="mini-label">FIRST DESTINATION</span>
              <strong>{archetype.region}</strong>
            </div>
            <div className="preview-detail">
              <span className="mini-label">THE PLAYER</span>
              <strong>{draft.name || 'Your name'}</strong>
              <small>Your character changes as you take action—not because you were perfect.</small>
            </div>
          </section>

          <div className="aside-whisper">
            <span>✦</span>
            <p>This is a reflection and quest-building experience, not medical or mental health advice.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SignaturePad({ onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  function point(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  }

  function startDrawing(event) {
    event.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const position = point(event);

    canvas.setPointerCapture?.(event.pointerId);
    drawing.current = true;
    context.beginPath();
    context.arc(position.x, position.y, 2.4, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(position.x, position.y);
  }

  function draw(event) {
    if (!drawing.current) return;
    event.preventDefault();

    const context = canvasRef.current.getContext('2d');
    const position = point(event);
    context.lineTo(position.x, position.y);
    context.stroke();
  }

  function stopDrawing(event) {
    if (!drawing.current) return;
    drawing.current = false;
    canvasRef.current.releasePointerCapture?.(event.pointerId);
    setHasInk(true);
    onChange(canvasRef.current.toDataURL('image/png'));
  }

  function clear() {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    onChange('');
  }

  return (
    <div className="signature-area">
      <div className="signature-wrap">
        <canvas
          ref={canvasRef}
          width="1200"
          height="300"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          aria-label="Draw your signature here"
        />
        {!hasInk && <div className="signature-placeholder">Draw your name with a finger or mouse</div>}
        <div className="signature-baseline" />
      </div>
      <div className="signature-tools">
        <span>{hasInk ? 'Your mark has been recorded.' : 'Your hand-drawn mark is required.'}</span>
        <button className="text-link" type="button" onClick={clear}>Clear</button>
      </div>
    </div>
  );
}

function OathScreen({ profile, onBegin, onEdit }) {
  const [duration, setDuration] = useState(21);
  const [stake, setStake] = useState('steady');
  const [signature, setSignature] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const archetype = getArchetype(profile);

  function begin() {
    if (!signature) {
      setError('Draw your mark before sealing the oath.');
      return;
    }
    if (!accepted) {
      setError('Confirm that you understand the quest and ward rules.');
      return;
    }
    onBegin({ duration: Number(duration), stake, signature });
  }

  return (
    <main>
      <div className="page-heading">
        <div>
          <span className="eyebrow">THE SECOND PAGE · YOUR OATH</span>
          <h1>Choose the shape of <em>your chapter.</em></h1>
          <p>Take on a challenge that feels meaningful, not impossible. This is a promise to return—not a demand for flawless days.</p>
        </div>
        <button className="text-link" type="button" onClick={onEdit}>← Edit your origin</button>
      </div>

      <div className="content-layout oath-layout">
        <div className="form-stack">
          <section className="panel form-panel">
            <div className="panel-heading">
              <span className="chapter-number">I</span>
              <div><h2>How long is this chapter?</h2><p>Choose the length of the adventure ahead.</p></div>
            </div>
            <div className="duration-grid">
              {[7, 21, 30].map((days) => (
                <button className={`duration-card ${duration === days ? 'selected' : ''}`} type="button" key={days} onClick={() => setDuration(days)} aria-pressed={duration === days}>
                  <strong>{days}</strong><span>days</span>
                  <small>{days === 7 ? 'The first spark' : days === 21 ? 'Find your rhythm' : 'A longer legend'}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="panel form-panel">
            <div className="panel-heading">
              <span className="chapter-number">II</span>
              <div><h2>Choose your warding</h2><p>These are in-app rules, not money or real-world punishments.</p></div>
            </div>
            <div className="stake-grid">
              {Object.entries(STAKES).map(([key, option]) => (
                <button className={`stake-card ${stake === key ? 'selected' : ''}`} type="button" key={key} onClick={() => setStake(key)} aria-pressed={stake === key}>
                  <span className="stake-symbol">{option.symbol}</span>
                  <strong>{option.name}</strong>
                  <span>{option.subtitle}</span>
                  <small>{option.detail}</small>
                </button>
              ))}
            </div>
            <div className="ward-note">
              <span>!</span>
              <p>Seal a day with fewer than half its quests completed and one ward stone is used. With no wards left, your chosen stake deducts XP.</p>
            </div>
          </section>

          <section className="panel form-panel">
            <div className="panel-heading">
              <span className="chapter-number">III</span>
              <div><h2>Write your name into the story</h2><p>Draw your signature to seal the living oath.</p></div>
            </div>

            <div className="oath-paper">
              <span className="mini-label">THE LIVING OATH</span>
              <p>
                I, <strong>{profile.name}</strong>, will give myself a fair chance for <strong>{duration} days</strong>.
                I will take one small step at a time, and when a day does not go to plan, I will return when I can.
              </p>
            </div>

            <SignaturePad onChange={(value) => { setSignature(value); setError(''); }} />

            <label className="oath-check">
              <input type="checkbox" checked={accepted} onChange={(e) => { setAccepted(e.target.checked); setError(''); }} />
              <span className="custom-check">✓</span>
              <span>I understand the quest, ward, and XP rules. I accept this chapter.</span>
            </label>
          </section>

          {error && <div className="error-message">{error}</div>}

          <div className="form-submit">
            <span>Your story stays on this device.</span>
            <button className="button button-primary" type="button" onClick={begin}>Seal the oath <span>✦</span></button>
          </div>
        </div>

        <aside className="sticky-aside">
          <section className="panel oath-preview">
            <span className="eyebrow">YOUR ADVENTURE PREVIEW</span>
            <Avatar profile={profile} level={1} />
            <h2>{archetype.name}</h2>
            <p className="companion-title">{archetype.title}</p>
            <div className="preview-rule" />
            <div className="oath-summary">
              <div><span className="mini-label">CHAPTER</span><strong>{duration} days</strong></div>
              <div><span className="mini-label">WARDS</span><strong>{STAKES[stake].wards} stones</strong></div>
              <div><span className="mini-label">FIRST REALM</span><strong>{archetype.region}</strong></div>
            </div>
            <p className="companion-quote">{archetype.tagline}</p>
          </section>
          <div className="aside-whisper"><span>✧</span><p>Complete all three daily quests to claim a +20 XP chapter bonus.</p></div>
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
        const start = baseline ? Math.round(baseline[item.key] ?? value) : null;
        const delta = start === null ? 0 : value - start;

        return (
          <div className="stat-row" key={item.key}>
            <div className="stat-heading">
              <span><i>{item.symbol}</i>{item.name}</span>
              <strong>{value}<small>/100</small></strong>
            </div>
            <div className="stat-track" role="progressbar" aria-label={`${item.name} stat`} aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
              <span style={{ width: `${value}%` }} />
            </div>
            {baseline && <small className="stat-delta">{delta > 0 ? `+${delta} since your first page` : delta < 0 ? `${delta} from your first page` : 'Your starting point'}</small>}
          </div>
        );
      })}
    </div>
  );
}

function CompanionPanel({ profile, challenge }) {
  const archetype = getArchetype(profile);
  const level = getLevel(challenge.xp);
  const levelXP = challenge.xp % XP_PER_LEVEL;
  const remaining = XP_PER_LEVEL - levelXP;
  const progress = (levelXP / XP_PER_LEVEL) * 100;

  return (
    <section className="panel companion-panel">
      <div className="companion-art">
        <div className="companion-orbit" />
        <Avatar profile={profile} level={level} />
      </div>

      <div className="companion-info">
        <span className="eyebrow">YOUR LOREBOUND COMPANION</span>
        <div className="companion-name-row">
          <div><h2>{archetype.name}</h2><p>{archetype.title}</p></div>
          <div className="level-seal"><small>LVL</small><strong>{level}</strong></div>
        </div>

        <p className="companion-quote">{archetype.tagline}</p>

        <div className="xp-heading"><span>LORE XP · LEVEL {level}</span><span>{levelXP} / {XP_PER_LEVEL}</span></div>
        <div className="xp-track"><span style={{ width: `${progress}%` }} /></div>
        <div className="xp-caption"><span>{challenge.xp} total XP</span><span>{remaining} XP to next level</span></div>

        <div className="evolution-heading">
          {level >= 7 ? 'The crown is yours.' : level >= 5 ? 'Your aura is awake.' : level >= 3 ? 'Your first relic is yours.' : 'A new form is waiting in the lore.'}
        </div>

        <div className="evolution-steps">
          {[{ level: 3, name: 'Relic gear' }, { level: 5, name: 'Cape + aura' }, { level: 7, name: 'Star crown' }].map((step) => (
            <div className={`evolution-step ${level >= step.level ? 'unlocked' : ''}`} key={step.level}>
              <span>{level >= step.level ? '✓' : step.level}</span>
              <small>LVL {step.level}<b>{step.name}</b></small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DayOutcome({ result, challenge, onNext, onResults }) {
  let message = 'The page is sealed. Your journey continues.';

  if (result.belowHalf && result.shieldUsed) {
    message = `A ward stone softened today’s landing. ${result.shieldsRemaining} ward${result.shieldsRemaining === 1 ? '' : 's'} remain.`;
  } else if (result.belowHalf && result.xpPenalty > 0) {
    message = `No ward stones remained, so ${result.xpPenalty} XP was spent. The story is still yours to continue.`;
  } else if (result.belowHalf) {
    message = 'No ward stones remained. Your XP was already at zero, so there was nothing left to deduct.';
  } else if (result.perfect) {
    message = 'All three quests complete. The realm grants you a +20 XP chapter bonus.';
  }

  return (
    <div className={`day-outcome ${result.belowHalf ? 'outcome-gentle' : ''}`}>
      <div className="outcome-heading">
        <span className="outcome-mark">{result.perfect ? '✦' : '✓'}</span>
        <div><span className="eyebrow">PAGE SEALED</span><h3>{result.perfect ? 'A perfect clear.' : 'You were here.'}</h3></div>
      </div>
      <p>{message}</p>

      <div className="reward-line">
        <div><strong>+{result.questXP}</strong><small>quest XP</small></div>
        {result.bonusXP > 0 && <div><strong>+{result.bonusXP}</strong><small>clear bonus</small></div>}
        {result.shieldUsed && <div><strong>−1</strong><small>ward stone</small></div>}
        {result.xpPenalty > 0 && <div className="reward-penalty"><strong>−{result.xpPenalty}</strong><small>XP spent</small></div>}
      </div>

      {challenge.currentDay < challenge.duration ? (
        <button className="button button-primary" type="button" onClick={onNext}>Turn to day {challenge.currentDay + 1} <span>→</span></button>
      ) : (
        <button className="button button-primary" type="button" onClick={onResults}>Open the final chapter <span>↗</span></button>
      )}
    </div>
  );
}

function QuestBoard({ profile, challenge, record, onToggle, onSeal, onNext, onResults }) {
  const quests = useMemo(() => makeQuests(profile, challenge.currentDay), [profile, challenge.currentDay]);
  const completed = record.completed || [];
  const count = quests.filter((quest) => completed.includes(quest.id)).length;
  const isComplete = count === quests.length;

  return (
    <section className="panel quest-panel">
      <div className="quest-title-row">
        <span className="quest-emblem">✧</span>
        <div>
          <span className="eyebrow">TODAY’S TRIALS · DAY {challenge.currentDay}</span>
          <h2>The realm has three small asks.</h2>
          <p>Complete what you can. Your next step is more important than a perfect score.</p>
        </div>
        <div className="quest-count"><strong>{count}</strong><span>/ {quests.length}</span></div>
      </div>

      <div className="quest-progress-label"><span>THE DAY’S UNWRITTEN PAGE</span><span>{Math.round((count / quests.length) * 100)}%</span></div>
      <div className="quest-progress"><span style={{ width: `${(count / quests.length) * 100}%` }} /></div>

      <div className="quest-list">
        {quests.map((quest) => {
          const done = completed.includes(quest.id);
          return (
            <button
              type="button"
              className={`quest-row ${done ? 'done' : ''}`}
              key={quest.id}
              disabled={record.locked}
              onClick={() => onToggle(quest.id)}
            >
              <span className="quest-check">{done ? '✓' : ''}</span>
              <span className="quest-copy">
                <small>{quest.category === 'ritual' ? 'CAMPFIRE RITUAL' : getAreaName(quest.category)}</small>
                <strong>{quest.title}</strong>
                <span>{quest.detail}</span>
              </span>
              <span className="quest-reward">{done ? '+10' : '10'}<small>XP</small></span>
            </button>
          );
        })}
      </div>

      {!record.locked ? (
        <>
          <div className={`bonus-note ${isComplete ? 'ready' : ''}`}>
            <span>{isComplete ? '✦' : '＋'}</span>
            <p>{isComplete ? 'All trials complete. Seal the page to claim your +20 XP chapter bonus.' : 'Complete all three trials to receive a +20 XP chapter bonus when you seal the page.'}</p>
          </div>
          <div className="seal-row">
            <div><strong>Ready to close today’s page?</strong><small>Fewer than half complete uses a ward. No wards left means an XP deduction.</small></div>
            <button className="button button-primary" type="button" onClick={onSeal}>Seal today <span>→</span></button>
          </div>
        </>
      ) : (
        <DayOutcome result={record.result} challenge={challenge} onNext={onNext} onResults={onResults} />
      )}
    </section>
  );
}

function AdventureMap({ challenge }) {
  const days = Array.from({ length: challenge.duration }, (_, index) => index + 1);
  const sealedDays = Object.values(challenge.days || {}).filter((day) => day?.locked).length;

  return (
    <section className="panel map-panel">
      <div className="panel-heading">
        <span className="chapter-number">✦</span>
        <div><span className="eyebrow">THE MAP OF YOUR CHAPTER</span><h2>One page at a time.</h2><p>{sealedDays} of {challenge.duration} pages sealed</p></div>
      </div>
      <div className="route-grid">
        {days.map((day) => {
          const sealed = Boolean(challenge.days?.[day]?.locked);
          const current = day === challenge.currentDay && !sealed;
          const future = day > challenge.currentDay;
          return (
            <span className={`route-token ${sealed ? 'sealed' : ''} ${current ? 'current' : ''} ${future ? 'future' : ''}`} key={day} title={`Day ${day}${sealed ? ' · sealed' : current ? ' · current' : ' · ahead'}`}>
              {sealed ? '✓' : day}
            </span>
          );
        })}
      </div>
      <div className="map-legend"><span><i className="legend-today" /> Current page</span><span><i className="legend-sealed" /> Sealed page</span><span><i className="legend-ahead" /> Ahead</span></div>
    </section>
  );
}

function WardPanel({ challenge }) {
  const stake = STAKES[challenge.stake] || STAKES.steady;

  return (
    <section className="panel ward-panel">
      <div className="side-heading">
        <div><span className="eyebrow">YOUR LIVING OATH</span><h3>{stake.name} warding</h3></div>
        <span className="side-rune">{stake.symbol}</span>
      </div>
      <div className="contract-line"><span>CHAPTER</span><strong>{challenge.duration} days</strong></div>
      <div className="contract-line"><span>SIGNED</span><strong>{formatDate(challenge.signedAt)}</strong></div>
      <div className="ward-count"><span>WARD STONES REMAINING</span><strong>{challenge.shields}</strong></div>
      <div className="ward-stones">
        {Array.from({ length: stake.wards }, (_, index) => (
          <span className={index < challenge.shields ? 'ward-live' : 'ward-spent'} key={index}>◆</span>
        ))}
      </div>
      <p className="side-note">A ward softens a difficult day. When none remain, your stake applies its XP rule.</p>
      {challenge.signature && <div className="saved-mark"><span className="mini-label">YOUR MARK ON THE OATH</span><img src={challenge.signature} alt="Your signature on the living oath" /></div>}
    </section>
  );
}

function DashboardScreen({ profile, challenge, onToggle, onSeal, onNext, onResults }) {
  const record = challenge.days?.[challenge.currentDay] || { completed: [], locked: false, result: null };
  const archetype = getArchetype(profile);
  const sealedDays = Object.values(challenge.days || {}).filter((day) => day?.locked).length;

  return (
    <main>
      <div className="dashboard-intro">
        <div>
          <span className="eyebrow"><span className="spark-dot" /> YOUR STORY IS IN MOTION · {archetype.region.toUpperCase()}</span>
          <h1>The next page is <em>today.</em></h1>
          <p>{profile.name}, you do not need to conquer the whole map. Just choose your next small move.</p>
        </div>
        <div className="quick-stats">
          <div><strong>{sealedDays}</strong><span>pages sealed</span></div>
          <div><strong>{challenge.xp}</strong><span>lore XP</span></div>
          <div><strong>{challenge.shields}</strong><span>wards</span></div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="main-column">
          <CompanionPanel profile={profile} challenge={challenge} />
          <QuestBoard profile={profile} challenge={challenge} record={record} onToggle={onToggle} onSeal={onSeal} onNext={onNext} onResults={onResults} />
          <AdventureMap challenge={challenge} />
        </div>

        <aside className="side-column">
          <section className="panel stats-panel">
            <div className="side-heading"><div><span className="eyebrow">PLAYER ATTRIBUTES</span><h3>Your stats are growing.</h3></div><span className="side-rune">⌘</span></div>
            <p className="side-note">Each completed trial adds strength to the attribute it calls on.</p>
            <StatBars stats={challenge.stats} baseline={challenge.initialStats} />
          </section>

          <WardPanel challenge={challenge} />

          <section className="panel why-panel">
            <span className="eyebrow">A NOTE FROM YOUR FIRST PAGE</span>
            <div className="quote-mark">“</div>
            <p>{profile.why || 'You decided that taking the first step was worth it.'}</p>
            <small><span /> {profile.name} · {archetype.title}</small>
          </section>

          <div className="aside-whisper"><span>✧</span><p>A missed quest is a clue, not a verdict. Make the next step smaller and return when you can.</p></div>
        </aside>
      </div>
    </main>
  );
}

function CompareStats({ before, after }) {
  return (
    <div className="compare-list">
      {STAT_ITEMS.map((item) => {
        const start = Math.round(before?.[item.key] ?? 0);
        const end = Math.round(after?.[item.key] ?? start);
        const change = end - start;

        return (
          <div className="compare-row" key={item.key}>
            <div><span>{item.symbol} {item.name}</span><strong>{start} <i>→</i> {end}</strong></div>
            <div className="compare-bars">
              <span className="before-bar"><i style={{ width: `${start}%` }} /></span>
              <span className="after-bar"><i style={{ width: `${end}%` }} /></span>
            </div>
            <small>{change > 0 ? `+${change} growth` : change < 0 ? `${change} change` : 'Your starting point held steady'}</small>
          </div>
        );
      })}
    </div>
  );
}

function ResultsScreen({ profile, challenge, onNewStory }) {
  const archetype = getArchetype(profile);
  const level = getLevel(challenge.xp);
  const sealed = Object.values(challenge.days || {}).filter((day) => day?.locked);
  const perfect = sealed.filter((day) => day.result?.perfect).length;
  const completedQuests = challenge.totalQuestsCompleted || 0;

  return (
    <main className="results-page">
      <section className="results-heading">
        <span className="eyebrow">THE END OF ONE CHAPTER · THE BEGINNING OF ANOTHER</span>
        <h1>Look at the story <em>you made.</em></h1>
        <p>You did not become someone else. You left a trail of proof that you can show up for yourself.</p>
      </section>

      <section className="panel transformation-panel">
        <div className="transformation-heading">
          <div><span className="eyebrow">THE BEFORE &amp; AFTER</span><h2>Your companion’s next form.</h2></div>
          <span className="complete-stamp">✦ CHAPTER COMPLETE</span>
        </div>

        <div className="before-after">
          <div className="form-stage">
            <span className="eyebrow">DAY 0 · THE FIRST PAGE</span>
            <Avatar profile={profile} level={1} />
            <h3>{archetype.name}</h3><p>{archetype.title}</p>
            <small>LEVEL 1 · WANDERER</small>
          </div>
          <div className="evolution-arrow"><span>→</span><small>{challenge.xp} XP</small></div>
          <div className="form-stage after-stage">
            <span className="eyebrow">DAY {challenge.duration} · THE NEW FORM</span>
            <Avatar profile={profile} level={level} />
            <h3>{archetype.name}</h3><p>{archetype.title}</p>
            <small>LEVEL {level} · {level >= 7 ? 'CROWNED' : level >= 5 ? 'AWAKENED' : level >= 3 ? 'GEARED' : 'GROWING'}</small>
          </div>
        </div>

        <div className="evolution-message">
          <span>✧</span>
          {level >= 7 ? 'Relic gear, a traveling cape, an awakened aura, and the star crown are yours.' : level >= 5 ? 'Your relic gear, cape, and awakened aura are yours. The crown awaits another chapter.' : level >= 3 ? 'Your companion has earned their first relic gear. The next form is waiting.' : 'Your first chapter is complete. Keep earning XP to unlock your companion’s next form.'}
        </div>
      </section>

      <div className="results-grid">
        <section className="panel results-stats">
          <div className="panel-heading"><span className="chapter-number">✧</span><div><span className="eyebrow">YOUR ATTRIBUTES</span><h2>From your first page to now.</h2></div></div>
          <div className="compare-legend"><span><i className="legend-before" /> First page</span><span><i className="legend-after" /> Now</span></div>
          <CompareStats before={challenge.initialStats} after={challenge.stats} />
        </section>

        <section className="panel recap-panel">
          <span className="eyebrow">THE CHAPTER RECAP</span>
          <h2>{profile.name}, you kept moving.</h2>
          <div className="recap-grid">
            <div><strong>{sealed.length}/{challenge.duration}</strong><span>pages sealed</span></div>
            <div><strong>{perfect}</strong><span>perfect clears</span></div>
            <div><strong>{completedQuests}</strong><span>trials completed</span></div>
            <div><strong>{challenge.xp}</strong><span>final lore XP</span></div>
          </div>
          <div className="recap-why"><span className="mini-label">YOUR ORIGINAL WHY</span><p>{profile.why || 'You decided this was worth the first step.'}</p></div>
          <p className="recap-ending">Keep what worked. Change what didn’t. The next page is yours.</p>
        </section>
      </div>

      <div className="results-action">
        <button className="button button-primary button-large" onClick={onNewStory}>Begin a new story <span>↗</span></button>
        <small>Your progress is saved on this device until you start over.</small>
      </div>
    </main>
  );
}

export default function App() {
  const saved = useMemo(() => readSave(), []);
  const [profile, setProfile] = useState(saved.profile || null);
  const [challenge, setChallenge] = useState(saved.challenge || null);

  const [screen, setScreen] = useState(() => {
    if (saved.challenge) {
      const day = saved.challenge.currentDay;
      const finalPageSealed = day >= saved.challenge.duration && saved.challenge.days?.[day]?.locked;
      return finalPageSealed ? 'codex' : 'realm';
    }
    return saved.profile ? 'oath' : 'landing';
  });

  useEffect(() => {
    try {
      if (!profile && !challenge) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, challenge }));
      }
    } catch {
      // The app remains usable if browser storage is unavailable.
    }
  }, [profile, challenge]);

  function newStory() {
    if ((profile || challenge) && !window.confirm('Start a new story? Your current profile and chapter will be removed from this browser.')) return;
    setProfile(null);
    setChallenge(null);
    setScreen('landing');
  }

  function saveOrigin(nextProfile) {
    setProfile(nextProfile);
    setChallenge(null);
    setScreen('oath');
  }

  function startChapter({ duration, stake, signature }) {
    if (!profile) return;
    const initialStats = getBaseStats(profile);

    setChallenge({
      duration,
      stake,
      shields: STAKES[stake].wards,
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
    setScreen('realm');
  }

  function toggleQuest(questId) {
    if (!profile) return;

    setChallenge((previous) => {
      if (!previous) return previous;

      const day = previous.currentDay;
      const record = previous.days?.[day] || { completed: [], locked: false, result: null };
      if (record.locked) return previous;

      const quest = makeQuests(profile, day).find((item) => item.id === questId);
      if (!quest) return previous;

      const alreadyDone = record.completed.includes(questId);
      const completed = alreadyDone
        ? record.completed.filter((id) => id !== questId)
        : [...record.completed, questId];

      const direction = alreadyDone ? -1 : 1;
      const stats = {
        ...previous.stats,
        [quest.stat]: clamp((previous.stats?.[quest.stat] || 0) + direction * STAT_GAIN_PER_QUEST, 0, 100)
      };

      return {
        ...previous,
        xp: Math.max(0, previous.xp + direction * quest.xp),
        stats,
        totalQuestsCompleted: Math.max(0, (previous.totalQuestsCompleted || 0) + direction),
        days: {
          ...previous.days,
          [day]: { ...record, completed, locked: false, result: null }
        }
      };
    });
  }

  function sealDay() {
    if (!profile) return;

    setChallenge((previous) => {
      if (!previous) return previous;

      const day = previous.currentDay;
      const quests = makeQuests(profile, day);
      const record = previous.days?.[day] || { completed: [], locked: false, result: null };
      if (record.locked) return previous;

      const completedCount = quests.filter((quest) => record.completed.includes(quest.id)).length;
      const perfect = completedCount === quests.length;
      const belowHalf = completedCount < quests.length / 2;
      const questXP = quests
        .filter((quest) => record.completed.includes(quest.id))
        .reduce((total, quest) => total + quest.xp, 0);
      const bonusXP = perfect ? 20 : 0;

      let shields = previous.shields;
      let shieldUsed = false;
      let xpPenalty = 0;

      if (belowHalf) {
        if (shields > 0) {
          shields -= 1;
          shieldUsed = true;
        } else {
          xpPenalty = Math.min(STAKES[previous.stake].penalty, previous.xp + bonusXP);
        }
      }

      const xpAfter = Math.max(0, previous.xp + bonusXP - xpPenalty);
      const result = {
        completedCount,
        perfect,
        belowHalf,
        questXP,
        bonusXP,
        shieldUsed,
        shieldsRemaining: shields,
        xpPenalty
      };

      return {
        ...previous,
        xp: xpAfter,
        shields,
        days: {
          ...previous.days,
          [day]: { ...record, locked: true, result, sealedAt: new Date().toISOString() }
        }
      };
    });
  }

  function nextDay() {
    setChallenge((previous) => {
      if (!previous || previous.currentDay >= previous.duration) return previous;
      if (!previous.days?.[previous.currentDay]?.locked) return previous;
      return { ...previous, currentDay: previous.currentDay + 1 };
    });
    setScreen('realm');
  }

  function showResults() {
    setScreen('codex');
  }

  return (
    <div className="app-shell">
      <div className="world-glow glow-one" />
      <div className="world-glow glow-two" />

      <div className="app-frame">
        <Header challenge={challenge} hasSave={Boolean(profile || challenge)} onNewStory={newStory} />

        {screen === 'landing' && <LandingScreen onStart={() => setScreen('origin')} />}

        {screen === 'origin' && (
          <OriginScreen
            initialProfile={profile}
            onContinue={saveOrigin}
            onBack={() => setScreen(profile ? 'oath' : 'landing')}
          />
        )}

        {screen === 'oath' && profile && (
          <OathScreen profile={profile} onBegin={startChapter} onEdit={() => setScreen('origin')} />
        )}

        {screen === 'realm' && profile && challenge && (
          <DashboardScreen
            profile={profile}
            challenge={challenge}
            onToggle={toggleQuest}
            onSeal={sealDay}
            onNext={nextDay}
            onResults={showResults}
          />
        )}

        {screen === 'codex' && profile && challenge && (
          <ResultsScreen profile={profile} challenge={challenge} onNewStory={newStory} />
        )}

        <footer className="site-footer">
          <span>LIFELORE</span>
          <span>Your story belongs to you. Progress stays on this device.</span>
          <span>Not medical advice.</span>
        </footer>
      </div>
    </div>
  );
}

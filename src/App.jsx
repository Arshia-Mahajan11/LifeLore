import { useEffect, useMemo, useRef, useState } from 'react';
import Companion from './components/Companion.jsx';
import {
  AREAS,
  STAKES,
  STAT_ITEMS,
  XP_PER_LEVEL,
  getAreaName,
  getArchetype,
  getLevel,
  getStartingStats,
  makeQuests
} from './data/lore.js';
import '../styles/styles.css';

const STORAGE_KEY = 'lifelore-adventure-v2';

const EMPTY_PROFILE = {
  name: '',
  areas: [],
  primaryGoal: 'mindset',
  goalDetail: '',
  sleep: '6to7',
  energy: 'steady',
  movement: 'sometimes',
  stress: 'medium',
  obstacle: 'time',
  hobby: '',
  dailyMinutes: '10',
  why: ''
};

const STEPS = [
  {
    key: 'name',
    eyebrow: 'ORIGIN 01 · THE PLAYER',
    title: 'What name should the world remember?',
    subtitle: 'A name, nickname, or chosen name. This is your story.'
  },
  {
    key: 'areas',
    eyebrow: 'ORIGIN 02 · CHOOSE YOUR REALM',
    title: 'Which parts of your life deserve a new chapter?',
    subtitle: 'Choose up to three. Your first selection becomes your main quest.'
  },
  {
    key: 'goal',
    eyebrow: 'ORIGIN 03 · YOUR MAIN QUEST',
    title: 'What would you actually like to change?',
    subtitle: 'Make it personal. A small, clear goal is easier to turn into useful quests.'
  },
  {
    key: 'sleep',
    eyebrow: 'ORIGIN 04 · YOUR REAL STARTING POINT',
    title: 'How much sleep have you been getting lately?',
    subtitle: 'This is only to understand your current rhythm—not to judge it.'
  },
  {
    key: 'energy',
    eyebrow: 'ORIGIN 05 · YOUR REAL STARTING POINT',
    title: 'How has your energy been recently?',
    subtitle: 'Choose the answer that fits most days, not your best day.'
  },
  {
    key: 'movement',
    eyebrow: 'ORIGIN 06 · YOUR REAL STARTING POINT',
    title: 'What does movement look like in your life right now?',
    subtitle: 'Movement can be a walk, stretching, sport, dancing, or anything that fits you.'
  },
  {
    key: 'stress',
    eyebrow: 'ORIGIN 07 · YOUR REAL STARTING POINT',
    title: 'How much stress are you carrying?',
    subtitle: 'A simple check-in helps keep the challenge realistic.'
  },
  {
    key: 'obstacle',
    eyebrow: 'ORIGIN 08 · THE THING IN THE WAY',
    title: 'What most often makes it hard to begin?',
    subtitle: 'We’ll use your answer to make one daily ritual more useful.'
  },
  {
    key: 'hobby',
    eyebrow: 'ORIGIN 09 · YOUR SIDE QUEST',
    title: 'What hobby would you love to make room for?',
    subtitle: 'Your life should include things you enjoy—not only things you need to finish.'
  },
  {
    key: 'dailyMinutes',
    eyebrow: 'ORIGIN 10 · SET THE PACE',
    title: 'How much time can a main quest really take?',
    subtitle: 'Choose what feels doable on an ordinary, slightly busy day.'
  },
  {
    key: 'why',
    eyebrow: 'ORIGIN 11 · LEAVE YOURSELF A NOTE',
    title: 'Why does this chapter matter to you now?',
    subtitle: 'Optional. Leave a note for the version of you who will read this later.'
  }
];

const GOAL_PROMPTS = {
  health: {
    label: 'What health goal would feel meaningful?',
    placeholder: 'For example: sleep better, feel stronger, or have more energy'
  },
  education: {
    label: 'What would you love to learn or finish?',
    placeholder: 'For example: finish a course, learn a language, or study regularly'
  },
  mindset: {
    label: 'What inner skill would you like to grow?',
    placeholder: 'For example: confidence, focus, calm, or self-trust'
  },
  career: {
    label: 'What would you like to move forward?',
    placeholder: 'For example: a portfolio, a job search, or a work project'
  },
  relationships: {
    label: 'What kind of connection do you want to grow?',
    placeholder: 'For example: closer friendships or more family time'
  },
  creativity: {
    label: 'What would you like to make or practice?',
    placeholder: 'For example: drawing, music, writing, or photography'
  }
};

const CHOICES = {
  sleep: [
    { value: 'under6', symbol: '☾', title: 'Under 6 hours', detail: 'My sleep is limited lately.' },
    { value: '6to7', symbol: '◐', title: '6–7 hours', detail: 'It varies, but this is typical.' },
    { value: '7to8', symbol: '◑', title: '7–8 hours', detail: 'This is usually my range.' },
    { value: 'over8', symbol: '☼', title: 'Over 8 hours', detail: 'I usually get a longer night.' }
  ],
  energy: [
    { value: 'low', symbol: '☾', title: 'Running on reserve', detail: 'Keep my quests very small.' },
    { value: 'steady', symbol: '◐', title: 'Somewhere in the middle', detail: 'I have a little room to work with.' },
    { value: 'high', symbol: '✦', title: 'I have some spark', detail: 'I feel ready to try things.' }
  ],
  movement: [
    { value: 'rarely', symbol: '○', title: 'Not much right now', detail: 'I am starting from a quieter place.' },
    { value: 'sometimes', symbol: '◌', title: 'Some days', detail: 'Movement is part of my week sometimes.' },
    { value: 'often', symbol: '✧', title: 'Most weeks', detail: 'I move my body regularly.' }
  ],
  stress: [
    { value: 'low', symbol: '☼', title: 'A little', detail: 'There is some breathing room.' },
    { value: 'medium', symbol: '◐', title: 'A moderate amount', detail: 'Some things are weighing on me.' },
    { value: 'high', symbol: '☾', title: 'A lot right now', detail: 'I need a gentler pace.' }
  ],
  obstacle: [
    { value: 'time', symbol: '⌛', title: 'Not enough time', detail: 'My day fills up quickly.' },
    { value: 'energy', symbol: '☾', title: 'Low energy', detail: 'Starting can feel like too much.' },
    { value: 'overwhelm', symbol: '≋', title: 'Feeling overwhelmed', detail: 'The whole task feels too big.' },
    { value: 'distraction', symbol: '◉', title: 'Distractions', detail: 'My attention gets pulled away.' },
    { value: 'uncertainty', symbol: '?', title: 'Not knowing where to start', detail: 'I need a clearer first move.' },
    { value: 'consistency', symbol: '↻', title: 'Getting back into it', detail: 'I want a way back after a missed day.' }
  ],
  dailyMinutes: [
    { value: '5', symbol: 'Ⅰ', title: '5 minutes', detail: 'Tiny and easy to begin.' },
    { value: '10', symbol: 'Ⅱ', title: '10 minutes', detail: 'A little room to focus.' },
    { value: '20', symbol: 'Ⅲ', title: '20 minutes', detail: 'A focused short session.' },
    { value: '30', symbol: 'Ⅳ', title: '30 minutes', detail: 'I have a little more time.' }
  ]
};

function readSave() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function ChoiceGrid({ options, value, onChange, className = '' }) {
  return (
    <div className={`choice-grid ${className}`}>
      {options.map((option) => (
        <button
          className={`choice-card ${value === option.value ? 'selected' : ''}`}
          type="button"
          key={option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          <span className="choice-symbol">{option.symbol}</span>
          <span className="choice-copy">
            <strong>{option.title}</strong>
            <small>{option.detail}</small>
          </span>
          <span className="choice-radio" />
        </button>
      ))}
    </div>
  );
}

function Header({ challenge, hasSave, onNewStory }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-sigil">✦</div>
        <div>
          <div className="brand-name">Life<span>Lore</span></div>
          <div className="brand-tagline">YOUR LIFE IS A GAME</div>
        </div>
      </div>

      <div className="header-right">
        {challenge ? (
          <div className="header-status">
            <span className="online-star">✦</span>
            <span>DAY {challenge.currentDay} / {challenge.duration}</span>
            <i />
            <strong>{challenge.xp} XP</strong>
          </div>
        ) : (
          <span className="header-world-note">A WORLD WRITTEN BY YOU</span>
        )}

        {hasSave && (
          <button className="new-story" type="button" onClick={onNewStory}>
            <span>↻</span> New story
          </button>
        )}
      </div>
    </header>
  );
}

function LandingScreen({ onStart }) {
  const demoProfile = { primaryGoal: 'creativity' };
  const demoHero = getArchetype(demoProfile);

  return (
    <main className="landing">
      <section className="cover">
        <div className="cover-copy">
          <span className="eyebrow"><i className="eyebrow-spark" /> A PERSONAL ADVENTURE RPG</span>
          <h1>
            YOUR LIFE<br />
            IS A <em>GAME.</em>
          </h1>
          <p className="cover-description">
            Your goals become quests. Your hobbies become side adventures.
            Your companion grows with every step you choose to take.
          </p>
          <p className="cover-honesty">
            LifeLore won’t promise that every problem disappears. It gives your next move a place to begin.
          </p>
          <button className="button button-primary button-large" onClick={onStart}>
            Write my first page <span>↗</span>
          </button>
          <div className="cover-notes">
            <span><i /> No streaks to protect</span>
            <span><i /> Start small, return anytime</span>
          </div>
        </div>

        <div className="cover-stage">
          <div className="cover-stage-inner">
            <span className="stage-label"><i className="eyebrow-spark" /> A COMPANION AWAITS</span>
            <div className="stage-orbit stage-orbit-one" />
            <div className="stage-orbit stage-orbit-two" />
            <span className="stage-star star-one">✦</span>
            <span className="stage-star star-two">✧</span>
            <span className="stage-star star-three">·</span>

            <Companion profile={demoProfile} level={5} className="cover-companion" />

            <div className="stage-nameplate">
              <div>
                <small>{demoHero.title.toUpperCase()}</small>
                <h2>{demoHero.name}</h2>
                <p>Your story has not been written yet.</p>
              </div>
              <span>LVL 05</span>
            </div>
            <div className="stage-footnote">ORIGINAL CHARACTER · ORIGINAL WORLD</div>
          </div>
        </div>
      </section>

      <section className="world-intro">
        <div>
          <span className="eyebrow">NOT A CHECKLIST. A CHRONICLE.</span>
          <h2>Your everyday life has more than one world in it.</h2>
        </div>
        <p>
          Start with one honest question at a time. Then take quests shaped by
          your real goals, your real energy, and the things you enjoy.
        </p>
      </section>

      <section className="feature-grid">
        <article className="feature-card">
          <span className="feature-icon">⌘</span>
          <span className="eyebrow">THE ORIGIN STORY</span>
          <h3>One question at a time.</h3>
          <p>Tell LifeLore what matters, what gets in your way, and what you want your days to make room for.</p>
        </article>
        <article className="feature-card">
          <span className="feature-icon">✍</span>
          <span className="eyebrow">THE LIVING OATH</span>
          <h3>A challenge you choose.</h3>
          <p>Choose 7, 21, or 30 days. Pick your warding and sign your promise with a finger or mouse.</p>
        </article>
        <article className="feature-card">
          <span className="feature-icon">✦</span>
          <span className="eyebrow">THE NEXT FORM</span>
          <h3>Your companion evolves.</h3>
          <p>Complete quests to earn XP, grow your stats, and unlock gear, a cape and aura, then a crown.</p>
        </article>
      </section>

      <div className="landing-footnote">
        <span>✧</span>
        Your story is personal. Your progress is saved in this browser.
      </div>
    </main>
  );
}

function OnboardingScreen({ initialProfile, onComplete, onExit }) {
  const [draft, setDraft] = useState(() => ({
    ...EMPTY_PROFILE,
    ...(initialProfile || {}),
    areas: initialProfile?.areas || []
  }));
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');

  const step = STEPS[stepIndex];
  const primaryGoal = draft.areas[0] || draft.primaryGoal || 'mindset';
  const hero = getArchetype({ ...draft, primaryGoal });
  const prompt = GOAL_PROMPTS[primaryGoal] || GOAL_PROMPTS.mindset;
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError('');
  }

  function toggleArea(key) {
    const currentAreas = draft.areas || [];
    const selected = currentAreas.includes(key);

    if (selected && currentAreas.length === 1) {
      setError('Choose at least one realm for your story.');
      return;
    }

    if (!selected && currentAreas.length >= 3) {
      setError('Choose up to three realms to keep your first chapter focused.');
      return;
    }

    const areas = selected
      ? currentAreas.filter((area) => area !== key)
      : [...currentAreas, key];

    setDraft((current) => ({
      ...current,
      areas,
      primaryGoal: areas[0] || 'mindset'
    }));
    setError('');
  }

  function goBack() {
    setError('');

    if (stepIndex === 0) {
      onExit();
      return;
    }

    setStepIndex((current) => current - 1);
  }

  function goForward() {
    setError('');

    if (step.key === 'name' && !draft.name.trim()) {
      setError('Enter a name or nickname to begin your story.');
      return;
    }

    if (step.key === 'areas' && !draft.areas.length) {
      setError('Choose at least one realm before continuing.');
      return;
    }

    if (step.key === 'goal' && !draft.goalDetail.trim()) {
      setError('Tell us what you would genuinely like to change.');
      return;
    }

    if (stepIndex === STEPS.length - 1) {
      onComplete({
        ...draft,
        name: draft.name.trim(),
        areas: draft.areas.length ? draft.areas : ['mindset'],
        primaryGoal: draft.areas[0] || 'mindset',
        goalDetail: draft.goalDetail.trim(),
        hobby: draft.hobby.trim(),
        why: draft.why.trim()
      });
      return;
    }

    setStepIndex((current) => current + 1);
  }

  function renderAnswer() {
    switch (step.key) {
      case 'name':
        return (
          <label className="big-input-wrap">
            <span className="input-symbol">✧</span>
            <input
              autoComplete="nickname"
              maxLength={30}
              value={draft.name}
              onChange={(event) => update('name', event.target.value)}
              placeholder="Your name or nickname"
              aria-label="Your name or nickname"
            />
          </label>
        );

      case 'areas':
        return (
          <>
            <div className="area-pick-grid">
              {AREAS.map((area) => {
                const selected = draft.areas.includes(area.key);
                const isMain = draft.areas[0] === area.key;

                return (
                  <button
                    className={`area-pick ${selected ? 'selected' : ''}`}
                    type="button"
                    key={area.key}
                    aria-pressed={selected}
                    onClick={() => toggleArea(area.key)}
                  >
                    <span className="area-pick-symbol">{area.symbol}</span>
                    <strong>{area.name}</strong>
                    <small>{area.note}</small>
                    {isMain && <span className="main-quest-mark">MAIN QUEST</span>}
                  </button>
                );
              })}
            </div>
            <p className="answer-hint">Tap to choose up to three. Your first choice shapes your companion.</p>
          </>
        );

      case 'goal':
        return (
          <label className="textarea-answer">
            <span>{prompt.label}</span>
            <textarea
              rows="4"
              maxLength={220}
              value={draft.goalDetail}
              onChange={(event) => update('goalDetail', event.target.value)}
              placeholder={prompt.placeholder}
            />
            <small>It can be a first draft. You are not locking in a life plan.</small>
          </label>
        );

      case 'sleep':
      case 'energy':
      case 'movement':
      case 'stress':
      case 'obstacle':
      case 'dailyMinutes':
        return (
          <ChoiceGrid
            options={CHOICES[step.key]}
            value={draft[step.key]}
            onChange={(value) => update(step.key, value)}
            className={step.key === 'obstacle' || step.key === 'dailyMinutes' ? 'choice-grid-two' : ''}
          />
        );

      case 'hobby':
        return (
          <div className="text-answer-stack">
            <label className="big-input-wrap hobby-input">
              <span className="input-symbol">✧</span>
              <input
                maxLength={70}
                value={draft.hobby}
                onChange={(event) => update('hobby', event.target.value)}
                placeholder="For example: drawing, gaming, baking, music..."
                aria-label="A hobby you would like to make room for"
              />
            </label>
            <button className="quiet-answer-button" type="button" onClick={() => update('hobby', '')}>
              I’m still discovering what I enjoy
            </button>
            <p className="answer-hint">A hobby side quest is for joy, not another way to measure your worth.</p>
          </div>
        );

      case 'why':
        return (
          <div className="text-answer-stack">
            <label className="textarea-answer">
              <span>A note to your future self</span>
              <textarea
                rows="4"
                maxLength={180}
                value={draft.why}
                onChange={(event) => update('why', event.target.value)}
                placeholder="What would you like to remember when this gets difficult?"
              />
              <small>This one is optional.</small>
            </label>
            <button className="quiet-answer-button" type="button" onClick={goForward}>
              Skip this question
            </button>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <main className="wizard-page">
      <div className="wizard-topline">
        <button className="text-link" type="button" onClick={goBack}>
          ← {stepIndex === 0 ? 'Back to title' : 'Previous question'}
        </button>
        <span>YOUR ORIGIN STORY</span>
        <span>{String(stepIndex + 1).padStart(2, '0')} / {STEPS.length}</span>
      </div>

      <div className="wizard-progress">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="wizard-layout">
        <section className="question-panel">
          <span className="eyebrow question-eyebrow">{step.eyebrow}</span>
          <h1>{step.key === 'goal' ? prompt.label : step.title}</h1>
          <p className="question-subtitle">{step.subtitle}</p>

          <div className="answer-area">{renderAnswer()}</div>

          {error && <div className="form-error">{error}</div>}

          <div className="question-controls">
            <button className="back-control" type="button" onClick={goBack}>
              ← Back
            </button>
            <button className="button button-primary" type="button" onClick={goForward}>
              {stepIndex === STEPS.length - 1 ? 'Meet my companion' : 'Continue'}
              <span>→</span>
            </button>
          </div>
        </section>

        <aside className="origin-preview">
          <div className="origin-preview-top">
            <span className="eyebrow">YOUR WORLD IS TAKING SHAPE</span>
            <span className="preview-orbit-mark">✧</span>
          </div>
          <div className="origin-art">
            <div className="origin-art-glow" />
            <Companion profile={{ ...draft, primaryGoal }} level={1} />
          </div>
          <div className="origin-character">
            <div>
              <small>{hero.title}</small>
              <h2>{hero.name}</h2>
            </div>
            <span>LEVEL 01</span>
          </div>
          <p className="origin-line">{hero.line}</p>
          <div className="origin-summary">
            <div><span>YOUR FIRST REALM</span><strong>{hero.realm}</strong></div>
            <div><span>YOUR MAIN QUEST</span><strong>{getAreaName(primaryGoal)}</strong></div>
            <div><span>YOUR SIDE QUEST</span><strong>{draft.hobby || 'A hobby waiting to be named'}</strong></div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SignaturePad({ onChange }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 7;
    context.strokeStyle = '#f1d390';
    context.fillStyle = '#f1d390';
  }, []);

  function getPoint(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  }

  function begin(event) {
    event.preventDefault();

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const point = getPoint(event);

    canvas.setPointerCapture?.(event.pointerId);
    drawingRef.current = true;

    context.beginPath();
    context.arc(point.x, point.y, 4, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(point.x, point.y);
  }

  function draw(event) {
    if (!drawingRef.current) return;
    event.preventDefault();

    const context = canvasRef.current.getContext('2d');
    const point = getPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  }

  function finish(event) {
    if (!drawingRef.current) return;

    drawingRef.current = false;
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
      <div className="signature-canvas-wrap">
        <canvas
          ref={canvasRef}
          width="1200"
          height="300"
          onPointerDown={begin}
          onPointerMove={draw}
          onPointerUp={finish}
          onPointerCancel={finish}
          aria-label="Draw your signature"
        />
        {!hasInk && <div className="signature-placeholder">Draw your signature with a finger or mouse</div>}
        <div className="signature-baseline" />
      </div>
      <div className="signature-tools">
        <span>{hasInk ? 'Your mark is recorded.' : 'A drawn mark is needed to seal the oath.'}</span>
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
  const hero = getArchetype(profile);

  function begin() {
    if (!signature) {
      setError('Draw your mark before sealing the oath.');
      return;
    }

    if (!accepted) {
      setError('Confirm that you understand the quest and ward rules.');
      return;
    }

    onBegin({ duration, stake, signature });
  }

  return (
    <main>
      <div className="page-heading">
        <div>
          <span className="eyebrow">THE LIVING OATH · PAGE TWO</span>
          <h1>Choose the shape of <em>your chapter.</em></h1>
          <p>Make a promise you can return to—not a demand for perfect days.</p>
        </div>
        <button className="text-link" type="button" onClick={onEdit}>← Revisit your origin</button>
      </div>

      <div className="contract-layout">
        <div className="contract-stack">
          <section className="panel form-panel">
            <div className="panel-heading">
              <span className="section-glyph">I</span>
              <div><h2>How long is this chapter?</h2><p>Pick the length of the adventure ahead.</p></div>
            </div>
            <div className="duration-grid">
              {[7, 21, 30].map((days) => (
                <button
                  className={`duration-card ${duration === days ? 'selected' : ''}`}
                  type="button"
                  key={days}
                  aria-pressed={duration === days}
                  onClick={() => setDuration(days)}
                >
                  <strong>{days}</strong>
                  <span>days</span>
                  <small>{days === 7 ? 'The first spark' : days === 21 ? 'Find your rhythm' : 'A longer legend'}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="panel form-panel">
            <div className="panel-heading">
              <span className="section-glyph">II</span>
              <div><h2>Choose your warding</h2><p>These are in-app rules. No money or real-world punishments.</p></div>
            </div>
            <div className="stake-grid">
              {Object.entries(STAKES).map(([key, option]) => (
                <button
                  className={`stake-card ${stake === key ? 'selected' : ''}`}
                  type="button"
                  key={key}
                  aria-pressed={stake === key}
                  onClick={() => setStake(key)}
                >
                  <span className="stake-symbol">{option.symbol}</span>
                  <strong>{option.name}</strong>
                  <span>{option.subtitle}</span>
                  <small>{option.detail}</small>
                </button>
              ))}
            </div>
            <div className="ward-explainer">
              <span>!</span>
              <p>Seal a day with fewer than half its quests completed and one ward stone is used. With no wards left, your chosen stake deducts XP.</p>
            </div>
          </section>

          <section className="panel form-panel">
            <div className="panel-heading">
              <span className="section-glyph">III</span>
              <div><h2>Write your name into the story</h2><p>Sign with a finger or mouse to seal your promise.</p></div>
            </div>

            <div className="oath-paper">
              <span className="mini-label">THE LIVING OATH</span>
              <p>
                I, <strong>{profile.name}</strong>, will give myself a fair chance for
                <strong> {duration} days</strong>. I will take one small step at a time.
                If a day does not go to plan, I can return when I am ready.
              </p>
            </div>

            <SignaturePad onChange={(value) => { setSignature(value); setError(''); }} />

            <label className="oath-checkbox">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => { setAccepted(event.target.checked); setError(''); }}
              />
              <span className="custom-checkbox">✓</span>
              <span>I understand the quest, ward, and XP rules. I accept this chapter.</span>
            </label>
          </section>

          {error && <div className="form-error">{error}</div>}

          <div className="contract-submit">
            <span>Your story stays in this browser.</span>
            <button className="button button-primary" type="button" onClick={begin}>Seal the oath <span>✦</span></button>
          </div>
        </div>

        <aside className="contract-aside">
          <section className="panel oath-preview">
            <span className="eyebrow">YOUR COMPANION</span>
            <Companion profile={profile} level={1} />
            <h2>{hero.name}</h2>
            <p>{hero.title}</p>
            <div className="preview-divider" />
            <div className="oath-preview-row"><span>CHAPTER LENGTH</span><strong>{duration} days</strong></div>
            <div className="oath-preview-row"><span>WARD STONES</span><strong>{STAKES[stake].wards}</strong></div>
            <div className="oath-preview-row"><span>FIRST REALM</span><strong>{hero.realm}</strong></div>
            <blockquote>{hero.line}</blockquote>
          </section>
          <div className="aside-note"><span>✧</span><p>Complete all three daily quests to claim a +20 XP chapter bonus.</p></div>
        </aside>
      </div>
    </main>
  );
}

function CompanionPanel({ profile, challenge }) {
  const hero = getArchetype(profile);
  const level = getLevel(challenge.xp);
  const currentLevelXP = challenge.xp % XP_PER_LEVEL;
  const progress = (currentLevelXP / XP_PER_LEVEL) * 100;
  const remaining = XP_PER_LEVEL - currentLevelXP;

  return (
    <section className="panel companion-panel">
      <div className="companion-stage">
        <div className="companion-stage-orbit" />
        <Companion profile={profile} level={level} />
        <span className="companion-stage-label">YOUR LOREBOUND COMPANION</span>
      </div>

      <div className="companion-details">
        <div className="companion-name-row">
          <div><h2>{hero.name}</h2><p>{hero.title}</p></div>
          <div className="level-badge"><small>LVL</small><strong>{level}</strong></div>
        </div>
        <p className="companion-quote">{hero.line}</p>

        <div className="xp-label"><span>LORE XP · LEVEL {level}</span><span>{currentLevelXP} / {XP_PER_LEVEL}</span></div>
        <div className="xp-bar"><span style={{ width: `${progress}%` }} /></div>
        <div className="xp-caption"><span>{challenge.xp} total XP</span><span>{remaining} XP to level up</span></div>

        <p className="evolution-hint">
          {level >= 7
            ? 'Your companion wears the star crown.'
            : level >= 5
              ? 'The cape is yours. The crown is still ahead.'
              : level >= 3
                ? 'Your companion has earned their first relic gear.'
                : 'Keep earning XP to uncover your companion’s next form.'}
        </p>

        <div className="evolution-track">
          {[{ level: 3, name: 'Relic gear' }, { level: 5, name: 'Cape + aura' }, { level: 7, name: 'Star crown' }].map((stage) => (
            <div className={`evolution-step ${level >= stage.level ? 'unlocked' : ''}`} key={stage.level}>
              <span>{level >= stage.level ? '✓' : stage.level}</span>
              <small>LEVEL {stage.level}<b>{stage.name}</b></small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuestCard({ quest, completed, locked, onClick }) {
  return (
    <button
      className={`mission-card tone-${quest.tone} ${completed ? 'mission-complete' : ''}`}
      type="button"
      disabled={locked}
      aria-pressed={completed}
      onClick={onClick}
    >
      <span className="mission-watermark" aria-hidden="true">{quest.symbol}</span>
      <span className="mission-topline">
        <span>{quest.kicker}</span>
        <i>{completed ? '✓' : '＋'}</i>
      </span>
      <span className="mission-content">
        <strong>{quest.title}</strong>
        <span className="mission-description">{quest.detail}</span>
      </span>
      <span className="mission-footer">
        <span>◷ {quest.minutes} MIN</span>
        <span>✦ +{quest.xp} XP</span>
        <span className="mission-complete-label">{completed ? 'COMPLETE' : 'TAP TO COMPLETE'}</span>
      </span>
    </button>
  );
}

function DayOutcome({ result, currentDay, duration, onNext, onResults }) {
  let message = 'Today’s page is sealed. The story is still yours to continue.';

  if (result.belowHalf && result.shieldUsed) {
    message = `A ward stone softened today’s landing. ${result.shieldsRemaining} ward${result.shieldsRemaining === 1 ? '' : 's'} remain.`;
  } else if (result.belowHalf && result.xpPenalty > 0) {
    message = `No ward stones remained, so ${result.xpPenalty} XP was spent. You can still continue.`;
  } else if (result.belowHalf) {
    message = 'No ward stones remained. Your XP was already at zero, so nothing more could be deducted.';
  } else if (result.perfect) {
    message = 'All three quests complete. The realm grants you a +20 XP chapter bonus.';
  }

  return (
    <div className={`day-outcome ${result.belowHalf ? 'gentle-outcome' : ''}`}>
      <div className="outcome-heading">
        <span className="outcome-sigil">{result.perfect ? '✦' : '✓'}</span>
        <div><span className="eyebrow">PAGE SEALED</span><h3>{result.perfect ? 'Perfect clear.' : 'You showed up.'}</h3></div>
      </div>
      <p>{message}</p>
      <div className="outcome-rewards">
        <div><strong>+{result.questXP}</strong><small>quest XP</small></div>
        {result.bonusXP > 0 && <div><strong>+{result.bonusXP}</strong><small>clear bonus</small></div>}
        {result.shieldUsed && <div><strong>−1</strong><small>ward used</small></div>}
        {result.xpPenalty > 0 && <div className="penalty"><strong>−{result.xpPenalty}</strong><small>XP spent</small></div>}
      </div>
      {currentDay < duration ? (
        <button className="button button-primary" type="button" onClick={onNext}>Turn to day {currentDay + 1} <span>→</span></button>
      ) : (
        <button className="button button-primary" type="button" onClick={onResults}>Open the final chapter <span>↗</span></button>
      )}
    </div>
  );
}

function QuestBoard({ profile, challenge, record, onToggle, onSeal, onNext, onResults }) {
  const quests = useMemo(() => makeQuests(profile, challenge.currentDay), [profile, challenge.currentDay]);
  const completed = record.completed || [];
  const completedCount = quests.filter((quest) => completed.includes(quest.id)).length;
  const completeAll = completedCount === quests.length;

  return (
    <section className="panel quest-panel">
      <div className="quest-heading">
        <div className="quest-heading-symbol">✦</div>
        <div>
          <span className="eyebrow">TODAY’S TRIALS · DAY {challenge.currentDay}</span>
          <h2>Three small asks from the realm.</h2>
          <p>Choose a card. Complete what you can. Your next step still counts.</p>
        </div>
        <div className="quest-counter"><strong>{completedCount}</strong><span>/ 3</span></div>
      </div>

      <div className="quest-progress-label"><span>DAILY QUESTS</span><span>{Math.round((completedCount / quests.length) * 100)}%</span></div>
      <div className="quest-progress"><span style={{ width: `${(completedCount / quests.length) * 100}%` }} /></div>

      <div className="mission-list">
        {quests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            completed={completed.includes(quest.id)}
            locked={record.locked}
            onClick={() => onToggle(quest.id)}
          />
        ))}
      </div>

      {!record.locked ? (
        <>
          <div className={`bonus-banner ${completeAll ? 'bonus-ready' : ''}`}>
            <span>{completeAll ? '✦' : '＋'}</span>
            <p>{completeAll ? 'All three quests are complete. Seal the page to claim +20 bonus XP.' : 'Complete all three quests to claim a +20 XP clear bonus.'}</p>
          </div>
          <div className="seal-day-row">
            <div><strong>Ready to close today’s page?</strong><small>Fewer than half complete uses a ward. No wards left means an XP deduction.</small></div>
            <button className="button button-primary" type="button" onClick={onSeal}>Seal today <span>→</span></button>
          </div>
        </>
      ) : (
        <DayOutcome
          result={record.result}
          currentDay={challenge.currentDay}
          duration={challenge.duration}
          onNext={onNext}
          onResults={onResults}
        />
      )}
    </section>
  );
}

function StatPanel({ challenge }) {
  return (
    <section className="panel side-panel">
      <div className="side-panel-heading">
        <div><span className="eyebrow">PLAYER ATTRIBUTES</span><h3>Your stats are growing.</h3></div>
        <span className="side-symbol">⌘</span>
      </div>
      <p className="side-copy">Each completed quest adds strength to the attribute it calls on.</p>
      <div className="stat-list">
        {STAT_ITEMS.map((item) => {
          const value = Math.round(challenge.stats[item.key] || 0);
          const starting = Math.round(challenge.initialStats[item.key] || 0);
          const change = value - starting;

          return (
            <div className="stat-row" key={item.key}>
              <div className="stat-title"><span><i>{item.symbol}</i>{item.name}</span><strong>{value}<small>/100</small></strong></div>
              <div className="stat-track"><span style={{ width: `${value}%` }} /></div>
              <small className="stat-delta">{change > 0 ? `+${change} since your first page` : 'Your starting point'}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WardPanel({ challenge }) {
  const stake = STAKES[challenge.stake] || STAKES.steady;

  return (
    <section className="panel side-panel">
      <div className="side-panel-heading">
        <div><span className="eyebrow">YOUR LIVING OATH</span><h3>{stake.name} warding</h3></div>
        <span className="side-symbol">{stake.symbol}</span>
      </div>
      <div className="contract-line"><span>CHAPTER</span><strong>{challenge.duration} days</strong></div>
      <div className="ward-line"><span>WARD STONES REMAINING</span><strong>{challenge.shields}</strong></div>
      <div className="ward-stones">
        {Array.from({ length: stake.wards }, (_, index) => (
          <span className={index < challenge.shields ? 'ward-live' : 'ward-spent'} key={index}>◆</span>
        ))}
      </div>
      <p className="side-copy">A ward softens a difficult day. When none remain, your stake applies its XP rule.</p>
      {challenge.signature && (
        <div className="saved-signature">
          <span className="mini-label">YOUR MARK ON THE OATH</span>
          <img src={challenge.signature} alt="Your signature on the challenge oath" />
        </div>
      )}
    </section>
  );
}

function AdventureMap({ challenge }) {
  const days = Array.from({ length: challenge.duration }, (_, index) => index + 1);
  const sealedDays = Object.values(challenge.days || {}).filter((day) => day?.locked).length;

  return (
    <section className="panel map-panel">
      <div className="side-panel-heading">
        <div><span className="eyebrow">THE MAP OF THIS CHAPTER</span><h3>One page at a time.</h3></div>
        <span className="side-symbol">↗</span>
      </div>
      <p className="side-copy">{sealedDays} of {challenge.duration} pages sealed.</p>
      <div className="day-map">
        {days.map((day) => {
          const sealed = Boolean(challenge.days?.[day]?.locked);
          const current = day === challenge.currentDay && !sealed;
          const upcoming = day > challenge.currentDay;

          return (
            <span
              key={day}
              className={`day-token ${sealed ? 'sealed' : ''} ${current ? 'current' : ''} ${upcoming ? 'upcoming' : ''}`}
              title={`Day ${day}${sealed ? ' · sealed' : current ? ' · current' : ' · ahead'}`}
            >
              {sealed ? '✓' : day}
            </span>
          );
        })}
      </div>
    </section>
  );
}

function DashboardScreen({ profile, challenge, onToggle, onSeal, onNext, onResults }) {
  const record = challenge.days?.[challenge.currentDay] || { completed: [], locked: false, result: null };
  const quests = useMemo(() => makeQuests(profile, challenge.currentDay), [profile, challenge.currentDay]);
  const completedCount = quests.filter((quest) => record.completed?.includes(quest.id)).length;
  const level = getLevel(challenge.xp);
  const toLevel = XP_PER_LEVEL - (challenge.xp % XP_PER_LEVEL);
  const hero = getArchetype(profile);

  return (
    <main className="dashboard">
      <section className="day-header">
        <div className="day-header-main">
          <div className="game-pills">
            <span>✦ {challenge.xp} XP</span>
            <span>♜ LEVEL {level}</span>
            <span className="realm-pill">{hero.realm}</span>
          </div>
          <h1>DAY <strong>{String(challenge.currentDay).padStart(2, '0')}</strong><span>/{challenge.duration}</span></h1>
          <p>{completedCount} of 3 quests completed · {toLevel} XP until your next level.</p>
        </div>
        <div className="day-header-emblem">✧</div>
      </section>

      <div className="dashboard-grid">
        <div className="main-column">
          <CompanionPanel profile={profile} challenge={challenge} />
          <QuestBoard
            profile={profile}
            challenge={challenge}
            record={record}
            onToggle={onToggle}
            onSeal={onSeal}
            onNext={onNext}
            onResults={onResults}
          />
          <AdventureMap challenge={challenge} />
        </div>

        <aside className="side-column">
          <StatPanel challenge={challenge} />
          <WardPanel challenge={challenge} />
          <section className="panel why-panel">
            <span className="eyebrow">A NOTE FROM YOUR FIRST PAGE</span>
            <div>“</div>
            <p>{profile.why || 'You decided this chapter was worth beginning.'}</p>
            <small>— {profile.name}</small>
          </section>
          <div className="gentle-note"><span>✧</span><p>A missed quest is a clue, not a verdict. Make the next step smaller and return when you can.</p></div>
        </aside>
      </div>
    </main>
  );
}

function ResultsScreen({ profile, challenge, onNewStory }) {
  const hero = getArchetype(profile);
  const level = getLevel(challenge.xp);
  const sealed = Object.values(challenge.days || {}).filter((day) => day?.locked);
  const perfect = sealed.filter((day) => day.result?.perfect).length;

  return (
    <main className="results-page">
      <section className="results-heading">
        <span className="eyebrow">ONE CHAPTER ENDS · THE NEXT IS YOURS</span>
        <h1>Look at the story <em>you made.</em></h1>
        <p>You did not become a different person. You made a trail of proof that you can take a next step.</p>
      </section>

      <section className="panel transformation-panel">
        <div className="transformation-heading">
          <div><span className="eyebrow">THE BEFORE &amp; AFTER</span><h2>Your companion’s next form.</h2></div>
          <span className="chapter-complete">✦ CHAPTER COMPLETE</span>
        </div>

        <div className="before-after">
          <div className="form-stage">
            <span className="eyebrow">DAY 0 · FIRST PAGE</span>
            <Companion profile={profile} level={1} />
            <h3>{hero.name}</h3><p>{hero.title}</p><small>LEVEL 1 · WANDERER</small>
          </div>
          <div className="transform-arrow"><span>→</span><small>{challenge.xp} XP</small></div>
          <div className="form-stage after-stage">
            <span className="eyebrow">DAY {challenge.duration} · NEW FORM</span>
            <Companion profile={profile} level={level} />
            <h3>{hero.name}</h3><p>{hero.title}</p>
            <small>LEVEL {level} · {level >= 7 ? 'CROWNED' : level >= 5 ? 'AWAKENED' : level >= 3 ? 'GEARED' : 'GROWING'}</small>
          </div>
        </div>

        <div className="evolution-message">
          <span>✧</span>
          {level >= 7
            ? 'Relic gear, cape, aura, and star crown are yours.'
            : level >= 5
              ? 'Your gear, cape, and aura are yours. The crown awaits another chapter.'
              : level >= 3
                ? 'Your companion earned their first relic gear. The next form is waiting.'
                : 'Your first chapter is complete. Continue earning XP to unlock your companion’s next form.'}
        </div>
      </section>

      <div className="results-grid">
        <section className="panel results-panel">
          <span className="eyebrow">PLAYER ATTRIBUTES</span>
          <h2>Your first page → now.</h2>
          <div className="compare-legend"><span><i /> First page</span><span><b /> Now</span></div>
          <div className="compare-list">
            {STAT_ITEMS.map((item) => {
              const before = Math.round(challenge.initialStats[item.key] || 0);
              const after = Math.round(challenge.stats[item.key] || before);
              const change = after - before;

              return (
                <div className="compare-row" key={item.key}>
                  <div><span>{item.symbol} {item.name}</span><strong>{before} <i>→</i> {after}</strong></div>
                  <div className="compare-bars">
                    <span className="before-bar"><i style={{ width: `${before}%` }} /></span>
                    <span className="after-bar"><i style={{ width: `${after}%` }} /></span>
                  </div>
                  <small>{change > 0 ? `+${change} growth` : 'Your starting point held steady'}</small>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel recap-panel">
          <span className="eyebrow">THE CHAPTER RECAP</span>
          <h2>{profile.name}, you kept moving.</h2>
          <div className="recap-grid">
            <div><strong>{sealed.length}/{challenge.duration}</strong><span>pages sealed</span></div>
            <div><strong>{perfect}</strong><span>perfect clears</span></div>
            <div><strong>{challenge.totalQuestsCompleted || 0}</strong><span>quests completed</span></div>
            <div><strong>{challenge.xp}</strong><span>final XP</span></div>
          </div>
          <div className="recap-note">
            <span className="mini-label">YOUR ORIGINAL WHY</span>
            <p>{profile.why || 'You decided taking the first step was worth it.'}</p>
          </div>
          <p className="recap-ending">Keep what worked. Change what didn’t. The next page is yours.</p>
        </section>
      </div>

      <div className="results-action">
        <button className="button button-primary button-large" type="button" onClick={onNewStory}>Begin a new story <span>↗</span></button>
        <small>Your progress stays on this device until you start over.</small>
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
      const finalDaySealed = day >= saved.challenge.duration && saved.challenge.days?.[day]?.locked;
      return finalDaySealed ? 'codex' : 'realm';
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
      // The app still works if browser storage is unavailable.
    }
  }, [profile, challenge]);

  function startNewStory() {
    if ((profile || challenge) && !window.confirm('Start a new story? Your current profile and challenge will be removed from this browser.')) {
      return;
    }

    setProfile(null);
    setChallenge(null);
    setScreen('landing');
  }

  function finishOrigin(nextProfile) {
    setProfile(nextProfile);
    setChallenge(null);
    setScreen('oath');
  }

  function beginChapter({ duration, stake, signature }) {
    const initialStats = getStartingStats(profile);

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
      signedAt: new Date().toISOString()
    });

    setScreen('realm');
  }

  function toggleQuest(questId) {
    setChallenge((previous) => {
      if (!previous) return previous;

      const day = previous.currentDay;
      const record = previous.days?.[day] || { completed: [], locked: false, result: null };
      if (record.locked) return previous;

      const quest = makeQuests(profile, day).find((item) => item.id === questId);
      if (!quest) return previous;

      const isCompleted = record.completed.includes(questId);
      const completed = isCompleted
        ? record.completed.filter((id) => id !== questId)
        : [...record.completed, questId];
      const direction = isCompleted ? -1 : 1;

      return {
        ...previous,
        xp: Math.max(0, previous.xp + direction * quest.xp),
        stats: {
          ...previous.stats,
          [quest.stat]: Math.min(100, Math.max(0, (previous.stats[quest.stat] || 0) + direction * 4))
        },
        totalQuestsCompleted: Math.max(0, (previous.totalQuestsCompleted || 0) + direction),
        days: {
          ...previous.days,
          [day]: { ...record, completed, locked: false, result: null }
        }
      };
    });
  }

  function sealDay() {
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
        xp: Math.max(0, previous.xp + bonusXP - xpPenalty),
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
      if (!previous) return previous;
      if (previous.currentDay >= previous.duration) return previous;
      if (!previous.days?.[previous.currentDay]?.locked) return previous;

      return { ...previous, currentDay: previous.currentDay + 1 };
    });

    setScreen('realm');
  }

  function viewResults() {
    setScreen('codex');
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <div className="app-frame">
        <Header
          challenge={challenge}
          hasSave={Boolean(profile || challenge)}
          onNewStory={startNewStory}
        />

        {screen === 'landing' && <LandingScreen onStart={() => setScreen('origin')} />}

        {screen === 'origin' && (
          <OnboardingScreen
            initialProfile={profile}
            onComplete={finishOrigin}
            onExit={() => setScreen(profile ? 'oath' : 'landing')}
          />
        )}

        {screen === 'oath' && profile && (
          <OathScreen
            profile={profile}
            onBegin={beginChapter}
            onEdit={() => setScreen('origin')}
          />
        )}

        {screen === 'realm' && profile && challenge && (
          <DashboardScreen
            profile={profile}
            challenge={challenge}
            onToggle={toggleQuest}
            onSeal={sealDay}
            onNext={nextDay}
            onResults={viewResults}
          />
        )}

        {screen === 'codex' && profile && challenge && (
          <ResultsScreen
            profile={profile}
            challenge={challenge}
            onNewStory={startNewStory}
          />
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

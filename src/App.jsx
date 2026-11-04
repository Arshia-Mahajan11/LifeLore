import { useState, useEffect } from 'react';
import { ARCHETYPES, matchArchetype, generateDynamicQuests, XP_PER_LEVEL } from './data/lore.js';
import '../styles/styles.css';

const STORAGE_KEY = 'winter_arc_lifereset_save_v2';

export default function App() {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [view, setView] = useState(() => (gameState ? 'dashboard' : 'landing'));
  const [qIndex, setQIndex] = useState(0);
  const [dashboardTab, setDashboardTab] = useState('quests');
  const [questSubTab, setQuestSubTab] = useState('todos');
  const [toast, setToast] = useState(null);

  // Signing style states: 'thumb' or 'type'
  const [signStyle, setSignStyle] = useState('thumb');
  const [typedSign, setTypedSign] = useState('');
  const [hasThumbprint, setHasThumbprint] = useState(false);

  const [answers, setAnswers] = useState({
    name: '',
    studyHours: '6',
    goal: 'discipline',
    hobby: '',
    duration: 66,
    skinGlowRating: 3,
    accepted: false
  });

  useEffect(() => {
    if (gameState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  const questions = [
    {
      id: 'name',
      title: 'ENTER YOUR WARRIOR ALIAS',
      subtitle: 'Your name will be inscribed in the Winter Arc Chronicle.',
      render: () => (
        <input
          type="text"
          className="q-input-heroic"
          placeholder="e.g. Manas, Jin, Ethan"
          value={answers.name}
          autoFocus
          onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
        />
      )
    },
    {
      id: 'study',
      title: 'DAILY STUDY & FOCUS QUOTA',
      subtitle: 'Select the extreme study hours you wish to conquer daily.',
      render: () => (
        <div className="study-choice-grid">
          {[
            { hours: '4', label: '4 Hours', desc: 'Standard Academic Arc' },
            { hours: '6', label: '6 Hours', desc: 'Intense Exam / Gate Arc' },
            { hours: '8', label: '8+ Hours', desc: 'Monarch Mode (Extreme Grinder)' }
          ].map((item) => (
            <button
              key={item.hours}
              type="button"
              className={`study-card ${answers.studyHours === item.hours ? 'selected' : ''}`}
              onClick={() => setAnswers({ ...answers, studyHours: item.hours })}
            >
              <strong className="study-h">{item.label}</strong>
              <span className="study-d">{item.desc}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'goal',
      title: 'YOUR PRIMARY ANIME INSPIRATION',
      subtitle: 'This summons your personal combat archetype.',
      render: () => (
        <div className="focus-grid">
          {[
            { key: 'discipline', label: 'Sung Jin-woo', anime: 'Solo Leveling', sub: 'Pure Solo Discipline' },
            { key: 'strength', label: 'Ippo Makunouchi', anime: 'Hajime no Ippo', sub: 'Brutal Strength & Gym' },
            { key: 'focus', label: 'Yoichi Isagi', anime: 'Blue Lock', sub: 'Ego & Cognitive Focus' },
            { key: 'mindset', label: 'Hinata Shoyo', anime: 'Haikyuu!!', sub: 'Limitless Confidence' }
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              className={`focus-card ${answers.goal === f.key ? 'selected' : ''}`}
              onClick={() => setAnswers({ ...answers, goal: f.key })}
            >
              <strong>{f.label}</strong>
              <small className="anime-name">{f.anime}</small>
              <span className="focus-sub">{f.sub}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'hobby',
      title: 'A HOBBY YOU WILL REFUSE TO ABANDON',
      subtitle: 'Keep your mind creative and resilient under intense load.',
      render: () => (
        <input
          type="text"
          className="q-input-heroic"
          placeholder="e.g. Coding, Piano, Sketching, Chess"
          value={answers.hobby}
          onChange={(e) => setAnswers({ ...answers, hobby: e.target.value })}
        />
      )
    },
    {
      id: 'oath',
      title: 'THE PARCHMENT COVENANT',
      subtitle: 'Seal with your thumbprint or signature to bind your words.',
      render: () => {
        const assigned = matchArchetype(answers.goal);
        return (
          <div className="parchment-scroll">
            <div className="scroll-inner">
              <span className="scroll-ornament">⚜ THE WINTER OATH ⚜</span>
              <p className="scroll-text">
                Be it known that <strong>{answers.name || 'The Seeker'}</strong> enters the ancient{' '}
                <strong>{answers.duration}-Day Winter Arc</strong> under the guidance of{' '}
                <em>{assigned.name}</em>. Daily promises shall be fulfilled: {answers.studyHours} hours of focused pursuit, relentless physical conditioning, and skin clarity.
              </p>

              <div className="arc-selector-row">
                {[14, 21, 66].map((days) => (
                  <button
                    key={days}
                    type="button"
                    className={`scroll-chip ${answers.duration === days ? 'active' : ''}`}
                    onClick={() => setAnswers({ ...answers, duration: days })}
                  >
                    {days} Days
                  </button>
                ))}
              </div>

              {/* Signing options: Thumbprint stamp or Calligraphy Typing */}
              <div className="seal-type-tabs">
                <button
                  type="button"
                  className={signStyle === 'thumb' ? 'active' : ''}
                  onClick={() => setSignStyle('thumb')}
                >
                  Blood/Wax Thumbprint
                </button>
                <button
                  type="button"
                  className={signStyle === 'type' ? 'active' : ''}
                  onClick={() => setSignStyle('type')}
                >
                  Ancient Script Signature
                </button>
              </div>

              {signStyle === 'thumb' ? (
                <div
                  className={`wax-thumbprint-zone ${hasThumbprint ? 'stamped' : ''}`}
                  onClick={() => setHasThumbprint(true)}
                >
                  {hasThumbprint ? (
                    <div className="blood-thumbprint">
                      <span className="thumb-lines"></span>
                      <small>BOUND BY BLOOD</small>
                    </div>
                  ) : (
                    <span className="press-thumb-prompt">Press & Hold Thumb to Stamp Wax Seal</span>
                  )}
                </div>
              ) : (
                <div className="vintage-type-zone">
                  <input
                    type="text"
                    className="calligraphy-input"
                    placeholder="Inscribe your signature..."
                    value={typedSign}
                    onChange={(e) => setTypedSign(e.target.value)}
                  />
                </div>
              )}

              <label className="scroll-agree">
                <input
                  type="checkbox"
                  checked={answers.accepted}
                  onChange={(e) => setAnswers({ ...answers, accepted: e.target.checked })}
                />
                <span>I solemnly accept this contract. No excuses.</span>
              </label>
            </div>
          </div>
        );
      }
    }
  ];

  function nextQuestion() {
    if (questions[qIndex].id === 'name' && !answers.name.trim()) {
      return alert('Please enter your player name.');
    }
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      if (signStyle === 'thumb' && !hasThumbprint) {
        return alert('Please stamp your thumbprint on the wax seal.');
      }
      if (signStyle === 'type' && !typedSign.trim()) {
        return alert('Please inscribe your signature in script.');
      }
      if (!answers.accepted) {
        return alert('Please check the confirmation box.');
      }

      const hero = matchArchetype(answers.goal);
      setGameState({
        player: answers.name.trim(),
        day: 1,
        totalDays: answers.duration,
        streak: 1,
        trophies: 3,
        xp: 320,
        level: 2,
        heroKey: hero.id,
        goal: answers.goal,
        hobby: answers.hobby,
        studyHours: answers.studyHours,
        glowLevel: 78, // Skin Care Glow-up metric
        completedQuestIds: [],
        ratings: {
          WISDOM: 55,
          CONFIDENCE: 114,
          STRENGTH: 130,
          DISCIPLINE: 180,
          FOCUS: 195
        }
      });
      setView('dashboard');
    }
  }

  function prevQuestion() {
    if (qIndex > 0) setQIndex(qIndex - 1);
    else setView('landing');
  }

  function toggleQuest(quest) {
    const isDone = gameState.completedQuestIds.includes(quest.id);

    if (isDone) {
      setGameState((prev) => ({
        ...prev,
        completedQuestIds: prev.completedQuestIds.filter((id) => id !== quest.id),
        xp: Math.max(0, prev.xp - quest.xp),
        ratings: {
          ...prev.ratings,
          [quest.stat]: Math.max(20, (prev.ratings[quest.stat] || 50) - 4)
        }
      }));
    } else {
      const nextXP = gameState.xp + quest.xp;
      const nextLevel = Math.floor(nextXP / XP_PER_LEVEL) + 1;

      setGameState((prev) => ({
        ...prev,
        completedQuestIds: [...prev.completedQuestIds, quest.id],
        xp: nextXP,
        level: nextLevel,
        glowLevel: quest.glowUp ? Math.min(100, prev.glowLevel + 6) : prev.glowLevel,
        ratings: {
          ...prev.ratings,
          [quest.stat]: (prev.ratings[quest.stat] || 50) + 5
        }
      }));

      setToast({
        xp: quest.xp,
        stat: quest.stat,
        glow: quest.glowUp ? '+6% Skin Glow' : null
      });
      setTimeout(() => setToast(null), 2500);
    }
  }

  function resetGame() {
    if (window.confirm('Reset this arc and choose a new character?')) {
      localStorage.removeItem(STORAGE_KEY);
      setGameState(null);
      setView('landing');
      setQIndex(0);
      setHasThumbprint(false);
      setTypedSign('');
    }
  }

  // --- SCREEN 1: LANDING ---
  if (view === 'landing') {
    return (
      <div className="mobile-frame">
        <div className="landing-layout">
          <div className="landing-badge">✦ WINTER ARC RPG</div>
          <h1 className="landing-title">START YOUR OWN<br /><span>WINTER ARC</span></h1>
          <p className="landing-desc">Heavy study arcs, physical looksmaxing, and character awakenings.</p>
          <div className="landing-hero-box">
            <img
              src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"
              alt="Winter Arc Character"
            />
          </div>
          <button className="primary-pill-btn" onClick={() => setView('wizard')}>
            ENTER THE PROTOCOL →
          </button>
        </div>
      </div>
    );
  }

  // --- SCREEN 2: COMPACT 1-QUESTION-AT-A-TIME WIZARD ---
  if (view === 'wizard') {
    const curQ = questions[qIndex];
    const progress = ((qIndex + 1) / questions.length) * 100;

    return (
      <div className="mobile-frame wizard-mode">
        <div className="wizard-top-nav">
          <button className="back-link" onClick={prevQuestion}>‹ Back</button>
          <span className="step-counter">STEP {qIndex + 1} OF {questions.length}</span>
        </div>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Compact tight container with zero wasted gap */}
        <div className="compact-q-wrapper">
          <span className="phase-tag">WINTER PROTOCOL</span>
          <h2 className="q-title-large">{curQ.title}</h2>
          <p className="q-subtitle-clean">{curQ.subtitle}</p>

          <div className="q-render-area">{curQ.render()}</div>
        </div>

        <button className="primary-pill-btn continue-btn-tight" onClick={nextQuestion}>
          {qIndex === questions.length - 1 ? 'SEAL COVENANT & AWAKEN →' : 'CONTINUE →'}
        </button>
      </div>
    );
  }

  // --- SCREEN 3: DASHBOARD ---
  const activeHero = Object.values(ARCHETYPES).find((h) => h.id === gameState.heroKey) || ARCHETYPES.discipline;
  const quests = generateDynamicQuests(gameState.level, gameState.studyHours, gameState.hobby);
  const todoQuests = quests.filter((q) => !gameState.completedQuestIds.includes(q.id));
  const doneQuests = quests.filter((q) => gameState.completedQuestIds.includes(q.id));

  let heroImage = activeHero.stages.base;
  let stageName = 'Base Level';
  let auraGlow = 'glow-base';

  if (gameState.level >= 6) {
    heroImage = activeHero.stages.monarch;
    stageName = 'Monarch Awakening';
    auraGlow = 'glow-monarch';
  } else if (gameState.level >= 3) {
    heroImage = activeHero.stages.awakened;
    stageName = 'Awakened State';
    auraGlow = 'glow-awakened';
  }

  const currentLevelXP = gameState.xp % XP_PER_LEVEL;

  return (
    <div className="mobile-frame">
      {toast && (
        <div className="toast-float">
          <div className="toast-card">
            <span className="toast-tag">XP EARNED</span>
            <div className="toast-row">
              <span className="toast-arrow">▲</span>
              <strong>+{toast.xp}</strong>
            </div>
            <div className="toast-sub">
              <span>{toast.stat}</span>
              <strong>+5 pts</strong>
            </div>
            {toast.glow && <div className="toast-glow-boost">{toast.glow}</div>}
          </div>
        </div>
      )}

      {/* Switcher */}
      <div className="top-tab-switcher">
        <button
          className={`switch-btn ${dashboardTab === 'quests' ? 'active' : ''}`}
          onClick={() => setDashboardTab('quests')}
        >
          DAILY QUESTS
        </button>
        <button
          className={`switch-btn ${dashboardTab === 'progress' ? 'active' : ''}`}
          onClick={() => setDashboardTab('progress')}
        >
          PROGRESS & GLOW
        </button>
      </div>

      {dashboardTab === 'quests' ? (
        <>
          <div className="status-metrics">
            <div className="pill-group">
              <span className="metric-pill pill-orange">🔥 {gameState.streak}</span>
              <span className="metric-pill pill-green">🏆 {gameState.trophies}</span>
              <span className="metric-pill pill-amber">✦ {gameState.xp}</span>
            </div>
            <button className="reset-circle" onClick={resetGame} title="Reset Arc">↻</button>
          </div>

          <div className="day-header-row">
            <h1>DAY {gameState.day} <span>/{gameState.totalDays}</span></h1>
            <div className="day-nav-btns">
              <button>‹</button>
              <button>›</button>
            </div>
          </div>

          {/* Player Anime Card */}
          <div className="hero-card">
            <div className="hero-card-left">
              <h2 className="player-tag">{gameState.player}</h2>
              <div className="lvl-badge-row">
                <span className="lvl-tag">LV</span>
                <span className="lvl-num">{gameState.level}</span>
              </div>

              <div className="segmented-gauge">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span
                    key={i}
                    className={`gauge-notch ${i < Math.round((currentLevelXP / XP_PER_LEVEL) * 16) ? 'filled' : ''}`}
                  />
                ))}
              </div>
              <div className="gauge-label">{XP_PER_LEVEL - currentLevelXP} XP to Level {gameState.level + 1}</div>

              <div className="mini-stats-grid">
                <div><span>CON</span><b>{gameState.ratings.DISCIPLINE}</b></div>
                <div><span>FOC</span><b>{gameState.ratings.FOCUS}</b></div>
                <div><span>STR</span><b>{gameState.ratings.STRENGTH}</b></div>
                <div><span>GLOW</span><b>{gameState.glowLevel}%</b></div>
              </div>
            </div>

            <div className="hero-card-right">
              <div className={`avatar-aura ${auraGlow}`} style={{ '--aura': activeHero.auraColor }}>
                <img src={heroImage} alt={activeHero.name} className="hero-photo" />
              </div>
              <span className="tier-tag">BRONZE V</span>
            </div>
          </div>

          <div className="subtabs-bar">
            <button
              className={`subtab-btn ${questSubTab === 'todos' ? 'active' : ''}`}
              onClick={() => setQuestSubTab('todos')}
            >
              To-dos <span>{todoQuests.length}</span>
            </button>
            <button
              className={`subtab-btn ${questSubTab === 'done' ? 'active' : ''}`}
              onClick={() => setQuestSubTab('done')}
            >
              Done <span>{doneQuests.length}</span>
            </button>
          </div>

          {/* Quests List */}
          <div className="quests-scroll-area">
            {questSubTab === 'todos' &&
              todoQuests.map((q) => (
                <div
                  key={q.id}
                  className="quest-card-item"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(14,14,18,0.2) 0%, rgba(10,10,14,0.94) 80%), url(${q.bg})` }}
                >
                  <div className="quest-details">
                    <h3>{q.title}</h3>
                    <div className="quest-meta-chips">
                      <span>🔁 {q.type}</span>
                      <span>📊 {q.difficulty}</span>
                      <span>⏱ {q.duration}</span>
                      {q.glowUp && <span className="glow-badge">✨ GLOW UP</span>}
                    </div>
                  </div>
                  <button
                    className="quest-checkbox"
                    onClick={() => toggleQuest(q)}
                    aria-label="Mark completed"
                  />
                </div>
              ))}

            {questSubTab === 'done' &&
              doneQuests.map((q) => (
                <div
                  key={q.id}
                  className="quest-card-item completed-card"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(14,14,18,0.5) 0%, rgba(10,10,14,0.96) 80%), url(${q.bg})` }}
                >
                  <div className="quest-details">
                    <h3 className="strikethrough">{q.title}</h3>
                    <div className="quest-meta-chips">
                      <span>COMPLETED</span>
                      <span>+{q.xp} XP</span>
                    </div>
                  </div>
                  <button
                    className="quest-checkbox checked"
                    onClick={() => toggleQuest(q)}
                    aria-label="Undo"
                  >
                    ✓
                  </button>
                </div>
              ))}
          </div>

          <div className="mobile-footer-nav">
            <span className="day-badge">DAY {gameState.day}</span>
            <span>{doneQuests.length} of {quests.length} cleared</span>
            <button
              className="enter-pill"
              onClick={() => {
                setGameState((prev) => ({
                  ...prev,
                  day: Math.min(prev.totalDays, prev.day + 1),
                  streak: prev.streak + 1,
                  completedQuestIds: []
                }));
              }}
            >
              NEXT DAY →
            </button>
          </div>
        </>
      ) : (
        /* --- PROGRESS & SKINCARE GLOW-UP TAB --- */
        <div className="progress-screen">
          <h2 className="rating-main-title">Progress & Looksmaxing</h2>

          {/* Skin Care & Glow Up Card */}
          <div className="glow-up-metric-card">
            <div className="glow-icon-box">✨</div>
            <div className="glow-info">
              <span className="glow-title">Skin Care & Complexion Glow</span>
              <div className="glow-bar-container">
                <div className="glow-bar-fill" style={{ width: `${gameState.glowLevel}%` }} />
              </div>
              <small>{gameState.glowLevel}% Hydrated & Clear</small>
            </div>
          </div>

          <div className="rating-summary-card">
            <div className="rating-box">
              <span className="rating-lvl-tag">LEVEL</span>
              <strong className="rating-lvl-num">{gameState.level}</strong>
            </div>
            <div className="rating-xp-box">
              <strong>{gameState.xp.toLocaleString()}</strong>
              <span>XP earned</span>
            </div>
          </div>

          <div className="rating-stats-list">
            {Object.entries(gameState.ratings).map(([statName, val]) => (
              <div className="rating-row" key={statName}>
                <div className="stat-title-left">
                  <span>{statName}</span>
                </div>
                <div className="stat-val-right">
                  <span className="arrow-up">▲</span>
                  <strong>{val}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

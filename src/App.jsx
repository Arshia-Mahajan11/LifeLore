import { useState, useEffect, useRef } from 'react';
import { ARCHETYPES, matchArchetype, generateDynamicQuests, XP_PER_LEVEL } from './data/lore.js';
import '../styles/styles.css';

const STORAGE_KEY = 'winter_arc_lifereset_save_v1';

function SignaturePad({ onSign }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#00e5ff';
  }, []);

  function getPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((cx - rect.left) / rect.width) * canvasRef.current.width,
      y: ((cy - rect.top) / rect.height) * canvasRef.current.height
    };
  }

  function start(e) {
    drawingRef.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const pt = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
  }

  function draw(e) {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const pt = getPos(e);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    setHasInk(true);
  }

  function finish() {
    drawingRef.current = false;
    onSign(canvasRef.current.toDataURL());
  }

  function clear() {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    onSign('');
  }

  return (
    <div className="sig-container">
      <canvas
        ref={canvasRef}
        width={380}
        height={110}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={finish}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={finish}
      />
      {!hasInk && <span className="sig-placeholder">Draw signature with finger or mouse</span>}
      <button type="button" className="sig-clear-btn" onClick={clear}>Clear</button>
    </div>
  );
}

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

  const [answers, setAnswers] = useState({
    name: '',
    wakeTime: '06:00',
    sleepTime: '23:00',
    goal: 'discipline',
    hobby: '',
    duration: 66,
    signature: '',
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
      title: 'WHAT IS YOUR PLAYER NAME?',
      subtitle: 'Enter your alias for the Winter Arc ranking system.',
      render: () => (
        <input
          type="text"
          className="q-input"
          placeholder="e.g. Manas Yadav, Jin, Ethan"
          value={answers.name}
          onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
        />
      )
    },
    {
      id: 'schedule',
      title: 'WHAT IS YOUR TARGET SCHEDULE?',
      subtitle: 'Your waking hours shape your daily quest triggers.',
      render: () => (
        <div className="time-select-grid">
          <div>
            <label>Wake Up Time</label>
            <input
              type="time"
              className="q-input"
              value={answers.wakeTime}
              onChange={(e) => setAnswers({ ...answers, wakeTime: e.target.value })}
            />
          </div>
          <div>
            <label>In Bed Time</label>
            <input
              type="time"
              className="q-input"
              value={answers.sleepTime}
              onChange={(e) => setAnswers({ ...answers, sleepTime: e.target.value })}
            />
          </div>
        </div>
      )
    },
    {
      id: 'goal',
      title: 'CHOOSE YOUR WINTER ARC FOCUS',
      subtitle: 'This unlocks your personal anime character archetype.',
      render: () => (
        <div className="focus-grid">
          {[
            { key: 'discipline', label: 'Solo Discipline', anime: 'Sung Jin-woo (Solo Leveling)', icon: '⚡' },
            { key: 'strength', label: 'Pure Grit & Gym', anime: 'Ippo (Hajime no Ippo)', icon: '🥊' },
            { key: 'focus', label: 'Deep Work & Strategy', anime: 'Isagi Yoichi (Blue Lock)', icon: '🧠' },
            { key: 'mindset', label: 'Relentless Confidence', anime: 'Hinata (Haikyuu!!)', icon: '🔥' }
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              className={`focus-card ${answers.goal === f.key ? 'selected' : ''}`}
              onClick={() => setAnswers({ ...answers, goal: f.key })}
            >
              <span className="focus-icon">{f.icon}</span>
              <strong>{f.label}</strong>
              <small>{f.anime}</small>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'hobby',
      title: 'WHAT HOBBY WILL YOU PROTECT?',
      subtitle: 'A high-tier habit keeps your mind sharp during tough arcs.',
      render: () => (
        <input
          type="text"
          className="q-input"
          placeholder="e.g. Chess, Coding, Guitar, Sketching"
          value={answers.hobby}
          onChange={(e) => setAnswers({ ...answers, hobby: e.target.value })}
        />
      )
    },
    {
      id: 'oath',
      title: 'SELECT ARC LENGTH & SEAL OATH',
      subtitle: 'Sign your name. Once sealed, daily trials begin.',
      render: () => {
        const assigned = matchArchetype(answers.goal);
        return (
          <div className="oath-step">
            <div className="arc-chips">
              {[14, 21, 66].map((days) => (
                <button
                  type="button"
                  key={days}
                  className={`arc-chip ${answers.duration === days ? 'active' : ''}`}
                  onClick={() => setAnswers({ ...answers, duration: days })}
                >
                  {days} DAYS
                </button>
              ))}
            </div>

            <div className="character-awaken-card">
              <img src={assigned.stages.base} alt={assigned.name} />
              <div>
                <span className="archetype-badge">{assigned.title}</span>
                <h4>{assigned.name}</h4>
                <p>"{assigned.line}"</p>
              </div>
            </div>

            <div className="oath-box">
              <p>
                I, <strong>{answers.name || 'Hunter'}</strong>, commit to this <strong>{answers.duration}-Day Winter Arc</strong>.
                I will clear my daily trials and build unstoppable consistency.
              </p>
              <SignaturePad onSign={(dataUrl) => setAnswers({ ...answers, signature: dataUrl })} />
              <label className="agree-check">
                <input
                  type="checkbox"
                  checked={answers.accepted}
                  onChange={(e) => setAnswers({ ...answers, accepted: e.target.checked })}
                />
                <span>I confirm and bind my signature to this arc.</span>
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
      if (!answers.signature) return alert('Please draw your signature to seal the oath.');
      if (!answers.accepted) return alert('Please check the confirmation box.');

      const hero = matchArchetype(answers.goal);
      setGameState({
        player: answers.name.trim(),
        day: 1,
        totalDays: answers.duration,
        streak: 1,
        trophies: 2,
        xp: 301,
        level: 2,
        heroKey: hero.id,
        goal: answers.goal,
        hobby: answers.hobby,
        completedQuestIds: [],
        ratings: {
          WISDOM: 52,
          CONFIDENCE: 113,
          STRENGTH: 124,
          DISCIPLINE: 175,
          FOCUS: 186
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
        ratings: {
          ...prev.ratings,
          [quest.stat]: (prev.ratings[quest.stat] || 50) + 4
        }
      }));

      setToast({ xp: quest.xp, stat: quest.stat });
      setTimeout(() => setToast(null), 2500);
    }
  }

  function resetGame() {
    if (window.confirm('Reset this arc and choose a new character?')) {
      localStorage.removeItem(STORAGE_KEY);
      setGameState(null);
      setView('landing');
      setQIndex(0);
    }
  }

  if (view === 'landing') {
    return (
      <div className="mobile-frame">
        <div className="landing-layout">
          <div className="landing-badge">✦ WINTER ARC RPG</div>
          <h1 className="landing-title">START YOUR OWN<br /><span>WINTER ARC</span></h1>
          <p className="landing-desc">Turn your goals into daily quests. Awaken an anime alter-ego that evolves as you level up.</p>
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

  if (view === 'wizard') {
    const curQ = questions[qIndex];
    const progress = ((qIndex + 1) / questions.length) * 100;

    return (
      <div className="mobile-frame">
        <div className="wizard-header">
          <button className="back-link" onClick={prevQuestion}>‹ Back</button>
          <span>STEP {qIndex + 1} OF {questions.length}</span>
        </div>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="wizard-body">
          <span className="phase-tag">INITIALIZING ARC</span>
          <h2 className="q-title">{curQ.title}</h2>
          <p className="q-desc">{curQ.subtitle}</p>

          <div className="q-content">{curQ.render()}</div>
        </div>

        <button className="primary-pill-btn" onClick={nextQuestion}>
          {qIndex === questions.length - 1 ? 'AWAKEN & BEGIN ARC →' : 'CONTINUE →'}
        </button>
      </div>
    );
  }

  const activeHero = Object.values(ARCHETYPES).find((h) => h.id === gameState.heroKey) || ARCHETYPES.discipline;
  const quests = generateDynamicQuests(gameState.level, gameState.goal, gameState.hobby);
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
              <strong>+4 pts</strong>
            </div>
          </div>
        </div>
      )}

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
          PROGRESS
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
            <button className="reset-circle" onClick={resetGame} title="Reset">↻</button>
          </div>

          <div className="day-header-row">
            <h1>DAY {gameState.day} <span>/{gameState.totalDays}</span></h1>
            <div className="day-nav-btns">
              <button>‹</button>
              <button>›</button>
            </div>
          </div>

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
                <div><span>WIS</span><b>{gameState.ratings.WISDOM}</b></div>
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
            <button className="subtab-btn disabled">
              Skipped <span>0</span>
            </button>
          </div>

          <div className="quests-scroll-area">
            {questSubTab === 'todos' &&
              todoQuests.map((q) => (
                <div
                  key={q.id}
                  className="quest-card-item"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(14,14,18,0.25) 0%, rgba(10,10,14,0.92) 80%), url(${q.bg})` }}
                >
                  <div className="quest-details">
                    <h3>{q.title}</h3>
                    <div className="quest-meta-chips">
                      <span>🔁 {q.type}</span>
                      <span>📊 {q.difficulty}</span>
                      <span>⏱ {q.duration}</span>
                    </div>
                  </div>
                  <button
                    className="quest-checkbox"
                    onClick={() => toggleQuest(q)}
                    aria-label="Mark done"
                  />
                </div>
              ))}

            {questSubTab === 'done' &&
              doneQuests.map((q) => (
                <div
                  key={q.id}
                  className="quest-card-item completed-card"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(14,14,18,0.5) 0%, rgba(10,10,14,0.95) 80%), url(${q.bg})` }}
                >
                  <div className="quest-details">
                    <h3 className="strikethrough">{q.title}</h3>
                    <div className="quest-meta-chips">
                      <span>COMPLETED</span>
                      <span>+{q.xp} XP AWARDED</span>
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

            {questSubTab === 'todos' && todoQuests.length === 0 && (
              <div className="peak-reached-box">
                <span className="peak-label">— PEAK REACHED —</span>
                <p>Nothing left on the list today.</p>
              </div>
            )}
          </div>

          <div className="mobile-footer-nav">
            <span className="day-badge">DAY {gameState.day}</span>
            <span>{doneQuests.length} of {quests.length} trials cleared</span>
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
              ENTER →
            </button>
          </div>
        </>
      ) : (
        <div className="progress-screen">
          <h2 className="rating-main-title">Your Rating</h2>

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
                  <span className="stat-glyph">
                    {statName === 'FOCUS' ? '◎' : statName === 'DISCIPLINE' ? '🔒' : statName === 'STRENGTH' ? '🏋' : statName === 'CONFIDENCE' ? '🏃' : '🔮'}
                  </span>
                  <span>{statName}</span>
                </div>
                <div className="stat-val-right">
                  <span className="arrow-up">▲</span>
                  <strong>{val}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="quote-banner">
            <p>"{activeHero.line}"</p>
            <small>— {activeHero.name} ({stageName})</small>
          </div>
        </div>
      )}
    </div>
  );
}

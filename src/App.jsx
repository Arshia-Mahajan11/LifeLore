import { useState, useEffect, useRef } from 'react';
import { CHARACTERS, determineCharacter, generateDynamicQuests, XP_PER_LEVEL } from './data/lore.js';
import '../styles/styles.css';

const STORAGE_KEY = 'lifelore_adventure_v3';

function SignaturePad({ onChange }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#00e5ff';
  }, []);

  function getPoint(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvasRef.current.width,
      y: ((clientY - rect.top) / rect.height) * canvasRef.current.height
    };
  }

  function start(e) {
    drawingRef.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const pt = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
  }

  function draw(e) {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const pt = getPoint(e);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    setHasInk(true);
  }

  function stop() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    onChange(canvasRef.current.toDataURL());
  }

  function clear() {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    onChange('');
  }

  return (
    <div className="sig-wrapper">
      <canvas
        ref={canvasRef}
        width={400}
        height={130}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={stop}
      />
      {!hasInk && <span className="sig-hint">Sign your name here with finger/mouse</span>}
      <button type="button" className="sig-clear" onClick={clear}>Clear</button>
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

  const [step, setStep] = useState('landing');
  const [survey, setSurvey] = useState({
    name: '',
    wakeTime: '6:30 AM',
    sleepTime: '11:00 PM',
    goal: 'discipline',
    hobby: '',
    duration: 21,
    signature: '',
    agreed: false
  });

  const [activeTab, setActiveTab] = useState('todos');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (gameState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  function startOnboarding() {
    setStep('questions');
  }

  function handleSurveyComplete() {
    if (!survey.name.trim()) return alert('Please enter your name.');
    if (!survey.signature) return alert('Please sign your oath before sealing.');
    if (!survey.agreed) return alert('Please check the confirmation box.');

    const assignedHero = determineCharacter(survey.goal);

    setGameState({
      player: survey.name,
      day: 1,
      totalDays: survey.duration,
      streak: 1,
      trophies: 10,
      xp: 0,
      level: 1,
      heroKey: assignedHero.id,
      goal: survey.goal,
      hobby: survey.hobby,
      completedQuestIds: [],
      stats: { CON: 15, FOC: 15, DIS: 15, STR: 15, WIS: 15 }
    });
    setStep('game');
  }

  function getHeroEvolution(hero, level) {
    if (level >= 6) return { stage: 'Monarch Mode', img: hero.stages.monarch, glow: 'monarch-glow' };
    if (level >= 3) return { stage: 'Awakened State', img: hero.stages.awakened, glow: 'awakened-glow' };
    return { stage: 'Base State', img: hero.stages.base, glow: 'base-glow' };
  }

  function toggleQuest(quest) {
    const isDone = gameState.completedQuestIds.includes(quest.id);

    if (isDone) {
      setGameState((prev) => ({
        ...prev,
        completedQuestIds: prev.completedQuestIds.filter((id) => id !== quest.id),
        xp: Math.max(0, prev.xp - quest.xp),
        stats: {
          ...prev.stats,
          [quest.stat]: Math.max(10, (prev.stats[quest.stat] || 15) - 3)
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
        stats: {
          ...prev.stats,
          [quest.stat]: (prev.stats[quest.stat] || 15) + 3
        }
      }));

      setToast({ xp: quest.xp, stat: quest.stat });
      setTimeout(() => setToast(null), 2500);
    }
  }

  function resetGame() {
    if (window.confirm('Reset all progress and create a new contract?')) {
      localStorage.removeItem(STORAGE_KEY);
      setGameState(null);
      setStep('landing');
    }
  }

  // --- SCREEN 1: LANDING ---
  if (!gameState && step === 'landing') {
    return (
      <div className="phone-wrapper">
        <div className="landing-content">
          <span className="brand-tag">✦ LIFELORE RPG</span>
          <h1>TURN YOUR LIFE INTO AN <em>ANIME ADVENTURE</em></h1>
          <p>Answer questions about your routine, awaken your personalized hero, and sign a contract for real growth.</p>
          <div className="landing-card-preview">
            <img
              src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"
              alt="Character Preview"
              className="preview-img"
            />
          </div>
          <button className="enter-btn full-btn" onClick={startOnboarding}>
            BEGIN ONBOARDING →
          </button>
        </div>
      </div>
    );
  }

  // --- SCREEN 2: ONBOARDING & OATH ---
  if (!gameState && step === 'questions') {
    const previewHero = determineCharacter(survey.goal);

    return (
      <div className="phone-wrapper">
        <div className="onboarding-scroll">
          <h2>CHARACTER AWAKENING</h2>
          <p className="subtext">Configure your schedule and seal the pact.</p>

          <label className="input-group">
            <span>What is your name?</span>
            <input
              type="text"
              placeholder="e.g. Jin, Ethan, Jordan"
              value={survey.name}
              onChange={(e) => setSurvey({ ...survey, name: e.target.value })}
            />
          </label>

          <label className="input-group">
            <span>What is your top priority right now?</span>
            <select
              value={survey.goal}
              onChange={(e) => setSurvey({ ...survey, goal: e.target.value })}
            >
              <option value="discipline">Unstoppable Discipline (Shadow Monarch)</option>
              <option value="fitness">Physical Strength & Combat (Tanjiro Kamado)</option>
              <option value="studies">Deep Focus & Strategy (Loid Forger)</option>
              <option value="habits">Vitality & Consistency (Naruto Uzumaki)</option>
            </select>
          </label>

          <div className="assigned-preview">
            <span className="preview-label">ASSIGNED COMPANION</span>
            <div className="mini-hero-row">
              <img src={previewHero.stages.base} alt={previewHero.name} />
              <div>
                <strong>{previewHero.name}</strong>
                <small>{previewHero.anime} • {previewHero.title}</small>
              </div>
            </div>
          </div>

          <label className="input-group">
            <span>A hobby you want to protect:</span>
            <input
              type="text"
              placeholder="e.g. Guitar, Digital Art, Gaming"
              value={survey.hobby}
              onChange={(e) => setSurvey({ ...survey, hobby: e.target.value })}
            />
          </label>

          <label className="input-group">
            <span>Duration of this Chapter:</span>
            <div className="duration-selector">
              {[7, 14, 21, 30].map((days) => (
                <button
                  type="button"
                  key={days}
                  className={`duration-chip ${survey.duration === days ? 'active' : ''}`}
                  onClick={() => setSurvey({ ...survey, duration: days })}
                >
                  {days} DAYS
                </button>
              ))}
            </div>
          </label>

          <div className="contract-box">
            <h3>THE LIVING OATH</h3>
            <p>
              I, <strong>{survey.name || 'Wanderer'}</strong>, bind myself to this <strong>{survey.duration}-Day Arc</strong>. 
              I will complete my daily trials, level up my attributes, and push past comfort.
            </p>

            <SignaturePad onChange={(dataUrl) => setSurvey({ ...survey, signature: dataUrl })} />

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={survey.agreed}
                onChange={(e) => setSurvey({ ...survey, agreed: e.target.checked })}
              />
              <span>I accept the pact and bind my progress to this device.</span>
            </label>
          </div>

          <button className="enter-btn full-btn" onClick={handleSurveyComplete}>
            SEAL OATH & AWAKEN →
          </button>
        </div>
      </div>
    );
  }

  // --- SCREEN 3: ACTIVE GAME DASHBOARD ---
  const currentHero = Object.values(CHARACTERS).find((c) => c.id === gameState.heroKey) || CHARACTERS.discipline;
  const evolution = getHeroEvolution(currentHero, gameState.level);
  const activeQuests = generateDynamicQuests(gameState.level, gameState.goal, gameState.hobby);

  const todoQuests = activeQuests.filter((q) => !gameState.completedQuestIds.includes(q.id));
  const doneQuests = activeQuests.filter((q) => gameState.completedQuestIds.includes(q.id));

  const currentLevelXP = gameState.xp % XP_PER_LEVEL;
  const xpNeeded = XP_PER_LEVEL;

  return (
    <div className="phone-wrapper">
      {/* Toast Notification */}
      {toast && (
        <div className="xp-toast-overlay">
          <div className="xp-toast">
            <span className="toast-label">XP EARNED</span>
            <div className="toast-main">
              <span className="toast-arrow">▲</span>
              <strong>+{toast.xp}</strong>
            </div>
            <div className="toast-sub">
              <span>ATTRIBUTE BOOST</span>
              <strong>{toast.stat} +3</strong>
            </div>
          </div>
        </div>
      )}

      {/* Top Status Bar */}
      <div className="app-status-bar">
        <div className="pill-group">
          <span className="pill orange-pill">🔥 {gameState.streak}</span>
          <span className="pill green-pill">🏆 {gameState.trophies}</span>
          <span className="pill amber-pill">✦ {gameState.xp}</span>
        </div>
        <button className="icon-btn" onClick={resetGame} title="Reset Arc">
          ↻
        </button>
      </div>

      {/* Day Title Row */}
      <div className="day-title-row">
        <h1>
          DAY {gameState.day} <span>/{gameState.totalDays}</span>
        </h1>
        <div className="day-arrows">
          <button>‹</button>
          <button>›</button>
        </div>
      </div>
      <p className="day-subtitle">{evolution.stage} • {currentHero.title}</p>

      {/* Hero Card */}
      <div className="player-card">
        <div className="card-left">
          <h2 className="player-name">{gameState.player}</h2>
          <div className="lvl-row">
            <span className="lvl-prefix">LV</span>
            <span className="lvl-number">{gameState.level}</span>
          </div>

          <div className="segmented-bar">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className={`bar-segment ${i < Math.round((currentLevelXP / xpNeeded) * 18) ? 'filled' : ''}`}
              />
            ))}
          </div>
          <div className="xp-remain-text">{xpNeeded - currentLevelXP} XP to Level {gameState.level + 1}</div>

          <div className="stats-row">
            <div className="stat-pill"><span className="stat-name">CON</span> <strong>{gameState.stats.CON}</strong></div>
            <div className="stat-pill"><span className="stat-name">FOC</span> <strong>{gameState.stats.FOC}</strong></div>
            <div className="stat-pill"><span className="stat-name">DIS</span> <strong>{gameState.stats.DIS}</strong></div>
            <div className="stat-pill"><span className="stat-name">STR</span> <strong>{gameState.stats.STR}</strong></div>
            <div className="stat-pill"><span className="stat-name">WIS</span> <strong>{gameState.stats.WIS}</strong></div>
          </div>
        </div>

        <div className="card-right">
          <div className={`avatar-aura ${evolution.glow}`} style={{ '--aura': currentHero.auraColor }}>
            <img src={evolution.img} alt={currentHero.name} className="hero-img" />
          </div>
          <div className="rank-badge">{evolution.stage.toUpperCase()}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        <button
          className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`}
          onClick={() => setActiveTab('todos')}
        >
          To-dos <span>{todoQuests.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'done' ? 'active' : ''}`}
          onClick={() => setActiveTab('done')}
        >
          Done <span>{doneQuests.length}</span>
        </button>
      </div>

      {/* Quest Cards */}
      <div className="quest-scroll-list">
        {activeTab === 'todos' &&
          todoQuests.map((quest) => (
            <div
              key={quest.id}
              className="cinematic-card"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(14,14,16,0.3) 0%, rgba(10,10,12,0.92) 80%), url(${quest.bg})` }}
            >
              <div className="quest-info">
                <h3>{quest.title}</h3>
                <div className="quest-meta">
                  <span>🔁 {quest.type}</span>
                  <span>📊 {quest.difficulty}</span>
                  <span>⏱ {quest.duration}</span>
                  <span className="quest-xp-badge">+{quest.xp} XP</span>
                </div>
              </div>
              <button
                className="quest-check-btn"
                onClick={() => toggleQuest(quest)}
                aria-label="Complete Quest"
              />
            </div>
          ))}

        {activeTab === 'done' &&
          doneQuests.map((quest) => (
            <div
              key={quest.id}
              className="cinematic-card completed"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(14,14,16,0.5) 0%, rgba(10,10,12,0.96) 80%), url(${quest.bg})` }}
            >
              <div className="quest-info">
                <h3 className="line-through">{quest.title}</h3>
                <div className="quest-meta">
                  <span>COMPLETED</span>
                  <span>+{quest.xp} XP AWARDED</span>
                </div>
              </div>
              <button
                className="quest-check-btn checked"
                onClick={() => toggleQuest(quest)}
                aria-label="Undo Quest"
              >
                ✓
              </button>
            </div>
          ))}

        {activeTab === 'todos' && todoQuests.length === 0 && (
          <div className="empty-state">
            <span className="empty-title">— DAY {gameState.day} CLEARED —</span>
            <p>All trials overcome. Your aura grows stronger.</p>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="bottom-pill">DAY {gameState.day}</div>
        <span>{doneQuests.length} of {activeQuests.length} completed</span>
        <button
          className="enter-btn"
          onClick={() => {
            setGameState((prev) => ({
              ...prev,
              day: Math.min(prev.totalDays, prev.day + 1),
              completedQuestIds: []
            }));
          }}
        >
          NEXT DAY →
        </button>
      </div>
    </div>
  );
}

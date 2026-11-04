import { useState, useEffect } from 'react';
import { HEROES, buildQuests, XP_PER_LEVEL } from './data/lore.js';
import '../styles/styles.css';

const STORAGE_KEY = 'lifelore_v4_save';

export default function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [screen, setScreen] = useState(() => (data ? 'dashboard' : 'landing'));
  const [qIndex, setQIndex] = useState(0);
  const [tab, setTab] = useState('quests');
  const [subTab, setSubTab] = useState('todos');
  const [toast, setToast] = useState(null);

  const [survey, setSurvey] = useState({
    name: '',
    heroKey: 'jinwoo',
    studyHours: 4,
    hobby: '',
    duration: 66,
    signMethod: 'thumb',
    signature: '',
    thumbStamped: false,
    agreed: false
  });

  const [isPressingThumb, setIsPressingThumb] = useState(false);

  useEffect(() => {
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const questions = [
    {
      id: 'name',
      title: 'ENTER YOUR HUNTER IDENTITY',
      subtitle: 'The registry requires your designated combat moniker.',
      render: () => (
        <input
          type="text"
          className="q-input-bold"
          placeholder="e.g. Ethan, Jin, Jordan"
          value={survey.name}
          onChange={(e) => setSurvey({ ...survey, name: e.target.value })}
          autoFocus
        />
      )
    },
    {
      id: 'character',
      title: 'SELECT YOUR ANIME ARCHETYPE',
      subtitle: 'Choose the aesthetic and combat spirit for your Winter Arc.',
      render: () => (
        <div className="char-selection-grid">
          {Object.values(HEROES).map((h) => (
            <div
              key={h.id}
              className={`char-card-choice ${survey.heroKey === h.id ? 'active' : ''}`}
              onClick={() => setSurvey({ ...survey, heroKey: h.id })}
            >
              <img src={h.avatar} alt={h.name} />
              <div className="char-info">
                <strong>{h.name}</strong>
                <small>{h.anime}</small>
                <span className="char-trait">⚡ {h.themeStat}</span>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'study',
      title: 'STUDY & DEEP WORK INTENSITY',
      subtitle: 'How many daily hours of pure, undistracted focus will you conquer?',
      render: () => (
        <div className="study-chips-grid">
          {[2, 4, 6, 8].map((hrs) => (
            <button
              type="button"
              key={hrs}
              className={`study-chip ${survey.studyHours === hrs ? 'active' : ''}`}
              onClick={() => setSurvey({ ...survey, studyHours: hrs })}
            >
              <span className="study-num">{hrs}h</span>
              <span className="study-label">
                {hrs >= 8 ? 'MONK MODE' : hrs >= 6 ? 'HARDCORE' : hrs >= 4 ? 'BALANCED' : 'LIGHT'}
              </span>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'hobby',
      title: 'PROTECTED HOBBY & GLOW-UP',
      subtitle: 'Identify a craft or skill you will polish alongside your skin care.',
      render: () => (
        <input
          type="text"
          className="q-input-bold"
          placeholder="e.g. Guitar, Digital Art, Reading"
          value={survey.hobby}
          onChange={(e) => setSurvey({ ...survey, hobby: e.target.value })}
        />
      )
    },
    {
      id: 'contract',
      title: 'SEAL THE ANCIENT LIVING PACT',
      subtitle: 'Sign in ink or stamp your biometric thumbprint upon the parchment.',
      render: () => (
        <div className="parchment-scroll">
          <div className="parchment-wax-seal">✦</div>
          <h3 className="parchment-title">SACRED OATH OF ELEVATION</h3>
          <p className="parchment-body">
            Be it known across all realms: <strong>{survey.name || 'The Wanderer'}</strong> has chosen the path of{' '}
            <strong>{survey.duration} Days</strong>. I shall train my body, study <strong>{survey.studyHours} hours daily</strong>,
            nurture radiance in skin and mind, and push past weakness.
          </p>

          <div className="sign-method-toggle">
            <button
              type="button"
              className={survey.signMethod === 'thumb' ? 'active' : ''}
              onClick={() => setSurvey({ ...survey, signMethod: 'thumb' })}
            >
              Crimson Thumbprint
            </button>
            <button
              type="button"
              className={survey.signMethod === 'type' ? 'active' : ''}
              onClick={() => setSurvey({ ...survey, signMethod: 'type' })}
            >
              Quill Signature
            </button>
          </div>

          {survey.signMethod === 'thumb' ? (
            <div className="thumbprint-area">
              <div
                className={`fingerprint-sensor ${survey.thumbStamped ? 'stamped' : ''} ${isPressingThumb ? 'pressing' : ''}`}
                onMouseDown={() => {
                  setIsPressingThumb(true);
                  setTimeout(() => {
                    setSurvey((s) => ({ ...s, thumbStamped: true }));
                    setIsPressingThumb(false);
                  }, 800);
                }}
                onTouchStart={() => {
                  setIsPressingThumb(true);
                  setTimeout(() => {
                    setSurvey((s) => ({ ...s, thumbStamped: true }));
                    setIsPressingThumb(false);
                  }, 800);
                }}
              >
                <span className="fingerprint-icon">🩸</span>
                <span className="fingerprint-text">
                  {survey.thumbStamped ? 'Pact Sealed in Crimson' : 'Press & Hold to Stamp'}
                </span>
              </div>
            </div>
          ) : (
            <div className="quill-sign-area">
              <input
                type="text"
                className="quill-input"
                placeholder="Type your formal name to scribe..."
                value={survey.signature}
                onChange={(e) => setSurvey({ ...survey, signature: e.target.value })}
              />
            </div>
          )}

          <label className="parchment-checkbox">
            <input
              type="checkbox"
              checked={survey.agreed}
              onChange={(e) => setSurvey({ ...survey, agreed: e.target.checked })}
            />
            <span>I bind my name to this living codex forever.</span>
          </label>
        </div>
      )
    }
  ];

  function handleNext() {
    if (questions[qIndex].id === 'name' && !survey.name.trim()) {
      return alert('Enter your hunter name to proceed.');
    }

    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      if (survey.signMethod === 'thumb' && !survey.thumbStamped) {
        return alert('Please press and hold to apply your crimson thumbprint.');
      }
      if (survey.signMethod === 'type' && !survey.signature.trim()) {
        return alert('Please type your formal name to sign.');
      }
      if (!survey.agreed) {
        return alert('Confirm the pact by checking the box.');
      }

      setData({
        name: survey.name.trim(),
        heroKey: survey.heroKey,
        day: 1,
        totalDays: survey.duration,
        streak: 1,
        trophies: 25,
        xp: 120,
        level: 1,
        studyHours: survey.studyHours,
        hobby: survey.hobby,
        glowLevel: 10,
        completedQuestIds: [],
        stats: {
          CON: 25,
          FOC: 18,
          DIS: 17,
          STR: 22,
          WIS: 13,
          GLOW: 30
        }
      });
      setScreen('dashboard');
    }
  }

  function handlePrev() {
    if (qIndex > 0) setQIndex(qIndex - 1);
    else setScreen('landing');
  }

  function toggleQuest(q) {
    const isDone = data.completedQuestIds.includes(q.id);

    if (isDone) {
      setData((prev) => ({
        ...prev,
        completedQuestIds: prev.completedQuestIds.filter((id) => id !== q.id),
        xp: Math.max(0, prev.xp - q.xp),
        glowLevel: q.stat === 'GLOW' ? Math.max(10, prev.glowLevel - 5) : prev.glowLevel
      }));
    } else {
      const nextXP = data.xp + q.xp;
      const nextLevel = Math.floor(nextXP / XP_PER_LEVEL) + 1;

      setData((prev) => ({
        ...prev,
        completedQuestIds: [...prev.completedQuestIds, q.id],
        xp: nextXP,
        level: nextLevel,
        glowLevel: q.stat === 'GLOW' ? prev.glowLevel + 7 : prev.glowLevel,
        stats: {
          ...prev.stats,
          [q.stat]: (prev.stats[q.stat] || 15) + 3
        }
      }));

      setToast({ xp: q.xp, stat: q.stat });
      setTimeout(() => setToast(null), 2400);
    }
  }

  function resetGame() {
    if (window.confirm('Reset this arc and choose a new character?')) {
      localStorage.removeItem(STORAGE_KEY);
      setData(null);
      setScreen('landing');
      setQIndex(0);
    }
  }

  // --- 1. COVER POSTER SCREEN ---
  if (screen === 'landing') {
    return (
      <div className="app-viewport">
        <div className="mobile-shell cover-layout">
          <div className="cover-header-group">
            <h1 className="cover-banner-title">
              TURN YOUR<br />LIFE INTO<br />
              <span className="orange-glitch">VIDEO GAME</span>
            </h1>
          </div>

          <div className="cover-duo-art">
            <img
              src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80"
              alt="Anime Hero"
              className="art-layer art-male"
            />
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
              alt="Anime Heroine"
              className="art-layer art-female"
            />
          </div>

          <div className="laurel-badges-row">
            <div className="laurel-item">
              <span className="laurel-branch">🪽</span>
              <div>
                <strong>1M+</strong>
                <small>USERS</small>
              </div>
              <span className="laurel-branch flipped">🪽</span>
            </div>
            <div className="laurel-item">
              <span className="laurel-branch">🪽</span>
              <div>
                <span className="stars">★★★★★</span>
                <strong>4.8</strong>
                <small>APPS WE LOVE</small>
              </div>
              <span className="laurel-branch flipped">🪽</span>
            </div>
          </div>

          <button className="enter-protocol-btn" onClick={() => setScreen('wizard')}>
            START WINTER ARC →
          </button>
        </div>
      </div>
    );
  }

  // --- 2. 1-QUESTION-AT-A-TIME WIZARD ---
  if (screen === 'wizard') {
    const curQ = questions[qIndex];
    const progress = ((qIndex + 1) / questions.length) * 100;

    return (
      <div className="app-viewport">
        <div className="mobile-shell wizard-layout">
          <div className="wizard-top-nav">
            <button className="nav-back-btn" onClick={handlePrev}>‹ Back</button>
            <span className="nav-step-indicator">STAGE {qIndex + 1} OF {questions.length}</span>
          </div>

          <div className="wizard-progress-bar">
            <div className="wizard-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="wizard-core-card">
            <span className="category-kicker">WINTER ARC AWAKENING</span>
            <h2 className="massive-question-title">{curQ.title}</h2>
            <p className="clean-subtext">{curQ.subtitle}</p>
            <div className="active-answer-slot">{curQ.render()}</div>
          </div>

          <button className="docked-continue-btn" onClick={handleNext}>
            {qIndex === questions.length - 1 ? 'SEAL OATH & AWAKEN →' : 'CONTINUE →'}
          </button>
        </div>
      </div>
    );
  }

  // --- 3. DASHBOARD ---
  const activeHero = HEROES[data.heroKey] || HEROES.jinwoo;
  const currentQuests = buildQuests(data.studyHours, '1h', data.level, data.hobby);
  const todoQuests = currentQuests.filter((q) => !data.completedQuestIds.includes(q.id));
  const doneQuests = currentQuests.filter((q) => data.completedQuestIds.includes(q.id));
  const xpNeeded = XP_PER_LEVEL;
  const currentXPInLvl = data.xp % xpNeeded;

  return (
    <div className="app-viewport">
      <div className="mobile-shell">
        {toast && (
          <div className="toast-float-card">
            <span className="toast-kicker">LEVEL XP EARNED</span>
            <div className="toast-big-xp">
              <span className="green-arrow">▲</span>
              <strong>+{toast.xp}</strong>
            </div>
            <div className="toast-stat-row">
              <span>BOOST: {toast.stat}</span>
              <strong>+3 PTS</strong>
            </div>
          </div>
        )}

        <div className="screen-toggle-bar">
          <button
            className={tab === 'quests' ? 'active' : ''}
            onClick={() => setTab('quests')}
          >
            DAILY QUESTS
          </button>
          <button
            className={tab === 'progress' ? 'active' : ''}
            onClick={() => setTab('progress')}
          >
            PROGRESS
          </button>
        </div>

        {tab === 'quests' ? (
          <div className="dashboard-content">
            <div className="status-pills-row">
              <div className="pill-trio">
                <span className="pill orange">🔥 {data.streak}</span>
                <span className="pill green">🏆 {data.trophies}</span>
                <span className="pill amber">✦ {data.xp}</span>
              </div>
              <button className="reset-btn" onClick={resetGame} title="Restart Arc">↻</button>
            </div>

            <div className="day-header-banner">
              <h1>DAY {data.day} <span>/{data.totalDays}</span></h1>
              <div className="day-arrows">
                <button>‹</button>
                <button>›</button>
              </div>
            </div>
            <p className="day-caption">with the exact same face.</p>

            <div className="hero-status-card">
              <div className="hero-status-left">
                <h2 className="hunter-name">{data.name}</h2>
                <div className="level-flex-row">
                  <span className="lv-label">LV</span>
                  <span className="lv-massive">{data.level}</span>
                </div>

                <div className="segmented-gauge-row">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span
                      key={i}
                      className={`gauge-notch ${i < Math.round((currentXPInLvl / xpNeeded) * 16) ? 'filled' : ''}`}
                    />
                  ))}
                </div>
                <div className="gauge-sub">{xpNeeded - currentXPInLvl} XP to Lvl {data.level + 1}</div>

                <div className="stats-badges-cluster">
                  <div className="attr-cell"><span>CON</span><b>{data.stats.CON}</b></div>
                  <div className="attr-cell"><span>FOC</span><b>{data.stats.FOC}</b></div>
                  <div className="attr-cell"><span>STR</span><b>{data.stats.STR}</b></div>
                  <div className="attr-cell"><span>WIS</span><b>{data.stats.WIS}</b></div>
                  <div className="attr-cell glow-cell"><span>✨ GLOW</span><b>{data.glowLevel}</b></div>
                </div>
              </div>

              <div className="hero-status-right">
                <div className="avatar-glowing-frame" style={{ '--glow': activeHero.aura }}>
                  <img src={activeHero.avatar} alt={activeHero.name} className="hero-cutout" />
                </div>
                <div className="rank-shield">BRONZE V</div>
              </div>
            </div>

            <div className="task-filter-tabs">
              <button
                className={`filter-btn ${subTab === 'todos' ? 'active' : ''}`}
                onClick={() => setSubTab('todos')}
              >
                To-dos <span>{todoQuests.length}</span>
              </button>
              <button
                className={`filter-btn ${subTab === 'done' ? 'active' : ''}`}
                onClick={() => setSubTab('done')}
              >
                Done <span>{doneQuests.length}</span>
              </button>
              <button className="filter-btn disabled">
                Skipped <span>0</span>
              </button>
            </div>

            <div className="quests-scroller">
              {subTab === 'todos' &&
                todoQuests.map((q) => (
                  <div
                    key={q.id}
                    className="cinematic-quest-card"
                    style={{ backgroundImage: `linear-gradient(180deg, rgba(14,14,20,0.2) 0%, rgba(10,10,14,0.95) 85%), url(${q.bg})` }}
                  >
                    <div className="quest-text-box">
                      <h3>{q.title}</h3>
                      <div className="meta-pill-strip">
                        <span>🔁 {q.tag}</span>
                        <span>⏱ {q.duration}</span>
                        <span className="amber-text">+{q.xp} XP</span>
                      </div>
                    </div>
                    <button
                      className="check-box-btn"
                      onClick={() => toggleQuest(q)}
                      aria-label="Complete Quest"
                    />
                  </div>
                ))}

              {subTab === 'done' &&
                doneQuests.map((q) => (
                  <div
                    key={q.id}
                    className="cinematic-quest-card completed"
                    style={{ backgroundImage: `linear-gradient(180deg, rgba(14,14,20,0.4) 0%, rgba(10,10,14,0.96) 85%), url(${q.bg})` }}
                  >
                    <div className="quest-text-box">
                      <h3 className="strikethrough">{q.title}</h3>
                      <div className="meta-pill-strip">
                        <span>COMPLETED</span>
                        <span>+{q.xp} XP AWARDED</span>
                      </div>
                    </div>
                    <button
                      className="check-box-btn checked"
                      onClick={() => toggleQuest(q)}
                      aria-label="Undo Quest"
                    >
                      ✓
                    </button>
                  </div>
                ))}

              {subTab === 'todos' && todoQuests.length === 0 && (
                <div className="peak-banner">
                  <span className="peak-tag">— PEAK REACHED —</span>
                  <p>Nothing left on the list today. Rest & Radiate.</p>
                </div>
              )}
            </div>

            <div className="docked-day-footer">
              <span className="day-badge-chip">DAY {data.day}</span>
              <span>{doneQuests.length} of {currentQuests.length} Cleared</span>
              <button
                className="enter-action-btn"
                onClick={() => {
                  setData((prev) => ({
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
          </div>
        ) : (
          <div className="progress-rating-page">
            <h2 className="rating-huge-title">Your Rating</h2>

            <div className="rating-kpi-banner">
              <div className="kpi-level-block">
                <small>LEVEL</small>
                <strong>{data.level}</strong>
              </div>
              <div className="kpi-xp-block">
                <strong>{data.xp.toLocaleString()}</strong>
                <span>XP earned</span>
              </div>
            </div>

            <div className="stat-bars-parchment">
              <div className="stat-line">
                <span>🔮 WISDOM</span>
                <strong className="green">▲ {data.stats.WIS * 4}</strong>
              </div>
              <div className="stat-line">
                <span>✨ SKIN GLOW</span>
                <strong className="green">▲ {data.glowLevel * 10}</strong>
              </div>
              <div className="stat-line">
                <span>🥊 STRENGTH</span>
                <strong className="green">▲ {data.stats.STR * 5}</strong>
              </div>
              <div className="stat-line">
                <span>🔒 DISCIPLINE</span>
                <strong className="green">▲ {data.stats.DIS * 6}</strong>
              </div>
              <div className="stat-line">
                <span>◎ FOCUS</span>
                <strong className="green">▲ {data.stats.FOC * 7}</strong>
              </div>
            </div>

            <div className="hero-quote-card">
              <p>"{activeHero.quote}"</p>
              <small>— {activeHero.name} • {activeHero.title}</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

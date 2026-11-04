import { useState, useEffect } from 'react';
import { CHARACTERS, INITIAL_QUESTS } from './data/lore.js';
import '../styles/styles.css';

const STORAGE_KEY = 'lifereset_data_v1';

export default function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return {
      day: 1,
      totalDays: 66,
      streak: 1,
      trophies: 25,
      xp: 120,
      level: 29,
      characterId: 'jinwoo',
      completedQuestIds: [],
      stats: {
        CON: 25,
        FOC: 18,
        DIS: 17,
        STR: 22,
        WIS: 13
      }
    };
  });

  const [activeTab, setActiveTab] = useState('todos');
  const [toast, setToast] = useState(null);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const activeHero = CHARACTERS.find((c) => c.id === data.characterId) || CHARACTERS[0];
  const xpNeeded = 250;
  const currentLevelXP = data.xp % xpNeeded;
  const xpRemaining = xpNeeded - currentLevelXP;

  function toggleQuest(quest) {
    const isDone = data.completedQuestIds.includes(quest.id);

    if (isDone) {
      setData((prev) => ({
        ...prev,
        completedQuestIds: prev.completedQuestIds.filter((id) => id !== quest.id),
        xp: Math.max(0, prev.xp - quest.xp),
        stats: {
          ...prev.stats,
          [quest.stat]: Math.max(0, (prev.stats[quest.stat] || 0) - 2)
        }
      }));
    } else {
      setData((prev) => ({
        ...prev,
        completedQuestIds: [...prev.completedQuestIds, quest.id],
        xp: prev.xp + quest.xp,
        stats: {
          ...prev.stats,
          [quest.stat]: (prev.stats[quest.stat] || 0) + 2
        }
      }));

      // Trigger XP popup toast like in Life Reset
      setToast({
        xp: quest.xp,
        statName: quest.stat,
        statVal: 2
      });
      setTimeout(() => setToast(null), 2400);
    }
  }

  const todoQuests = INITIAL_QUESTS.filter((q) => !data.completedQuestIds.includes(q.id));
  const doneQuests = INITIAL_QUESTS.filter((q) => data.completedQuestIds.includes(q.id));

  return (
    <div className="phone-wrapper">
      {/* Toast popup when quest is completed */}
      {toast && (
        <div className="xp-toast-overlay">
          <div className="xp-toast">
            <span className="toast-label">XP earned</span>
            <div className="toast-main">
              <span className="toast-arrow">▲</span>
              <strong>{toast.xp}</strong>
            </div>
            <div className="toast-sub">
              <span>🎯 {toast.statName}</span>
              <strong>+{toast.statVal}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Top Mobile Bar */}
      <div className="app-status-bar">
        <div className="pill-group">
          <span className="pill orange-pill">🔥 {data.streak}</span>
          <span className="pill green-pill">🏆 {data.trophies}</span>
          <span className="pill amber-pill">✦ {data.xp.toLocaleString()}</span>
        </div>
        <div className="status-icons">
          <button className="icon-btn" onClick={() => setShowSelector(!showSelector)} title="Switch Character">
            ⚙️
          </button>
        </div>
      </div>

      {/* Character Selector Modal */}
      {showSelector && (
        <div className="modal-sheet">
          <div className="modal-header">
            <h3>SELECT ANIME HERO</h3>
            <button onClick={() => setShowSelector(false)}>✕</button>
          </div>
          <div className="character-grid">
            {CHARACTERS.map((char) => (
              <div
                key={char.id}
                className={`char-option ${char.id === data.characterId ? 'selected' : ''}`}
                onClick={() => {
                  setData((prev) => ({ ...prev, characterId: char.id }));
                  setShowSelector(false);
                }}
              >
                <img src={char.avatar} alt={char.name} />
                <strong>{char.name}</strong>
                <small>{char.anime}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day Header */}
      <div className="day-title-row">
        <h1>
          DAY {data.day} <span>/{data.totalDays}</span>
        </h1>
        <div className="day-arrows">
          <button>‹</button>
          <button>›</button>
        </div>
      </div>
      <p className="day-subtitle">with the exact same face.</p>

      {/* Main Hero Card */}
      <div className="player-card">
        <div className="card-left">
          <h2 className="player-name">{activeHero.name.split('/')[0]}</h2>
          <div className="lvl-row">
            <span className="lvl-prefix">LV</span>
            <span className="lvl-number">{data.level}</span>
          </div>

          {/* Segmented XP Bar */}
          <div className="segmented-bar">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className={`bar-segment ${i < Math.round((currentLevelXP / xpNeeded) * 18) ? 'filled' : ''}`}
              />
            ))}
          </div>
          <div className="xp-remain-text">{xpRemaining} XP to Lvl {data.level + 1}</div>

          {/* Player Attributes */}
          <div className="stats-row">
            <div className="stat-pill"><span className="stat-name">CON</span> <strong>{data.stats.CON}</strong></div>
            <div className="stat-pill"><span className="stat-name">FOC</span> <strong>{data.stats.FOC}</strong></div>
            <div className="stat-pill"><span className="stat-name">DIS</span> <strong>{data.stats.DIS}</strong></div>
            <div className="stat-pill"><span className="stat-name">STR</span> <strong>{data.stats.STR}</strong></div>
            <div className="stat-pill"><span className="stat-name">WIS</span> <strong>{data.stats.WIS}</strong></div>
          </div>
        </div>

        {/* Character Avatar with Glow Aura */}
        <div className="card-right" onClick={() => setShowSelector(true)}>
          <div className="avatar-aura" style={{ '--aura': activeHero.auraColor }}>
            <img src={activeHero.avatar} alt={activeHero.name} className="hero-img" />
          </div>
          <div className="rank-badge">BRONZE V</div>
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
        <button
          className={`tab-btn ${activeTab === 'skipped' ? 'active' : ''}`}
          onClick={() => setActiveTab('skipped')}
        >
          Skipped <span>0</span>
        </button>
        <button className="tab-add-btn">+</button>
      </div>

      {/* Quests List */}
      <div className="quest-scroll-list">
        {activeTab === 'todos' &&
          todoQuests.map((quest) => (
            <div
              key={quest.id}
              className="cinematic-card"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(14,14,16,0.2) 0%, rgba(10,10,12,0.92) 80%), url(${quest.bg})` }}
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
                  <span>+{quest.xp} XP GAINED</span>
                </div>
              </div>
              <button
                className="quest-check-btn checked"
                onClick={() => toggleQuest(quest)}
                aria-label="Uncomplete Quest"
              >
                ✓
              </button>
            </div>
          ))}

        {activeTab === 'todos' && todoQuests.length === 0 && (
          <div className="empty-state">
            <span className="empty-title">— PEAK REACHED —</span>
            <p>Nothing left on the list today.</p>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="bottom-pill">DAY {data.day}</div>
        <span>Ready. Tap Enter to graduate.</span>
        <button className="enter-btn">ENTER →</button>
      </div>
    </div>
  );
}

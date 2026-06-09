import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const emptyReport = {
  notes: '',
  pitchers: '',
  tendencies: '',
  prevScores: '',
  strengths: '',
  weaknesses: '',
};

export default function ScoutingReportTab({ user, schedule, selectedSeason }) {
  const [selectedOpponent, setSelectedOpponent] = useState('');
  const [report, setReport] = useState(emptyReport);
  const [savedReports, setSavedReports] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  const opponents = [...new Set((schedule || []).map(g => g.opponent).filter(Boolean))].sort();

  useEffect(() => {
    if (!user || !selectedSeason) return;
    const docId = `scouting_${user.uid}_${selectedSeason.replace(/[^a-z0-9]/gi, '_')}`;
    getDoc(doc(db, 'scoutingReports', docId)).then(snap => {
      if (snap.exists()) setSavedReports(snap.data().reports || {});
    }).catch(() => {});
  }, [user, selectedSeason]);

  useEffect(() => {
    if (selectedOpponent && savedReports[selectedOpponent]) {
      setReport(savedReports[selectedOpponent]);
    } else {
      setReport(emptyReport);
    }
  }, [selectedOpponent, savedReports]);

  const saveReport = async () => {
    if (!user || !selectedOpponent) return;
    setSaveStatus('saving');
    const docId = `scouting_${user.uid}_${selectedSeason.replace(/[^a-z0-9]/gi, '_')}`;
    const updated = { ...savedReports, [selectedOpponent]: report };
    await setDoc(doc(db, 'scoutingReports', docId), { reports: updated, updatedAt: new Date().toISOString() }, { merge: true });
    setSavedReports(updated);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const field = (key, label, placeholder, multiline = false) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</label>
      {multiline
        ? <textarea value={report[key]} onChange={e => setReport(r => ({ ...r, [key]: e.target.value }))} disabled={!user || !selectedOpponent} placeholder={placeholder} rows={3}
            style={{ width: '100%', background: '#0b1329', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', padding: '10px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        : <input value={report[key]} onChange={e => setReport(r => ({ ...r, [key]: e.target.value }))} disabled={!user || !selectedOpponent} placeholder={placeholder}
            style={{ width: '100%', background: '#0b1329', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', padding: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
      }
    </div>
  );

  const prevGames = (schedule || []).filter(g => g.opponent === selectedOpponent && g.status === 'Final');

  return (
    <div style={{ maxWidth: '860px', margin: '24px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>🔍 Opponent Scouting Reports</h2>
        <select
          value={selectedOpponent}
          onChange={e => setSelectedOpponent(e.target.value)}
          style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', minWidth: '220px' }}
        >
          <option value="">— Select opponent —</option>
          {opponents.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {!selectedOpponent ? (
        <div style={{ background: '#0f172a', border: '1px dashed #334155', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#475569', fontSize: '14px' }}>
          Select an opponent from your schedule to view or create a scouting report.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', color: '#f8fafc', fontSize: '16px' }}>📋 {selectedOpponent}</h3>
            {field('pitchers', '⚾ Key Pitchers', 'e.g. #12 Jones — 75mph fastball, drops curve')}
            {field('tendencies', '📊 Offensive Tendencies', 'e.g. Pull hitters, aggressive on first pitch', true)}
            {field('strengths', '💪 Strengths', 'e.g. Strong corner infielders, fast center fielder')}
            {field('weaknesses', '🎯 Weaknesses / Exploits', 'e.g. Weak arm in left field, struggles with off-speed', true)}
            {field('notes', '📝 General Notes', 'Any other scouting notes, coaching adjustments...', true)}
            <button
              onClick={saveReport}
              disabled={!user || !selectedOpponent || saveStatus === 'saving'}
              style={{ background: '#2563eb', border: '1px solid #60a5fa', color: '#fff', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
            >
              {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '✓ Saved!' : '💾 Save Report'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {prevGames.length > 0 && (
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px' }}>
                <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>Previous Matchups</div>
                {prevGames.map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e293b' }}>
                    <div>
                      <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '600' }}>{g.date || 'TBD'}</div>
                      <div style={{ fontSize: '11px', color: '#475569' }}>{g.location === 'Away' ? '@ Away' : 'vs Home'} · {g.type}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: g.result === 'W' ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '11px', color: g.result === 'W' ? '#020617' : '#fff' }}>{g.result}</div>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#fff', fontFamily: 'monospace' }}>{g.ourScore}-{g.theirScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px' }}>
              <div style={{ fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px' }}>Reports Saved</div>
              {Object.keys(savedReports).length === 0
                ? <div style={{ fontSize: '12px', color: '#334155' }}>None yet this season.</div>
                : Object.keys(savedReports).map(opp => (
                    <div key={opp} onClick={() => setSelectedOpponent(opp)}
                      style={{ padding: '7px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: opp === selectedOpponent ? '#38bdf8' : '#94a3b8', background: opp === selectedOpponent ? 'rgba(56,189,248,0.08)' : 'transparent', marginBottom: '4px' }}>
                      🔍 {opp}
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

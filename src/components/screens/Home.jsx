import { useState, useEffect } from 'react';
import { dailyQuotes } from '../../utils/constants';
import { getGreeting, getDaysUntilExam, getStreak } from '../../utils/helpers';
import { getGeetaQuote } from '../../utils/geetaQuotes';

const defaultGoals = [
  { id: 'water', label: 'Drink a glass of water', done: false },
  { id: 'stretch', label: 'Do a 5-minute stretch', done: false },
  { id: 'review', label: 'Review one core concept', done: false }
];

export default function Home({ profile, logs, setScreen, settings, updateSettings }) {
  const [geetaQuote, setGeetaQuote] = useState(null);
  const [geetaDismissed, setGeetaDismissed] = useState(false);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    // Geeta logic
    if (settings?.geetaQuotesEnabled) {
      const todayStr = new Date().toLocaleDateString();
      const dismissed = localStorage.getItem(`moodmate_geeta_dismissed_${todayStr}`);
      if (!dismissed) {
        const latestMood = logs.length > 0 ? logs[logs.length - 1].mood.label : 'Okay';
        setGeetaQuote(getGeetaQuote(latestMood));
      } else {
        setGeetaDismissed(true);
      }
    }

    // Goals logic
    const todayStr = new Date().toLocaleDateString();
    const savedGoals = localStorage.getItem(`moodmate_goals_${todayStr}`);
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals(defaultGoals);
    }
  }, [logs, settings]);

  const dismissGeeta = () => {
    const todayStr = new Date().toLocaleDateString();
    localStorage.setItem(`moodmate_geeta_dismissed_${todayStr}`, 'true');
    setGeetaDismissed(true);
  };

  const toggleGeetaSetting = () => {
    updateSettings({ geetaQuotesEnabled: false });
  };

  const toggleGoal = (id) => {
    const newGoals = goals.map(g => g.id === id ? { ...g, done: !g.done } : g);
    setGoals(newGoals);
    const todayStr = new Date().toLocaleDateString();
    localStorage.setItem(`moodmate_goals_${todayStr}`, JSON.stringify(newGoals));
  };

  const yesterdayMood = logs.length > 0 ? logs[logs.length - 1].mood.color : 'bg-slate-200';
  const todayQuote = dailyQuotes[new Date().getDay()];
  const allGoalsDone = goals.length > 0 && goals.every(g => g.done);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <p className="text-slate-500 font-medium">{getGreeting()},</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{profile?.name}</h1>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-2xl">🎯</div>
          <div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{profile?.examType} Countdown</div>
            <div className="text-2xl font-bold text-indigo-600">{getDaysUntilExam(profile)} <span className="text-sm font-medium text-slate-400">days</span></div>
          </div>
        </div>
      </div>

      {settings?.geetaQuotesEnabled && !geetaDismissed && geetaQuote && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 relative overflow-hidden shadow-sm animate-fade-in">
          <div className="absolute top-4 right-4 flex space-x-2">
            <button onClick={toggleGeetaSetting} className="text-orange-300 hover:text-orange-500 transition-colors" title="Disable Geeta Quotes in Settings">
               ⚙️
            </button>
            <button onClick={dismissGeeta} className="text-orange-300 hover:text-orange-500 font-bold px-2 transition-colors" title="Dismiss for today">
               ✕
            </button>
          </div>
          <div className="flex items-start space-x-4">
            <div className="text-3xl">🪔</div>
            <div>
              <p className="text-orange-900 font-medium leading-relaxed italic mb-2">"{geetaQuote.text}"</p>
              <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">{geetaQuote.chapter}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Quote of the Day */}
        <div className="bg-indigo-900/5 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-400"></div>
          <p className="text-slate-700 italic font-medium leading-relaxed">"{todayQuote}"</p>
        </div>

        {/* Gamified Micro-Goals */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Daily Micro-Goals</h3>
            {allGoalsDone && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full animate-bounce">Perfect!</span>}
          </div>
          <div className="space-y-3">
            {goals.map(goal => (
              <div 
                key={goal.id} 
                onClick={() => toggleGoal(goal.id)}
                className={`flex items-center space-x-3 cursor-pointer p-2 -ml-2 rounded-xl transition-all ${goal.done ? 'opacity-50 bg-slate-50' : 'hover:bg-slate-50'}`}
              >
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${goal.done ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                  {goal.done && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                </div>
                <span className={`font-medium ${goal.done ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{goal.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div onClick={() => setScreen('checkin')} className="bg-white rounded-3xl p-6 flex items-center shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 group">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">📝</div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-slate-800 mb-1">Log Today's Mood</h3>
            <p className="text-sm text-slate-500">Take a moment for yourself</p>
          </div>
          <div className="text-slate-300 group-hover:text-indigo-400 transition-colors">→</div>
        </div>
        
        <div onClick={() => setScreen('chat')} className="bg-white rounded-3xl p-6 flex items-center shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 group">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">💬</div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-slate-800 mb-1">Talk to MoodMate</h3>
            <p className="text-sm text-slate-500">Your AI companion is ready</p>
          </div>
          <div className="text-slate-300 group-hover:text-purple-400 transition-colors">→</div>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className={`w-4 h-4 rounded-full ${yesterdayMood} shadow-sm`}></div>
             <span className="font-medium text-slate-700">Latest check-in: {logs[logs.length - 1].mood.label}</span>
           </div>
           <div className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold tracking-wide border border-orange-100">
             {getStreak(logs)} Day Streak 🔥
           </div>
        </div>
      )}
    </div>
  );
}

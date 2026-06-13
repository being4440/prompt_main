import { dailyQuotes } from '../../utils/constants';
import { getGreeting, getDaysUntilExam, getStreak } from '../../utils/helpers';

export default function Home({ profile, logs, setScreen }) {
  const yesterdayMood = logs.length > 0 ? logs[logs.length - 1].mood.color : 'bg-slate-200';
  const todayQuote = dailyQuotes[new Date().getDay()];

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

      <div className="bg-indigo-900/5 border border-indigo-100 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-400"></div>
        <p className="text-slate-700 md:text-lg italic font-medium leading-relaxed">"{todayQuote}"</p>
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

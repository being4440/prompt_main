import { useState, useEffect } from 'react';
import { model } from '../../utils/gemini';
import { getStreak, getAvgMood, getCommonTime, getAvgMetric, calculateCorrelations } from '../../utils/helpers';

export default function Dashboard({ profile, logs }) {
  const [weeklyInsight, setWeeklyInsight] = useState('');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [expandedEntryId, setExpandedEntryId] = useState(null);

  useEffect(() => {
    const todayStr = new Date().toLocaleDateString();
    const cached = localStorage.getItem(`moodmate_insight_${todayStr}`);
    if (cached) setWeeklyInsight(cached);
  }, []);

  const generateWeeklyInsight = async () => {
    if (logs.length === 0) return;
    setIsGeneratingInsight(true);
    setWeeklyInsight('');
    
    const recentLogs = logs.slice(-7);
    const dataString = recentLogs.map(l => 
      `${new Date(l.timestamp).toLocaleDateString()}: Mood ${l.mood.label}, Energy ${l.energy}, Focus ${l.focus}, Sleep ${l.sleepHours || '-'}hrs, Study ${l.studyHours || '-'}hrs, Journal: "${l.journalText}"`
    ).join('\n');

    const prompt = `Analyze these ${recentLogs.length} days of mood data for a student preparing for ${profile.examType}.
Identify: 1 key emotional pattern, 1 recurring stress trigger, 1 strength you notice, and 1 personalized recommendation for next week.
Be specific, warm, and encouraging. Under 150 words.

Data:
${dataString}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        setWeeklyInsight(text);
        const todayStr = new Date().toLocaleDateString();
        localStorage.setItem(`moodmate_insight_${todayStr}`, text);
      }
    } catch (err) {
      console.error(err);
      setWeeklyInsight("Unable to generate insight at this time.");
    }
    setIsGeneratingInsight(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">📊</div>
        <h1 className="text-3xl font-bold text-slate-800">Insights Dashboard</h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Current Streak</div>
          <div className="text-4xl font-black text-orange-500">{getStreak(logs)} <span className="text-lg font-medium text-slate-500">days</span></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Avg Mood (7d)</div>
          <div className="text-4xl">{getAvgMood(logs).emoji} <span className="text-lg font-medium text-slate-600">{getAvgMood(logs).label}</span></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Common Time</div>
          <div className="text-3xl font-bold text-indigo-500 mt-2">{getCommonTime(logs)}</div>
        </div>
      </div>

      {/* Grid for Timeline and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 14-Day Timeline */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Mood Timeline (Last 14 Days)</h3>
          <div className="grid grid-cols-7 gap-3">
            {Array.from({length: 14}).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (13 - i));
              d.setHours(0,0,0,0);
              const logForDay = logs.find(l => {
                const ld = new Date(l.timestamp);
                ld.setHours(0,0,0,0);
                return ld.getTime() === d.getTime();
              });

              const circleClass = logForDay 
                ? `${logForDay.mood.color} shadow-sm cursor-pointer hover:scale-110 transition-transform` 
                : 'bg-slate-50 border-2 border-slate-200';
              
              const tooltip = logForDay 
                ? `${d.toLocaleDateString()}: ${logForDay.mood.label} | E:${logForDay.energy} F:${logForDay.focus} C:${logForDay.confidence}`
                : `${d.toLocaleDateString()}: No log`;

              return (
                <div key={i} className="flex flex-col items-center group relative">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${circleClass}`} title={tooltip}></div>
                  <span className="text-[10px] text-slate-400 mt-2 font-medium">{d.getDate()}/{d.getMonth()+1}</span>
                  
                  {logForDay && (
                    <div className="absolute bottom-full mb-2 hidden group-hover:block w-max max-w-[200px] bg-slate-800 text-white text-xs p-2 rounded-lg z-10 shadow-xl">
                      <p className="font-bold">{d.toLocaleDateString()}</p>
                      <p>{logForDay.mood.emoji} {logForDay.mood.label}</p>
                      <p className="opacity-80 mt-1">Eng: {logForDay.energy} • Foc: {logForDay.focus} • Cnf: {logForDay.confidence}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Slider Trends */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Trends (This Week vs Last)</h3>
          <div className="space-y-6">
            {[
              { label: "Energy", color: "bg-yellow-400", metric: "energy" },
              { label: "Focus", color: "bg-blue-400", metric: "focus" },
              { label: "Confidence", color: "bg-green-400", metric: "confidence" }
            ].map(item => {
              const thisWeek = getAvgMetric(logs, 0, 6, item.metric);
              const lastWeek = getAvgMetric(logs, 7, 13, item.metric);
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                    <span>{item.label}</span>
                    <div className="space-x-3 text-xs">
                      <span className="text-slate-400">Last: {lastWeek}</span>
                      <span className="text-slate-700">This: {thisWeek}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full flex mb-1">
                    <div className={`h-full rounded-full bg-slate-300 transition-all`} style={{width: `${lastWeek*10}%`}}></div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full flex">
                    <div className={`h-full rounded-full ${item.color} transition-all`} style={{width: `${thisWeek*10}%`}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Correlations */}
        {(() => {
          const correlations = calculateCorrelations(logs);
          if (!correlations) return null;
          return (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Lifestyle Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                   <p className="text-sm font-bold text-indigo-400 uppercase tracking-wide mb-2">Sleep vs Focus</p>
                   <p className="text-slate-700 font-medium">When you sleep <span className="font-bold text-indigo-600">7+ hours</span>, your focus averages <span className="font-bold text-indigo-600">{correlations.avgHighSleepFocus}/10</span>.</p>
                   <p className="text-slate-700 font-medium mt-1">On less sleep, it drops to <span className="font-bold text-orange-500">{correlations.avgLowSleepFocus}/10</span>.</p>
                </div>
                <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                   <p className="text-sm font-bold text-purple-400 uppercase tracking-wide mb-2">Study Volume</p>
                   <p className="text-slate-700 font-medium">You have averaged <span className="font-bold text-purple-600">{correlations.avgStudyHours} hours</span> of studying per logged day.</p>
                </div>
              </div>
            </div>
          );
        })()}

      </div>

      {/* AI Weekly Insight */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-1 rounded-3xl shadow-sm">
        <div className="bg-white/90 backdrop-blur-sm rounded-[22px] p-8 h-full">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center">
                <span className="text-2xl mr-2">✨</span> AI Weekly Insight
              </h3>
              <p className="text-sm text-slate-500 mt-1">Personalized analysis of your last 7 days</p>
            </div>
            <button 
              onClick={generateWeeklyInsight}
              disabled={isGeneratingInsight || logs.length === 0}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all text-sm"
            >
              {isGeneratingInsight ? 'Analyzing...' : 'Generate Insight'}
            </button>
          </div>
          
          {weeklyInsight ? (
            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-inner text-slate-700 leading-relaxed">
              {weeklyInsight.split('\n').map((line, j) => <p key={j} className={j>0?'mt-3':''}>{line}</p>)}
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400">
              {logs.length === 0 ? "Log some moods to get an insight!" : "Click generate to see your weekly patterns and tips."}
            </div>
          )}
        </div>
      </div>

      {/* Journal Archive */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Journal Archive</h3>
        <div className="space-y-3">
          {logs.length === 0 && <p className="text-slate-400 text-center py-4">No entries yet.</p>}
          {[...logs].reverse().map(l => {
            const isExpanded = expandedEntryId === l.id;
            const dateStr = new Date(l.timestamp).toLocaleDateString();
            return (
              <div key={l.id} className="border border-slate-100 rounded-2xl overflow-hidden transition-all">
                <div 
                  onClick={() => setExpandedEntryId(isExpanded ? null : l.id)}
                  className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full ${l.mood.color} text-white flex items-center justify-center text-lg shadow-sm`}>{l.mood.emoji}</div>
                    <div>
                      <div className="font-bold text-slate-700">{dateStr}</div>
                      <div className="text-sm text-slate-500 truncate max-w-xs md:max-w-md">
                        {l.journalText ? l.journalText.slice(0, 60) + (l.journalText.length > 60 ? '...' : '') : 'No journal entry.'}
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400">{isExpanded ? '▲' : '▼'}</div>
                </div>
                {isExpanded && (
                  <div className="p-6 bg-white border-t border-slate-100">
                    <div className="flex space-x-6 mb-4 text-sm font-medium text-slate-500">
                      <span>Energy: <strong className="text-slate-800">{l.energy}/10</strong></span>
                      <span>Focus: <strong className="text-slate-800">{l.focus}/10</strong></span>
                      <span>Confidence: <strong className="text-slate-800">{l.confidence}/10</strong></span>
                      {l.sleepHours && <span>Sleep: <strong className="text-slate-800">{l.sleepHours}h</strong></span>}
                      {l.studyHours && <span>Study: <strong className="text-slate-800">{l.studyHours}h</strong></span>}
                    </div>
                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-3 text-sm">
                      <span className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider block mb-1">Prompt</span>
                      {l.prompt}
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{l.journalText || <em>No text provided.</em>}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

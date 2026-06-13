import { useState } from 'react';

export default function Onboarding({ onComplete }) {
  const [name, setName] = useState('');
  const [examType, setExamType] = useState('JEE');
  const [examDate, setExamDate] = useState('');

  const handleSubmit = () => {
    if (!name || !examDate) return;
    onComplete({ name, examType, examDate });
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 font-sans">
      
      {/* Left Panel: Landing Showcase */}
      <div className="md:w-5/12 lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden hidden md:flex">
        {/* Background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl opacity-60"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-16">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/20">✨</div>
            <h2 className="text-3xl font-bold tracking-tight">MoodMate</h2>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6 tracking-tight">
            Your personal mental wellness companion.
          </h1>
          <p className="text-lg text-indigo-100 mb-12 max-w-lg leading-relaxed font-medium">
            Navigate exam stress with AI-powered insights, daily check-ins, and a supportive companion that understands exactly what you're going through.
          </p>

          <div className="space-y-6">
            {[
              { icon: '📊', title: 'Track Your Mood', desc: 'Log daily emotions and spot trends.' },
              { icon: '🤖', title: 'AI Companion', desc: 'Get personalized, empathetic advice.' },
              { icon: '🎯', title: 'Exam Focus', desc: 'Tailored specifically for student stress.' }
            ].map(feature => (
              <div key={feature.title} className="flex items-center space-x-5 bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <div className="text-4xl drop-shadow-md">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-white text-lg">{feature.title}</h3>
                  <p className="text-indigo-200 text-sm mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-12 text-sm text-indigo-200/60 font-medium">
          © 2026 MoodMate. Designed for students.
        </div>
      </div>

      {/* Right Panel: Onboarding Form */}
      <div className="w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50 relative min-h-screen md:min-h-0">
        
        {/* Mobile Header (Shows only on mobile since left panel is hidden) */}
        <div className="md:hidden absolute top-8 left-8 flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">✨</div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">MoodMate</h2>
        </div>

        <div className="w-full max-w-md animate-fade-in mt-12 md:mt-0">
          
          <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative">
            
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Let's get started</h2>
              <p className="text-slate-500 font-medium">Set up your profile so MoodMate can personalize your experience.</p>
            </div>

            <div className="space-y-6 text-left">
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">What's your name?</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Alex"
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-700 font-semibold placeholder:text-slate-400 placeholder:font-medium" 
                />
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Which exam are you preparing for?</label>
                <div className="relative">
                  <select 
                    value={examType} 
                    onChange={e => setExamType(e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-700 font-semibold appearance-none cursor-pointer"
                  >
                    <option value="JEE">JEE (Engineering)</option>
                    <option value="NEET">NEET (Medical)</option>
                    <option value="CAT">CAT (Management)</option>
                    <option value="GATE">GATE (Engineering)</option>
                    <option value="UPSC">UPSC (Civil Services)</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">When is your exam?</label>
                <input 
                  type="date" 
                  value={examDate} 
                  onChange={e => setExamDate(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-700 font-semibold uppercase tracking-wider" 
                />
              </div>

              <button 
                onClick={handleSubmit} 
                disabled={!name || !examDate}
                className={`mt-10 w-full py-4 rounded-2xl font-bold text-white transition-all flex justify-center items-center group
                  ${name && examDate ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:-translate-y-1' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
              >
                <span>Enter MoodMate</span>
                <span className={`ml-2 transition-transform ${name && examDate ? 'group-hover:translate-x-1' : ''}`}>→</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

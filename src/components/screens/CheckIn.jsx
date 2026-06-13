import { useState, useEffect } from 'react';
import { moodOptions, journalPrompts } from '../../utils/constants';

export default function CheckIn({ onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [energy, setEnergy] = useState(5);
  const [focus, setFocus] = useState(5);
  const [confidence, setConfidence] = useState(5);
  const [randomPrompt, setRandomPrompt] = useState('');
  const [journalText, setJournalText] = useState('');

  useEffect(() => {
    setRandomPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
  }, []);

  const handleSubmit = () => {
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      mood: selectedMood,
      energy,
      focus,
      confidence,
      prompt: randomPrompt,
      journalText
    };
    onComplete(entry);
  };

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Daily Check-in</h2>
      
      {step === 1 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col justify-center space-y-10">
          <h3 className="text-xl font-medium text-slate-700 text-center">How are you feeling right now?</h3>
          <div className="grid grid-cols-5 gap-4">
            {moodOptions.map(mood => (
              <div 
                key={mood.label} onClick={() => setSelectedMood(mood)}
                className={`flex flex-col items-center cursor-pointer transition-all ${selectedMood?.label === mood.label ? 'transform -translate-y-2' : 'opacity-70 hover:opacity-100'}`}
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl bg-slate-50 shadow-sm border border-slate-100 transition-all ${selectedMood?.label === mood.label ? `ring-4 ring-offset-4 ring-${mood.color.split('-')[1]}-400 ${mood.shadow}` : 'hover:bg-white'}`}>
                  {mood.emoji}
                </div>
                <span className={`text-xs md:text-sm mt-3 font-semibold ${selectedMood?.label === mood.label ? 'text-slate-800' : 'text-slate-400'}`}>{mood.label}</span>
              </div>
            ))}
          </div>
          <div className="pt-8 text-center">
            <button 
              onClick={() => selectedMood && setStep(2)}
              disabled={!selectedMood}
              className={`px-12 py-4 rounded-full font-bold text-white transition-all ${selectedMood ? 'bg-indigo-500 shadow-md hover:bg-indigo-600' : 'bg-slate-200 text-slate-400'}`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col space-y-8">
          <h3 className="text-xl font-medium text-slate-700 text-center mb-4">Where's your head at?</h3>
          
          {[
            { label: "Energy Level", val: energy, set: setEnergy, color: "accent-yellow-500" },
            { label: "Focus Today", val: focus, set: setFocus, color: "accent-blue-500" },
            { label: "Confidence Level", val: confidence, set: setConfidence, color: "accent-green-500" }
          ].map(slider => (
            <div key={slider.label} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-base font-medium text-slate-700 mb-4">
                <span>{slider.label}</span>
                <span className="text-slate-500 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">{slider.val}/10</span>
              </div>
              <input 
                type="range" min="1" max="10" value={slider.val} 
                onChange={e => slider.set(parseInt(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none bg-slate-200 cursor-pointer ${slider.color}`}
              />
            </div>
          ))}

          <div className="pt-6 flex justify-between space-x-4">
            <button onClick={() => setStep(1)} className="px-8 py-4 rounded-full font-medium text-slate-600 bg-slate-100 hover:bg-slate-200">Back</button>
            <button onClick={() => setStep(3)} className="flex-1 px-8 py-4 rounded-full font-bold text-white bg-indigo-500 hover:bg-indigo-600 shadow-md">Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col space-y-6">
          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 relative">
            <span className="absolute -top-3 left-6 bg-white px-3 py-1 text-[10px] font-bold tracking-wider text-indigo-500 uppercase rounded-full shadow-sm border border-indigo-100">Journal Prompt</span>
            <p className="text-slate-800 font-medium text-lg leading-relaxed mt-2">{randomPrompt}</p>
          </div>
          
          <textarea 
            value={journalText} onChange={e => setJournalText(e.target.value)}
            placeholder="Write freely — this is just for you and MoodMate..."
            className="w-full flex-1 min-h-[200px] p-5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none resize-none bg-slate-50/50 text-slate-700 text-lg"
          ></textarea>

          <div className="pt-4 flex space-x-4">
            <button onClick={() => setStep(2)} className="px-8 py-4 rounded-full font-medium text-slate-600 bg-slate-100 hover:bg-slate-200">Back</button>
            <button onClick={handleSubmit} className="flex-1 py-4 rounded-full font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-all flex items-center justify-center space-x-3 group">
              <span>Analyze & Support Me</span>
              <span className="group-hover:scale-125 transition-transform">✨</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

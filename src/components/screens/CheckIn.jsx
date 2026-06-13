import { useState, useEffect } from 'react';
import { moodOptions, journalPrompts } from '../../utils/constants';
import { useDebounce } from '../../utils/useDebounce';
import { detectCrisisKeywords } from '../../utils/safety';

export default function CheckIn({ onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [energy, setEnergy] = useState(5);
  const [focus, setFocus] = useState(5);
  const [confidence, setConfidence] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [studyHours, setStudyHours] = useState(4);
  const [randomPrompt, setRandomPrompt] = useState('');
  const [journalText, setJournalText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  const debouncedJournalText = useDebounce(journalText, 1000);

  useEffect(() => {
    if (debouncedJournalText) {
      localStorage.setItem('moodmate_draft_journal', debouncedJournalText);
      if (detectCrisisKeywords(debouncedJournalText)) {
        setShowCrisisAlert(true);
      } else {
        setShowCrisisAlert(false);
      }
    }
  }, [debouncedJournalText]);

  const toggleListening = () => {
    if (isListening) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Input.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setJournalText(prev => prev ? prev + ' ' + transcript : transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

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
      sleepHours,
      studyHours,
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
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col space-y-6">
          <h3 className="text-xl font-medium text-slate-700 text-center mb-2">Where's your head at?</h3>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
               <div className="flex justify-between font-medium text-slate-700 mb-2 text-sm">
                 <span>Sleep (hrs)</span><span>{sleepHours}</span>
               </div>
               <input type="range" min="0" max="14" step="0.5" value={sleepHours} onChange={e => setSleepHours(parseFloat(e.target.value))} className="w-full accent-indigo-500" aria-label="Sleep hours slider" />
             </div>
             <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
               <div className="flex justify-between font-medium text-slate-700 mb-2 text-sm">
                 <span>Study (hrs)</span><span>{studyHours}</span>
               </div>
               <input type="range" min="0" max="14" step="0.5" value={studyHours} onChange={e => setStudyHours(parseFloat(e.target.value))} className="w-full accent-indigo-500" aria-label="Study hours slider" />
             </div>
          </div>
          
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
          
          {showCrisisAlert && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm mb-2">
              <h4 className="text-red-700 font-bold mb-1">We're here for you.</h4>
              <p className="text-red-600 text-sm mb-2">It sounds like you're going through a really tough time. Please consider reaching out to someone who can help.</p>
              <div className="flex space-x-4">
                <a href="tel:988" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors">Call 988 (Lifeline)</a>
                <a href="sms:741741" className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-200 transition-colors">Text HOME to 741741</a>
              </div>
            </div>
          )}

          <div className="relative flex-1 flex flex-col">
            <textarea 
              value={journalText} onChange={e => setJournalText(e.target.value)}
              placeholder="Write freely — this is just for you and MoodMate..."
              className="w-full flex-1 min-h-[200px] p-5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none resize-none bg-slate-50/50 text-slate-700 text-lg"
              aria-label="Journal text area"
            ></textarea>
            <button 
              onClick={toggleListening}
              className={`absolute bottom-4 right-4 p-3 rounded-full shadow-md transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-500 hover:text-indigo-500 hover:bg-indigo-50'}`}
              title="Voice Input"
              aria-label="Start voice input"
            >
              🎤
            </button>
          </div>

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

import { useState, useEffect, useRef } from 'react';
import { analyzeMood, model } from '../../utils/gemini';
import { detectCrisisKeywords } from '../../utils/safety';

export default function Chat({ profile, logs, activeContext }) {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const chatScrollRef = useRef(null);

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
      setChatInput(prev => prev ? prev + ' ' + transcript : transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  // Auto-start conversation if activeContext changes and messages are empty
  useEffect(() => {
    if (activeContext && messages.length === 0) {
      startAIConversation(activeContext, logs.slice(-6, -1));
    }
  }, [activeContext]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const startAIConversation = async (entry, recentLogs) => {
    setMessages([]);
    setIsTyping(true);
    
    const responseText = await analyzeMood(profile, entry, recentLogs);
    setMessages([{ role: 'model', text: responseText }]);
    
    setIsTyping(false);
  };

  const sendChatMessage = async (text) => {
    if (!text.trim()) return;

    if (detectCrisisKeywords(text)) {
      setShowCrisisAlert(true);
    } else {
      setShowCrisisAlert(false);
    }
    const userMsg = { role: 'user', text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatInput('');
    setIsTyping(true);

    // Filter out consecutive roles for history
    let apiHistory = [];
    messages.forEach(m => {
      if (apiHistory.length > 0 && apiHistory[apiHistory.length - 1].role === m.role) {
        apiHistory[apiHistory.length - 1].parts[0].text += `\n${m.text}`;
      } else {
        apiHistory.push({ role: m.role, parts: [{ text: m.text }] });
      }
    });

    try {
      const chat = model.startChat({
        systemInstruction: { parts: [{ text: "Stay empathetic, chill, supportive, and motivating. Keep answers concise." }] },
        history: apiHistory
      });

      const result = await chat.sendMessage(text);
      const responseText = result.response.text();
      setMessages([...newMessages, { role: 'model', text: responseText }]);
      
    } catch (err) {
       console.error("Chat SDK Error:", err);
       setMessages([...newMessages, { role: 'model', text: `Connection error: ${err.message}` }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden animate-fade-in">
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">💬</div>
        <div>
          <h3 className="font-bold text-slate-800">MoodMate Assistant</h3>
          <p className="text-xs text-slate-500">AI-powered support</p>
        </div>
      </div>

      <div ref={chatScrollRef} className="flex-1 p-6 overflow-y-auto space-y-6">
        
        {showCrisisAlert && (
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm animate-fade-in">
            <h4 className="text-red-700 font-bold mb-1">We're here for you.</h4>
            <p className="text-red-600 text-sm mb-2">It sounds like you're having a really difficult time. Please consider reaching out.</p>
            <div className="flex space-x-4">
              <a href="tel:988" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors">Call 988</a>
              <a href="sms:741741" className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-200 transition-colors">Text HOME to 741741</a>
            </div>
          </div>
        )}

        {!messages.length && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 opacity-60">
            <div className="text-6xl">✨</div>
            <p className="text-lg font-medium">Say hi to MoodMate</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-5 rounded-3xl text-base leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
            }`}>
              {m.text.split('\n').map((line, j) => <p key={j} className={j>0?'mt-3':''}>{line}</p>)}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-5 flex items-center space-x-2 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay:'0.2s'}}></div>
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay:'0.4s'}}></div>
              <span className="text-sm text-slate-400 ml-3 font-medium">MoodMate is listening...</span>
            </div>
          </div>
        )}

        {/* Quick Replies */}
        {messages.length > 0 && messages[messages.length-1].role === 'model' && !isTyping && (
          <div className="flex flex-wrap gap-2 pt-2 animate-fade-in justify-start max-w-[75%]">
            {["Tell me a breathing exercise", "I'm feeling like giving up", "Help me focus right now", "I need motivation"].map(qr => (
              <div 
                key={qr} onClick={() => sendChatMessage(qr)}
                className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium cursor-pointer transition-colors border border-indigo-100"
              >
                {qr}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto flex items-center bg-slate-50 rounded-full border border-slate-200 p-1.5 pl-6 shadow-inner focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
          <input 
            type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChatMessage(chatInput)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-base text-slate-700 py-2"
            aria-label="Chat input"
          />
          <button 
            onClick={toggleListening}
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-2 transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-100'}`}
            title="Voice Input"
            aria-label="Start voice input"
          >
            🎤
          </button>
          <button 
            onClick={() => sendChatMessage(chatInput)}
            disabled={!chatInput.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${chatInput.trim() ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-slate-200 text-slate-400'}`}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

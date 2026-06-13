import { useState, useEffect } from 'react';

// Layout
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import Header from './components/layout/Header';

// Screens
import Onboarding from './components/screens/Onboarding';
import Home from './components/screens/Home';
import CheckIn from './components/screens/CheckIn';
import Chat from './components/screens/Chat';
import Dashboard from './components/screens/Dashboard';

export default function App() {
  // Global State
  const [screen, setScreen] = useState('onboarding');
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeCheckinContext, setActiveCheckinContext] = useState(null);
  const [settings, setSettings] = useState({ geetaQuotesEnabled: true });

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('moodmate_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setScreen('home');
    }
    const savedLogs = localStorage.getItem('moodmate_logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
    const savedSettings = localStorage.getItem('moodmate_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Handlers
  const handleOnboardComplete = (newProfile) => {
    localStorage.setItem('moodmate_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    setScreen('home');
  };

  const handleCheckinComplete = (entry) => {
    const updatedLogs = [...logs, entry];
    setLogs(updatedLogs);
    localStorage.setItem('moodmate_logs', JSON.stringify(updatedLogs));
    
    setActiveCheckinContext(entry);
    setScreen('chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('moodmate_profile');
    localStorage.removeItem('moodmate_logs');
    localStorage.removeItem('moodmate_settings');
    setProfile(null);
    setLogs([]);
    setSettings({ geetaQuotesEnabled: true });
    setScreen('onboarding');
  };

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('moodmate_settings', JSON.stringify(updated));
  };

  // Render Onboarding (no layout wrapper)
  if (screen === 'onboarding') {
    return <Onboarding onComplete={handleOnboardComplete} />;
  }

  // Render Main App
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 text-slate-800">
      
      {/* Desktop Sidebar */}
      <Sidebar screen={screen} setScreen={setScreen} profile={profile} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header */}
        <Header profile={profile} onLogout={handleLogout} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-24 md:pb-8">
          {screen === 'home' && <Home profile={profile} logs={logs} setScreen={setScreen} settings={settings} updateSettings={updateSettings} />}
          {screen === 'checkin' && <CheckIn onComplete={handleCheckinComplete} />}
          {screen === 'chat' && <Chat profile={profile} logs={logs} activeContext={activeCheckinContext} />}
          {screen === 'dashboard' && <Dashboard profile={profile} logs={logs} />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav screen={screen} setScreen={setScreen} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.4); }
      `}</style>
    </div>
  );
}

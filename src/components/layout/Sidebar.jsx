import { HomeIcon, CheckInIcon, ChatIcon, DashboardIcon } from '../icons/Icons';
import { useTranslation } from '../../utils/i18n';

export default function Sidebar({ screen, setScreen, profile, onLogout }) {
  const { t, lang, changeLang } = useTranslation();

  const navItems = [
    { id: 'home', icon: HomeIcon, label: t('nav_home') },
    { id: 'checkin', icon: CheckInIcon, label: t('nav_checkin') },
    { id: 'chat', icon: ChatIcon, label: t('nav_chat') },
    { id: 'dashboard', icon: DashboardIcon, label: t('nav_dashboard') }
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col py-6 shadow-sm z-20">
      <div className="px-6 mb-8 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xl">✨</div>
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">MoodMate</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map(item => {
          const isActive = screen === item.id;
          return (
            <div 
              key={item.id} onClick={() => setScreen(item.id)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <item.icon active={isActive} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
      <div className="p-6 border-t border-slate-100 flex flex-col space-y-4">
        <div className="flex justify-between items-center text-xs">
           <span className="text-slate-500 font-medium uppercase tracking-wider">{t('language')}</span>
           <div className="flex space-x-1">
             <button onClick={() => changeLang('en')} className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-400 hover:bg-slate-50'}`} aria-label="Switch to English">EN</button>
             <button onClick={() => changeLang('hi')} className={`px-2 py-1 rounded ${lang === 'hi' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-400 hover:bg-slate-50'}`} aria-label="Switch to Hindi">HI</button>
           </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-200 to-purple-200 flex items-center justify-center text-indigo-700 font-bold shadow-inner">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">{profile?.name}</p>
              <p className="text-xs text-slate-500">{profile?.examType} Aspirant</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="text-slate-400 hover:text-red-500 p-2 transition-colors rounded-lg hover:bg-red-50"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

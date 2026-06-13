import { HomeIcon, CheckInIcon, ChatIcon, DashboardIcon } from '../icons/Icons';

export default function MobileNav({ screen, setScreen }) {
  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'checkin', icon: CheckInIcon, label: 'Check-in' },
    { id: 'chat', icon: ChatIcon, label: 'Chat' },
    { id: 'dashboard', icon: DashboardIcon, label: 'Dashboard' }
  ];

  return (
    <nav className="md:hidden absolute bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 pb-safe z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = screen === item.id;
          return (
            <div 
              key={item.id} onClick={() => setScreen(item.id)}
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer relative group"
            >
              {isActive && <div className="absolute top-0 w-8 h-1 bg-indigo-500 rounded-b-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>}
              <div className={`transition-transform duration-200 ${isActive ? 'transform -translate-y-1' : 'group-hover:-translate-y-0.5'}`}>
                <item.icon active={isActive} />
              </div>
              <span className={`text-[10px] font-medium mt-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

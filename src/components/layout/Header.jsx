export default function Header({ profile, onLogout }) {
  return (
    <header className="md:hidden px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-100 z-10 shrink-0 shadow-sm">
      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">MoodMate</h2>
      <div className="flex items-center space-x-3">
        <button onClick={onLogout} className="text-slate-400 hover:text-red-500 p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-200 to-purple-200 flex items-center justify-center text-indigo-700 font-semibold">
          {profile?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

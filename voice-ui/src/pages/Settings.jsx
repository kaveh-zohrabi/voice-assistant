import React from 'react';

export default function Settings({ onBack, lang, setLang, soundEnabled, setSoundEnabled }) {
  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[120px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-6">
        <header className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-white text-xl font-bold">تنظیمات</h1>
        </header>

        <div className="space-y-4" style={{ animation: 'fade-in 0.5s ease-out' }}>
          {/* Language */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <div>
                <h2 className="text-white font-medium">زبان</h2>
                <p className="text-slate-500 text-xs">Language</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLang('fa')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${lang === 'fa' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                فارسی
              </button>
              <button
                onClick={() => setLang('en')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                English
              </button>
            </div>
          </div>

          {/* Sound */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                </div>
                <div>
                  <h2 className="text-white font-medium">خواندن با صدا</h2>
                  <p className="text-slate-500 text-xs">Read responses aloud</p>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-7 rounded-full transition-all duration-300 relative ${soundEnabled ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all duration-300 ${soundEnabled ? 'right-1' : 'right-6'}`} />
              </button>
            </div>
          </div>

          {/* About */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
              <div>
                <h2 className="text-white font-medium">درباره جارویس</h2>
                <p className="text-slate-500 text-xs">About Jarvis</p>
              </div>
            </div>
          </div>

          {/* Model Info */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div>
                <h2 className="text-white font-medium">مدل هوش مصنوعی</h2>
                <p className="text-slate-500 text-xs">AI Model</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-slate-300 text-sm font-mono">kaveh (Gemini 3.1 Flash Lite)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

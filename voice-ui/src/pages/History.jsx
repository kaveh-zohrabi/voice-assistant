import React from 'react';

export default function History({ onBack, history, onClear }) {
  const userMessages = history.filter(h => h.role === 'user');

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-[120px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h1 className="text-white text-xl font-bold">تاریخچه چت</h1>
          </div>
          {userMessages.length > 0 && (
            <button onClick={onClear} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-all">
              پاک کردن همه
            </button>
          )}
        </header>

        {userMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ animation: 'fade-in 0.5s ease-out' }}>
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <p className="text-slate-500 text-sm">هنوز چتی نداشتید</p>
            <p className="text-slate-600 text-xs mt-1">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-3" style={{ animation: 'fade-in 0.5s ease-out' }}>
            <p className="text-slate-500 text-xs mb-4">{userMessages.length} مکالمه</p>
            {history.map((item, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border transition-all duration-200 hover:bg-white/[0.03] ${
                  item.role === 'user'
                    ? 'bg-blue-600/5 border-blue-500/10'
                    : 'bg-white/[0.02] border-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    item.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {item.role === 'user' ? 'ش' : 'ج'}
                  </div>
                  <span className="text-slate-500 text-xs">{item.role === 'user' ? 'شما' : 'جارویس'}</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3" dir="auto">
                  {item.text.replace(/\[FA\]|\[EN\]/g, '').replace(/```[\s\S]*?```/g, '[کد]').trim().slice(0, 200)}
                  {item.text.length > 200 && '...'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

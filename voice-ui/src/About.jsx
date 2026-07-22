import React from 'react';

export default function About({ onBack }) {
  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
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
          <h1 className="text-white text-xl font-bold">درباره ما</h1>
        </header>
        <div className="flex-1 space-y-5" style={{ animation: 'fade-in 0.5s ease-out' }}>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent" style={{ backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }}>جارویس</span>
            </h2>
            <p className="text-slate-500 text-sm">دستیار صوتی هوشمند شما</p>
          </div>
          {[
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>, color: 'blue', title: 'جارویس کیه؟', content: 'جارویس یک دستیار صوتی هوشمند هست که با استفاده از هوش مصنوعی طراحی شده. می‌تونی باهاش فارسی یا انگلیسی حرف بزنی و جواب بگیری.' },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m7.5 12 3 3 6-6"/></svg>, color: 'purple', title: 'قابلیت‌ها', items: ['پاسخ به سوالات در هر موضوعی','حل مسائل ریاضی','نوشتن کد به زبان‌های مختلف','گفتن جوک و داستان','ترجمه و توضیح مفاهیم'] },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>, color: 'cyan', title: 'تکنولوژی‌ها', items: ['React','Node.js','Ollama','Tailwind CSS','Web Speech API'] },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>, color: 'green', title: 'سورس کد', content: 'پروژه کاملاً متن‌باز هست.', link: 'https://github.com/kaveh-zohrabi/voice-assistant', linkLabel: 'GitHub' },
          ].map((card, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl bg-${card.color}-500/10 flex items-center justify-center`}>{card.icon}</div>
                <h3 className="text-white font-medium">{card.title}</h3>
              </div>
              {card.content && <p className="text-slate-400 text-sm leading-relaxed">{card.content}</p>}
              {card.items && <ul className="text-slate-400 text-sm space-y-1.5">{card.items.map((item, j) => <li key={j} className="flex items-start gap-2"><span className={`text-${card.color}-400 mt-1 text-xs`}>●</span><span>{item}</span></li>)}</ul>}
              {card.link && <a href={card.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 hover:text-white transition-all"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>{card.linkLabel}</a>}
            </div>
          ))}
          <div className="text-center py-4"><p className="text-slate-600 text-xs">Made with ❤️ by Kaveh Zohrabi</p></div>
        </div>
      </div>
    </div>
  );
}

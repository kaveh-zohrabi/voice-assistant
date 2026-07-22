import React, { useState, useCallback, useRef, useEffect } from 'react';
import Auth from './pages/Auth';
import Welcome from './pages/Welcome';
import Settings from './pages/Settings';
import History from './pages/History';
import Profile from './pages/Profile';
import About from './About';
import Admin from './pages/Admin';
import ChatMessage from './components/ChatMessage';

function Sidebar({ open, onClose, setPage, user, conversations, onNewChat, onSelectChat, onLogout }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#111118] border-r border-white/[0.06] z-50 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:z-0 flex flex-col flex-shrink-0`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
              </div>
              <span className="text-white font-bold text-sm">Jarvis</span>
            </div>
            <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-all duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            مکالمه جدید
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
          {conversations.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p className="text-slate-600 text-xs">هنوز مکالمه‌ای ندارید</p>
            </div>
          )}
          {conversations.map((c, i) => (
            <button key={i} onClick={() => onSelectChat(c)} className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200 truncate group">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 opacity-50 group-hover:opacity-100"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span className="truncate">{c.title || 'مکالمه جدید'}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.06] space-y-0.5">
          <button onClick={() => setPage('settings')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            تنظیمات
          </button>
          {user?.role === 'admin' && (
            <button onClick={() => setPage('admin')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-yellow-400/80 hover:bg-yellow-500/10 hover:text-yellow-400 transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              پنل ادمین
            </button>
          )}
          <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            خروج
          </button>
        </div>
      </aside>
    </>
  );
}

function WelcomeScreen({ userName, onSend }) {
  const suggestions = [
    { icon: '💡', text: 'یه پروژه React بساز', en: 'Build a React project' },
    { icon: '🧮', text: '۲۵ ضربدر ۴ چنده', en: 'What is 25 * 4' },
    { icon: '💻', text: 'یک API با Python بنویس', en: 'Write a Python API' },
    { icon: '📝', text: 'درباره هوش مصنوعی توضیح بده', en: 'Explain AI' },
    { icon: '🎲', text: 'یه جوک بگو', en: 'Tell me a joke' },
    { icon: '🔧', text: 'یک ربات تلگرام بساز', en: 'Build a Telegram bot' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6" style={{ animation: 'float 4s ease-in-out infinite' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">سلام {userName} 👋</h2>
      <p className="text-slate-500 text-sm mb-8 text-center max-w-sm">چطور می‌تونم کمکت کنم؟ از کدنویسی تا ریاضی تا هر موضوعی.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl w-full">
        {suggestions.map((s) => (
          <button key={s.text} onClick={() => onSend(s.text)} className="text-right px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <span className="text-lg">{s.icon}</span>
              <span className="text-slate-400 text-sm group-hover:text-white transition-colors">{s.text}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function VoiceAssistant() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('jarvis_user')); } catch { return null; } });
  const [page, setPage] = useState(user ? 'home' : 'auth');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('fa');
  const [speaking, setSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [history, setHistory] = useState([]);
  const [conversations] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, []);
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { const h = (e) => { if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement !== inputRef.current) { e.preventDefault(); inputRef.current?.focus(); } }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, []);

  const handleLogin = (u) => { setUser(u); setPage('welcome'); };
  const handleLogout = () => { localStorage.removeItem('jarvis_user'); localStorage.removeItem('jarvis_token'); setUser(null); setPage('auth'); setMessages([]); };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert(lang === 'fa' ? 'مرورگر پشتیبانی نمی‌کند' : 'Browser not supported'); return; }
    const r = new SR(); r.lang = lang === 'fa' ? 'fa-IR' : 'en-US';
    r.onstart = () => setLoading(true);
    r.onresult = (e) => { const text = e.results[0][0].transcript; sendMessage(text); };
    r.onerror = () => setLoading(false);
    r.start();
  };

  const sendMessage = async (message) => {
    setMessages(prev => [...prev, { role: 'user', text: message }]);
    setLoading(true);
    setTextInput('');

    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, lang }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      // Add empty assistant message
      setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n').filter(Boolean)) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const p = JSON.parse(data);
              if (p.text) {
                full += p.text;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1] = { role: 'assistant', text: full };
                  return newMsgs;
                });
              }
            } catch {}
          }
        }
      }

      if (full && soundEnabled) speakResponse(full);
    } catch (e) {
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { role: 'assistant', text: `Error: ${e.message}` };
        return newMsgs;
      });
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = useCallback((fullText) => {
    const clean = fullText.replace(/```[\s\S]*?```/g, '').trim();
    const fa = clean.split('[FA]')[1]?.split('[EN]')[0]?.trim() || clean;
    const en = clean.split('[EN]')[1]?.trim() || '';
    if (!fa && !en) return;
    setSpeaking(true);
    window.speechSynthesis.cancel();
    const sEn = () => { if (!en) { setSpeaking(false); return; } const u = new SpeechSynthesisUtterance(en); u.lang = 'en-US'; u.rate = 0.9; u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false); window.speechSynthesis.speak(u); };
    const sFa = () => { if (!fa) { sEn(); return; } const u = new SpeechSynthesisUtterance(fa); u.lang = 'fa-IR'; u.rate = 0.9; u.onend = () => sEn(); u.onerror = () => sEn(); window.speechSynthesis.speak(u); };
    sFa();
  }, []);

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setSpeaking(false); };
  const newChat = () => { setMessages([]); setSidebarOpen(false); };

  if (page === 'auth') return <Auth onLogin={handleLogin} />;
  if (page === 'welcome') return <Welcome onStart={() => setPage('home')} />;
  if (page === 'settings') return <Settings onBack={() => setPage('home')} lang={lang} setLang={setLang} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />;
  if (page === 'history') return <History onBack={() => setPage('home')} history={history} onClear={() => setHistory([])} />;
  if (page === 'profile') return <Profile onBack={() => setPage('home')} user={user} onLogout={handleLogout} />;
  if (page === 'about') return <About onBack={() => setPage('home')} />;
  if (page === 'admin') return <Admin onBack={() => setPage('home')} />;

  return (
    <div className="h-screen flex bg-[#0a0a1a] overflow-hidden">
      <style>{`@keyframes pulse-glow { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } } @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } } @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @keyframes typing-dot { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } } .scrollbar-thin::-webkit-scrollbar { width: 4px; } .scrollbar-thin::-webkit-scrollbar-track { background: transparent; } .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }`}</style>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} setPage={setPage} user={user} conversations={conversations} onNewChat={newChat} onSelectChat={() => setSidebarOpen(false)} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-lg flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-sm truncate">Jarvis AI</h1>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage('about')} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all" title="درباره"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></button>
            <button onClick={() => setPage('profile')} className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'J'}</button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {messages.length === 0 && !loading ? (
            <WelcomeScreen userName={user?.name} onSend={sendMessage} />
          ) : (
            <div className="py-4">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} isLatest={i === messages.length - 1} userName={user?.name} />
              ))}
              {loading && messages[messages.length - 1]?.text === '' && (
                <div className="max-w-3xl mx-auto px-4 py-5">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/></svg>
                    </div>
                    <div className="pt-1">
                      <div className="flex items-center gap-2 mb-1"><span className="text-white font-medium text-sm">Jarvis</span><span className="text-xs text-emerald-500/60">AI</span></div>
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-slate-500 rounded-full" style={{ animation: 'typing-dot 1.4s ease-in-out infinite' }} />
                        <div className="w-2 h-2 bg-slate-500 rounded-full" style={{ animation: 'typing-dot 1.4s ease-in-out infinite 0.2s' }} />
                        <div className="w-2 h-2 bg-slate-500 rounded-full" style={{ animation: 'typing-dot 1.4s ease-in-out infinite 0.4s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-lg p-3 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            {speaking && <div className="flex justify-center mb-2"><button onClick={stopSpeaking} className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/30 transition-all">توقف خواندن</button></div>}
            <form onSubmit={(e) => { e.preventDefault(); if (!textInput.trim() || loading) return; sendMessage(textInput.trim()); }} className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={textInput}
                  onChange={(e) => { setTextInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.target.form.requestSubmit(); } }}
                  disabled={loading}
                  placeholder={lang === 'fa' ? 'پیامت رو بنویس... (Enter برای ارسال)' : 'Type your message... (Enter to send)'}
                  dir="auto"
                  rows={1}
                  className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 transition-all resize-none overflow-hidden"
                />
                <button type="button" onClick={startListening} disabled={loading}
                  className={`absolute left-2 bottom-2 p-2 rounded-xl transition-all ${loading ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                </button>
              </div>
              <button type="submit" disabled={!textInput.trim() || loading}
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
            <p className="text-center text-slate-600 text-[10px] mt-2">Jarvis AI · Built with ❤️</p>
          </div>
        </div>
      </div>
    </div>
  );
}

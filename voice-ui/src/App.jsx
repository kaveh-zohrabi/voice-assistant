import React, { useState, useCallback, useRef, useEffect } from 'react';
import Auth from './pages/Auth';
import Welcome from './pages/Welcome';
import Settings from './pages/Settings';
import History from './pages/History';
import Profile from './pages/Profile';
import About from './About';
import Admin from './pages/Admin';

function GlowOrb({ speaking }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="rounded-full blur-3xl transition-all duration-700"
        style={{ width: speaking ? '260px' : '160px', height: speaking ? '260px' : '160px', background: speaking ? 'radial-gradient(circle, rgba(96,165,250,0.35) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)' : 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 60%)', animation: speaking ? 'pulse-glow 1.5s ease-in-out infinite' : 'none' }} />
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={handleCopy} className="absolute top-2 left-2 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white text-xs transition-all flex items-center gap-1">
      {copied ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Copied!</> : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>}
    </button>
  );
}

function MessageBubble({ text }) {
  const [showEnglish, setShowEnglish] = useState(false);
  const parts = text.split(/\[FA\]|\[EN\]/g).filter(Boolean);
  let farsi = '', english = '';
  parts.forEach((part, i) => {
    if (text.indexOf('[FA]') < text.indexOf('[EN]') || text.indexOf('[EN]') === -1) { if (i === 0) farsi = part.trim(); else if (part.trim()) english = part.trim(); }
    else { if (i === 0) english = part.trim(); else if (part.trim()) farsi = part.trim(); }
  });
  if (!farsi && !english) farsi = text;
  const renderContent = (content) => {
    const regex = /```(\w+)?\n([\s\S]*?)```/g; const segs = []; let last = 0, m;
    while ((m = regex.exec(content)) !== null) { if (m.index > last) segs.push({ type: 'text', content: content.slice(last, m.index) }); segs.push({ type: 'code', lang: m[1] || '', content: m[2].trim() }); last = m.index + m[0].length; }
    if (last < content.length) segs.push({ type: 'text', content: content.slice(last) });
    return segs.map((s, i) => s.type === 'code' ? (<div key={i} className="relative my-3 rounded-xl overflow-hidden bg-[#1a1b26] border border-white/10"><div className="flex items-center justify-between px-4 py-1.5 bg-white/5 border-b border-white/5"><span className="text-xs text-slate-500">{s.lang || 'code'}</span><CopyButton text={s.content} /></div><div className="px-4 py-3 overflow-x-auto"><pre className="text-sm text-slate-300 font-mono leading-relaxed"><code>{s.content}</code></pre></div></div>) : <p key={i} className="text-slate-200 leading-relaxed whitespace-pre-wrap">{s.content}</p>);
  };
  return (
    <div className="space-y-2">
      <div className="text-[15px] leading-relaxed" dir="auto">{renderContent(farsi)}</div>
      {english && (<div><button onClick={() => setShowEnglish(!showEnglish)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${showEnglish ? 'rotate-90' : ''}`}><polyline points="9 18 15 12 9 6"/></svg>English</button>{showEnglish && <div className="mt-2 pl-3 border-r-2 border-blue-500/30 text-sm text-slate-400 leading-relaxed" style={{ animation: 'fade-in 0.2s ease-out' }}>{english}</div>}</div>)}
    </div>
  );
}

function Sidebar({ open, onClose, setPage, user, conversations, onNewChat, onSelectChat, onLogout }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#111118] border-r border-white/[0.06] z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:z-0 flex flex-col`}>
        <div className="p-4 border-b border-white/[0.06]">
          <button onClick={onNewChat} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            مکالمه جدید
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 && <p className="text-slate-600 text-xs text-center mt-4">هنوز مکالمه‌ای ندارید</p>}
          {conversations.map((c, i) => (
            <button key={i} onClick={() => onSelectChat(c)} className="w-full text-right px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all truncate">
              {c.title || 'مکالمه جدید'}
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-white/[0.06] space-y-1">
          <button onClick={() => setPage('settings')} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/></svg>
            تنظیمات
          </button>
          {user?.role === 'admin' && (
            <button onClick={() => setPage('admin')} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-yellow-400 hover:bg-yellow-500/10 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              پنل ادمین
            </button>
          )}
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            خروج
          </button>
        </div>
      </aside>
    </>
  );
}

export default function VoiceAssistant() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('jarvis_user')); } catch { return null; } });
  const [page, setPage] = useState(user ? 'home' : 'auth');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('fa');
  const [speaking, setSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [history, setHistory] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConvo, setCurrentConvo] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const historyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (historyRef.current) historyRef.current.scrollTop = historyRef.current.scrollHeight; }, [history, response]);
  useEffect(() => { const h = (e) => { if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement !== inputRef.current) { e.preventDefault(); inputRef.current?.focus(); } }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, []);

  const handleLogin = (u) => { setUser(u); setPage('welcome'); };
  const handleLogout = () => { localStorage.removeItem('jarvis_user'); localStorage.removeItem('jarvis_token'); setUser(null); setPage('auth'); setHistory([]); setConversations([]); };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert(lang === 'fa' ? 'مرورگر پشتیبانی نمی‌کند' : 'Browser not supported'); return; }
    const r = new SR(); r.lang = lang === 'fa' ? 'fa-IR' : 'en-US';
    r.onstart = () => setLoading(true); r.onresult = (e) => sendMessage(e.results[0][0].transcript); r.onerror = () => setLoading(false); r.start();
  };

  const sendMessage = async (message) => {
    setHistory(prev => [...prev, { role: 'user', text: message }]); setResponse('');
    try {
      const res = await fetch('http://localhost:3000/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, lang, conversationId: currentConvo?.id }) });
      const reader = res.body.getReader(); const decoder = new TextDecoder(); let full = '';
      while (true) { const { done, value } = await reader.read(); if (done) break; const chunk = decoder.decode(value, { stream: true }); for (const line of chunk.split('\n').filter(Boolean)) { if (line.startsWith('data: ')) { const data = line.slice(6); if (data === '[DONE]') break; try { const p = JSON.parse(data); if (p.text) { full += p.text; setResponse(full); } } catch {} } } }
      if (full) { setHistory(prev => [...prev, { role: 'assistant', text: full }]); if (soundEnabled) speakResponse(full); }
    } catch (e) { setResponse(`Error: ${e.message}`); setHistory(prev => [...prev, { role: 'assistant', text: `Error: ${e.message}` }]); } finally { setLoading(false); }
  };

  const speakResponse = useCallback((fullText) => {
    const clean = fullText.replace(/```[\s\S]*?```/g, '').trim();
    const fa = clean.split('[FA]')[1]?.split('[EN]')[0]?.trim() || clean;
    const en = clean.split('[EN]')[1]?.trim() || '';
    if (!fa && !en) return;
    setSpeaking(true); window.speechSynthesis.cancel();
    const sEn = () => { if (!en) { setSpeaking(false); return; } const u = new SpeechSynthesisUtterance(en); u.lang = 'en-US'; u.rate = 0.9; u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false); window.speechSynthesis.speak(u); };
    const sFa = () => { if (!fa) { sEn(); return; } const u = new SpeechSynthesisUtterance(fa); u.lang = 'fa-IR'; u.rate = 0.9; u.onend = () => sEn(); u.onerror = () => sEn(); window.speechSynthesis.speak(u); };
    sFa();
  }, []);

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setSpeaking(false); };
  const clearChat = () => { setHistory([]); setResponse(''); };
  const newChat = () => { setHistory([]); setResponse(''); setCurrentConvo(null); setSidebarOpen(false); };

  if (page === 'auth') return <Auth onLogin={handleLogin} />;
  if (page === 'welcome') return <Welcome onStart={() => setPage('home')} />;
  if (page === 'settings') return <Settings onBack={() => setPage('home')} lang={lang} setLang={setLang} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />;
  if (page === 'history') return <History onBack={() => setPage('home')} history={history} onClear={clearChat} />;
  if (page === 'profile') return <Profile onBack={() => setPage('home')} user={user} onLogout={handleLogout} />;
  if (page === 'about') return <About onBack={() => setPage('home')} />;
  if (page === 'admin') return <Admin onBack={() => setPage('home')} user={user} />;

  return (
    <div className="h-screen flex bg-[#0a0a1a] overflow-hidden">
      <style>{`@keyframes pulse-glow { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } } @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @keyframes typing-dot { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } } .scrollbar-thin::-webkit-scrollbar { width: 4px; } .scrollbar-thin::-webkit-scrollbar-track { background: transparent; } .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }`}</style>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} page={page} setPage={setPage} user={user} conversations={conversations} onNewChat={newChat} onSelectChat={(c) => { setCurrentConvo(c); setSidebarOpen(false); }} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-lg flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold truncate">{currentConvo?.title || 'Jarvis'}</h1>
            <p className="text-slate-500 text-xs truncate">{lang === 'fa' ? 'دستیار صوتی هوشمند' : 'Smart Voice Assistant'}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage('history')} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all" title="تاریخچه"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></button>
            <button onClick={() => setPage('about')} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all" title="درباره"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></button>
            <button onClick={() => setPage('profile')} className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'J'}</button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div ref={historyRef} className="flex-1 overflow-y-auto scrollbar-thin">
            {history.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center h-full px-4">
                <GlowOrb speaking={speaking} />
                <div className="relative mb-6" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  </div>
                </div>
                <h2 className="text-white text-xl font-bold mb-2">سلام {user?.name || ''} 👋</h2>
                <p className="text-slate-500 text-sm text-center max-w-sm">{lang === 'fa' ? 'چطور می‌تونم کمکت کنم؟ صدا بزن یا تایپ کن.' : 'How can I help you? Speak or type a message.'}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-md">
                  {[{ icon: '🎲', fa: 'یه جوک بگو', en: 'Tell me a joke' }, { icon: '🧮', fa: '۲۵ ضربدر ۴', en: '25 * 4' }, { icon: '💡', fa: 'چیز جالب بگو', en: 'Say something interesting' }, { icon: '💻', fa: 'کد python بنویس', en: 'Write python code' }].map((a) => (
                    <button key={a.fa} onClick={() => sendMessage(lang === 'fa' ? a.fa : a.en)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs hover:bg-white/10 hover:text-white transition-all">
                      {a.icon} {lang === 'fa' ? a.fa : a.en}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {history.map((item, i) => (
                  <div key={i} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animation: 'fade-in 0.3s ease-out' }}>
                    <div className={`max-w-[85%] md:max-w-[75%] ${item.role === 'user' ? '' : ''}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        {item.role === 'assistant' && <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/></svg></div>}
                        <span className="text-slate-500 text-xs">{item.role === 'user' ? (user?.name || 'شما') : 'Jarvis'}</span>
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-sm ${item.role === 'user' ? 'bg-blue-600/15 border border-blue-500/15 text-blue-50' : 'bg-white/[0.03] border border-white/[0.06]'}`}>
                        {item.role === 'assistant' ? <MessageBubble text={item.text} /> : <span dir="auto">{item.text}</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && !response && (
                  <div className="flex justify-start" style={{ animation: 'fade-in 0.3s ease-out' }}>
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3">
                      <div className="flex gap-1.5"><div className="w-2 h-2 bg-slate-500 rounded-full" style={{ animation: 'typing-dot 1.4s ease-in-out infinite' }} /><div className="w-2 h-2 bg-slate-500 rounded-full" style={{ animation: 'typing-dot 1.4s ease-in-out infinite 0.2s' }} /><div className="w-2 h-2 bg-slate-500 rounded-full" style={{ animation: 'typing-dot 1.4s ease-in-out infinite 0.4s' }} /></div>
                    </div>
                  </div>
                )}
                {response && (
                  <div className="flex justify-start" style={{ animation: 'fade-in 0.3s ease-out' }}>
                    <div className="max-w-[85%] md:max-w-[75%]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/></svg></div>
                        <span className="text-slate-500 text-xs">Jarvis</span>
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-sm">
                        <MessageBubble text={response} />
                        {speaking && <div className="mt-2 flex items-center gap-1.5 text-blue-400"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" /><span className="text-xs">در حال خواندن...</span></div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-lg p-3 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            {speaking && <div className="flex justify-center mb-2"><button onClick={stopSpeaking} className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/30 transition-all">توقف خواندن</button></div>}
            <form onSubmit={(e) => { e.preventDefault(); if (!textInput.trim() || loading) return; sendMessage(textInput.trim()); setTextInput(''); }} className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <input ref={inputRef} type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} disabled={loading}
                  placeholder={lang === 'fa' ? 'پیامت رو بنویس...' : 'Type your message...'} dir="auto"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 transition-all pr-12" />
                <button type="button" onClick={startListening} disabled={loading}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${loading ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                </button>
              </div>
              <button type="submit" disabled={!textInput.trim() || loading}
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
            <p className="text-center text-slate-600 text-[10px] mt-2">Jarvis AI · Made with ❤️</p>
          </div>
        </div>
      </div>
    </div>
  );
}

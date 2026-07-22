import React, { useState, useCallback, useRef, useEffect } from 'react';
import Welcome from './pages/Welcome';
import Settings from './pages/Settings';
import History from './pages/History';
import About from './About';

function WaveAnimation({ active }) {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-300"
          style={{
            height: active ? `${8 + Math.random() * 24}px` : '4px',
            backgroundColor: active ? ['#60a5fa','#818cf8','#a78bfa','#c084fc','#818cf8','#60a5fa','#38bdf8'][i] : '#475569',
            animation: active ? `wave 0.${3 + i}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

function GlowOrb({ speaking }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className="rounded-full blur-3xl transition-all duration-700"
        style={{
          width: speaking ? '280px' : '180px',
          height: speaking ? '280px' : '180px',
          background: speaking
            ? 'radial-gradient(circle, rgba(96,165,250,0.35) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 60%)',
          animation: speaking ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
        }}
      />
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={handleCopy} className="absolute top-2 left-2 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white text-xs transition-all duration-200 flex items-center gap-1">
      {copied ? (<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>) : (<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>)}
    </button>
  );
}

function MessageBubble({ text }) {
  const [showEnglish, setShowEnglish] = useState(false);
  const parts = text.split(/\[FA\]|\[EN\]/g).filter(Boolean);
  let farsi = '', english = '';
  parts.forEach((part, i) => {
    if (text.indexOf('[FA]') < text.indexOf('[EN]') || text.indexOf('[EN]') === -1) {
      if (i === 0) farsi = part.trim(); else if (part.trim()) english = part.trim();
    } else {
      if (i === 0) english = part.trim(); else if (part.trim()) farsi = part.trim();
    }
  });
  if (!farsi && !english) farsi = text;

  const renderContent = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const segments = [];
    let lastIndex = 0, match;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) segments.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      segments.push({ type: 'code', lang: match[1] || '', content: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) segments.push({ type: 'text', content: content.slice(lastIndex) });

    return segments.map((seg, i) => {
      if (seg.type === 'code') return (
        <div key={i} className="relative my-3 rounded-xl overflow-hidden bg-[#1a1b26] border border-white/10">
          <div className="flex items-center justify-between px-4 py-1.5 bg-white/5 border-b border-white/5">
            <span className="text-xs text-slate-500">{seg.lang || 'code'}</span>
            <CopyButton text={seg.content} />
          </div>
          <div className="px-4 py-3 overflow-x-auto">
            <pre className="text-sm text-slate-300 font-mono leading-relaxed"><code>{seg.content}</code></pre>
          </div>
        </div>
      );
      return <p key={i} className="text-slate-200 leading-relaxed whitespace-pre-wrap">{seg.content}</p>;
    });
  };

  return (
    <div className="space-y-2">
      <div className="text-[15px] leading-relaxed" dir="auto">{renderContent(farsi)}</div>
      {english && (
        <div>
          <button onClick={() => setShowEnglish(!showEnglish)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors duration-200">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${showEnglish ? 'rotate-90' : ''}`}><polyline points="9 18 15 12 9 6"/></svg>
            English
          </button>
          {showEnglish && <div className="mt-2 pl-3 border-r-2 border-blue-500/30 text-sm text-slate-400 leading-relaxed" style={{ animation: 'fade-in-up 0.2s ease-out' }}>{english}</div>}
        </div>
      )}
    </div>
  );
}

export default function VoiceAssistant() {
  const [page, setPage] = useState('welcome');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('fa');
  const [speaking, setSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [history, setHistory] = useState([]);
  const [textInput, setTextInput] = useState('');
  const historyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }, [history, response]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement !== inputRef.current) {
        e.preventDefault(); inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert(lang === 'fa' ? 'مرورگر پشتیبانی نمی‌کند' : 'Browser not supported'); return; }
    const recognition = new SR();
    recognition.lang = lang === 'fa' ? 'fa-IR' : 'en-US';
    recognition.onstart = () => setLoading(true);
    recognition.onresult = (e) => { sendMessage(e.results[0][0].transcript); };
    recognition.onerror = () => setLoading(false);
    recognition.start();
  };

  const sendMessage = async (message) => {
    setHistory(prev => [...prev, { role: 'user', text: message }]);
    setResponse('');
    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, lang }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n').filter(Boolean)) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try { const p = JSON.parse(data); if (p.text) { full += p.text; setResponse(full); } } catch {}
          }
        }
      }
      if (full) { setHistory(prev => [...prev, { role: 'assistant', text: full }]); if (soundEnabled) speakResponse(full); }
    } catch (e) { setResponse(`Error: ${e.message}`); setHistory(prev => [...prev, { role: 'assistant', text: `Error: ${e.message}` }]); }
    finally { setLoading(false); }
  };

  const speakResponse = useCallback((fullText) => {
    const clean = fullText.replace(/```[\s\S]*?```/g, '').trim();
    const fa = clean.split('[FA]')[1]?.split('[EN]')[0]?.trim() || clean;
    const en = clean.split('[EN]')[1]?.trim() || '';
    if (!fa && !en) return;
    setSpeaking(true); window.speechSynthesis.cancel();
    const speakEn = () => {
      if (!en) { setSpeaking(false); return; }
      const u = new SpeechSynthesisUtterance(en); u.lang = 'en-US'; u.rate = 0.9;
      u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    };
    const speakFa = () => {
      if (!fa) { speakEn(); return; }
      const u = new SpeechSynthesisUtterance(fa); u.lang = 'fa-IR'; u.rate = 0.9;
      u.onend = () => speakEn(); u.onerror = () => speakEn();
      window.speechSynthesis.speak(u);
    };
    speakFa();
  }, []);

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setSpeaking(false); };
  const clearChat = () => { setHistory([]); setResponse(''); };

  if (page === 'welcome') return <Welcome onStart={() => setPage('home')} />;
  if (page === 'settings') return <Settings onBack={() => setPage('home')} lang={lang} setLang={setLang} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />;
  if (page === 'history') return <History onBack={() => setPage('home')} history={history} onClear={clearChat} />;
  if (page === 'about') return <About onBack={() => setPage('home')} />;

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      <style>{`
        @keyframes wave { 0% { height: 6px; } 100% { height: 24px; } }
        @keyframes pulse-glow { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ring-pulse { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes typing-dot { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-4px); } }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 h-screen flex flex-col max-w-2xl mx-auto px-4 py-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight">Jarvis</h1>
              <p className="text-slate-500 text-xs">{lang === 'fa' ? 'دستیار صوتی هوشمند' : 'Smart Voice Assistant'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage('history')} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all" title="تاریخچه">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </button>
            <button onClick={() => setPage('settings')} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all" title="تنظیمات">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </button>
            <button onClick={() => setPage('about')} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all" title="درباره ما">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </button>
            <button onClick={() => setLang(l => l === 'fa' ? 'en' : 'fa')} className="px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:bg-white/10 hover:text-white transition-all">
              {lang === 'fa' ? 'EN' : 'فا'}
            </button>
          </div>
        </header>

        {/* Mic */}
        <div className="flex-shrink-0 flex flex-col items-center mb-4">
          <GlowOrb speaking={speaking} />
          <div className="relative mb-3" style={{ animation: 'float 4s ease-in-out infinite' }}>
            <button onClick={startListening} disabled={loading}
              className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 group"
              style={{ background: loading ? 'linear-gradient(135deg, #1e40af, #7c3aed)' : 'linear-gradient(135deg, #1e3a5f, #1e1b4b)', boxShadow: loading ? '0 0 35px rgba(99,102,241,0.4)' : '0 0 25px rgba(30,58,95,0.5)' }}>
              {loading && (<><div className="absolute inset-0 rounded-full border-2 border-blue-400/30" style={{ animation: 'ring-pulse 1.5s ease-out infinite' }} /><div className="absolute inset-0 rounded-full border-2 border-blue-400/20" style={{ animation: 'ring-pulse 1.5s ease-out infinite 0.5s' }} /></>)}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={loading ? '#93c5fd' : '#64748b'} strokeWidth="1.5" className="transition-all duration-300 group-hover:stroke-blue-400">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </button>
          </div>
          <WaveAnimation active={loading} />
          {speaking && (
            <button onClick={stopSpeaking} className="mt-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/30 transition-all">
              توقف خواندن
            </button>
          )}

          <form onSubmit={(e) => { e.preventDefault(); if (!textInput.trim() || loading) return; sendMessage(textInput.trim()); setTextInput(''); }} className="mt-3 w-full max-w-md flex gap-2">
            <input ref={inputRef} type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} disabled={loading}
              placeholder={lang === 'fa' ? 'پیامت رو بنویس... (/ برای فوکوس)' : 'Type your message...'} dir="auto"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 transition-all duration-300" />
            <button type="submit" disabled={!textInput.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm transition-all duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-h-0">
          <div ref={historyRef} className="flex-1 overflow-y-auto space-y-3 mb-3 scrollbar-thin pr-1">
            {history.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-slate-500 text-sm">{lang === 'fa' ? 'با جارویس شروع کنید' : 'Start chatting with Jarvis'}</p>
              </div>
            )}
            {history.map((item, i) => (
              <div key={i} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animation: 'fade-in-up 0.3s ease-out' }}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${item.role === 'user' ? 'bg-blue-600/20 border border-blue-500/20 text-blue-100 rounded-br-md' : 'bg-white/5 border border-white/10 rounded-bl-md'}`}>
                  {item.role === 'assistant' ? <MessageBubble text={item.text} /> : <span className="text-blue-100" dir="auto">{item.text}</span>}
                </div>
              </div>
            ))}
            {loading && !response && (
              <div className="flex justify-start" style={{ animation: 'fade-in-up 0.3s ease-out' }}>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-slate-500 rounded-full" style={{ animation: 'typing-dot 1.4s ease-in-out infinite' }} />
                    <div className="w-2 h-2 bg-slate-500 rounded-full" style={{ animation: 'typing-dot 1.4s ease-in-out infinite 0.2s' }} />
                    <div className="w-2 h-2 bg-slate-500 rounded-full" style={{ animation: 'typing-dot 1.4s ease-in-out infinite 0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            {response && (
              <div className="flex justify-start" style={{ animation: 'fade-in-up 0.3s ease-out' }}>
                <div className="max-w-[85%] bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                  <MessageBubble text={response} />
                  {speaking && (
                    <div className="mt-2 flex items-center gap-1.5 text-blue-400">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ animation: 'wave 0.4s ease-in-out infinite alternate' }} />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ animation: 'wave 0.5s ease-in-out infinite alternate 0.1s' }} />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ animation: 'wave 0.6s ease-in-out infinite alternate 0.2s' }} />
                      <span className="text-xs ml-1">{lang === 'fa' ? 'در حال خواندن...' : 'Speaking...'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="flex-shrink-0 pt-2 border-t border-white/5 text-center text-slate-600 text-xs">
          {lang === 'fa' ? 'ساخته شده با Ollama + React' : 'Built with Ollama + React'}
        </footer>
      </div>
    </div>
  );
}

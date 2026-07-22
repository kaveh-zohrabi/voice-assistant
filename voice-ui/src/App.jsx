import React, { useState, useCallback, useRef, useEffect } from 'react';
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
            backgroundColor: active
              ? ['#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#818cf8', '#60a5fa', '#38bdf8'][i]
              : '#475569',
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
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 left-2 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white text-xs transition-all duration-200 flex items-center gap-1"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy
        </>
      )}
    </button>
  );
}

function MessageBubble({ text }) {
  const [showEnglish, setShowEnglish] = useState(false);

  const parts = text.split(/\[FA\]|\[EN\]/g).filter(Boolean);
  let farsi = '';
  let english = '';

  parts.forEach((part, i) => {
    if (text.indexOf('[FA]') < text.indexOf('[EN]') || text.indexOf('[EN]') === -1) {
      if (i === 0) farsi = part.trim();
      else if (part.trim()) english = part.trim();
    } else {
      if (i === 0) english = part.trim();
      else if (part.trim()) farsi = part.trim();
    }
  });

  if (!farsi && !english) farsi = text;

  const renderContent = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'code', lang: match[1] || '', content: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      segments.push({ type: 'text', content: content.slice(lastIndex) });
    }

    return segments.map((seg, i) => {
      if (seg.type === 'code') {
        return (
          <div key={i} className="relative my-3 rounded-xl overflow-hidden bg-[#1a1b26] border border-white/10">
            <div className="flex items-center justify-between px-4 py-1.5 bg-white/5 border-b border-white/5">
              <span className="text-xs text-slate-500">{seg.lang || 'code'}</span>
              <CopyButton text={seg.content} />
            </div>
            <div className="px-4 py-3 overflow-x-auto">
              <pre className="text-sm text-slate-300 font-mono leading-relaxed">
                <code>{seg.content}</code>
              </pre>
            </div>
          </div>
        );
      }
      return <p key={i} className="text-slate-200 leading-relaxed whitespace-pre-wrap">{seg.content}</p>;
    });
  };

  return (
    <div className="space-y-2">
      <div className="text-[15px] leading-relaxed" dir="auto">
        {renderContent(farsi)}
      </div>

      {english && (
        <div>
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors duration-200"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-200 ${showEnglish ? 'rotate-90' : ''}`}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            English
          </button>
          {showEnglish && (
            <div className="mt-2 pl-3 border-r-2 border-blue-500/30 text-sm text-slate-400 leading-relaxed" style={{ animation: 'fade-in-up 0.2s ease-out' }}>
              {english}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QuickActions({ onSend }) {
  const actions = [
    { icon: '🎲', label: 'جوک', fa: 'یه جوک بگو' },
    { icon: '🧮', label: 'ریاضی', fa: '۲۵ ضربدر ۴ چنده' },
    { icon: '💡', label: 'جالب', fa: 'یه چیز جالب بگو' },
    { icon: '💻', label: 'کد', fa: 'یک تابع python برای فاکتوریل بنویس' },
  ];

  return (
    <div className="flex gap-2 flex-wrap justify-center mt-2">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => onSend(a.fa)}
          className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs hover:bg-white/10 hover:text-white transition-all duration-200 flex items-center gap-1.5"
        >
          <span>{a.icon}</span>
          {a.label}
        </button>
      ))}
    </div>
  );
}

function StatusBar({ model, charCount }) {
  return (
    <div className="flex items-center justify-between text-xs text-slate-600 px-1">
      <span>{model}</span>
      <span>{charCount > 0 ? `${charCount} chars` : ''}</span>
    </div>
  );
}

export default function VoiceAssistant() {
  const [page, setPage] = useState('home');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('fa');
  const [speaking, setSpeaking] = useState(false);
  const [history, setHistory] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const historyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history, response]);

  useEffect(() => {
    setCharCount(textInput.length);
  }, [textInput]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(lang === 'fa' ? 'مرورگر پشتیبانی نمی‌کند' : 'Browser not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'fa' ? 'fa-IR' : 'en-US';

    recognition.onstart = () => {
      setLoading(true);
      setTranscript(lang === 'fa' ? 'گوش می‌دهم...' : 'Listening...');
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      sendMessage(text);
    };

    recognition.onerror = (event) => {
      setTranscript(`Error: ${event.error}`);
      setLoading(false);
    };

    recognition.start();
  };

  const sendMessage = async (message) => {
    setHistory(prev => [...prev, { role: 'user', text: message, time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }]);
    setResponse('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, lang }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullResponse += parsed.text;
                setResponse(fullResponse);
              }
              if (parsed.error) {
                setResponse(`Error: ${parsed.error}`);
              }
            } catch {}
          }
        }
      }

      if (fullResponse) {
        setHistory(prev => [...prev, {
          role: 'assistant',
          text: fullResponse,
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        }]);
        if (soundEnabled) speakResponse(fullResponse);
      }
    } catch (error) {
      const errMsg = `Error: ${error.message}`;
      setResponse(errMsg);
      setHistory(prev => [...prev, { role: 'assistant', text: errMsg, time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = useCallback((fullText) => {
    const codeRemoved = fullText.replace(/```[\s\S]*?```/g, '').trim();
    const faMatch = codeRemoved.split('[FA]')[1]?.split('[EN]')[0]?.trim();
    const enMatch = codeRemoved.split('[EN]')[1]?.trim();
    const faText = faMatch || codeRemoved;
    const enText = enMatch || '';

    if (!faText && !enText) return;

    setSpeaking(true);
    window.speechSynthesis.cancel();

    const speakFarsi = () => {
      if (!faText) { speakEnglish(); return; }
      const u1 = new SpeechSynthesisUtterance(faText);
      u1.lang = 'fa-IR';
      u1.rate = 0.9;
      u1.onend = () => speakEnglish();
      u1.onerror = () => speakEnglish();
      window.speechSynthesis.speak(u1);
    };

    const speakEnglish = () => {
      if (!enText) { setSpeaking(false); return; }
      const u2 = new SpeechSynthesisUtterance(enText);
      u2.lang = 'en-US';
      u2.rate = 0.9;
      u2.onend = () => setSpeaking(false);
      u2.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u2);
    };

    speakFarsi();
  }, []);

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const clearChat = () => {
    setHistory([]);
    setResponse('');
    setTranscript('');
  };

  const toggleLang = () => setLang(l => l === 'fa' ? 'en' : 'fa');

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim() || loading) return;
    sendMessage(textInput.trim());
    setTextInput('');
  };

  if (page === 'about') {
    return <About onBack={() => setPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      <style>{`
        @keyframes wave {
          0% { height: 6px; }
          100% { height: 24px; }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ring-pulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes typing-dot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-4px); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-cyan-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 h-screen flex flex-col max-w-2xl mx-auto px-4 py-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight">Jarvis</h1>
              <p className="text-slate-500 text-xs">{lang === 'fa' ? 'دستیار صوتی هوشمند' : 'Smart Voice Assistant'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage('about')} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-300" title={lang === 'fa' ? 'درباره ما' : 'About'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </button>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-2 rounded-lg border transition-all duration-300 ${soundEnabled ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-slate-400'}`} title={soundEnabled ? 'صدا روشن' : 'صدا خاموش'}>
              {soundEnabled ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              )}
            </button>
            {speaking && (
              <button onClick={stopSpeaking} className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all duration-300" title="توقف">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
              </button>
            )}
            <button onClick={clearChat} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-300" title={lang === 'fa' ? 'پاک کردن' : 'Clear'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
            <button onClick={toggleLang} className="px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:bg-white/10 hover:text-white transition-all duration-300">
              {lang === 'fa' ? 'EN' : 'فا'}
            </button>
          </div>
        </header>

        {/* Mic + Input */}
        <div className="flex-shrink-0 flex flex-col items-center mb-4">
          <GlowOrb speaking={speaking} />

          <div className="relative mb-3" style={{ animation: 'float 4s ease-in-out infinite' }}>
            <button
              onClick={startListening}
              disabled={loading}
              className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 group"
              style={{
                background: loading
                  ? 'linear-gradient(135deg, #1e40af, #7c3aed)'
                  : 'linear-gradient(135deg, #1e3a5f, #1e1b4b)',
                boxShadow: loading
                  ? '0 0 35px rgba(99,102,241,0.4), inset 0 0 15px rgba(99,102,241,0.1)'
                  : '0 0 25px rgba(30,58,95,0.5), inset 0 0 12px rgba(30,27,75,0.3)',
              }}
            >
              {loading && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/30" style={{ animation: 'ring-pulse 1.5s ease-out infinite' }} />
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/20" style={{ animation: 'ring-pulse 1.5s ease-out infinite 0.5s' }} />
                </>
              )}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={loading ? '#93c5fd' : '#64748b'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:stroke-blue-400">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </button>
          </div>

          <WaveAnimation active={loading} />

          {history.length === 0 && <QuickActions onSend={sendMessage} />}

          <form onSubmit={handleTextSubmit} className="mt-3 w-full max-w-md flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={lang === 'fa' ? 'پیامت رو بنویس... (/ برای فوکوس)' : 'Type your message... (/ to focus)'}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                dir="auto"
              />
              {charCount > 0 && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 pointer-events-none">{charCount}</span>
              )}
            </div>
            <button
              type="submit"
              disabled={!textInput.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm transition-all duration-300 flex items-center gap-1.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-h-0">
          <div ref={historyRef} className="flex-1 overflow-y-auto space-y-3 mb-3 scrollbar-thin pr-1">
            {history.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                </div>
                <p className="text-slate-500 text-sm">{lang === 'fa' ? 'با جارویس شروع کنید' : 'Start chatting with Jarvis'}</p>
                <p className="text-slate-600 text-xs mt-1">{lang === 'fa' ? 'صدا بزنید یا تایپ کنید' : 'Speak or type a message'}</p>
              </div>
            )}

            {history.map((item, i) => (
              <div
                key={i}
                className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: 'fade-in-up 0.3s ease-out' }}
              >
                <div className={`max-w-[85%] ${item.role === 'user'
                  ? 'bg-blue-600/20 border border-blue-500/20 text-blue-100 rounded-2xl rounded-br-md px-4 py-3'
                  : 'bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3'
                }`}>
                  {item.role === 'assistant' ? (
                    <MessageBubble text={item.text} isLatest={i === history.length - 1} />
                  ) : (
                    <span className="text-[15px]" dir="auto">{item.text}</span>
                  )}
                  {item.time && (
                    <p className="text-[10px] text-slate-600 mt-1.5">{item.time}</p>
                  )}
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
                  <MessageBubble text={response} isLatest={true} />
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

        {/* Footer */}
        <footer className="flex-shrink-0 pt-2 border-t border-white/5">
          <StatusBar model="kaveh" charCount={charCount} />
        </footer>
      </div>
    </div>
  );
}

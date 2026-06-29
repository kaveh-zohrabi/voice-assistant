import React, { useState, useCallback, useRef, useEffect } from 'react';
import About from './About';

function WaveAnimation({ active }) {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-300"
          style={{
            height: active ? `${12 + Math.random() * 20}px` : '4px',
            backgroundColor: active ? '#60a5fa' : '#475569',
            animation: active ? `wave 0.${4 + i}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${i * 0.1}s`,
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
            ? 'radial-gradient(circle, rgba(96,165,250,0.3) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)'
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
      className="absolute top-2 left-2 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white text-xs transition-all duration-200"
    >
      {copied ? 'Copied!' : 'Copy'}
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

  if (!farsi && !english) {
    farsi = text;
  }

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
            <CopyButton text={seg.content} />
            <div className="px-4 pt-8 pb-4 overflow-x-auto">
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
      <div className="text-base leading-relaxed" dir="auto">
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
            <div className="mt-2 pl-3 border-r-2 border-white/10 text-sm text-slate-400 leading-relaxed" style={{ animation: 'fade-in-up 0.2s ease-out' }}>
              {english}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VoiceAssistant() {
  const [page, setPage] = useState('home');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lang, setLang] = useState('fa');
  const [speaking, setSpeaking] = useState(false);
  const [history, setHistory] = useState([]);
  const [textInput, setTextInput] = useState('');
  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history, response]);

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
    setHistory(prev => [...prev, { role: 'user', text: message }]);
    setResponse('');

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
        const faText = fullResponse.split('[FA]')[1]?.split('[EN]')[0]?.trim() || fullResponse;
        setHistory(prev => [...prev, { role: 'assistant', text: fullResponse }]);
        speakFarsi(faText);
      }
    } catch (error) {
      const errMsg = `Error: ${error.message}`;
      setResponse(errMsg);
      setHistory(prev => [...prev, { role: 'assistant', text: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const speakFarsi = useCallback((text) => {
    const cleanText = text.replace(/```[\s\S]*?```/g, '').trim();
    if (!cleanText) return;

    setSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fa-IR';
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

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
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-cyan-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6">
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage('about')}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-sm hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              {lang === 'fa' ? 'درباره ما' : 'About'}
            </button>
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-sm hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              {lang === 'fa' ? 'EN' : 'فا'}
            </button>
          </div>
        </header>

        <div className="flex-shrink-0 flex flex-col items-center mb-6">
          <GlowOrb speaking={speaking} />

          <div className="relative mb-4" style={{ animation: 'float 4s ease-in-out infinite' }}>
            <button
              onClick={startListening}
              disabled={loading}
              className="relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 group"
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
              <svg
                width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke={loading ? '#93c5fd' : '#64748b'}
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className="transition-all duration-300 group-hover:stroke-blue-400"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </button>
          </div>

          <WaveAnimation active={loading} />

          <p className="text-slate-500 text-xs mt-2">
            {loading
              ? (lang === 'fa' ? 'در حال گوش دادن...' : 'Listening...')
              : (lang === 'fa' ? 'روی میکروفون کلیک کنید یا تایپ کنید' : 'Click mic or type a message')}
          </p>

          <form onSubmit={handleTextSubmit} className="mt-3 w-full max-w-md flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={lang === 'fa' ? 'پیامت رو بنویس...' : 'Type your message...'}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 transition-all duration-300"
              dir="auto"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm transition-all duration-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>

        {(transcript || history.length > 0) && (
          <div className="flex-1 flex flex-col min-h-0">
            <div
              ref={historyRef}
              className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-thin pr-1"
              style={{ maxHeight: 'calc(100vh - 420px)' }}
            >
              {history.map((item, i) => (
                <div
                  key={i}
                  className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{ animation: 'fade-in-up 0.3s ease-out' }}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                      item.role === 'user'
                        ? 'bg-blue-600/20 border border-blue-500/20 text-blue-100 rounded-br-md'
                        : 'bg-white/5 border border-white/10 rounded-bl-md'
                    }`}
                  >
                    {item.role === 'assistant' ? (
                      <MessageBubble text={item.text} />
                    ) : (
                      <span className="text-blue-100">{item.text}</span>
                    )}
                  </div>
                </div>
              ))}

              {response && (!history.length || history[history.length - 1]?.text !== response) && (
                <div className="flex justify-start" style={{ animation: 'fade-in-up 0.3s ease-out' }}>
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-md bg-white/5 border border-white/10 text-sm">
                    <MessageBubble text={response} />
                    {speaking && (
                      <div className="mt-2 flex items-center gap-1.5 text-blue-400">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ animation: 'wave 0.4s ease-in-out infinite alternate' }} />
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ animation: 'wave 0.5s ease-in-out infinite alternate 0.1s' }} />
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ animation: 'wave 0.6s ease-in-out infinite alternate 0.2s' }} />
                        <span className="text-xs ml-1">در حال خواندن...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="text-center text-slate-600 text-xs pt-3 border-t border-white/5">
          {lang === 'fa' ? 'ساخته شده با Ollama + React' : 'Built with Ollama + React'}
        </footer>
      </div>
    </div>
  );
}

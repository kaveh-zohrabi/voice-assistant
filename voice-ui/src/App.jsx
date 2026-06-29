import React, { useState, useCallback, useRef, useEffect } from 'react';
import About from './About';

function WaveAnimation({ active }) {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-300"
          style={{
            height: active ? `${16 + Math.random() * 32}px` : '6px',
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
          width: speaking ? '300px' : '200px',
          height: speaking ? '300px' : '200px',
          background: speaking
            ? 'radial-gradient(circle, rgba(96,165,250,0.3) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 60%)',
          animation: speaking ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
        }}
      />
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
        setHistory(prev => [...prev, { role: 'assistant', text: fullResponse }]);
        speakResponse(fullResponse);
      }
    } catch (error) {
      const errMsg = `Error: ${error.message}`;
      setResponse(errMsg);
      setHistory(prev => [...prev, { role: 'assistant', text: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = useCallback((text) => {
    setSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'fa' ? 'fa-IR' : 'en-US';
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [lang]);

  const toggleLang = () => setLang(l => l === 'fa' ? 'en' : 'fa');

  if (page === 'about') {
    return <About onBack={() => setPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      <style>{`
        @keyframes wave {
          0% { height: 8px; }
          100% { height: 32px; }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ring-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-cyan-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
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

        <div className="flex-1 flex flex-col items-center justify-center mb-8">
          <GlowOrb speaking={speaking} />

          <div className="relative mb-6" style={{ animation: 'float 4s ease-in-out infinite' }}>
            <button
              onClick={startListening}
              disabled={loading}
              className="relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 group"
              style={{
                background: loading
                  ? 'linear-gradient(135deg, #1e40af, #7c3aed)'
                  : 'linear-gradient(135deg, #1e3a5f, #1e1b4b)',
                boxShadow: loading
                  ? '0 0 40px rgba(99,102,241,0.4), inset 0 0 20px rgba(99,102,241,0.1)'
                  : '0 0 30px rgba(30,58,95,0.5), inset 0 0 15px rgba(30,27,75,0.3)',
              }}
            >
              {loading && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/30" style={{ animation: 'ring-pulse 1.5s ease-out infinite' }} />
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/20" style={{ animation: 'ring-pulse 1.5s ease-out infinite 0.5s' }} />
                </>
              )}
              <svg
                width="40" height="40" viewBox="0 0 24 24" fill="none"
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

          <p className="text-slate-500 text-sm mt-3">
            {loading
              ? (lang === 'fa' ? 'در حال گوش دادن...' : 'Listening...')
              : (lang === 'fa' ? 'روی میکروفون کلیک کنید' : 'Click the microphone')}
          </p>
        </div>

        {(transcript || history.length > 0) && (
          <div className="flex-1 flex flex-col min-h-0">
            <div
              ref={historyRef}
              className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-thin pr-1"
              style={{ maxHeight: '320px' }}
            >
              {history.map((item, i) => (
                <div
                  key={i}
                  className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{ animation: 'fade-in-up 0.3s ease-out' }}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      item.role === 'user'
                        ? 'bg-blue-600/20 border border-blue-500/20 text-blue-100 rounded-br-md'
                        : 'bg-white/5 border border-white/10 text-slate-300 rounded-bl-md'
                    }`}
                  >
                    {item.text}
                  </div>
                </div>
              ))}

              {response && (!history.length || history[history.length - 1]?.text !== response) && (
                <div className="flex justify-start" style={{ animation: 'fade-in-up 0.3s ease-out' }}>
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-md bg-white/5 border border-white/10 text-slate-300 text-sm leading-relaxed">
                    {response}
                    {speaking && (
                      <span className="inline-flex gap-0.5 ml-2 align-middle">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ animation: 'wave 0.4s ease-in-out infinite alternate' }} />
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ animation: 'wave 0.5s ease-in-out infinite alternate 0.1s' }} />
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ animation: 'wave 0.6s ease-in-out infinite alternate 0.2s' }} />
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="text-center text-slate-600 text-xs pt-4 border-t border-white/5">
          {lang === 'fa' ? 'ساخته شده با Ollama + React' : 'Built with Ollama + React'}
        </footer>
      </div>
    </div>
  );
}

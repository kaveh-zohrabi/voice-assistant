import React, { useState, useCallback, useRef, useEffect } from 'react';
import Avatar from './components/Avatar';
import useVoiceAssistant from './hooks/useVoiceAssistant';
import { memory } from './utils/memory';

const SYSTEM_PROMPT = `تو جارویس هستی، یک دستیار شخصی صمیمی و خودمونی. با کاربرت مثل یک دوست خوب حرف بزن.

قوانین مهم:
- همیشه فقط فارسی جواب بده. هیچوقت انگلیسی ننویس.
- خیلی خودمونی و صمیمی باش
- کوتاه جواب بده (۱-۲ جمله)
- از ایموجی استفاده کن
- اگه چیزی رو نمی‌دونی بگو
- حافظه داری — چیزایی که کاربر گفته رو یادت باشه
- اگه کاربر چیزی خواست یادت بده، یادت باشه
- شوخی کن، جوک بگو
- به حال و هوای کاربر توجه کن
- هیچوقت انگلیسی ننویس، فقط فارسی

مثال‌ها:
کاربر: سلام
تو: سلااام! خوبی عزیزم؟ 😊

کاربر: اسمت چیه
تو: من جارویس هستم، دستیار شخصی تو! هر وقت بخوای کمکت کنم اینجام 💪

کاربر: حالم خوب نیست
تو: آخیش 😔 امیدوارم زودتر بهتر بشی. میخوای یه چیزی بگم حالت خوش بشه؟

کاربر: یه جوک بگو
تو: چرا کامپیوتر به مهمونی نرفت؟ چون timeout شد! 😂

کاربر: یادم بده فردا ساعت ۳ جلسه دارم
تو: چشم عزیزم! فردا ساعت ۳ جلسه داری. یادم میمونه 📝

کاربر: ممنون
تو: خواهش میگم! هر وقت خواستی در خدمتم 😊

کاربر: چه خبر
تو: هیچی، فقط نشستم منتظرتم! تو چه خبر؟ 😄

کاربر: چی کار می‌تونی بکنی
تو: می‌تونم جواب سوالاتت رو بدم، جوک بگم، یادآوری کنم، و باهات حرف بزنم. بپرس! 💡`;

export default function VoiceChat() {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const processMessage = useCallback(async (text) => {
    // Add user message
    memory.addMessage('user', text);
    setMessages(prev => [...prev, { role: 'user', text, time: Date.now() }]);
    setIsProcessing(true);

    try {
      // Build context with memory
      const recentMessages = memory.getRecentMessages(10);
      const facts = memory.getFacts();
      const summary = memory.getSummary();

      const contextMessages = [
        { role: 'system', content: SYSTEM_PROMPT + `\n\nاطلاعات کاربر:\n${facts.length > 0 ? facts.join('\n') : 'هنوز اطلاعاتی ثبت نشده.'}\n\nآخرین مکالمات:\n${recentMessages.map(m => `${m.role === 'user' ? 'کاربر' : 'جارویس'}: ${m.content}`).join('\n')}` },
        ...recentMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
        { role: 'user', content: text },
      ];

      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, lang: 'fa', context: contextMessages }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      setMessages(prev => [...prev, { role: 'assistant', text: '', time: Date.now() }]);

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
                fullResponse += p.text;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1] = { role: 'assistant', text: fullResponse, time: Date.now() };
                  return newMsgs;
                });
              }
            } catch {}
          }
        }
      }

      if (fullResponse) {
        memory.addMessage('assistant', fullResponse);

        // Check if user asked to remember something
        if (text.includes('یادم بده') || text.includes('یادداشت کن') || text.includes('به خاطر بسپار')) {
          memory.addFact(text);
        }

        // Speak response
        await voice.speak(fullResponse);
      }
    } catch (e) {
      console.error('Error:', e);
      const errorMsg = 'آخیش، یه مشکلی پیش اومد. دوباره امتحان کن 😅';
      setMessages(prev => [...prev, { role: 'assistant', text: errorMsg, time: Date.now() }]);
      await voice.speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const voice = useVoiceAssistant({
    onMessage: processMessage,
    onListening: () => {},
    onSpeaking: () => {},
  });

  const toggleListening = () => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden flex flex-col">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes audio-bar { 0% { height: 4px; } 100% { height: 16px; } }
        @keyframes float-msg { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">جارویس</h1>
            <p className="text-slate-500 text-xs">{voice.isListening ? 'در حال گوش دادن...' : voice.isSpeaking ? 'در حال صحبت...' : 'آماده‌ام'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { memory.clear(); setMessages([]); }} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all" title="پاک کردن حافظه">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 relative z-10">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="mb-6" style={{ animation: 'float 4s ease-in-out infinite' }}>
                <Avatar speaking={voice.isSpeaking} listening={voice.isListening} />
              </div>
              <h2 className="text-white text-xl font-bold mb-2">سلام! 👋</h2>
              <p className="text-slate-500 text-sm">روی دکمه میکروفون کلیک کن و شروع کن</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animation: 'float-msg 0.3s ease-out' }}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600/20 border border-blue-500/20 text-blue-50 rounded-br-md'
                  : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-md'
              }`}>
                {msg.text || <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" /><div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} /><div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} /></div>}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Avatar & Controls */}
      <div className="relative z-10 border-t border-white/[0.06] bg-[#0a0a1a]/80 backdrop-blur-lg p-6">
        <div className="max-w-lg mx-auto flex flex-col items-center">
          {/* Avatar */}
          {messages.length > 0 && (
            <div className="mb-4" style={{ animation: 'float 4s ease-in-out infinite' }}>
              <Avatar speaking={voice.isSpeaking} listening={voice.isListening} />
            </div>
          )}

          {/* Status */}
          <p className="text-slate-500 text-xs mb-4 h-4">
            {voice.transcript || (isProcessing ? 'دارم فکر می‌کنم...' : '')}
          </p>

          {/* Mic Button */}
          <div className="relative">
            {voice.isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-500/20" style={{ animation: 'pulse-ring 1.5s ease-out infinite' }} />
                <div className="absolute inset-0 rounded-full bg-blue-500/10" style={{ animation: 'pulse-ring 1.5s ease-out infinite 0.5s' }} />
              </>
            )}
            <button
              onClick={toggleListening}
              disabled={isProcessing}
              className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                voice.isListening
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/30'
                  : 'bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 shadow-black/30'
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </button>
          </div>

          <p className="text-slate-600 text-xs mt-3">
            {voice.isListening ? 'در حال گوش دادن...' : 'برای شروع کلیک کن'}
          </p>
        </div>
      </div>
    </div>
  );
}

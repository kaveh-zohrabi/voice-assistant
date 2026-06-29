import React, { useState } from 'react';

export default function VoiceAssistant() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lang, setLang] = useState('fa');

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('مرورگر تو از Speech Recognition پشتیبانی نمی‌کند');
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
      setTranscript(`خطا: ${event.error}`);
      setLoading(false);
    };

    recognition.start();
  };

  const sendMessage = async (message) => {
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
                setResponse(`خطا: ${parsed.error}`);
              }
            } catch {}
          }
        }
      }

      if (fullResponse) speakResponse(fullResponse);
    } catch (error) {
      setResponse(`خطا: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'fa' ? 'fa-IR' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const toggleLang = () => setLang(l => l === 'fa' ? 'en' : 'fa');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900 flex flex-col items-center justify-center p-6">
      <button
        onClick={toggleLang}
        className="mb-4 px-4 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-full text-sm"
      >
        {lang === 'fa' ? 'EN' : 'فارسی'}
      </button>
      <h1 className="text-5xl font-bold text-white mb-2">جارویس</h1>
      <p className="text-blue-300 mb-12 text-lg">{lang === 'fa' ? 'دستیار صوتی شما' : 'Your Voice Assistant'}</p>

      <button
        onClick={startListening}
        disabled={loading}
        className="px-10 py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-full text-xl font-bold shadow-lg transition-all"
      >
        {loading
          ? (lang === 'fa' ? '🎤 در حال پردازش...' : '🎤 Processing...')
          : (lang === 'fa' ? '🎤 کلیک کن و صحبت کن' : '🎤 Click and Speak')}
      </button>

      {transcript && (
        <div className="mt-8 bg-slate-800 p-4 rounded-lg max-w-xl w-full">
          <p className="text-blue-300 text-sm">{lang === 'fa' ? 'شما گفتید:' : 'You said:'}</p>
          <p className="text-white text-lg">{transcript}</p>
        </div>
      )}

      {response && (
        <div className="mt-6 bg-slate-700 p-6 rounded-lg max-w-xl w-full">
          <p className="text-yellow-300 text-sm mb-2">{lang === 'fa' ? 'جارویس جواب داد:' : 'Jarvis replied:'}</p>
          <p className="text-white text-lg leading-relaxed">{response}</p>
        </div>
      )}
    </div>
  );
}
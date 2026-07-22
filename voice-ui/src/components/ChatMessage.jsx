import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all" title="Copy">
      {copied ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>}
    </button>
  );
}

export default function ChatMessage({ message, userName }) {
  const [showEnglish, setShowEnglish] = useState(false);
  const isUser = message.role === 'user';

  const extractLanguages = (text) => {
    const faMatch = text.split('[FA]')[1]?.split('[EN]')[0]?.trim();
    const enMatch = text.split('[EN]')[1]?.trim();
    if (faMatch || enMatch) {
      return { farsi: faMatch || text, english: enMatch || '' };
    }
    return { farsi: text, english: '' };
  };

  const { farsi, english } = isUser ? { farsi: message.text, english: '' } : extractLanguages(message.text);

  return (
    <div className={`group ${isUser ? 'bg-transparent' : 'bg-white/[0.02]'}`}>
      <div className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {isUser ? (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/20">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-medium text-sm">{isUser ? (userName || 'شما') : 'Jarvis'}</span>
              {!isUser && <span className="text-xs text-emerald-500/60">AI</span>}
            </div>

            {isUser ? (
              <p className="text-slate-200 leading-relaxed" dir="auto">{message.text}</p>
            ) : (
              <div>
                <MarkdownRenderer content={farsi} />
                {english && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <button onClick={() => setShowEnglish(!showEnglish)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${showEnglish ? 'rotate-90' : ''}`}><polyline points="9 18 15 12 9 6"/></svg>
                      Show English translation
                    </button>
                    {showEnglish && (
                      <div className="text-sm text-slate-400 leading-relaxed" style={{ animation: 'fade-in 0.2s ease-out' }}>
                        {english}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            {!isUser && (
              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={farsi} />
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all" title="Regenerate">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all" title="Good response">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function Welcome({ onStart }) {
  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden flex items-center justify-center">
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-30%] left-[-20%] w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[150px]" style={{ animation: 'pulse-slow 8s ease-in-out infinite' }} />
        <div className="absolute bottom-[-30%] right-[-20%] w-[600px] h-[600px] rounded-full bg-purple-600/8 blur-[150px]" style={{ animation: 'pulse-slow 8s ease-in-out infinite 4s' }} />
        <div className="absolute top-[30%] left-[60%] w-[400px] h-[400px] rounded-full bg-cyan-600/5 blur-[120px]" style={{ animation: 'pulse-slow 6s ease-in-out infinite 2s' }} />
      </div>

      <div className="relative z-10 text-center px-6" style={{ animation: 'fade-in 1s ease-out' }}>
        <div className="mb-8" style={{ animation: 'float 4s ease-in-out infinite' }}>
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
            </svg>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent" style={{ backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }}>
            Jarvis
          </span>
        </h1>
        <p className="text-slate-400 text-lg mb-2">دستیار صوتی هوشمند شما</p>
        <p className="text-slate-500 text-sm mb-10">Your AI Voice Assistant</p>

        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
            </div>
            <span>صحبت کنید، جواب بگیرید</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span>فارسی و انگلیسی</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <span>نوشتن کد و حل مسائل</span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="px-12 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg font-bold shadow-2xl shadow-blue-500/20 transition-all duration-500 hover:shadow-blue-500/30 hover:scale-105"
        >
          شروع کنید
        </button>
        <p className="text-slate-600 text-xs mt-4">Press Enter or click to start</p>
      </div>
    </div>
  );
}

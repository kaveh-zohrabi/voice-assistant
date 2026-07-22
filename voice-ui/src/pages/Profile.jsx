import React from 'react';

export default function Profile({ onBack, user, onLogout }) {
  return (
    <div className="min-h-screen bg-[#0a0a1a] relative overflow-hidden">
      <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-[120px]" />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-6">
        <header className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-white text-xl font-bold">پروفایل</h1>
        </header>
        <div className="space-y-5" style={{ animation: 'fade-in 0.5s ease-out' }}>
          {/* Avatar & Name */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-3">
              <span className="text-3xl font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'J'}</span>
            </div>
            <h2 className="text-white text-xl font-bold">{user?.name || 'کاربر'}</h2>
            <p className="text-slate-500 text-sm">{user?.email || 'user@example.com'}</p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'پیام‌ها', value: '۱۲۸', color: 'blue' },
              { label: 'جلسات', value: '۱۲', color: 'purple' },
              { label: 'روزها', value: '۳۰', color: 'cyan' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
                <p className={`text-${stat.color}-400 text-lg font-bold`}>{stat.value}</p>
                <p className="text-slate-500 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
          {/* Account */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-white font-medium mb-3">اطلاعات حساب</h3>
            <div className="space-y-3">
              {[
                { label: 'نام', value: user?.name || 'کاربر', icon: '👤' },
                { label: 'ایمیل', value: user?.email || 'user@example.com', icon: '📧' },
                { label: 'عضویت', value: 'ژوئن ۲۰۲۶', icon: '📅' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-slate-400 text-sm">{item.label}</span>
                  </div>
                  <span className="text-white text-sm" dir="auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Logout */}
          <button onClick={onLogout} className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium hover:bg-red-500/20 transition-all duration-300 flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            خروج از حساب
          </button>
        </div>
      </div>
    </div>
  );
}

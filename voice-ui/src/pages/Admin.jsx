import React, { useState, useEffect, useCallback } from 'react';

export default function Admin({ onBack }) {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('jarvis_token');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, convosRes] = await Promise.all([
        fetch('http://localhost:3000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:3000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:3000/api/admin/conversations', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats(await statsRes.json());
      setUsers(await usersRes.json());
      setConversations(await convosRes.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const deleteUser = async (id) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    await fetch(`http://localhost:3000/api/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchStats();
  };

  const deleteConversation = async (id) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    await fetch(`http://localhost:3000/api/admin/conversations/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchStats();
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await fetch(`http://localhost:3000/api/admin/users/${id}/role`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ role: newRole }) });
    fetchStats();
  };

  const tabs = [
    { id: 'dashboard', label: 'داشبورد', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { id: 'users', label: 'کاربران', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'conversations', label: 'مکالمات', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white/[0.02] border-r border-white/[0.06] flex flex-col flex-shrink-0 hidden md:flex">
          <div className="p-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Jarvis Admin</h2>
                <p className="text-slate-500 text-xs">پنل مدیریت</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${tab === t.id ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-white/[0.06]">
            <button onClick={onBack} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              بازگشت به سایت
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-lg border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/></svg>
            </div>
            <span className="text-white font-bold text-sm">Admin</span>
          </div>
          <button onClick={onBack} className="text-slate-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-lg border-t border-white/[0.06] flex">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${tab === t.id ? 'text-blue-400' : 'text-slate-500'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 pt-16 md:pt-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div style={{ animation: 'fade-in 0.3s ease-out' }}>
              {tab === 'dashboard' && stats && (
                <div className="space-y-6">
                  <h1 className="text-white text-2xl font-bold">داشبورد</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'کاربران', value: stats.users, color: 'blue', icon: '👥' },
                      { label: 'مکالمات', value: stats.conversations, color: 'purple', icon: '💬' },
                      { label: 'پیام‌ها', value: stats.messages, color: 'cyan', icon: '📨' },
                    ].map((s, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl">{s.icon}</span>
                          <span className={`text-xs px-2 py-1 rounded-full bg-${s.color}-500/10 text-${s.color}-400`}>فعال</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{s.value}</p>
                        <p className="text-slate-500 text-sm mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                      <h3 className="text-white font-medium mb-4">آخرین کاربران</h3>
                      <div className="space-y-3">
                        {stats.recentUsers?.map(u => (
                          <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">{u.name?.charAt(0)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">{u.name}</p>
                              <p className="text-slate-500 text-xs truncate">{u.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                      <h3 className="text-white font-medium mb-4">آخرین مکالمات</h3>
                      <div className="space-y-3">
                        {stats.recentConversations?.map(c => (
                          <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs">💬</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">{c.title}</p>
                              <p className="text-slate-500 text-xs">{c.user_name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'users' && (
                <div className="space-y-4">
                  <h1 className="text-white text-2xl font-bold">مدیریت کاربران</h1>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-white/[0.06]">
                          <th className="text-right px-4 py-3 text-slate-400 font-medium">نام</th>
                          <th className="text-right px-4 py-3 text-slate-400 font-medium hidden sm:table-cell">ایمیل</th>
                          <th className="text-right px-4 py-3 text-slate-400 font-medium">نقش</th>
                          <th className="text-right px-4 py-3 text-slate-400 font-medium hidden md:table-cell">تاریخ</th>
                          <th className="text-right px-4 py-3 text-slate-400 font-medium">عملیات</th>
                        </tr></thead>
                        <tbody>
                          {users.map(u => (
                            <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                              <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">{u.name?.charAt(0)}</div><span className="text-white">{u.name}</span></div></td>
                              <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{u.email}</td>
                              <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${u.role === 'admin' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'}`}>{u.role}</span></td>
                              <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{new Date(u.created_at).toLocaleDateString('fa-IR')}</td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1">
                                  <button onClick={() => toggleRole(u.id, u.role)} className="px-2 py-1 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-white/10 hover:text-white">تغییر نقش</button>
                                  <button onClick={() => deleteUser(u.id)} className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20">حذف</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'conversations' && (
                <div className="space-y-4">
                  <h1 className="text-white text-2xl font-bold">مدیریت مکالمات</h1>
                  <div className="space-y-3">
                    {conversations.map(c => (
                      <div key={c.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">💬</div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{c.title}</p>
                            <p className="text-slate-500 text-xs">{c.user_name} · {c.message_count} پیام</p>
                          </div>
                        </div>
                        <button onClick={() => deleteConversation(c.id)} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 flex-shrink-0">حذف</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

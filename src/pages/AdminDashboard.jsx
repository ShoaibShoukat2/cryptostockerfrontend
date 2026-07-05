import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, ArrowDownToLine, ArrowUpFromLine, DollarSign,
  CheckCircle, XCircle, Search, Bell, Edit3, Ban, Check,
  Clock, TrendingUp, AlertCircle, MessageCircle, ExternalLink, Megaphone, Mail,
} from 'lucide-react';
import { adminAPI } from '../api';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { formatSupportLinkLabel, normalizeSupportLink } from '../lib/support';

const statusStyle = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
};

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${statusStyle[status] || ''}`}>
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color, glow }) {
  return (
    <div className={`card-dark p-4 ${glow}`}>
      <Icon size={22} className={`${color} mb-2`} />
      <p className="text-xl font-bold">{value ?? '0'}</p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}

function UserModal({ user, onClose, onSave }) {
  const [vip, setVip] = useState(user?.profile?.vip_level || 1);
  const [adjust, setAdjust] = useState('');
  const [note, setNote] = useState('');
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyMsg, setNotifyMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const data = { vip_level: vip };
      if (adjust) data.adjust_balance = parseFloat(adjust);
      if (note) data.note = note;
      await adminAPI.updateUser(user.id, data);
      onSave();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleNotify = async () => {
    if (!notifyTitle || !notifyMsg) return;
    setLoading(true);
    try {
      await adminAPI.notifyUser(user.id, { title: notifyTitle, message: notifyMsg });
      alert('Notification sent!');
      setNotifyTitle('');
      setNotifyMsg('');
    } catch {
      alert('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async () => {
    setLoading(true);
    try {
      await adminAPI.updateUser(user.id, { is_active: !user.is_active });
      onSave();
      onClose();
    } catch {
      alert('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="card-dark glow-purple max-h-[90vh] w-full max-w-md overflow-y-auto p-5">
        <h3 className="mb-1 text-lg font-bold">Manage User</h3>
        <p className="mb-1 text-sm text-gray-400">@{user.username}</p>
        <p className="mb-4 font-mono text-sm text-cs-gold">Password: {user.plain_password || '—'}</p>

        <div className="mb-4 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl border border-cs-border bg-cs-dark p-2">
            <p className="text-xs text-gray-500">Balance</p>
            <p className="font-bold text-cs-green">${parseFloat(user.profile?.available_balance || 0).toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-cs-border bg-cs-dark p-2">
            <p className="text-xs text-gray-500">Total Profit</p>
            <p className="font-bold text-cs-gold">${parseFloat(user.profile?.total_profit || 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs text-gray-400">VIP Level</label>
          <select
            value={vip}
            onChange={(e) => setVip(Number(e.target.value))}
            className="w-full rounded-xl border border-cs-border bg-cs-dark px-3 py-2 text-sm"
          >
            {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>VIP {v}</option>)}
          </select>
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs text-gray-400">Adjust Balance (+/-)</label>
          <input
            type="number"
            step="0.01"
            value={adjust}
            onChange={(e) => setAdjust(e.target.value)}
            placeholder="e.g. 100 or -50"
            className="w-full rounded-xl border border-cs-border bg-cs-dark px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note for adjustment"
            className="mt-2 w-full rounded-xl border border-cs-border bg-cs-dark px-3 py-2 text-sm"
          />
        </div>

        <button type="button" onClick={handleUpdate} disabled={loading} className="gradient-btn mb-3 w-full rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-50">
          Save Changes
        </button>

        <div className="mb-3 border-t border-cs-border pt-3">
          <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-400"><Bell size={12} /> Send Notification</p>
          <input value={notifyTitle} onChange={(e) => setNotifyTitle(e.target.value)} placeholder="Title" className="mb-2 w-full rounded-xl border border-cs-border bg-cs-dark px-3 py-2 text-sm" />
          <textarea value={notifyMsg} onChange={(e) => setNotifyMsg(e.target.value)} placeholder="Message" rows={2} className="mb-2 w-full resize-none rounded-xl border border-cs-border bg-cs-dark px-3 py-2 text-sm" />
          <button type="button" onClick={handleNotify} disabled={loading} className="w-full rounded-xl border border-cs-purple/30 bg-cs-purple/10 py-2 text-sm font-semibold text-cs-purple">
            Send Notification
          </button>
        </div>

        <button
          type="button"
          onClick={toggleActive}
          disabled={loading}
          className={`mb-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold ${
            user.is_active ? 'bg-cs-red/10 text-cs-red' : 'bg-cs-green/10 text-cs-green'
          }`}
        >
          {user.is_active ? <><Ban size={16} /> Deactivate User</> : <><Check size={16} /> Activate User</>}
        </button>

        <button type="button" onClick={onClose} className="w-full text-sm text-gray-500 hover:text-white">Cancel</button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [siteConfig, setSiteConfig] = useState(null);
  const [configSaving, setConfigSaving] = useState(false);
  const [supportSaving, setSupportSaving] = useState(false);
  const [supportForm, setSupportForm] = useState({
    support_heading: '',
    support_subtitle: '',
    telegram_link: '',
  });
  const [promotionSaving, setPromotionSaving] = useState(false);
  const [promotionForm, setPromotionForm] = useState({
    promotion_bonus_subtitle: '',
    promotion_bonus_note: '',
    promotion_tier1_detail: '',
    promotion_tier1_reward: '',
    promotion_tier2_detail: '',
    promotion_tier2_reward: '',
    promotion_tier3_detail: '',
    promotion_tier3_reward: '',
  });

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashRes, depRes, witRes, userRes, txRes, cfgRes, contactRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getDeposits(),
        adminAPI.getWithdrawals(),
        adminAPI.getUsers(),
        adminAPI.getTransactions(),
        adminAPI.getConfig(),
        adminAPI.getContactMessages(),
      ]);
      setStats(dashRes.data);
      setDeposits(depRes.data);
      setWithdrawals(witRes.data);
      setUsers(userRes.data);
      setTransactions(txRes.data);
      setSiteConfig(cfgRes.data);
      setContacts(contactRes.data);
      setSupportForm({
        support_heading: cfgRes.data.support_heading || 'Telegram Support',
        support_subtitle: cfgRes.data.support_subtitle || 'Our team is available 24/7 on Telegram',
        telegram_link: cfgRes.data.telegram_link || '',
      });
      setPromotionForm({
        promotion_bonus_subtitle: cfgRes.data.promotion_bonus_subtitle || 'Upload videos and earn extra rewards',
        promotion_bonus_note: cfgRes.data.promotion_bonus_note || 'Contact support on Telegram to claim your promotion bonus rewards.',
        promotion_tier1_detail: cfgRes.data.promotion_tier1_detail || 'Upload 1 video daily for 7 days',
        promotion_tier1_reward: cfgRes.data.promotion_tier1_reward ?? '5',
        promotion_tier2_detail: cfgRes.data.promotion_tier2_detail || '5k views on a video',
        promotion_tier2_reward: cfgRes.data.promotion_tier2_reward ?? '10',
        promotion_tier3_detail: cfgRes.data.promotion_tier3_detail || '10k views on a video',
        promotion_tier3_reward: cfgRes.data.promotion_tier3_reward ?? '30',
      });
    } catch {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const runAction = async (action, id) => {
    setActionLoading(id);
    try {
      await action(id);
      await loadAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const saveSupportSettings = async () => {
    setSupportSaving(true);
    try {
      const link = normalizeSupportLink(supportForm.telegram_link);
      const { data } = await adminAPI.updateConfig({
        support_heading: supportForm.support_heading.trim(),
        support_subtitle: supportForm.support_subtitle.trim(),
        telegram_link: link,
      });
      setSiteConfig(data);
      setSupportForm({
        support_heading: data.support_heading || '',
        support_subtitle: data.support_subtitle || '',
        telegram_link: data.telegram_link || link,
      });
      alert('Support settings updated!');
    } catch {
      alert('Failed to update support settings');
    } finally {
      setSupportSaving(false);
    }
  };

  const updateSupportField = (key, value) => {
    setSupportForm((prev) => ({ ...prev, [key]: value }));
  };

  const updatePromotionField = (key, value) => {
    setPromotionForm((prev) => ({ ...prev, [key]: value }));
  };

  const savePromotionBonus = async () => {
    setPromotionSaving(true);
    try {
      const payload = {
        ...promotionForm,
        promotion_tier1_reward: parseFloat(promotionForm.promotion_tier1_reward || 0),
        promotion_tier2_reward: parseFloat(promotionForm.promotion_tier2_reward || 0),
        promotion_tier3_reward: parseFloat(promotionForm.promotion_tier3_reward || 0),
      };
      const { data } = await adminAPI.updateConfig(payload);
      setSiteConfig(data);
      setPromotionForm({
        promotion_bonus_subtitle: data.promotion_bonus_subtitle || '',
        promotion_bonus_note: data.promotion_bonus_note || '',
        promotion_tier1_detail: data.promotion_tier1_detail || '',
        promotion_tier1_reward: data.promotion_tier1_reward ?? '',
        promotion_tier2_detail: data.promotion_tier2_detail || '',
        promotion_tier2_reward: data.promotion_tier2_reward ?? '',
        promotion_tier3_detail: data.promotion_tier3_detail || '',
        promotion_tier3_reward: data.promotion_tier3_reward ?? '',
      });
      alert('Promotion bonus updated!');
    } catch {
      alert('Failed to update promotion bonus');
    } finally {
      setPromotionSaving(false);
    }
  };

  const filterBySearch = (list, fields) => {
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((item) => fields.some((f) => String(item[f] || '').toLowerCase().includes(q)));
  };

  const filterByStatus = (list) => (statusFilter === 'all' ? list : list.filter((i) => i.status === statusFilter));

  const filteredUsers = useMemo(() => filterBySearch(users, ['username', 'email', 'plain_password']), [users, search]);
  const filteredDeposits = useMemo(() => filterByStatus(filterBySearch(deposits, ['username', 'transaction_id'])), [deposits, search, statusFilter]);
  const filteredWithdrawals = useMemo(() => filterByStatus(filterBySearch(withdrawals, ['username', 'wallet_address'])), [withdrawals, search, statusFilter]);
  const filteredTx = useMemo(() => filterBySearch(transactions, ['username', 'type', 'description']), [transactions, search]);
  const filteredContacts = useMemo(
    () => filterBySearch(contacts, ['username', 'email', 'subject', 'message']),
    [contacts, search],
  );

  if (loading && !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cs-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <AdminLayout
      activeTab={tab}
      onTabChange={setTab}
      onRefresh={loadAll}
      onLogout={handleLogout}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-cs-red/30 bg-cs-red/10 p-3 text-sm text-cs-red">
          <AlertCircle size={16} /> {error}
          <button type="button" onClick={loadAll} className="ml-auto underline">Retry</button>
        </div>
      )}

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <StatCard icon={Users} label="Total Users" value={stats?.total_users} color="text-cs-purple" glow="glow-purple" />
            <StatCard icon={ArrowDownToLine} label="Total Deposits" value={`$${(stats?.total_deposits || 0).toLocaleString()}`} color="text-cs-green" glow="glow-green" />
            <StatCard icon={ArrowUpFromLine} label="Total Withdrawals" value={`$${(stats?.total_withdrawals || 0).toLocaleString()}`} color="text-cs-orange" glow="glow-orange" />
            <StatCard icon={TrendingUp} label="Profit Paid" value={`$${(stats?.total_profit_paid || 0).toLocaleString()}`} color="text-cs-gold" glow="glow-gold" />
            <StatCard icon={Clock} label="Pending Deposits" value={stats?.pending_deposits} color="text-cs-red" glow="glow-red" />
            <StatCard icon={Clock} label="Pending Withdrawals" value={stats?.pending_withdrawals} color="text-cs-red" glow="glow-red" />
          </div>

          {(stats?.pending_deposits > 0 || stats?.pending_withdrawals > 0 || stats?.unread_contacts > 0) && (
            <div className="card-dark glow-gold flex flex-wrap items-center gap-4 p-4">
              <AlertCircle className="text-cs-gold" size={20} />
              <p className="text-sm">
                {stats.pending_deposits > 0 && (
                  <>
                    <span className="font-bold text-cs-gold">{stats.pending_deposits}</span> pending deposits
                    (${(stats.pending_deposit_amount || 0).toFixed(2)})
                  </>
                )}
                {stats.pending_deposits > 0 && stats.pending_withdrawals > 0 && ' | '}
                {stats.pending_withdrawals > 0 && (
                  <>
                    <span className="font-bold text-cs-gold">{stats.pending_withdrawals}</span> pending withdrawals
                    (${(stats.pending_withdrawal_amount || 0).toFixed(2)})
                  </>
                )}
                {(stats.pending_deposits > 0 || stats.pending_withdrawals > 0) && stats.unread_contacts > 0 && ' | '}
                {stats.unread_contacts > 0 && (
                  <>
                    <span className="font-bold text-cs-gold">{stats.unread_contacts}</span> new contact message(s)
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={() => setTab(stats?.unread_contacts > 0 ? 'contact' : 'deposits')}
                className="ml-auto text-xs text-cs-purple hover:underline"
              >
                Review →
              </button>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card-dark p-4">
              <h3 className="mb-3 flex items-center gap-2 font-bold"><ArrowDownToLine size={16} className="text-cs-green" /> Recent Deposits</h3>
              {stats?.recent_deposits?.length ? stats.recent_deposits.map((d) => (
                <div key={d.id} className="flex items-center justify-between border-b border-cs-border/40 py-2 text-sm">
                  <span>{d.username}</span>
                  <span className="text-cs-green">${parseFloat(d.amount).toFixed(2)}</span>
                  <StatusBadge status={d.status} />
                </div>
              )) : <p className="text-sm text-gray-500">No deposits yet</p>}
            </div>
            <div className="card-dark p-4">
              <h3 className="mb-3 flex items-center gap-2 font-bold"><ArrowUpFromLine size={16} className="text-cs-orange" /> Recent Withdrawals</h3>
              {stats?.recent_withdrawals?.length ? stats.recent_withdrawals.map((w) => (
                <div key={w.id} className="flex items-center justify-between border-b border-cs-border/40 py-2 text-sm">
                  <span>{w.username}</span>
                  <span className="text-cs-orange">${parseFloat(w.amount).toFixed(2)}</span>
                  <StatusBadge status={w.status} />
                </div>
              )) : <p className="text-sm text-gray-500">No withdrawals yet</p>}
            </div>
          </div>

          <div className="card-dark p-4">
            <h3 className="mb-3 flex items-center gap-2 font-bold"><Users size={16} className="text-cs-purple" /> New Users</h3>
            {stats?.recent_users?.length ? stats.recent_users.map((u) => (
              <div key={u.id} className="flex items-center justify-between border-b border-cs-border/40 py-2 text-sm">
                <span className="font-medium">{u.username}</span>
                <span className="text-gray-400">{u.email}</span>
                <span className="text-xs text-gray-500">{new Date(u.date_joined).toLocaleDateString()}</span>
              </div>
            )) : <p className="text-sm text-gray-500">No users yet</p>}
          </div>
        </div>
      )}

      {/* USERS */}
      {tab === 'users' && (
        <div className="card-dark p-4">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full rounded-xl border border-cs-border bg-cs-dark py-2 pl-9 pr-3 text-sm" />
            </div>
            <span className="text-xs text-gray-500">{filteredUsers.length} users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cs-border text-left text-[10px] text-gray-500">
                  <th className="py-2">User</th><th className="py-2">Password</th><th className="py-2">Email</th><th className="py-2">Balance</th>
                  <th className="py-2">Deposit</th><th className="py-2">Profit</th><th className="py-2">VIP</th>
                  <th className="py-2">Status</th><th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-cs-border/30 hover:bg-cs-dark/50">
                    <td className="py-3 font-medium">{u.username}</td>
                    <td className="py-3 font-mono text-xs text-cs-gold">{u.plain_password || '—'}</td>
                    <td className="py-3 text-xs text-gray-400">{u.email || '—'}</td>
                    <td className="py-3 font-semibold text-cs-green">${parseFloat(u.profile?.available_balance || 0).toFixed(2)}</td>
                    <td className="py-3">${parseFloat(u.profile?.total_deposit || 0).toFixed(2)}</td>
                    <td className="py-3 text-cs-gold">${parseFloat(u.profile?.total_profit || 0).toFixed(2)}</td>
                    <td className="py-3"><span className="rounded-full bg-cs-purple/20 px-2 py-0.5 text-[10px] text-cs-purple">VIP {u.profile?.vip_level}</span></td>
                    <td className="py-3">
                      <span className={`text-[10px] font-semibold ${u.is_active ? 'text-cs-green' : 'text-cs-red'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button type="button" onClick={() => setSelectedUser(u)} className="rounded-lg bg-cs-purple/20 p-2 text-cs-purple hover:bg-cs-purple/30">
                        <Edit3 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && <p className="py-8 text-center text-gray-500">No users found</p>}
          </div>
        </div>
      )}

      {/* DEPOSITS */}
      {tab === 'deposits' && (
        <div className="card-dark p-4">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search deposits..." className="w-full rounded-xl border border-cs-border bg-cs-dark py-2 pl-9 pr-3 text-sm" />
            </div>
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${statusFilter === s ? 'bg-cs-purple text-white' : 'bg-cs-dark text-gray-400'}`}>{s}</button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cs-border text-left text-[10px] text-gray-500">
                  <th className="py-2">User</th><th className="py-2">Amount</th><th className="py-2">Network</th>
                  <th className="py-2">Screenshot</th><th className="py-2">Status</th><th className="py-2">Date</th><th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeposits.map((d) => (
                  <tr key={d.id} className="border-b border-cs-border/30">
                    <td className="py-3 font-medium">{d.username}</td>
                    <td className="py-3 font-bold text-cs-green">${parseFloat(d.amount).toFixed(2)}</td>
                    <td className="py-3 text-xs text-cs-purple">{d.network || '—'}</td>
                    <td className="py-3">
                      {d.screenshot_url ? (
                        <a href={d.screenshot_url} target="_blank" rel="noopener noreferrer" className="text-xs text-cs-purple hover:underline">View</a>
                      ) : '—'}
                    </td>
                    <td className="py-3"><StatusBadge status={d.status} /></td>
                    <td className="py-3 text-xs text-gray-500">{new Date(d.created_at).toLocaleString()}</td>
                    <td className="py-3 text-right">
                      {d.status === 'pending' && (
                        <div className="flex justify-end gap-1">
                          <button type="button" disabled={actionLoading === d.id} onClick={() => runAction(adminAPI.approveDeposit, d.id)} className="rounded-lg bg-green-500/20 p-2 text-green-400 hover:bg-green-500/30 disabled:opacity-50" title="Approve"><CheckCircle size={16} /></button>
                          <button type="button" disabled={actionLoading === d.id} onClick={() => runAction(adminAPI.rejectDeposit, d.id)} className="rounded-lg bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 disabled:opacity-50" title="Reject"><XCircle size={16} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDeposits.length === 0 && <p className="py-8 text-center text-gray-500">No deposits found</p>}
          </div>
        </div>
      )}

      {/* WITHDRAWALS */}
      {tab === 'withdrawals' && (
        <div className="card-dark p-4">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search withdrawals..." className="w-full rounded-xl border border-cs-border bg-cs-dark py-2 pl-9 pr-3 text-sm" />
            </div>
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${statusFilter === s ? 'bg-cs-orange text-white' : 'bg-cs-dark text-gray-400'}`}>{s}</button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cs-border text-left text-[10px] text-gray-500">
                  <th className="py-2">User</th><th className="py-2">Amount</th><th className="py-2">Wallet</th>
                  <th className="py-2">Status</th><th className="py-2">Date</th><th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWithdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-cs-border/30">
                    <td className="py-3 font-medium">{w.username}</td>
                    <td className="py-3 font-bold text-cs-orange">${parseFloat(w.amount).toFixed(2)}</td>
                    <td className="max-w-[140px] truncate py-3 font-mono text-[10px] text-gray-400">{w.wallet_address}</td>
                    <td className="py-3"><StatusBadge status={w.status} /></td>
                    <td className="py-3 text-xs text-gray-500">{new Date(w.created_at).toLocaleString()}</td>
                    <td className="py-3 text-right">
                      {w.status === 'pending' && (
                        <div className="flex justify-end gap-1">
                          <button type="button" disabled={actionLoading === w.id} onClick={() => runAction(adminAPI.approveWithdrawal, w.id)} className="rounded-lg bg-green-500/20 p-2 text-green-400 hover:bg-green-500/30 disabled:opacity-50"><CheckCircle size={16} /></button>
                          <button type="button" disabled={actionLoading === w.id} onClick={() => runAction(adminAPI.rejectWithdrawal, w.id)} className="rounded-lg bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 disabled:opacity-50"><XCircle size={16} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredWithdrawals.length === 0 && <p className="py-8 text-center text-gray-500">No withdrawals found</p>}
          </div>
        </div>
      )}

      {/* TRANSACTIONS */}
      {tab === 'transactions' && (
        <div className="card-dark p-4">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions..." className="w-full rounded-xl border border-cs-border bg-cs-dark py-2 pl-9 pr-3 text-sm" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cs-border text-left text-[10px] text-gray-500">
                  <th className="py-2">User</th><th className="py-2">Type</th><th className="py-2">Amount</th>
                  <th className="py-2">Description</th><th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTx.map((tx) => (
                  <tr key={tx.id} className="border-b border-cs-border/30">
                    <td className="py-3">{tx.username}</td>
                    <td className="py-3 capitalize text-cs-purple">{tx.type}</td>
                    <td className="py-3 font-semibold">${parseFloat(tx.amount).toFixed(2)}</td>
                    <td className="py-3 text-xs text-gray-400">{tx.description}</td>
                    <td className="py-3 text-xs text-gray-500">{new Date(tx.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTx.length === 0 && <p className="py-8 text-center text-gray-500">No transactions found</p>}
          </div>
        </div>
      )}

      {/* CONTACT MESSAGES */}
      {tab === 'contact' && (
        <div className="card-dark p-4">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full rounded-xl border border-cs-border bg-cs-dark py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <span className="text-xs text-gray-500">
              {filteredContacts.length} message(s)
              {stats?.unread_contacts > 0 && (
                <span className="ml-2 rounded-full bg-yellow-500/20 px-2 py-0.5 text-yellow-400">
                  {stats.unread_contacts} unread
                </span>
              )}
            </span>
          </div>

          <div className="space-y-3">
            {filteredContacts.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl border p-4 ${
                  msg.is_read
                    ? 'border-cs-border/50 bg-cs-dark/40'
                    : 'border-cs-purple/40 bg-cs-purple/10'
                }`}
              >
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-white">@{msg.username}</p>
                    <p className="text-xs text-gray-500">{msg.email || 'No email'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      msg.is_read ? 'bg-cs-green/20 text-cs-green' : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                    >
                      {msg.is_read ? 'Read' : 'New'}
                    </span>
                    {!msg.is_read && (
                      <button
                        type="button"
                        disabled={actionLoading === `contact-${msg.id}`}
                        onClick={async () => {
                          setActionLoading(`contact-${msg.id}`);
                          try {
                            await adminAPI.markContactRead(msg.id);
                            await loadAll();
                          } catch {
                            alert('Failed to mark as read');
                          } finally {
                            setActionLoading(null);
                          }
                        }}
                        className="rounded-lg bg-cs-purple/20 px-2 py-1 text-[10px] font-semibold text-cs-purple hover:bg-cs-purple/30 disabled:opacity-50"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
                <p className="mb-1 text-sm font-semibold text-cs-gold">{msg.subject}</p>
                <p className="mb-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{msg.message}</p>
                <p className="text-[10px] text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
          {filteredContacts.length === 0 && (
            <p className="py-8 text-center text-gray-500">No contact messages found</p>
          )}
        </div>
      )}

      {/* SUPPORT LINK */}
      {tab === 'support' && (
        <div className="card-dark max-w-xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cs-purple/20">
              <MessageCircle size={24} className="text-cs-purple" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Support Link Settings</h2>
              <p className="text-xs text-gray-500">Telegram or WhatsApp — shown on Help & Support page</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs text-gray-400">Heading</label>
            <input
              type="text"
              value={supportForm.support_heading}
              onChange={(e) => updateSupportField('support_heading', e.target.value)}
              placeholder="e.g. WhatsApp Support, Telegram Support"
              className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-2.5 text-sm focus:border-cs-purple focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs text-gray-400">Subtitle (page text above button)</label>
            <input
              type="text"
              value={supportForm.support_subtitle}
              onChange={(e) => updateSupportField('support_subtitle', e.target.value)}
              placeholder="e.g. Our team is available 24/7 on WhatsApp"
              className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-2.5 text-sm focus:border-cs-purple focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs text-gray-400">Support Link (Telegram or WhatsApp)</label>
            <input
              type="text"
              value={supportForm.telegram_link}
              onChange={(e) => updateSupportField('telegram_link', e.target.value)}
              placeholder="https://t.me/group, @username, https://wa.me/923001234567"
              className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-2.5 text-sm focus:border-cs-purple focus:outline-none"
            />
            <p className="mt-2 text-[10px] text-gray-500">
              Telegram: https://t.me/name, @name — WhatsApp: https://wa.me/923001234567 or phone number
            </p>
          </div>

          {supportForm.telegram_link && (
            <div className="mb-4 rounded-xl border border-cs-border/50 bg-cs-dark/60 p-4">
              <p className="mb-1 text-[10px] uppercase tracking-wide text-gray-500">Preview</p>
              <p className="font-bold text-white">{supportForm.support_heading || 'Support'}</p>
              <p className="text-xs text-cs-purple">{formatSupportLinkLabel(normalizeSupportLink(supportForm.telegram_link))}</p>
              <a
                href={normalizeSupportLink(supportForm.telegram_link)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-cs-green hover:underline"
              >
                <ExternalLink size={12} /> Open link
              </a>
            </div>
          )}

          <button
            type="button"
            disabled={supportSaving || !supportForm.telegram_link.trim() || !supportForm.support_heading.trim()}
            onClick={saveSupportSettings}
            className="gradient-btn rounded-xl px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {supportSaving ? 'Saving...' : 'Save Support Settings'}
          </button>
        </div>
      )}

      {/* PROMOTION BONUS */}
      {tab === 'promotion' && (
        <div className="card-dark max-w-2xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cs-gold/20">
              <Megaphone size={24} className="text-cs-gold" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Promotion Bonus</h2>
              <p className="text-xs text-gray-500">Shown on My Team and Bonus pages</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs text-gray-400">Subtitle</label>
            <input
              type="text"
              value={promotionForm.promotion_bonus_subtitle}
              onChange={(e) => updatePromotionField('promotion_bonus_subtitle', e.target.value)}
              className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-2.5 text-sm focus:border-cs-purple focus:outline-none"
            />
          </div>

          {[1, 2, 3].map((tier) => (
            <div key={tier} className="mb-4 rounded-xl border border-cs-border/50 bg-cs-dark/40 p-4">
              <p className="mb-3 text-xs font-semibold text-cs-gold">Reward Tier {tier}</p>
              <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Detail</label>
                  <input
                    type="text"
                    value={promotionForm[`promotion_tier${tier}_detail`]}
                    onChange={(e) => updatePromotionField(`promotion_tier${tier}_detail`, e.target.value)}
                    className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-2.5 text-sm focus:border-cs-purple focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Reward ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={promotionForm[`promotion_tier${tier}_reward`]}
                    onChange={(e) => updatePromotionField(`promotion_tier${tier}_reward`, e.target.value)}
                    className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-2.5 text-sm focus:border-cs-purple focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="mb-6">
            <label className="mb-1 block text-xs text-gray-400">Footer Note</label>
            <textarea
              value={promotionForm.promotion_bonus_note}
              onChange={(e) => updatePromotionField('promotion_bonus_note', e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-cs-border bg-cs-dark px-4 py-2.5 text-sm focus:border-cs-purple focus:outline-none"
            />
          </div>

          <button
            type="button"
            disabled={promotionSaving}
            onClick={savePromotionBonus}
            className="gradient-btn rounded-xl px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {promotionSaving ? 'Saving...' : 'Save Promotion Bonus'}
          </button>
        </div>
      )}

      {/* SETTINGS */}
      {tab === 'settings' && siteConfig && (
        <div className="card-dark max-w-2xl p-6">
          <h2 className="mb-4 text-lg font-bold">Platform Settings</h2>
          <p className="mb-6 text-xs text-gray-500">Configure deposit addresses and business rules. Support link is managed in the Support Link tab.</p>
          <div className="space-y-4">
            {[
              { key: 'bep20_address', label: 'BEP20 USDT Address' },
              { key: 'trc20_address', label: 'TRC20 USDT Address' },
              { key: 'min_deposit', label: 'Minimum Deposit ($)', type: 'number' },
              { key: 'min_withdraw', label: 'Minimum Withdraw ($)', type: 'number' },
              { key: 'referral_commission_rate', label: 'Referral Commission (0.12 = 12%)', type: 'number', step: '0.01' },
              { key: 'daily_bonus_amount', label: 'Daily Bonus Amount ($)', type: 'number' },
              { key: 'daily_bonus_referrals', label: 'Referrals needed for daily bonus', type: 'number' },
              { key: 'investment_lock_days', label: 'Investment Lock (days)', type: 'number' },
            ].map(({ key, label, type = 'text', step }) => (
              <div key={key}>
                <label className="mb-1 block text-xs text-gray-400">{label}</label>
                <input
                  type={type}
                  step={step}
                  value={siteConfig[key] ?? ''}
                  onChange={(e) => setSiteConfig({ ...siteConfig, [key]: e.target.value })}
                  className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-2.5 text-sm focus:border-cs-purple focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label className="mb-1 block text-xs text-gray-400">About Us Text</label>
              <textarea
                value={siteConfig.about_text || ''}
                onChange={(e) => setSiteConfig({ ...siteConfig, about_text: e.target.value })}
                rows={4}
                className="w-full resize-none rounded-xl border border-cs-border bg-cs-dark px-4 py-2.5 text-sm focus:border-cs-purple focus:outline-none"
              />
            </div>
            <button
              type="button"
              disabled={configSaving}
              onClick={async () => {
                setConfigSaving(true);
                try {
                  const { data } = await adminAPI.updateConfig(siteConfig);
                  setSiteConfig(data);
                } catch {
                  alert('Failed to save settings');
                } finally {
                  setConfigSaving(false);
                }
              }}
              className="gradient-btn rounded-xl px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {configSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}

      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} onSave={loadAll} />
      )}
    </AdminLayout>
  );
}

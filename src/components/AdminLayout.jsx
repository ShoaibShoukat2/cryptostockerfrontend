import {
  LayoutDashboard, Users, ArrowDownToLine, ArrowUpFromLine,
  Receipt, LogOut, Shield, Menu, X, RefreshCw, Settings, MessageCircle, Megaphone, Mail, KeyRound, BadgePercent,
} from 'lucide-react';
import { Logo } from './Logo';

const navItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'users', icon: Users, label: 'Users' },
  { id: 'deposits', icon: ArrowDownToLine, label: 'Deposits' },
  { id: 'withdrawals', icon: ArrowUpFromLine, label: 'Withdrawals' },
  { id: 'transactions', icon: Receipt, label: 'Transactions' },
  { id: 'support', icon: MessageCircle, label: 'Support Link' },
  { id: 'contact', icon: Mail, label: 'Contact Us' },
  { id: 'promotion', icon: Megaphone, label: 'Promotion Bonus' },
  { id: 'levels', icon: BadgePercent, label: 'Daily Profit & Levels' },
  { id: 'admin-account', icon: KeyRound, label: 'Admin Account' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({
  activeTab, onTabChange, onRefresh, onLogout, children, sidebarOpen, setSidebarOpen,
}) {
  return (
    <div className="min-h-dvh bg-black">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 flex h-dvh w-64 flex-col overflow-hidden border-r border-cs-border bg-cs-dark transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="shrink-0 border-b border-cs-border p-4">
          <Logo size="xs" centered={false} showTagline={false} />
          <div className="mt-2 flex items-center gap-2">
            <Shield size={14} className="text-cs-red" />
            <span className="text-xs font-bold text-cs-red">ADMIN PANEL</span>
          </div>
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => { onTabChange(id); setSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-cs-purple/20 text-cs-purple'
                  : 'text-gray-400 hover:bg-cs-card hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="shrink-0 border-t border-cs-border p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-cs-red transition-colors hover:bg-cs-red/10"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-cs-border bg-black/90 px-4 py-3 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 lg:hidden"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="text-sm font-bold capitalize sm:text-base">{activeTab}</h1>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-1.5 rounded-xl bg-cs-purple/20 px-3 py-1.5 text-xs font-semibold text-cs-purple hover:bg-cs-purple/30"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

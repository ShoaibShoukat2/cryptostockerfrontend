import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellRing } from 'lucide-react';
import { userAPI } from '../api';

export default function NotificationBell({ initialCount = 0, variant = 'default' }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    setUnreadCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const togglePanel = async () => {
    const next = !open;
    setOpen(next);
    if (next) await loadNotifications();
  };

  const markRead = async (id) => {
    try {
      await userAPI.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      /* ignore */
    }
  };

  const btnClass = variant === 'glass'
    ? `relative flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/25 bg-purple-500/10 backdrop-blur-md transition-all hover:border-purple-400/40 hover:shadow-[0_0_18px_rgba(168,85,247,0.35)] ${open ? 'border-purple-400/50 shadow-[0_0_18px_rgba(168,85,247,0.4)]' : ''}`
    : 'relative text-gray-400 transition-colors hover:text-white';

  const BellIcon = unreadCount > 0 ? BellRing : Bell;

  return (
    <div className="relative" ref={panelRef}>
      <motion.button
        type="button"
        onClick={togglePanel}
        whileHover={{ scale: 1.06, y: -1 }}
        whileTap={{ scale: 0.95 }}
        className={btnClass}
        aria-label="Notifications"
      >
        <BellIcon
          size={18}
          className={variant === 'glass' ? 'text-purple-300' : ''}
        />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 px-1 text-[9px] font-bold text-white ring-2 ring-[#111]"
            style={{ boxShadow: '0 0 10px rgba(239,68,68,0.6)' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-purple-500/20 bg-[#111111]/98 shadow-[0_0_30px_rgba(139,92,246,0.15)] backdrop-blur-xl sm:w-80"
        >
          <div className="flex items-center justify-between border-b border-white/8 bg-purple-500/5 px-4 py-3">
            <p className="text-sm font-bold text-white">Notifications</p>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell size={24} className="mx-auto mb-2 text-gray-700" />
                <p className="text-xs text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => !n.is_read && markRead(n.id)}
                  className={`w-full border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-purple-500/5 ${
                    !n.is_read ? 'bg-purple-500/8' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.is_read && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                    )}
                    <div className={!n.is_read ? '' : 'pl-3.5'}>
                      <p className="text-xs font-semibold text-white">{n.title}</p>
                      <p className="mt-0.5 text-[10px] text-gray-400">{n.message}</p>
                      <p className="mt-1 text-[9px] text-gray-600">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { userAPI } from '../api';

export default function NotificationBell({ initialCount = 0 }) {
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

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={togglePanel}
        className="relative text-gray-400 transition-colors hover:text-white"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cs-red text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-72 rounded-xl border border-cs-border bg-cs-card shadow-xl sm:w-80">
          <div className="border-b border-cs-border px-4 py-3">
            <p className="text-sm font-bold">Notifications</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-center text-xs text-gray-500">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-gray-500">No notifications</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => !n.is_read && markRead(n.id)}
                  className={`w-full border-b border-cs-border/50 px-4 py-3 text-left transition-colors hover:bg-cs-dark ${
                    !n.is_read ? 'bg-cs-purple/5' : ''
                  }`}
                >
                  <p className="text-xs font-semibold">{n.title}</p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{n.message}</p>
                  <p className="mt-1 text-[9px] text-gray-600">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, Clock } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api';

export default function ContactUs() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    userAPI.getContactMessages().then(({ data }) => setHistory(data)).catch(() => {});
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await userAPI.sendContactMessage({ subject: subject.trim(), message: message.trim() });
      setSubject('');
      setMessage('');
      setSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={user} />

        <div className="card-dark glow-purple mb-4 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cs-purple/20">
              <Mail size={24} className="text-cs-purple" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Contact Us</h1>
              <p className="text-sm text-gray-400">Send a message to our support team</p>
            </div>
          </div>

          <div className="mb-5 rounded-xl border border-cs-border/50 bg-cs-dark/60 p-3 text-xs text-gray-400">
            Sending as <span className="font-semibold text-white">@{user?.user?.username}</span>
            {user?.user?.email ? (
              <span> · {user.user.email}</span>
            ) : null}
          </div>

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-cs-green/30 bg-cs-green/10 p-3 text-sm text-cs-green">
              <CheckCircle size={18} />
              Message sent! Our team will reply soon.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-cs-red/30 bg-cs-red/10 p-3 text-sm text-cs-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What is your message about?"
                required
                maxLength={200}
                className="w-full rounded-xl border border-cs-border bg-cs-dark px-4 py-2.5 text-sm focus:border-cs-purple focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                required
                rows={5}
                className="w-full resize-none rounded-xl border border-cs-border bg-cs-dark px-4 py-2.5 text-sm focus:border-cs-purple focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="gradient-btn flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              <Send size={16} />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {history.length > 0 && (
          <div className="card-dark mb-4 p-4">
            <h2 className="mb-3 text-sm font-bold text-gray-300">Your Messages</h2>
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="rounded-xl border border-cs-border/50 bg-cs-dark/60 p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{item.subject}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                      item.is_read ? 'bg-cs-green/20 text-cs-green' : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                    >
                      {item.is_read ? 'Read' : 'Pending'}
                    </span>
                  </div>
                  <p className="mb-2 text-xs leading-relaxed text-gray-400">{item.message}</p>
                  <p className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Clock size={10} />
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

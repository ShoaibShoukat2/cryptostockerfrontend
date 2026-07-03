import { useState, useEffect } from 'react';
import { ExternalLink, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api';

export default function HelpSupport() {
  const { user } = useAuth();
  const [telegram, setTelegram] = useState('https://t.me/cryptostacker');

  useEffect(() => {
    userAPI.getSiteConfig().then(({ data }) => {
      if (data.telegram_link) setTelegram(data.telegram_link);
    }).catch(() => {});
  }, []);

  const faqs = [
  {
    q: 'How does stacking work?',
    a: 'Stack your total balance once every 24 hours to earn daily profit. Profit is calculated on your full balance and compounds each day.',
  },
  {
    q: 'What is the minimum deposit?',
    a: 'Minimum deposit is $100 via BEP20 or TRC20 USDT.',
  },
  {
    q: 'How long does withdrawal take?',
    a: 'Withdrawals are processed within 24–72 hours. Only one withdrawal can be pending at a time.',
  },
  {
    q: 'Can I withdraw my investment anytime?',
    a: 'Profit can be withdrawn anytime. Your investment (deposit) is locked for 7 days before it can be withdrawn.',
  },
  {
    q: 'What is referral commission?',
    a: 'You earn 12% commission when your direct referral makes a deposit. Example: $100 deposit = $12 commission for you.',
  },
];

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={user} />
        <div className="card-dark glow-purple mb-4 p-6">
          <h1 className="mb-2 text-xl font-bold">Help & Support</h1>
          <p className="mb-6 text-sm text-gray-400">Our team is available 24/7 on Telegram</p>

          <a
            href={telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 flex items-center gap-4 rounded-2xl border border-cs-purple/30 bg-cs-purple/10 p-4 transition hover:bg-cs-purple/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cs-purple/20">
              <MessageCircle size={24} className="text-cs-purple" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white">Telegram Support</p>
              <p className="text-xs text-cs-purple">{telegram.replace('https://t.me/', '@')}</p>
            </div>
            <ExternalLink size={18} className="text-gray-500" />
          </a>

          <h2 className="mb-3 text-sm font-bold text-gray-300">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-cs-border/50 bg-cs-dark/60 p-4">
                <p className="mb-1 text-sm font-semibold text-white">{faq.q}</p>
                <p className="text-xs leading-relaxed text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

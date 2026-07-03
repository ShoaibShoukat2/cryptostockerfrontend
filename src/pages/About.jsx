import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api';

export default function About() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aboutText, setAboutText] = useState('');

  useEffect(() => {
    userAPI.getSiteConfig().then(({ data }) => {
      setAboutText(data.about_text || '');
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={user} />
        <div className="card-dark glow-purple mb-4 p-6">
          <h1 className="mb-4 text-xl font-bold">About Us</h1>
          <div className="space-y-4 text-sm leading-relaxed text-gray-300">
            <p>
              {aboutText || (
                <>
                  Crypto Stacker is a professional crypto trading platform. We invest your deposits
                  in crypto trading markets and share daily profits with you.
                </>
              )}
            </p>
            <p>
              When you deposit funds, our expert trading team uses your investment in cryptocurrency
              markets including BTC, ETH and other major pairs. The profits generated from trading
              are distributed to you as daily stack rewards.
            </p>
            <p>
              Stack your balance once every 24 hours to earn tier-based daily profits on your
              total balance. Higher referral levels unlock greater profit percentages — up to 3% daily.
            </p>
            <ul className="list-inside list-disc space-y-1 text-gray-400">
              <li>Daily profit on total balance (compound growth)</li>
              <li>Secure deposit via BEP20 / TRC20 USDT</li>
              <li>12% referral commission on team deposits</li>
              <li>4 referral tiers with increasing profit rates</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => navigate('/help')}
            className="gradient-btn-cta mt-6 w-full rounded-xl py-3 text-sm font-bold text-white"
          >
            Contact Support
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

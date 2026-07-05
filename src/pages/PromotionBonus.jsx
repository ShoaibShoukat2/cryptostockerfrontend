import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import PromotionBonusBox from '../components/PromotionBonusBox';
import { useAuth } from '../context/AuthContext';

export default function PromotionBonus() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cs-mesh pb-20">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <Header user={user} />
        <PromotionBonusBox />
      </div>
      <BottomNav />
    </div>
  );
}

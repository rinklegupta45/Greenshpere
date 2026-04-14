import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import RewardCard from '../components/RewardCard';

export default function Rewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rewards')
      .then((res) => setRewards(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-2xl mx-auto p-4 flex justify-center py-12"><div className="animate-spin w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="font-display font-bold text-2xl text-green-800 mb-2">Redeem Rewards</h1>
      <p className="text-gray-600 text-sm mb-2">Your eco-points: <strong className="text-green-600">{user?.points ?? 0}</strong></p>
      <p className="text-gray-500 text-sm mb-6">Spend points on badges, coupons, and certificates</p>
      <div className="space-y-4">
        {rewards.map((reward) => (
          <RewardCard key={reward._id} reward={reward} />
        ))}
      </div>
      {rewards.length === 0 && <div className="card p-8 text-center text-gray-500">No rewards available yet</div>}
    </div>
  );
}

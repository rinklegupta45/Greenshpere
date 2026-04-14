import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RewardCard({ reward, onRedeem }) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const canAfford = (user?.points ?? 0) >= reward.pointsCost;
  const inStock = reward.stock > 0;

  const handleRedeem = async () => {
    if (!canAfford || !inStock || loading) return;
    if (!window.confirm(`Are you sure you want to redeem "${reward.title}" for ${reward.pointsCost} points?`)) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/rewards/${reward._id}/redeem`);
      updateUser(data.user);
      toast.success('Redeemed successfully!');
      onRedeem?.(data);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Redemption failed');
    } finally {
      setLoading(false);
    }
  };

  const typeEmoji = { badge: '🏅', coupon: '🎫', certificate: '📜', other: '🎁' };

  return (
    <div className="card p-5">
      <div className="flex items-start gap-3">
        <span className="text-3xl">{typeEmoji[reward.type] || '🎁'}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-gray-900">{reward.title}</h3>
          {reward.description && <p className="text-sm text-gray-600 mt-1">{reward.description}</p>}
          <p className="text-green-600 font-semibold mt-2">{reward.pointsCost} pts</p>
          <p className="text-xs text-gray-500">Stock: {reward.stock}</p>
          <button
            onClick={handleRedeem}
            disabled={!canAfford || !inStock || loading}
            className="mt-3 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Redeeming...' : !inStock ? 'Out of stock' : !canAfford ? 'Not enough points' : 'Redeem'}
          </button>
        </div>
      </div>
    </div>
  );
}

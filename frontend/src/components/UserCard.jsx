import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function UserCard({ user: u, currentUserId, isFollowing, onFollow }) {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = async () => {
    if (u._id === currentUserId) return;
    setLoading(true);
    try {
      const { data } = await api.put(`/users/follow/${u._id}`);
      setFollowing(data.following);
      onFollow?.(data);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const avatar = u.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.name || 'U');

  return (
    <div className="card p-4 flex items-center justify-between">
      <Link to={`/profile/${u._id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <img src={avatar} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-gray-800 truncate">{u.name}</p>
          <p className="text-sm text-green-600">{u.points ?? 0} pts</p>
        </div>
      </Link>
      {u._id !== currentUserId && (
        <button onClick={handleFollow} disabled={loading} className="btn-secondary text-sm py-1.5 px-3 ml-2">
          {following ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import api from '../api/axios';
import LeaderboardCard from '../components/LeaderboardCard';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/leaderboard')
      .then((res) => setUsers(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-2xl mx-auto p-4 flex justify-center py-12"><div className="animate-spin w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="font-display font-bold text-2xl text-green-800 mb-2">Leaderboard</h1>
      <p className="text-gray-600 text-sm mb-6">Top users by eco-points</p>
      <div className="space-y-3">
        {users.map((user, i) => (
          <LeaderboardCard key={user._id} user={user} rank={i + 1} />
        ))}
      </div>
      {users.length === 0 && <div className="card p-8 text-center text-gray-500">No users yet</div>}
    </div>
  );
}

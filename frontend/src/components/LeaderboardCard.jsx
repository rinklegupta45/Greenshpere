import { Link } from 'react-router-dom';

export default function LeaderboardCard({ user, rank }) {
  const avatar = user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'U');
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Link to={`/profile/${user._id}`} className="card p-4 flex items-center gap-4 hover:border-green-300 transition-colors">
      <span className="text-2xl w-8 text-center">{rank <= 3 ? medals[rank - 1] : `#${rank}`}</span>
      <img src={avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{user.name}</p>
        <p className="text-sm text-green-600 font-semibold">{user.points ?? 0} eco-points</p>
      </div>
      {user.badges?.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {user.badges.slice(0, 3).map((b) => (
            <span key={b} className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">{b}</span>
          ))}
        </div>
      )}
    </Link>
  );
}

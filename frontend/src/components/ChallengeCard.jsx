import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ChallengeCard({ challenge, isParticipant, participationStatus, onJoin }) {
  const [loading, setLoading] = useState(false);
  const ended = new Date(challenge.deadline) < new Date();

  const handleJoin = async () => {
    if (ended || isParticipant) return;
    setLoading(true);
    try {
      await api.post(`/challenges/${challenge._id}/join`);
      toast.success('Joined challenge!');
      onJoin?.();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to join');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5">
      <h3 className="font-display font-semibold text-lg text-gray-900">{challenge.title}</h3>
      <p className="text-gray-600 text-sm mt-1">{challenge.description}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          +{challenge.pointsReward} pts
        </span>
        <span className="text-xs text-gray-500">
          Deadline: {new Date(challenge.deadline).toLocaleDateString()}
        </span>
        {challenge.requiresProof && <span className="text-xs text-amber-600">Proof required</span>}
      </div>
      {!ended && (
        <div className="mt-4">
          {isParticipant ? (
            <span className="text-sm text-green-600 font-medium">
              {participationStatus === 'pending' ? '⏳ Pending verification' : '✓ Participating'}
            </span>
          ) : (
            <button onClick={handleJoin} disabled={loading} className="btn-primary text-sm">
              {loading ? 'Joining...' : 'Join Challenge'}
            </button>
          )}
        </div>
      )}
      {ended && <p className="mt-2 text-sm text-gray-500">Ended</p>}
    </div>
  );
}

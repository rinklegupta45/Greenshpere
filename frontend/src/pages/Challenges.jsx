import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ChallengeCard from '../components/ChallengeCard';

export default function Challenges() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [myParticipations, setMyParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([api.get('/challenges'), api.get('/challenges/my')])
      .then(([allRes, myRes]) => {
        setChallenges(allRes.data || []);
        setMyParticipations(myRes.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const getParticipation = (challengeId) => {
    const c = myParticipations.find((ch) => ch._id === challengeId);
    const part = c?.participations?.find((p) => p.userId?._id === user?.id || p.userId === user?.id);
    return part;
  };

  if (loading) return <div className="max-w-2xl mx-auto p-4 flex justify-center py-12"><div className="animate-spin w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="font-display font-bold text-2xl text-green-800 mb-2">Challenges</h1>
      <p className="text-gray-600 text-sm mb-6">Join weekly eco-challenges and earn points</p>
      <div className="space-y-4">
        {challenges.map((ch) => {
          const part = getParticipation(ch._id);
          return (
            <ChallengeCard
              key={ch._id}
              challenge={ch}
              isParticipant={!!part}
              participationStatus={part?.status}
              onJoin={load}
            />
          );
        })}
      </div>
      {challenges.length === 0 && <div className="card p-8 text-center text-gray-500">No challenges yet</div>}
    </div>
  );
}

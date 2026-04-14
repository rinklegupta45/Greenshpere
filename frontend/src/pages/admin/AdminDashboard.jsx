import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/analytics'),
      api.get('/admin/challenges/pending'),
    ])
      .then(([aRes, pRes]) => {
        setAnalytics(aRes.data);
        setPending(pRes.data || []);
      })
      .catch(() => setAnalytics({ totalUsers: 0, totalPosts: 0, pendingVerifications: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const [approving, setApproving] = useState({});
  const handleVerification = async (challengeId, participationId, status) => {
    setApproving((p) => ({ ...p, [participationId]: true }));
    try {
      await api.put(`/admin/challenges/${challengeId}/participation/${participationId}`, { status });
      setPending((prev) => prev.map((c) => (c._id === challengeId ? { ...c, participations: c.participations.filter((p) => p._id !== participationId) } : c)));
    } finally {
      setApproving((p) => ({ ...p, [participationId]: false }));
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto p-6 flex justify-center"><div className="animate-spin w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-green-800">Admin Dashboard</h1>
        <Link to="/dashboard" className="text-green-600 hover:underline">← Back to app</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-sm text-gray-600">Total users</p>
          <p className="text-2xl font-bold text-green-600">{analytics?.totalUsers ?? 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Total posts</p>
          <p className="text-2xl font-bold text-green-600">{analytics?.totalPosts ?? 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Pending verifications</p>
          <p className="text-2xl font-bold text-amber-600">{analytics?.pendingVerifications ?? 0}</p>
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <Link to="/admin/create-challenge" className="btn-primary">Create Challenge</Link>
        <Link to="/admin/create-reward" className="btn-secondary">Create Reward</Link>
      </div>
      <h2 className="font-display font-semibold text-lg text-gray-800 mb-3">Pending proof verifications</h2>
      <div className="space-y-4">
        {pending.length === 0 ? (
          <div className="card p-6 text-center text-gray-500">No pending verifications</div>
        ) : (
          pending.flatMap((challenge) =>
            (challenge.participations || []).filter((p) => p.status === 'pending').map((p) => (
              <div key={p._id} className="card p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{challenge.title}</p>
                  <p className="text-sm text-gray-600">{p.userId?.name} — {p.proofText || p.proofUrl || 'No proof text'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerification(challenge._id, p._id, 'approved')}
                    disabled={approving[p._id]}
                    className="btn-primary text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerification(challenge._id, p._id, 'rejected')}
                    disabled={approving[p._id]}
                    className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

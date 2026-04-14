import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminCreateChallenge() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pointsReward, setPointsReward] = useState(50);
  const [deadline, setDeadline] = useState('');
  const [requiresProof, setRequiresProof] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !deadline) {
      toast.error('Fill required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/admin/challenges', {
        title,
        description,
        pointsReward: Number(pointsReward) || 0,
        deadline: new Date(deadline).toISOString(),
        requiresProof,
      });
      toast.success('Challenge created');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/dashboard')} className="text-green-600 hover:underline">← Back</button>
        <h1 className="font-display font-bold text-xl text-green-800">Create Challenge</h1>
      </div>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" rows={3} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Points reward</label>
          <input type="number" value={pointsReward} onChange={(e) => setPointsReward(e.target.value)} className="input-field" min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
          <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="input-field" required />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={requiresProof} onChange={(e) => setRequiresProof(e.target.checked)} />
          <span className="text-sm">Require proof (admin approval)</span>
        </label>
        <button type="submit" disabled={loading} className="btn-primary">Create Challenge</button>
      </form>
    </div>
  );
}

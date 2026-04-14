import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const TYPES = ['badge', 'coupon', 'certificate', 'other'];

export default function AdminCreateReward() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pointsCost, setPointsCost] = useState(100);
  const [stock, setStock] = useState(10);
  const [type, setType] = useState('badge');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error('Title is required');
      return;
    }
    setLoading(true);
    try {
      await api.post('/admin/rewards', {
        title,
        description,
        pointsCost: Number(pointsCost) || 0,
        stock: Number(stock) || 0,
        type,
      });
      toast.success('Reward created');
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
        <h1 className="font-display font-bold text-xl text-green-800">Create Reward</h1>
      </div>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" rows={2} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Points cost</label>
          <input type="number" value={pointsCost} onChange={(e) => setPointsCost(e.target.value)} className="input-field" min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="input-field" min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading} className="btn-primary">Create Reward</button>
      </form>
    </div>
  );
}

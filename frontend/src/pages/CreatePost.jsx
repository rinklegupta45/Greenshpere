import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import imageCompression from 'browser-image-compression';

export default function CreatePost() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [ecoCategory, setEcoCategory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ecoOptions, setEcoOptions] = useState([{ value: '', label: 'None' }]);

  useEffect(() => {
    api.get('/config/eco-options')
      .then(res => setEcoOptions(res.data))
      .catch(err => console.error("Failed to load eco options", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('location', location);
    formData.append('ecoCategory', ecoCategory);
    if (image) {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(image, options);
        formData.append('image', compressedFile, compressedFile.name);
      } catch (error) {
        console.error("Image compression error", error);
        formData.append('image', image);
      }
    }
    try {
      await api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Post created!');
      refreshUser();
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="font-display font-bold text-xl text-green-800 mb-6">Create Post</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="input-field" rows={3} placeholder="What's your green update?" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location (optional)</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="input-field" placeholder="e.g. Central Park" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Eco category (earn points)</label>
          <select value={ecoCategory} onChange={(e) => setEcoCategory(e.target.value)} className="input-field">
            {ecoOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0])} className="input-field" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Posting...' : 'Post'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

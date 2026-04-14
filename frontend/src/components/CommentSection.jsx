import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CommentSection({ postId, comments = [], onUpdate }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comment`, { text: text.trim() });
      onUpdate?.(data);
      setText('');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-green-100">
      <ul className="space-y-2 mb-4">
        {(comments || []).map((c) => (
          <li key={c._id} className="flex gap-2">
            <img src={c.userId?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(c.userId?.name || 'U')} alt="" className="w-6 h-6 rounded-full flex-shrink-0" />
            <div>
              <span className="font-medium text-sm text-gray-800">{c.userId?.name || 'User'}</span>
              <p className="text-sm text-gray-600">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="input-field flex-1 text-sm"
        />
        <button type="submit" disabled={submitting} className="btn-primary text-sm py-1.5 px-3">Post</button>
      </form>
    </div>
  );
}

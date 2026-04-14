import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';
import toast from 'react-hot-toast';

export default function PostCard({ post, onUpdate, feed }) {
  const { user } = useAuth();
  const [liking, setLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const isLiked = post.likes?.some((id) => id.toString?.() === user?.id || id === user?.id);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const { data } = await api.put(`/posts/${post._id}/like`);
      onUpdate?.({ ...post, ...data });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to like');
    } finally {
      setLiking(false);
    }
  };

  const author = post.userId;
  const authorName = author?.name ?? 'User';
  const authorAvatar = author?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(authorName);
  const commentCount = post.comments?.length ?? 0;

  return (
    <article className="card">
      <div className="p-4 flex items-center gap-3 border-b border-green-100">
        <Link to={`/profile/${author?._id || post.userId}`}>
          <img src={authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/profile/${author?._id || post.userId}`} className="font-medium text-gray-800 hover:text-green-600 truncate block">
            {authorName}
          </Link>
          {post.location && <p className="text-xs text-gray-500">{post.location}</p>}
        </div>
      </div>
      {post.imageUrl && (
        <div className="aspect-video bg-gray-200 relative overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
              <span className="text-gray-400">Loading image...</span>
            </div>
          )}
          <img 
            src={post.imageUrl.startsWith('http') ? post.imageUrl : (import.meta.env.VITE_API_URL || '') + post.imageUrl} 
            alt="Post content" 
            className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
          />
        </div>
      )}
      <div className="p-4">
        {post.caption && <p className="text-gray-700 whitespace-pre-wrap">{post.caption}</p>}
        {post.ecoCategory && (
          <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {post.ecoCategory.replace('_', ' ')} {post.pointsAwarded ? `+${post.pointsAwarded} pts` : ''}
          </span>
        )}
        <div className="flex items-center gap-4 mt-3 text-gray-500">
          <button onClick={handleLike} disabled={liking} className="flex items-center gap-1 hover:text-green-600">
            {isLiked ? '❤️' : '🤍'} {post.likes?.length ?? 0}
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 hover:text-green-600">
            💬 {commentCount}
          </button>
        </div>
        {showComments && (
          <CommentSection postId={post._id} comments={post.comments} onUpdate={onUpdate} />
        )}
      </div>
    </article>
  );
}

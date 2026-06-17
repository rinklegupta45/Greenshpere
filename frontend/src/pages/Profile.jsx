import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/users/profile/${id}`),
      api.get(`/posts/user/${id}`),
    ])
      .then(([profileRes, postsRes]) => {
        setProfile(profileRes.data);
        setFollowing(profileRes.data.isFollowing);
        setPosts(postsRes.data || []);
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFollow = async () => {
    if (!profile || profile._id === currentUser?.id) return;
    setFollowLoading(true);
    try {
      const { data } = await api.put(`/users/follow/${profile._id}`);
      setFollowing(data.following);
      setProfile((p) => {
        if (!p) return null;
        const currentUserId = currentUser?.id || currentUser?._id;
        const followersList = p.followers || [];
        const followers = data.following
          ? (followersList.includes(currentUserId) ? followersList : [...followersList, currentUserId])
          : followersList.filter((id) => id !== currentUserId);
        return { ...p, followers };
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const updatePost = (updated) => setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

  if (loading) return <div className="max-w-2xl mx-auto p-4 flex justify-center py-12"><div className="animate-spin w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full" /></div>;
  if (!profile) return <div className="max-w-2xl mx-auto p-4 text-red-600">User not found</div>;

  const isOwnProfile = currentUser?.id === profile._id;
  const avatar = profile.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img src={avatar} alt="" className="w-24 h-24 rounded-full object-cover" />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display font-bold text-2xl text-gray-900">{profile.name}</h1>
            {profile.bio && <p className="text-gray-600 mt-1">{profile.bio}</p>}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-sm">
              <span><strong>{profile.postCount ?? 0}</strong> posts</span>
              <span><strong>{profile.followers?.length ?? 0}</strong> followers</span>
              <span><strong>{profile.following?.length ?? 0}</strong> following</span>
              <span className="text-green-600 font-semibold"><strong>{profile.points ?? 0}</strong> eco-points</span>
            </div>
            {profile.badges?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {profile.badges.map((b) => (
                  <span key={b} className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">{b}</span>
                ))}
              </div>
            )}
            {!isOwnProfile && (
              <button onClick={handleFollow} disabled={followLoading} className="mt-3 btn-primary">
                {following ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>
      <h2 className="font-display font-semibold text-lg text-gray-800 mb-3">Posts</h2>
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">No posts yet</div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} onUpdate={updatePost} />)
        )}
      </div>
    </div>
  );
}

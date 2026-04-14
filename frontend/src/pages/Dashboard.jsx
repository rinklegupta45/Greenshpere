import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = (pageNum = 1) => {
    api.get(`/posts/feed?page=${pageNum}&limit=10`)
      .then((res) => {
        if (pageNum === 1) {
          setFeed(res.data.feed || []);
          setTrending(res.data.trending || []);
        } else {
          setFeed(prev => [...prev, ...(res.data.feed || [])]);
        }
        setHasMore(res.data.hasMore);
        setPage(pageNum + 1);
      })
      .catch((e) => setError(e.response?.data?.message || 'Failed to load feed'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFeed(1);
  }, []);

  const updatePost = (updated) => {
    setFeed((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    setTrending((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  if (loading) return <div className="max-w-2xl mx-auto p-4 flex justify-center py-12"><div className="animate-spin w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full" /></div>;
  if (error) return <div className="max-w-2xl mx-auto p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="font-display font-bold text-xl text-green-800 mb-4">Your Feed</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {feed.length === 0 && trending.length === 0 ? (
            <div className="card p-8 text-center text-gray-500">
              <p>No posts yet. Follow users or create a post to get started!</p>
            </div>
          ) : (
            <>
              <InfiniteScroll
                dataLength={feed.length}
                next={() => fetchFeed(page)}
                hasMore={hasMore}
                loader={<div className="text-center py-4 text-green-600">Loading more posts...</div>}
                endMessage={<p className="text-center py-4 text-gray-500">You have seen it all!</p>}
                className="space-y-6"
              >
                {feed.map((post) => (
                  <PostCard key={post._id} post={post} onUpdate={updatePost} />
                ))}
              </InfiniteScroll>
              {trending.length > 0 && (
                <section>
                  <h2 className="font-display font-semibold text-lg text-gray-800 mb-3">Trending</h2>
                  {trending.map((post) => (
                    <PostCard key={post._id} post={post} onUpdate={updatePost} feed />
                  ))}
                </section>
              )}
            </>
          )}
        </div>
        <div className="space-y-4">
          <div className="card p-4">
            <h2 className="font-display font-semibold text-gray-800 mb-3">Your eco-points</h2>
            <p className="text-2xl font-bold text-green-600">{user?.points ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

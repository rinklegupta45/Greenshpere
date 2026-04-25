import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-2 min-w-[200px]">
        <p className="font-medium text-gray-800">Are you sure you want to log out?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            className="px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="px-3 py-1.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            onClick={() => {
              toast.dismiss(t.id);
              logout();
              navigate('/login');
              toast.success('Logged out successfully');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    ), { duration: Infinity, id: 'logout-confirm' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 text-green-800 font-display font-bold text-2xl tracking-tight">
            <img src={logo} alt="GreenSphere Logo" className="w-8 h-8 rounded-lg drop-shadow-sm" /> GreenSphere
          </Link>
          
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Feed</Link>
            <Link to="/create-post" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Create Post</Link>
            <Link to="/leaderboard" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Leaderboard</Link>
            <Link to="/challenges" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Challenges</Link>
            <Link to="/rewards" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Rewards</Link>
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-sm font-bold text-amber-600 hover:text-amber-700">Admin</Link>
            )}
            <div className="relative border-l pl-6 ml-2 border-gray-200">
              <button onClick={() => setOpen(!open)} className="flex items-center gap-3 text-gray-700 hover:text-green-600 focus:outline-none transition-colors">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold">{user?.name}</span>
                  <span className="text-green-600 text-xs font-medium">{user?.points ?? 0} pts</span>
                </div>
                <img src={user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'U')} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-green-100" />
              </button>
              {open && (
                <>
                  <div className="fixed inset-0" onClick={() => setOpen(false)} />
                  <div className="absolute right-0 mt-3 w-48 py-2 bg-white rounded-xl shadow-xl border border-gray-100 ring-1 ring-black ring-opacity-5 origin-top-right transform transition py-1">
                    <Link to={`/profile/${user?.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors" onClick={() => setOpen(false)}>Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Logout</button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <button className="lg:hidden p-2 text-gray-600 hover:text-green-600 transition-colors" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      
      {open && (
        <div className="lg:hidden border-t border-green-100 bg-white/95 px-4 pt-2 shadow-inner">
          <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-gray-50">
             <img src={user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'U')} alt="" className="w-10 h-10 rounded-full object-cover" />
             <div>
                <span className="block text-sm font-bold text-gray-900">{user?.name}</span>
                <span className="block text-xs text-green-600 font-medium">{user?.points ?? 0} pts</span>
             </div>
          </div>
          <Link to="/dashboard" className="block px-2 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md" onClick={() => setOpen(false)}>Feed</Link>
          <Link to="/create-post" className="block px-2 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md" onClick={() => setOpen(false)}>Create Post</Link>
          <Link to="/leaderboard" className="block px-2 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md" onClick={() => setOpen(false)}>Leaderboard</Link>
          <Link to="/challenges" className="block px-2 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md" onClick={() => setOpen(false)}>Challenges</Link>
          <Link to="/rewards" className="block px-2 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md" onClick={() => setOpen(false)}>Rewards</Link>
          <Link to={`/profile/${user?.id}`} className="block px-2 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md" onClick={() => setOpen(false)}>Your Profile</Link>
          {user?.role === 'admin' && <Link to="/admin/dashboard" className="block px-2 py-3 text-base font-bold text-amber-600 hover:bg-amber-50 rounded-md" onClick={() => setOpen(false)}>Admin Panel</Link>}
          <button onClick={handleLogout} className="block w-full text-left px-2 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">Logout</button>
        </div>
      )}
    </nav>
  );
}

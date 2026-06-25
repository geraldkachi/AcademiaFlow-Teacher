import { useState } from 'react';
import { Search, Bell, Menu, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/services';

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    clearAuth(); navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center gap-4 shrink-0 relative z-20">
      <button onClick={onMenuClick} className="lg:hidden p-1.5 text-gray-500 hover:text-navy"><Menu size={20}/></button>
      <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 flex-1 max-w-xs">
        <Search size={14} className="text-gray-400"/>
        <input placeholder="Search" className="bg-transparent text-sm outline-none text-gray-600 placeholder:text-gray-400 w-full"/>
      </div>
      <div className="flex-1"/>
      <div className="hidden sm:flex items-center gap-2">
        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-[8px] font-bold text-yellow-900">S</span>
        </div>
        <span className="text-xs font-medium text-navy">{user?.school?.name || 'Spring Hills Academy'}</span>
      </div>
      <button onClick={() => navigate('/notifications')} className="relative p-1.5 text-gray-500 hover:text-navy">
        <Bell size={18}/>
        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-primary rounded-full"/>
      </button>
      <div className="relative">
        <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar"/> : <User size={15} className="text-gray-500"/>}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-navy leading-tight">{user?.name || 'Jane Doe'}</p>
            <p className="text-[10px] text-gray-400">Staff ID: {user?.staff_id || 'STF-10374'}</p>
          </div>
        </button>
        {showProfile && (
          <div className="absolute right-0 top-11 bg-white border border-gray-100 rounded-xl shadow-modal w-36 py-1 z-50">
            <button onClick={() => { navigate('/settings'); setShowProfile(false); }} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <User size={13}/>Profile
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">
              <LogOut size={13}/>Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

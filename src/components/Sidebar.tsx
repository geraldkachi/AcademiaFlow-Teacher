import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Database, BookMarked, ClipboardList, BarChart2, Bell, Settings, LogOut, X } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/services';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/classes', label: 'My Classes', icon: BookMarked },
  { to: '/question-bank', label: 'Question Bank', icon: Database },
  { to: '/exams', label: 'Exams', icon: BookOpen },
  { to: '/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/results', label: 'Results', icon: BarChart2 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { clearAuth } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    clearAuth(); navigate('/login');
  };
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-52 bg-white border-r border-gray-100 flex flex-col py-5 px-3 transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <button onClick={onClose} className="lg:hidden absolute top-4 right-3 p-1 text-gray-400 hover:text-gray-600"><X size={18}/></button>
        <div className="px-2 mb-7"><Logo size="md"/></div>
        <nav className="flex-1 flex flex-col gap-0.5">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
              <Icon size={16}/>{label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-100 pt-3 mt-3">
          <NavLink to="/settings" onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
            <Settings size={16}/>Settings
          </NavLink>
          <button onClick={handleLogout} className="sidebar-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600 mt-0.5">
            <LogOut size={16}/>Logout
          </button>
        </div>
      </aside>
    </>
  );
}

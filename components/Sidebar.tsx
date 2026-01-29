
import React from 'react';
import { User, UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  currentUser: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: '📊' },
    { id: 'add', label: 'إضافة معاملة', icon: '➕' },
    { id: 'history', label: 'السجل المالي', icon: '📋' },
  ];

  if (currentUser.role === UserRole.SUPER_ADMIN) {
    menuItems.push({ id: 'admin', label: 'إدارة النظام', icon: '⚙️' });
  }

  return (
    <aside className="w-20 md:w-64 bg-white border-l border-gray-200 h-screen sticky top-0 flex flex-col shadow-sm no-print">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3">
        <div className="w-10 h-10 bg-[#8B1D3D] rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
        <span className="hidden md:block text-xl font-bold text-[#8B1D3D]">STORY</span>
      </div>

      <nav className="mt-8 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-[#fdf2f2] text-[#8B1D3D] border-r-4 border-[#8B1D3D]' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-100 hidden md:block">
        <div className="bg-gray-50 p-4 rounded-xl mb-3">
          <p className="text-xs text-gray-400 mb-1">المستخدم الحالي</p>
          <p className="text-sm font-bold truncate" title={currentUser.name}>{currentUser.name}</p>
          <p className="text-[10px] text-gray-500 uppercase">{currentUser.role === UserRole.SUPER_ADMIN ? 'Super Admin' : 'Admin'}</p>
        </div>
        <button 
          onClick={onLogout}
          className="w-full text-red-500 text-sm hover:bg-red-50 py-2 rounded-lg transition-colors font-bold flex items-center justify-center gap-2"
        >
          <span>🚪</span> تسجيل خروج
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

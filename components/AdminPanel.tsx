
import React, { useState } from 'react';
import { AppConfig, User, UserRole } from '../types';

interface AdminPanelProps {
  config: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
  users: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ config, onUpdateConfig, users, onAddUser, onDeleteUser }) => {
  // User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.ADMIN);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) return;

    onAddUser({
      id: crypto.randomUUID(),
      name: newName,
      email: newEmail,
      password: newPassword,
      role: newRole
    });

    setNewName('');
    setNewEmail('');
    setNewPassword('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">👥 إدارة المستخدمين والمدراء</h2>
        
        {/* Add User Form */}
        <form onSubmit={handleAddUser} className="bg-gray-50 p-4 rounded-xl mb-8 border border-gray-200">
          <h3 className="font-bold text-sm mb-4 text-gray-600">إضافة مستخدم جديد</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="الاسم الكامل"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#8B1D3D]"
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#8B1D3D]"
            />
            <input
              type="text"
              placeholder="كلمة المرور"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#8B1D3D]"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#8B1D3D] bg-white"
            >
              <option value={UserRole.ADMIN}>مدير (Admin)</option>
              <option value={UserRole.VIEWER}>مشاهد فقط (Viewer)</option>
            </select>
          </div>
          <button type="submit" className="mt-4 w-full bg-[#8B1D3D] text-white py-2 rounded-lg font-bold text-sm hover:bg-[#701530]">
            إضافة المستخدم
          </button>
        </form>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-4 py-3">الاسم</th>
                <th className="px-4 py-3">البريد</th>
                <th className="px-4 py-3">الصلاحية</th>
                <th className="px-4 py-3 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-bold">{user.name}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role === UserRole.ADMIN ? 'مدير' : 'مشاهد'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => onDeleteUser(user.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg text-xs"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">لا يوجد مدراء إضافيين</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

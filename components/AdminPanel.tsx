
import React, { useState } from 'react';
import { AppConfig, User, UserRole } from '../types';
import { initializeSheetStructure } from '../utils/sheetService';

interface AdminPanelProps {
  config: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
  users: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ config, onUpdateConfig, users, onAddUser, onDeleteUser }) => {
  const [sheetUrl, setSheetUrl] = useState(config.sheetUrl || '');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.ADMIN);

  const handleSaveConfig = async () => {
    setIsSyncing(true);
    // Simulate initialization
    await initializeSheetStructure(sheetUrl);
    onUpdateConfig({ ...config, sheetUrl });
    setIsSyncing(false);
    alert('تم ربط الشيت وتهيئة الهيكلية بنجاح!');
  };

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
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-4">🔌 ربط مصدر البيانات (Google Sheets)</h2>
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            قم بإدخال رابط Google Apps Script Web App ليكون مصدراً للبيانات. سيقوم النظام بتهيئة الأعمدة تلقائياً عند الربط.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B1D3D] outline-none text-left"
              dir="ltr"
            />
            <button 
              onClick={handleSaveConfig}
              disabled={isSyncing || !sheetUrl}
              className="bg-[#12B886] hover:bg-[#0ca678] text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 justify-center"
            >
              {isSyncing ? 'جاري التهيئة...' : 'ربط وتهيئة الشيت'}
            </button>
          </div>
          {config.sheetUrl && (
            <div className="text-xs text-green-600 font-bold bg-green-50 p-2 rounded inline-block">
              ✅ متصل حالياً
            </div>
          )}
        </div>
      </div>

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


import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      // البحث عن المستخدم في القائمة الممررة (التي تأتي من data.ts)
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError('بيانات الدخول غير صحيحة');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-['Tajawal']" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#8B1D3D] p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 backdrop-blur-sm">S</div>
          <h1 className="text-2xl font-bold text-white mb-1">Story Accounting</h1>
          <p className="text-pink-100 text-sm opacity-80">تسجيل الدخول للنظام المالي</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B1D3D] outline-none transition-all text-left"
              placeholder="name@company.com"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B1D3D] outline-none transition-all text-left"
              placeholder="••••••"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B1D3D] hover:bg-[#701530] text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-pink-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'دخول'
            )}
          </button>
        </form>
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
          Powered by Rayan Media © 2024
        </div>
      </div>
    </div>
  );
};

export default Login;

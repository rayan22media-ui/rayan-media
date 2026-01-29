
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType, User, UserRole, AppConfig } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import InvoiceView from './components/InvoiceView';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { saveToGoogleSheet, loadFromGoogleSheet } from './utils/sheetService';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // App Data State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [config, setConfig] = useState<AppConfig>({
    sheetUrl: '',
    googleSheetId: '',
    lastSync: ''
  });

  // UI State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'history' | 'admin'>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);
  const [advice, setAdvice] = useState<string>("");
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'loading' | 'success' | 'error'>('idle');

  // 1. Initialize Data from LocalStorage
  useEffect(() => {
    const session = localStorage.getItem('story_session');
    if (session) setCurrentUser(JSON.parse(session));

    const savedData = localStorage.getItem('story_accounting_data');
    if (savedData) setTransactions(JSON.parse(savedData));

    const savedUsers = localStorage.getItem('story_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));

    const savedConfig = localStorage.getItem('story_config');
    if (savedConfig) setConfig(JSON.parse(savedConfig));
  }, []);

  // 2. Load from Sheet on Startup (if Config exists and user is logged in)
  useEffect(() => {
    if (currentUser && config.sheetUrl) {
      handleManualSync();
    }
  }, [currentUser]); // Run once when user logs in

  // 3. Persist to LocalStorage on every change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('story_accounting_data', JSON.stringify(transactions));
      localStorage.setItem('story_users', JSON.stringify(users));
      localStorage.setItem('story_config', JSON.stringify(config));
    }
  }, [transactions, users, config, currentUser]);

  // 4. Debounced Auto-Save to Google Sheet
  useEffect(() => {
    if (!currentUser || !config.sheetUrl) return;

    const timeoutId = setTimeout(() => {
      setSyncStatus('saving');
      saveToGoogleSheet(config.sheetUrl, { transactions, users })
        .then((success) => {
          setSyncStatus(success ? 'success' : 'error');
          setTimeout(() => setSyncStatus('idle'), 3000);
        });
    }, 2000); // Wait 2 seconds after last change

    return () => clearTimeout(timeoutId);
  }, [transactions, users, config.sheetUrl]);

  const handleManualSync = async () => {
    if (!config.sheetUrl) return;
    setSyncStatus('loading');
    const data = await loadFromGoogleSheet(config.sheetUrl);
    if (data) {
      setTransactions(data.transactions);
      setUsers(data.users);
      setSyncStatus('success');
    } else {
      setSyncStatus('error');
    }
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('story_session', JSON.stringify(user));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('story_session');
  };

  const addTransaction = (t: Omit<Transaction, 'id' | 'date' | 'invoiceNumber'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      invoiceNumber: `ST-${new Date().getFullYear()}${String(transactions.length + 1).padStart(4, '0')}`
    };
    setTransactions([newTransaction, ...transactions]);
    setActiveTab('history');
  };

  const deleteTransaction = (id: string) => {
    if (currentUser?.role === UserRole.VIEWER) {
      alert('ليس لديك صلاحية الحذف');
      return;
    }
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const getStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + (t.amount * t.quantity), 0);
    const totalExpense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + (t.amount * t.quantity), 0);
    return {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense
    };
  };

  const generateFinancialAdvice = async () => {
    const stats = getStats();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `بصفتك مستشار مالي خبير، قم بتحليل هذه البيانات المالية لشركة "Story Creative Studio":
        الدخل الإجمالي: ${stats.totalIncome}$
        المصاريف الإجمالية: ${stats.totalExpense}$
        صافي الربح: ${stats.netProfit}$
        قدم نصيحة مالية قصيرة وذكية باللغة العربية لتحسين الأداء المالي.`,
      });
      setAdvice(response.text || "لا يمكن الحصول على نصيحة حالياً.");
    } catch (error) {
      console.error("AI Error:", error);
      setAdvice("يرجى المحاولة لاحقاً للحصول على استشارة ذكية.");
    }
  };

  // Render Logic
  if (!currentUser) {
    return <Login onLogin={handleLogin} users={users} />;
  }

  if (selectedInvoice) {
    return <InvoiceView transaction={selectedInvoice} onBack={() => setSelectedInvoice(null)} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-['Tajawal']">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 transition-all duration-300">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">نظام المحاسبة الذكي</h1>
            <p className="text-gray-500 mt-1">إدارة مالية احترافية لشركة Story Creative Studio</p>
          </div>
          <div className="flex gap-3">
             {config.sheetUrl && (
                <button
                  onClick={handleManualSync}
                  className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                    syncStatus === 'error' ? 'bg-red-100 text-red-600' : 
                    syncStatus === 'success' ? 'bg-green-100 text-green-600' :
                    'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                  disabled={syncStatus === 'loading' || syncStatus === 'saving'}
                >
                  {syncStatus === 'loading' || syncStatus === 'saving' ? (
                    <span className="animate-spin">⌛</span>
                  ) : syncStatus === 'success' ? (
                    <span>✅ تم الحفظ</span>
                  ) : syncStatus === 'error' ? (
                     <span>⚠️ خطأ اتصال</span>
                  ) : (
                    <span>🔄 مزامنة</span>
                  )}
                </button>
             )}
            {activeTab === 'dashboard' && (
              <button 
                onClick={generateFinancialAdvice}
                className="bg-[#12B886] hover:bg-[#0ca678] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
              >
                <span className="text-lg">✨</span>
                استشارة مالية
              </button>
            )}
          </div>
        </header>

        {advice && activeTab === 'dashboard' && (
          <div className="mb-8 p-4 bg-teal-50 border-r-4 border-[#12B886] rounded-l-lg animate-fade-in shadow-sm">
            <h3 className="font-bold text-[#12B886] mb-1">نصيحة Gemini:</h3>
            <p className="text-gray-700 leading-relaxed">{advice}</p>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard stats={getStats()} transactions={transactions} />
        )}

        {activeTab === 'add' && (
          <div className="max-w-2xl mx-auto">
             {currentUser.role !== UserRole.VIEWER ? (
               <TransactionForm onSubmit={addTransaction} />
             ) : (
               <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                 ⚠️ ليس لديك صلاحية لإضافة معاملات جديدة
               </div>
             )}
          </div>
        )}

        {activeTab === 'history' && (
          <TransactionTable 
            transactions={transactions} 
            onDelete={deleteTransaction} 
            onViewInvoice={setSelectedInvoice}
          />
        )}

        {activeTab === 'admin' && currentUser.role === UserRole.SUPER_ADMIN && (
          <AdminPanel 
            config={config} 
            onUpdateConfig={setConfig}
            users={users}
            onAddUser={(user) => setUsers([...users, user])}
            onDeleteUser={(id) => setUsers(users.filter(u => u.id !== id))}
          />
        )}
      </main>
    </div>
  );
};

export default App;

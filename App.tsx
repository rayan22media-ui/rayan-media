
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, User, UserRole, AppConfig } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import InvoiceView from './components/InvoiceView';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { exportToCSV } from './utils/sheetService';
import { INITIAL_TRANSACTIONS, INITIAL_USERS } from './data'; // استيراد البيانات المحلية
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // App Data State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [config, setConfig] = useState<AppConfig>({
    lastSync: ''
  });

  // UI State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'history' | 'admin'>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);
  const [advice, setAdvice] = useState<string>("");

  // 1. Initialize Data
  useEffect(() => {
    // Check Session
    const session = localStorage.getItem('story_session');
    if (session) setCurrentUser(JSON.parse(session));

    // Load Transactions: Try LocalStorage first, otherwise use INITIAL_TRANSACTIONS from code
    const savedData = localStorage.getItem('story_accounting_data');
    if (savedData) {
      setTransactions(JSON.parse(savedData));
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
    }

    // Load Users: Try LocalStorage first, otherwise use INITIAL_USERS from code
    const savedUsers = localStorage.getItem('story_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(INITIAL_USERS);
    }

    const savedConfig = localStorage.getItem('story_config');
    if (savedConfig) setConfig(JSON.parse(savedConfig));
  }, []);

  // 2. Persist to LocalStorage on every change (To keep edits during usage)
  useEffect(() => {
    // We only save if we have data loaded to avoid overwriting with empty arrays on first render
    if (transactions.length > 0 || users.length > 0) {
      localStorage.setItem('story_accounting_data', JSON.stringify(transactions));
      localStorage.setItem('story_users', JSON.stringify(users));
      localStorage.setItem('story_config', JSON.stringify(config));
    }
  }, [transactions, users, config]);

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
             <button
               onClick={() => exportToCSV(transactions)}
               className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all bg-green-600 hover:bg-green-700 text-white shadow-sm"
             >
               <span>📥</span>
               تصدير Excel
             </button>
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

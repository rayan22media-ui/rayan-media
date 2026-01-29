
import React from 'react';
import { FinancialStats, Transaction, TransactionType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  stats: FinancialStats;
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, transactions }) => {
  const chartData = [
    { name: 'الدخل', value: stats.totalIncome, color: '#12B886' },
    { name: 'المصاريف', value: stats.totalExpense, color: '#fa5252' },
    { name: 'الربح', value: stats.netProfit, color: '#8B1D3D' },
  ];

  const pieData = [
    { name: 'دخل', value: stats.totalIncome },
    { name: 'مصاريف', value: stats.totalExpense },
  ];

  const COLORS = ['#12B886', '#fa5252'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1 font-medium">إجمالي الدخل</p>
          <p className="text-3xl font-bold text-[#12B886]">${stats.totalIncome.toLocaleString()}</p>
          <div className="mt-2 text-xs text-green-600 bg-green-50 inline-block px-2 py-1 rounded">نشاط إيجابي</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1 font-medium">إجمالي المصاريف</p>
          <p className="text-3xl font-bold text-[#fa5252]">${stats.totalExpense.toLocaleString()}</p>
          <div className="mt-2 text-xs text-red-600 bg-red-50 inline-block px-2 py-1 rounded">تدفقات خارجة</div>
        </div>
        <div className="bg-[#8B1D3D] p-6 rounded-2xl shadow-sm">
          <p className="text-pink-100 text-sm mb-1 font-medium">صافي الربح</p>
          <p className="text-3xl font-bold text-white">${stats.netProfit.toLocaleString()}</p>
          <div className="mt-2 text-xs text-pink-200 bg-[#a02346] inline-block px-2 py-1 rounded">أداء الشركة</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6">مقارنة مالية</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8f9fa'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6">توزيع الميزانية</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#12B886]"></div>
                <span className="text-sm">دخل</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#fa5252]"></div>
                <span className="text-sm">مصاريف</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg mb-4">آخر المعاملات</h3>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  t.type === TransactionType.INCOME ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {t.type === TransactionType.INCOME ? '↓' : '↑'}
                </div>
                <div>
                  <p className="font-bold text-sm">{t.description}</p>
                  <p className="text-xs text-gray-400">{t.date} • {t.customerName || 'عميل عام'}</p>
                </div>
              </div>
              <p className={`font-bold ${
                t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'
              }`}>
                {t.type === TransactionType.INCOME ? '+' : '-'}${ (t.amount * t.quantity).toLocaleString() }
              </p>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-gray-400 py-4">لا توجد معاملات حالياً</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

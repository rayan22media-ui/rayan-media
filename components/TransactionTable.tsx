
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onViewInvoice: (t: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onDelete, onViewInvoice }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-600 text-sm">رقم الفاتورة</th>
              <th className="px-6 py-4 font-bold text-gray-600 text-sm">التاريخ</th>
              <th className="px-6 py-4 font-bold text-gray-600 text-sm">الجهة / العميل</th>
              <th className="px-6 py-4 font-bold text-gray-600 text-sm">الوصف</th>
              <th className="px-6 py-4 font-bold text-gray-600 text-sm">النوع</th>
              <th className="px-6 py-4 font-bold text-gray-600 text-sm">المجموع</th>
              <th className="px-6 py-4 font-bold text-gray-600 text-sm text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm">{t.invoiceNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{t.date}</td>
                <td className="px-6 py-4 text-sm font-bold">{t.customerName || '-'}</td>
                <td className="px-6 py-4 text-sm">{t.description}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    t.type === TransactionType.INCOME 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                  }`}>
                    {t.type === TransactionType.INCOME ? 'إيراد' : 'مصروف'}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">${(t.amount * t.quantity).toLocaleString()}</td>
                <td className="px-6 py-4 text-center space-x-2 space-x-reverse">
                  <button 
                    onClick={() => onViewInvoice(t)}
                    className="text-[#8B1D3D] hover:bg-[#8B1D3D] hover:text-white p-2 rounded-lg transition-all"
                    title="عرض الفاتورة"
                  >
                    📄
                  </button>
                  <button 
                    onClick={() => { if(confirm('هل أنت متأكد؟')) onDelete(t.id) }}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition-all"
                    title="حذف"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="text-center py-20 bg-white">
            <div className="text-5xl mb-4 opacity-20">📊</div>
            <p className="text-gray-400 font-medium">لا توجد معاملات مسجلة بعد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;

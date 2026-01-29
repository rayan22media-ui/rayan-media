
import React, { useState } from 'react';
import { TransactionType } from '../types';

interface TransactionFormProps {
  onSubmit: (data: {
    type: TransactionType;
    description: string;
    amount: number;
    quantity: number;
    customerName: string;
  }) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [customerName, setCustomerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    
    onSubmit({
      type,
      description,
      amount: parseFloat(amount),
      quantity: parseInt(quantity),
      customerName
    });

    // Reset
    setDescription('');
    setAmount('');
    setQuantity('1');
    setCustomerName('');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-[#8B1D3D]">إضافة معاملة جديدة</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setType(TransactionType.INCOME)}
            className={`flex-1 py-2 rounded-md font-bold transition-all ${
              type === TransactionType.INCOME ? 'bg-white text-[#12B886] shadow-sm' : 'text-gray-500'
            }`}
          >
            إيراد (دخل)
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.EXPENSE)}
            className={`flex-1 py-2 rounded-md font-bold transition-all ${
              type === TransactionType.EXPENSE ? 'bg-white text-[#fa5252] shadow-sm' : 'text-gray-500'
            }`}
          >
            مصروف (خرج)
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">اسم العميل / الجهة</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B1D3D] outline-none transition-all"
            placeholder="مثال: شركة الخطوات للتنمية"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">وصف الخدمة / المادة</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B1D3D] outline-none transition-all"
            placeholder="مثال: تصميم شعار احترافي"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">سعر الواحدة ($)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B1D3D] outline-none transition-all"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">الكمية</label>
            <input
              type="number"
              required
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B1D3D] outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#8B1D3D] hover:bg-[#701530] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-100 transition-all mt-4"
        >
          حفظ المعاملة وتوليد الفاتورة
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;

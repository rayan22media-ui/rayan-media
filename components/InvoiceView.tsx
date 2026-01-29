
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface InvoiceViewProps {
  transaction: Transaction;
  onBack: () => void;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ transaction, onBack }) => {
  const total = transaction.amount * transaction.quantity;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-0">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6 no-print">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold"
        >
          <span>→</span> العودة للسجل
        </button>
        <button 
          onClick={handlePrint}
          className="bg-[#8B1D3D] text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-[#701530] transition-all"
        >
          طباعة أو حفظ PDF
        </button>
      </div>

      {/* A4 Content */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] p-12 md:p-16 relative overflow-hidden print:shadow-none print:p-8">
        
        {/* Decorative elements from original image */}
        <div className="flex justify-between items-start mb-16">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#8B1D3D] rounded-xl flex items-center justify-center text-white text-3xl font-bold italic">S</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#8B1D3D]">story</h1>
              <p className="text-xs uppercase text-gray-400 tracking-widest font-light">Creative Studio</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden text-center min-w-[250px]">
            <div className="bg-[#8B1D3D] text-white text-xs py-2 px-4 border-l border-[#8B1D3D]">رقم الفاتورة</div>
            <div className="bg-[#8B1D3D] text-white text-xs py-2 px-4">التاريخ</div>
            <div className="py-2 px-4 border-l border-gray-200 font-mono text-sm">{transaction.invoiceNumber}</div>
            <div className="py-2 px-4 text-sm">{transaction.date}</div>
          </div>
        </div>

        <div className="mb-12">
          <p className="text-gray-500 mb-1">لصالح:</p>
          <h2 className="text-xl font-bold text-gray-800">{transaction.customerName || 'عميل عام'}</h2>
        </div>

        <div className="bg-[#8B1D3D] text-white py-3 px-6 rounded-t-lg text-center mb-8">
          <h3 className="text-xl font-bold">إتفاقية العمل / فاتورة ضريبية</h3>
        </div>

        <div className="mb-12">
          <p className="text-gray-700 leading-relaxed mb-8">
            تم تحرير هذا الملف من قبل شركة <span className="font-bold text-[#8B1D3D]">Story Creative Studio</span> لينص على إتفاقية العمل على مشروعكم 
            وفق المهام والتعليمات التي تلقيناها منكم وتم الاتفاق عليها.
          </p>

          <h4 className="font-bold text-lg mb-4 text-[#8B1D3D]">المهام المطلوبة</h4>
          <p className="text-gray-600 mb-8 border-b border-gray-100 pb-8">
            تتكفل الشركة بإنجاز المهام المطلوبة من قبل العميل وفقاً للمعلومات التي تلقيناها وتم الاتفاق عليها والموضحة في الجدول أدناه.
          </p>
        </div>

        <div className="mb-12">
          <h4 className="font-bold text-lg mb-6">المستحقات المالية</h4>
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#8B1D3D] text-white">
                <th className="p-3 border border-[#8B1D3D] w-12 text-center">م</th>
                <th className="p-3 border border-[#8B1D3D]">الشرح</th>
                <th className="p-3 border border-[#8B1D3D] text-center">سعر الواحدة</th>
                <th className="p-3 border border-[#8B1D3D] text-center w-20">الكمية</th>
                <th className="p-3 border border-[#8B1D3D] text-center">المجموع</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border border-gray-200 text-center">1</td>
                <td className="p-4 border border-gray-200 font-bold">{transaction.description}</td>
                <td className="p-4 border border-gray-200 text-center">${transaction.amount.toLocaleString()}</td>
                <td className="p-4 border border-gray-200 text-center">{transaction.quantity}</td>
                <td className="p-4 border border-gray-200 text-center font-bold">${total.toLocaleString()}</td>
              </tr>
              {/* Padding rows to make it look substantial like the image */}
              {[...Array(2)].map((_, i) => (
                <tr key={i}>
                  <td className="p-4 border border-gray-200 text-center text-transparent">.</td>
                  <td className="p-4 border border-gray-200"></td>
                  <td className="p-4 border border-gray-200"></td>
                  <td className="p-4 border border-gray-200"></td>
                  <td className="p-4 border border-gray-200"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-16">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between p-2 border border-gray-100 rounded">
              <span className="text-gray-500 font-bold">المجموع</span>
              <span className="font-bold">${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-2 border border-gray-100 rounded">
              <span className="text-gray-500 font-bold">الخصم</span>
              <span className="font-bold text-gray-300">--</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded text-[#12B886] font-bold text-lg border-2 border-[#12B886]">
              <span>الإجمالي</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 border-t border-gray-50 pt-12">
          <div className="space-y-4">
            <h4 className="font-bold text-[#8B1D3D]">الزمن المتوقع لإنجاز المهام:</h4>
            <ul className="text-sm text-gray-500 space-y-2 list-disc list-inside">
              <li>يتم إنجاز كافة المهام المتفق عليها في الخطة خلال التواريخ المحددة لكل مهمة.</li>
              <li>على العميل تقديم الملاحظات والمقترحات في حال وجودها لتحسين جودة العمل.</li>
              <li>العقد صالح لمدة شهر كامل من تاريخ الصدور.</li>
            </ul>
          </div>

          <div className="text-center flex flex-col items-center justify-center">
            <div className="w-32 h-32 opacity-10 mb-4">
               {/* Simplified SVG Placeholder for Logo */}
               <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="#8B1D3D" strokeWidth="2" strokeDasharray="5 5"/>
                <text x="50" y="55" textAnchor="middle" fill="#8B1D3D" fontSize="12" fontWeight="bold">Story Studio</text>
               </svg>
            </div>
            <p className="text-xs text-gray-400">المدير التنفيذي</p>
            <p className="font-bold text-lg border-b-2 border-[#8B1D3D] pb-1 mt-2">أحمد الأخرس</p>
          </div>
        </div>

        <footer className="absolute bottom-12 left-0 right-0 text-center text-[10px] text-gray-300 print:bottom-4">
          Story Creative Studio • www.story-studio.com • +963 000 000 000
        </footer>
      </div>
    </div>
  );
};

export default InvoiceView;

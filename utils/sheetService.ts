
import { Transaction } from '../types';

export const exportToCSV = (transactions: Transaction[]) => {
  // تعريف عناوين الأعمدة
  const headers = ['المعرف', 'رقم الفاتورة', 'التاريخ', 'النوع', 'الوصف', 'السعر الافرادي', 'الكمية', 'المجموع', 'العميل'];
  
  // تحويل البيانات إلى صفوف
  const rows = transactions.map(t => [
    t.id,
    t.invoiceNumber,
    t.date,
    t.type === 'income' ? 'إيراد' : 'مصروف',
    `"${t.description.replace(/"/g, '""')}"`, // معالجة الفواصل والنصوص
    t.amount,
    t.quantity,
    t.amount * t.quantity,
    `"${(t.customerName || '').replace(/"/g, '""')}"`
  ]);

  // دمج العناوين مع الصفوف
  const csvContent = [
    '\uFEFF' + headers.join(','), // \uFEFF لدعم اللغة العربية في Excel
    ...rows.map(row => row.join(','))
  ].join('\n');

  // إنشاء ملف وتنزيله
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Story_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

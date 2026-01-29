
import { Transaction, TransactionType, User, UserRole } from './types';

// ==========================================
// قاعدة البيانات المحلية (Local Database)
// يمكنك تعديل البيانات هنا مباشرة
// ==========================================

export const INITIAL_USERS: User[] = [
  {
    id: 'super_admin_01',
    name: 'مدير النظام (Rayan Media)',
    email: 'admin@rayan2media.com',
    password: '546884', 
    role: UserRole.SUPER_ADMIN
  },
  {
    id: 'admin_user_01',
    name: 'أحمد الأخرس',
    email: 'ahmed@story.com',
    password: '123',
    role: UserRole.ADMIN
  },
  {
    id: 'viewer_user_01',
    name: 'مراقب مالي',
    email: 'viewer@story.com',
    password: '123',
    role: UserRole.VIEWER
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    invoiceNumber: 'ST-20240001',
    date: '2024-05-15',
    type: TransactionType.INCOME,
    description: 'تصميم هوية بصرية - شركة الأفق',
    amount: 1500,
    quantity: 1,
    customerName: 'شركة الأفق للتجارة'
  },
  {
    id: 't2',
    invoiceNumber: 'ST-20240002',
    date: '2024-05-18',
    type: TransactionType.EXPENSE,
    description: 'اشتراك Adobe Creative Cloud',
    amount: 54.99,
    quantity: 1,
    customerName: 'Adobe Inc'
  },
  {
    id: 't3',
    invoiceNumber: 'ST-20240003',
    date: '2024-05-20',
    type: TransactionType.INCOME,
    description: 'إنتاج فيديو ترويجي 30 ثانية',
    amount: 800,
    quantity: 1,
    customerName: 'مطعم السرايا'
  },
  {
    id: 't4',
    invoiceNumber: 'ST-20240004',
    date: '2024-05-22',
    type: TransactionType.EXPENSE,
    description: 'تجديد استضافة الموقع',
    amount: 120,
    quantity: 1,
    customerName: 'Hostinger'
  }
];

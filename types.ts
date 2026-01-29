
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  quantity: number;
  date: string;
  customerName?: string;
  invoiceNumber: string;
}

export interface FinancialStats {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  VIEWER = 'viewer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real app, never store plain passwords. This is for the demo requirements.
  role: UserRole;
}

export interface AppConfig {
  lastSync: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note: string;
  date: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  createdAt: string;
}

export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  recentTransactions: Transaction[];
}

export interface ReportData {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  categoryBreakdown: CategorySummary[];
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  userId: string | null;
}

export const EXPENSE_CATEGORIES = [
  { value: "Food", label: "Food" },
  { value: "Transport", label: "Transport" },
  { value: "Groceries", label: "Groceries" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Rent", label: "Rent" },
  { value: "Education", label: "Education" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Others", label: "Others" },
] as const;

export const INCOME_CATEGORIES = [
  { value: "Salary", label: "Salary" },
  { value: "Freelance", label: "Freelance" },
  { value: "Investment", label: "Investment" },
  { value: "Others", label: "Others" },
] as const;

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

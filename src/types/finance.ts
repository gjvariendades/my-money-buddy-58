// Tipos para o sistema de gerenciamento financeiro

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  totalLimit: number;
  usedLimit: number;
  closingDay: number;
  dueDay: number;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  date: string;
  paymentMethod: 'debit' | 'credit';
  cardId?: string;
  categoryId: string;
  description?: string;
}

export interface Income {
  id: string;
  amount: number;
  date: string;
  type: 'salary' | 'extra';
  description?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface MonthlyData {
  month: string; // formato: YYYY-MM
  salary: number;
  extraIncome: number;
  expenses: Expense[];
  savingsGoal?: SavingsGoal;
}

export interface FinanceData {
  cards: CreditCard[];
  categories: Category[];
  monthlyData: Record<string, MonthlyData>;
  savingsGoals: SavingsGoal[];
}

// Categorias padrão do sistema
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Alimentação', icon: 'UtensilsCrossed', color: 'hsl(38 92% 50%)', isCustom: false },
  { id: 'transport', name: 'Transporte', icon: 'Car', color: 'hsl(210 100% 52%)', isCustom: false },
  { id: 'entertainment', name: 'Lazer', icon: 'Gamepad2', color: 'hsl(280 65% 60%)', isCustom: false },
  { id: 'health', name: 'Saúde', icon: 'Heart', color: 'hsl(0 72% 51%)', isCustom: false },
  { id: 'education', name: 'Educação', icon: 'GraduationCap', color: 'hsl(160 84% 39%)', isCustom: false },
  { id: 'housing', name: 'Moradia', icon: 'Home', color: 'hsl(185 75% 45%)', isCustom: false },
  { id: 'shopping', name: 'Compras', icon: 'ShoppingBag', color: 'hsl(320 70% 55%)', isCustom: false },
  { id: 'bills', name: 'Contas', icon: 'Receipt', color: 'hsl(200 80% 50%)', isCustom: false },
  { id: 'other', name: 'Outros', icon: 'MoreHorizontal', color: 'hsl(215 15% 45%)', isCustom: false },
];

// Cores disponíveis para cartões
export const CARD_COLORS = [
  'hsl(160 84% 39%)',
  'hsl(210 100% 52%)',
  'hsl(185 75% 45%)',
  'hsl(38 92% 50%)',
  'hsl(280 65% 60%)',
  'hsl(0 72% 51%)',
  'hsl(320 70% 55%)',
  'hsl(200 80% 50%)',
];

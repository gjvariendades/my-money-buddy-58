import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CreditCard, 
  Category, 
  Expense, 
  Income, 
  SavingsGoal, 
  MonthlyData, 
  FinanceData,
  DEFAULT_CATEGORIES 
} from '@/types/finance';
import { format, subMonths } from 'date-fns';

interface FinanceContextType {
  // Dados
  cards: CreditCard[];
  categories: Category[];
  currentMonth: string;
  monthlyData: MonthlyData | undefined;
  savingsGoals: SavingsGoal[];
  
  // Ações - Cartões
  addCard: (card: Omit<CreditCard, 'id'>) => void;
  updateCard: (card: CreditCard) => void;
  deleteCard: (id: string) => void;
  
  // Ações - Categorias
  addCategory: (category: Omit<Category, 'id' | 'isCustom'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  
  // Ações - Renda
  setSalary: (amount: number) => void;
  addExtraIncome: (income: Omit<Income, 'id' | 'type'>) => void;
  
  // Ações - Gastos
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  
  // Ações - Metas
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  deleteSavingsGoal: (id: string) => void;
  
  // Navegação de mês
  setCurrentMonth: (month: string) => void;
  getAvailableMonths: () => string[];
  
  // Cálculos
  getTotalExpenses: () => number;
  getTotalIncome: () => number;
  getAvailableBalance: () => number;
  getCardUsage: (cardId: string) => number;
  getExpensesByCategory: () => { categoryId: string; total: number }[];
  getExpensesByCard: () => { cardId: string; total: number }[];
  getDailyExpenses: () => { date: string; total: number }[];
  
  // Alertas
  getAlerts: () => { type: 'warning' | 'danger'; message: string }[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY = 'fincontrol-data';

const getInitialData = (): FinanceData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    cards: [],
    categories: DEFAULT_CATEGORIES,
    monthlyData: {},
    savingsGoals: [],
  };
};

const getCurrentMonthKey = () => format(new Date(), 'yyyy-MM');

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FinanceData>(getInitialData);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthKey());

  // Persistir dados no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Garantir que o mês atual existe
  useEffect(() => {
    if (!data.monthlyData[currentMonth]) {
      setData(prev => ({
        ...prev,
        monthlyData: {
          ...prev.monthlyData,
          [currentMonth]: {
            month: currentMonth,
            salary: 0,
            extraIncome: 0,
            expenses: [],
          },
        },
      }));
    }
  }, [currentMonth, data.monthlyData]);

  const monthlyData = data.monthlyData[currentMonth];

  // Gerar ID único
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // CARTÕES
  const addCard = (card: Omit<CreditCard, 'id'>) => {
    setData(prev => ({
      ...prev,
      cards: [...prev.cards, { ...card, id: generateId() }],
    }));
  };

  const updateCard = (card: CreditCard) => {
    setData(prev => ({
      ...prev,
      cards: prev.cards.map(c => (c.id === card.id ? card : c)),
    }));
  };

  const deleteCard = (id: string) => {
    setData(prev => ({
      ...prev,
      cards: prev.cards.filter(c => c.id !== id),
    }));
  };

  // CATEGORIAS
  const addCategory = (category: Omit<Category, 'id' | 'isCustom'>) => {
    setData(prev => ({
      ...prev,
      categories: [...prev.categories, { ...category, id: generateId(), isCustom: true }],
    }));
  };

  const updateCategory = (category: Category) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(c => (c.id === category.id ? category : c)),
    }));
  };

  const deleteCategory = (id: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id || !c.isCustom),
    }));
  };

  // RENDA
  const setSalary = (amount: number) => {
    setData(prev => ({
      ...prev,
      monthlyData: {
        ...prev.monthlyData,
        [currentMonth]: {
          ...prev.monthlyData[currentMonth],
          month: currentMonth,
          salary: amount,
          extraIncome: prev.monthlyData[currentMonth]?.extraIncome || 0,
          expenses: prev.monthlyData[currentMonth]?.expenses || [],
        },
      },
    }));
  };

  const addExtraIncome = (income: Omit<Income, 'id' | 'type'>) => {
    setData(prev => ({
      ...prev,
      monthlyData: {
        ...prev.monthlyData,
        [currentMonth]: {
          ...prev.monthlyData[currentMonth],
          month: currentMonth,
          salary: prev.monthlyData[currentMonth]?.salary || 0,
          extraIncome: (prev.monthlyData[currentMonth]?.extraIncome || 0) + income.amount,
          expenses: prev.monthlyData[currentMonth]?.expenses || [],
        },
      },
    }));
  };

  // GASTOS
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId() };
    
    setData(prev => {
      const newData = { ...prev };
      
      // Adicionar gasto ao mês
      newData.monthlyData = {
        ...newData.monthlyData,
        [currentMonth]: {
          ...newData.monthlyData[currentMonth],
          month: currentMonth,
          salary: newData.monthlyData[currentMonth]?.salary || 0,
          extraIncome: newData.monthlyData[currentMonth]?.extraIncome || 0,
          expenses: [...(newData.monthlyData[currentMonth]?.expenses || []), newExpense],
        },
      };
      
      // Atualizar limite do cartão se for crédito
      if (expense.paymentMethod === 'credit' && expense.cardId) {
        newData.cards = newData.cards.map(card =>
          card.id === expense.cardId
            ? { ...card, usedLimit: card.usedLimit + expense.amount }
            : card
        );
      }
      
      return newData;
    });
  };

  const updateExpense = (expense: Expense) => {
    setData(prev => ({
      ...prev,
      monthlyData: {
        ...prev.monthlyData,
        [currentMonth]: {
          ...prev.monthlyData[currentMonth],
          expenses: prev.monthlyData[currentMonth]?.expenses.map(e =>
            e.id === expense.id ? expense : e
          ) || [],
        },
      },
    }));
  };

  const deleteExpense = (id: string) => {
    const expense = monthlyData?.expenses.find(e => e.id === id);
    
    setData(prev => {
      const newData = { ...prev };
      
      // Remover gasto
      newData.monthlyData = {
        ...newData.monthlyData,
        [currentMonth]: {
          ...newData.monthlyData[currentMonth],
          expenses: newData.monthlyData[currentMonth]?.expenses.filter(e => e.id !== id) || [],
        },
      };
      
      // Restaurar limite do cartão se for crédito
      if (expense?.paymentMethod === 'credit' && expense.cardId) {
        newData.cards = newData.cards.map(card =>
          card.id === expense.cardId
            ? { ...card, usedLimit: Math.max(0, card.usedLimit - expense.amount) }
            : card
        );
      }
      
      return newData;
    });
  };

  // METAS
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    setData(prev => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, { ...goal, id: generateId() }],
    }));
  };

  const updateSavingsGoal = (goal: SavingsGoal) => {
    setData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map(g => (g.id === goal.id ? goal : g)),
    }));
  };

  const deleteSavingsGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter(g => g.id !== id),
    }));
  };

  // NAVEGAÇÃO DE MÊS
  const getAvailableMonths = () => {
    const months: string[] = [];
    for (let i = 0; i < 12; i++) {
      months.push(format(subMonths(new Date(), i), 'yyyy-MM'));
    }
    return months;
  };

  // CÁLCULOS
  const getTotalExpenses = () => {
    return monthlyData?.expenses.reduce((sum, e) => sum + e.amount, 0) || 0;
  };

  const getTotalIncome = () => {
    return (monthlyData?.salary || 0) + (monthlyData?.extraIncome || 0);
  };

  const getAvailableBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getCardUsage = (cardId: string) => {
    return monthlyData?.expenses
      .filter(e => e.cardId === cardId)
      .reduce((sum, e) => sum + e.amount, 0) || 0;
  };

  const getExpensesByCategory = () => {
    const grouped: Record<string, number> = {};
    monthlyData?.expenses.forEach(e => {
      grouped[e.categoryId] = (grouped[e.categoryId] || 0) + e.amount;
    });
    return Object.entries(grouped).map(([categoryId, total]) => ({ categoryId, total }));
  };

  const getExpensesByCard = () => {
    const grouped: Record<string, number> = {};
    monthlyData?.expenses
      .filter(e => e.paymentMethod === 'credit' && e.cardId)
      .forEach(e => {
        grouped[e.cardId!] = (grouped[e.cardId!] || 0) + e.amount;
      });
    return Object.entries(grouped).map(([cardId, total]) => ({ cardId, total }));
  };

  const getDailyExpenses = () => {
    const grouped: Record<string, number> = {};
    monthlyData?.expenses.forEach(e => {
      grouped[e.date] = (grouped[e.date] || 0) + e.amount;
    });
    return Object.entries(grouped)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  // ALERTAS
  const getAlerts = () => {
    const alerts: { type: 'warning' | 'danger'; message: string }[] = [];
    
    // Verificar cartões próximos do limite
    data.cards.forEach(card => {
      const usage = (card.usedLimit / card.totalLimit) * 100;
      if (usage >= 90) {
        alerts.push({ type: 'danger', message: `${card.name}: Limite crítico (${usage.toFixed(0)}% usado)` });
      } else if (usage >= 80) {
        alerts.push({ type: 'warning', message: `${card.name}: Limite alto (${usage.toFixed(0)}% usado)` });
      }
    });
    
    // Verificar salário baixo
    const balance = getAvailableBalance();
    const income = getTotalIncome();
    if (income > 0 && balance < income * 0.1) {
      alerts.push({ type: 'warning', message: 'Saldo disponível está abaixo de 10% da renda' });
    }
    
    return alerts;
  };

  return (
    <FinanceContext.Provider
      value={{
        cards: data.cards,
        categories: data.categories,
        currentMonth,
        monthlyData,
        savingsGoals: data.savingsGoals,
        addCard,
        updateCard,
        deleteCard,
        addCategory,
        updateCategory,
        deleteCategory,
        setSalary,
        addExtraIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        setCurrentMonth,
        getAvailableMonths,
        getTotalExpenses,
        getTotalIncome,
        getAvailableBalance,
        getCardUsage,
        getExpensesByCategory,
        getExpensesByCard,
        getDailyExpenses,
        getAlerts,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

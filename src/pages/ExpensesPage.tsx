import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Layout } from '@/components/layout/Layout';
import { ExpenseItem } from '@/components/finance/ExpenseItem';
import { ExpenseFormDialog } from '@/components/finance/ExpenseFormDialog';
import { MonthSelector } from '@/components/finance/MonthSelector';
import { Button } from '@/components/ui/button';
import { Expense } from '@/types/finance';
import { Plus, Receipt } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ExpensesPage() {
  const { monthlyData, categories, cards, deleteExpense } = useFinance();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [deletingExpense, setDeletingExpense] = useState<Expense | undefined>();

  const expenses = monthlyData?.expenses || [];

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingExpense) {
      deleteExpense(deletingExpense.id);
      setDeletingExpense(undefined);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingExpense(undefined);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gastos</h1>
            <p className="text-muted-foreground">Registre e acompanhe seus gastos</p>
          </div>
          <div className="flex items-center gap-2">
            <MonthSelector />
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo
            </Button>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">Nenhum gasto registrado</h3>
            <p className="text-sm text-muted-foreground mb-4">Registre seu primeiro gasto do mês</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Gasto
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.sort((a, b) => b.date.localeCompare(a.date)).map(expense => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                category={categories.find(c => c.id === expense.categoryId)}
                card={cards.find(c => c.id === expense.cardId)}
                onEdit={() => handleEdit(expense)}
                onDelete={() => setDeletingExpense(expense)}
              />
            ))}
          </div>
        )}
      </div>

      <ExpenseFormDialog open={dialogOpen} onOpenChange={handleDialogClose} expense={editingExpense} />

      <AlertDialog open={!!deletingExpense} onOpenChange={() => setDeletingExpense(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Gasto</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir este gasto?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

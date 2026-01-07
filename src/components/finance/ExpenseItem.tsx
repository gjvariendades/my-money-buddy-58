import { Expense, Category, CreditCard } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil, Trash2, CreditCard as CreditCardIcon, Wallet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExpenseItemProps {
  expense: Expense;
  category?: Category;
  card?: CreditCard;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ExpenseItem({ expense, category, card, onEdit, onDelete }: ExpenseItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
      <div 
        className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
        style={{ backgroundColor: category?.color || 'hsl(var(--muted))' }}
      >
        {expense.paymentMethod === 'credit' ? (
          <CreditCardIcon className="h-5 w-5 text-white" />
        ) : (
          <Wallet className="h-5 w-5 text-white" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {expense.description || category?.name || 'Gasto'}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{format(parseISO(expense.date), "dd 'de' MMM", { locale: ptBR })}</span>
          {card && (
            <>
              <span>•</span>
              <span>{card.name}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-destructive">
          -{formatCurrency(expense.amount)}
        </p>
      </div>
      
      {(onEdit || onDelete) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

import { SavingsGoal } from '@/types/finance';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SavingsGoalItemProps {
  goal: SavingsGoal;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SavingsGoalItem({ goal, onEdit, onDelete }: SavingsGoalItemProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{goal.name}</h3>
              {goal.deadline && (
                <p className="text-xs text-muted-foreground">
                  Prazo: {format(parseISO(goal.deadline), "dd 'de' MMM, yyyy", { locale: ptBR })}
                </p>
              )}
            </div>
          </div>
          
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{progress.toFixed(0)}%</span>
          </div>
          
          <Progress value={Math.min(progress, 100)} className="h-2" />
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
            </span>
            <span className="font-medium text-primary">
              Faltam {formatCurrency(remaining > 0 ? remaining : 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { CreditCard as CreditCardType } from '@/types/finance';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreditCard, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CreditCardItemProps {
  card: CreditCardType;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

export function CreditCardItem({ card, onEdit, onDelete, compact = false }: CreditCardItemProps) {
  const availableLimit = card.totalLimit - card.usedLimit;
  const usagePercentage = (card.usedLimit / card.totalLimit) * 100;
  
  const getProgressColor = () => {
    if (usagePercentage >= 90) return 'bg-destructive';
    if (usagePercentage >= 80) return 'bg-warning';
    return 'bg-primary';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: card.color }}
        >
          <CreditCard className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{card.name}</p>
          <p className="text-xs text-muted-foreground">
            Disponível: {formatCurrency(availableLimit)}
          </p>
        </div>
        <div className="w-16">
          <Progress value={usagePercentage} className="h-2" />
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: card.color }}
            >
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{card.name}</h3>
              <p className="text-sm text-muted-foreground">{card.bank}</p>
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
            <span className="text-muted-foreground">Limite utilizado</span>
            <span className="font-medium">{formatCurrency(card.usedLimit)}</span>
          </div>
          
          <Progress 
            value={usagePercentage} 
            className="h-2"
          />
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Disponível</span>
            <span className="font-semibold text-primary">{formatCurrency(availableLimit)}</span>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Fecha dia {card.closingDay}</span>
            <span>Vence dia {card.dueDay}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

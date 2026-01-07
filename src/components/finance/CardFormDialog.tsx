import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { CARD_COLORS } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditCard } from '@/types/finance';

interface CardFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card?: CreditCard;
}

export function CardFormDialog({ open, onOpenChange, card }: CardFormDialogProps) {
  const { addCard, updateCard } = useFinance();
  const isEditing = !!card;

  const [name, setName] = useState(card?.name || '');
  const [bank, setBank] = useState(card?.bank || '');
  const [totalLimit, setTotalLimit] = useState(card?.totalLimit?.toString() || '');
  const [usedLimit, setUsedLimit] = useState(card?.usedLimit?.toString() || '0');
  const [closingDay, setClosingDay] = useState(card?.closingDay?.toString() || '');
  const [dueDay, setDueDay] = useState(card?.dueDay?.toString() || '');
  const [color, setColor] = useState(card?.color || CARD_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cardData = {
      name,
      bank,
      totalLimit: parseFloat(totalLimit) || 0,
      usedLimit: parseFloat(usedLimit) || 0,
      closingDay: parseInt(closingDay) || 1,
      dueDay: parseInt(dueDay) || 1,
      color,
    };

    if (isEditing && card) {
      updateCard({ ...cardData, id: card.id });
    } else {
      addCard(cardData);
    }

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setBank('');
    setTotalLimit('');
    setUsedLimit('0');
    setClosingDay('');
    setDueDay('');
    setColor(CARD_COLORS[0]);
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Cartão' : 'Novo Cartão'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cartão</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Nubank, Inter..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bank">Banco</Label>
            <Input
              id="bank"
              value={bank}
              onChange={e => setBank(e.target.value)}
              placeholder="Ex: Nubank, Banco Inter..."
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalLimit">Limite Total</Label>
              <Input
                id="totalLimit"
                type="number"
                step="0.01"
                value={totalLimit}
                onChange={e => setTotalLimit(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="usedLimit">Limite Utilizado</Label>
              <Input
                id="usedLimit"
                type="number"
                step="0.01"
                value={usedLimit}
                onChange={e => setUsedLimit(e.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="closingDay">Dia de Fechamento</Label>
              <Select value={closingDay} onValueChange={setClosingDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Dia" />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDay">Dia de Vencimento</Label>
              <Select value={dueDay} onValueChange={setDueDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Dia" />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Cor do Cartão</Label>
            <div className="flex gap-2 flex-wrap">
              {CARD_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    color === c ? 'scale-110 ring-2 ring-offset-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

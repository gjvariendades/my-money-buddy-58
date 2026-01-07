import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Layout } from '@/components/layout/Layout';
import { CreditCardItem } from '@/components/finance/CreditCardItem';
import { CardFormDialog } from '@/components/finance/CardFormDialog';
import { Button } from '@/components/ui/button';
import { CreditCard as CreditCardType } from '@/types/finance';
import { Plus, CreditCard } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function CardsPage() {
  const { cards, deleteCard } = useFinance();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCardType | undefined>();
  const [deletingCard, setDeletingCard] = useState<CreditCardType | undefined>();

  const handleEdit = (card: CreditCardType) => {
    setEditingCard(card);
    setDialogOpen(true);
  };

  const handleDelete = (card: CreditCardType) => {
    setDeletingCard(card);
  };

  const confirmDelete = () => {
    if (deletingCard) {
      deleteCard(deletingCard.id);
      setDeletingCard(undefined);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingCard(undefined);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cartões</h1>
            <p className="text-muted-foreground">Gerencie seus cartões de crédito</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cartão
          </Button>
        </div>

        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">Nenhum cartão cadastrado</h3>
            <p className="text-sm text-muted-foreground mb-4">Adicione seu primeiro cartão de crédito</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cartão
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(card => (
              <CreditCardItem
                key={card.id}
                card={card}
                onEdit={() => handleEdit(card)}
                onDelete={() => handleDelete(card)}
              />
            ))}
          </div>
        )}
      </div>

      <CardFormDialog open={dialogOpen} onOpenChange={handleDialogClose} card={editingCard} />

      <AlertDialog open={!!deletingCard} onOpenChange={() => setDeletingCard(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cartão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cartão "{deletingCard?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

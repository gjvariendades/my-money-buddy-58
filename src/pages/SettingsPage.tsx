import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { CategoryFormDialog } from '@/components/finance/CategoryFormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Palette, Trash2, Plus } from 'lucide-react';
import { Category } from '@/types/finance';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { categories, deleteCategory } = useFinance();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deletingCategory, setDeletingCategory] = useState<Category | undefined>();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleClearData = () => {
    localStorage.removeItem('fincontrol-data');
    window.location.reload();
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryDialogOpen(true);
  };

  const handleCategoryDialogClose = (open: boolean) => {
    setCategoryDialogOpen(open);
    if (!open) setEditingCategory(undefined);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Personalize sua experiência</p>
        </div>

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Modo Escuro</Label>
              <Switch id="dark-mode" checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Categorias
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setCategoryDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Nova
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm">{cat.name}</span>
                  {cat.isCustom && <span className="text-xs text-muted-foreground">(personalizada)</span>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditCategory(cat)}>Editar</Button>
                  {cat.isCustom && (
                    <Button variant="ghost" size="sm" onClick={() => setDeletingCategory(cat)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Zona de Perigo</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={() => setClearDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Todos os Dados
            </Button>
          </CardContent>
        </Card>
      </div>

      <CategoryFormDialog open={categoryDialogOpen} onOpenChange={handleCategoryDialogClose} category={editingCategory} />

      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
            <AlertDialogDescription>Excluir "{deletingCategory?.name}"?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { deleteCategory(deletingCategory!.id); setDeletingCategory(undefined); }} className="bg-destructive">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar Todos os Dados</AlertDialogTitle>
            <AlertDialogDescription>Esta ação apagará todos os seus dados financeiros permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearData} className="bg-destructive">Limpar Tudo</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

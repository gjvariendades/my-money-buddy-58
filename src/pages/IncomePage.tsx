import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Wallet, Plus, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function IncomePage() {
  const { monthlyData, setSalary, addExtraIncome } = useFinance();
  const { toast } = useToast();
  
  const [salary, setSalaryInput] = useState(monthlyData?.salary?.toString() || '');
  const [extraAmount, setExtraAmount] = useState('');
  const [extraDescription, setExtraDescription] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleSaveSalary = () => {
    setSalary(parseFloat(salary) || 0);
    toast({ title: 'Salário atualizado!', description: formatCurrency(parseFloat(salary) || 0) });
  };

  const handleAddExtra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraAmount) return;
    
    addExtraIncome({
      amount: parseFloat(extraAmount) || 0,
      date: new Date().toISOString().split('T')[0],
      description: extraDescription || undefined,
    });
    
    toast({ title: 'Renda extra adicionada!', description: formatCurrency(parseFloat(extraAmount) || 0) });
    setExtraAmount('');
    setExtraDescription('');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Renda</h1>
          <p className="text-muted-foreground">Gerencie seu salário e rendas extras</p>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="gradient-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Salário</p>
                  <p className="text-2xl font-bold">{formatCurrency(monthlyData?.salary || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Plus className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Renda Extra</p>
                  <p className="text-2xl font-bold">{formatCurrency(monthlyData?.extraIncome || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Salary Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Salário Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salário Líquido (R$)</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                value={salary}
                onChange={e => setSalaryInput(e.target.value)}
                placeholder="0,00"
                className="text-lg"
              />
            </div>
            <Button onClick={handleSaveSalary} className="w-full">Salvar Salário</Button>
          </CardContent>
        </Card>

        {/* Extra Income Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Adicionar Renda Extra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExtra} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="extraAmount">Valor (R$)</Label>
                <Input
                  id="extraAmount"
                  type="number"
                  step="0.01"
                  value={extraAmount}
                  onChange={e => setExtraAmount(e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extraDesc">Descrição (opcional)</Label>
                <Input
                  id="extraDesc"
                  value={extraDescription}
                  onChange={e => setExtraDescription(e.target.value)}
                  placeholder="Ex: Freelance, bônus..."
                />
              </div>
              <Button type="submit" variant="secondary" className="w-full">Adicionar Renda Extra</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

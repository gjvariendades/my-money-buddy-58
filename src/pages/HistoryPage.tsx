import { Layout } from '@/components/layout/Layout';
import { MonthSelector } from '@/components/finance/MonthSelector';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function HistoryPage() {
  const { getAvailableMonths, categories } = useFinance();
  const months = getAvailableMonths();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Get data from localStorage for comparison
  const getMonthlyTotals = () => {
    const stored = localStorage.getItem('fincontrol-data');
    if (!stored) return [];
    
    const data = JSON.parse(stored);
    return months.map(month => {
      const monthData = data.monthlyData?.[month];
      const expenses = monthData?.expenses?.reduce((sum: number, e: any) => sum + e.amount, 0) || 0;
      const income = (monthData?.salary || 0) + (monthData?.extraIncome || 0);
      const date = parse(month, 'yyyy-MM', new Date());
      
      return {
        month,
        label: format(date, 'MMM', { locale: ptBR }),
        expenses,
        income,
        savings: income - expenses,
      };
    }).reverse();
  };

  const monthlyData = getMonthlyTotals();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Histórico</h1>
            <p className="text-muted-foreground">Acompanhe sua evolução financeira</p>
          </div>
          <MonthSelector />
        </div>

        {/* Monthly Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparativo Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(v) => `R$${v}`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="income" name="Renda" fill="hsl(var(--primary))" radius={4} />
                <Bar dataKey="expenses" name="Gastos" fill="hsl(var(--destructive))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Savings Evolution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolução da Economia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(v) => `R$${v}`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line type="monotone" dataKey="savings" name="Economia" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {monthlyData.slice(-6).reverse().map(m => {
            const date = parse(m.month, 'yyyy-MM', new Date());
            return (
              <Card key={m.month}>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground capitalize">
                    {format(date, "MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Renda</span>
                      <span className="font-medium text-primary">{formatCurrency(m.income)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Gastos</span>
                      <span className="font-medium text-destructive">{formatCurrency(m.expenses)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t">
                      <span className="text-sm font-medium">Saldo</span>
                      <span className={`font-bold ${m.savings >= 0 ? 'text-primary' : 'text-destructive'}`}>
                        {formatCurrency(m.savings)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

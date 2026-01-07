import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Layout } from '@/components/layout/Layout';
import { SummaryCard } from '@/components/finance/SummaryCard';
import { CreditCardItem } from '@/components/finance/CreditCardItem';
import { AlertBanner } from '@/components/finance/AlertBanner';
import { MonthSelector } from '@/components/finance/MonthSelector';
import { SavingsGoalItem } from '@/components/finance/SavingsGoalItem';
import { ExpenseFormDialog } from '@/components/finance/ExpenseFormDialog';
import { GoalFormDialog } from '@/components/finance/GoalFormDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Wallet, TrendingDown, PiggyBank, CreditCard, Plus, Target } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';

export default function Dashboard() {
  const { 
    cards, categories, savingsGoals, monthlyData,
    getTotalIncome, getTotalExpenses, getAvailableBalance,
    getExpensesByCategory, getExpensesByCard, getDailyExpenses, getAlerts
  } = useFinance();

  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getAvailableBalance();
  const spentPercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const totalCardLimit = cards.reduce((sum, c) => sum + (c.totalLimit - c.usedLimit), 0);

  const expensesByCategory = getExpensesByCategory().map(e => ({
    ...e,
    name: categories.find(c => c.id === e.categoryId)?.name || 'Outros',
    color: categories.find(c => c.id === e.categoryId)?.color || 'hsl(var(--muted))',
  }));

  const expensesByCard = getExpensesByCard().map(e => ({
    ...e,
    name: cards.find(c => c.id === e.cardId)?.name || 'Cartão',
    color: cards.find(c => c.id === e.cardId)?.color || 'hsl(var(--primary))',
  }));

  const dailyExpenses = getDailyExpenses().map(e => ({
    ...e,
    day: e.date.split('-')[2],
  }));

  const alerts = getAlerts();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral das suas finanças</p>
          </div>
          <MonthSelector />
        </div>

        {/* Alerts */}
        <AlertBanner alerts={alerts} />

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Renda Total"
            value={formatCurrency(totalIncome)}
            icon={<Wallet className="h-5 w-5" />}
            variant="primary"
          />
          <SummaryCard
            title="Total Gasto"
            value={formatCurrency(totalExpenses)}
            subtitle={`${spentPercentage.toFixed(0)}% da renda`}
            icon={<TrendingDown className="h-5 w-5" />}
          />
          <SummaryCard
            title="Saldo Disponível"
            value={formatCurrency(balance)}
            icon={<PiggyBank className="h-5 w-5" />}
            variant={balance < 0 ? 'danger' : balance < totalIncome * 0.1 ? 'warning' : 'default'}
          />
          <SummaryCard
            title="Limite Disponível"
            value={formatCurrency(totalCardLimit)}
            subtitle={`${cards.length} cartões`}
            icon={<CreditCard className="h-5 w-5" />}
          />
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Orçamento Utilizado</span>
              <span className="text-sm text-muted-foreground">{spentPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={Math.min(spentPercentage, 100)} className="h-3" />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button onClick={() => setExpenseDialogOpen(true)} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            Novo Gasto
          </Button>
          <Button variant="outline" onClick={() => setGoalDialogOpen(true)} className="flex-1 sm:flex-none">
            <Target className="h-4 w-4 mr-2" />
            Nova Meta
          </Button>
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Pie Chart - By Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Gastos por Cartão</CardTitle>
            </CardHeader>
            <CardContent>
              {expensesByCard.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={expensesByCard} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {expensesByCard.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Nenhum gasto registrado
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bar Chart - By Category */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Gastos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              {expensesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={expensesByCategory} layout="vertical">
                    <XAxis type="number" tickFormatter={(v) => `R$${v}`} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="total" radius={4}>
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Nenhum gasto registrado
                </div>
              )}
            </CardContent>
          </Card>

          {/* Line Chart - Daily Evolution */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Evolução dos Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              {dailyExpenses.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dailyExpenses}>
                    <XAxis dataKey="day" />
                    <YAxis tickFormatter={(v) => `R$${v}`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Nenhum gasto registrado
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cards Overview */}
        {cards.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Seus Cartões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cards.map(card => (
                <CreditCardItem key={card.id} card={card} compact />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Savings Goals */}
        {savingsGoals.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Metas de Economia</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {savingsGoals.map(goal => (
                <SavingsGoalItem key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ExpenseFormDialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen} />
      <GoalFormDialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen} />
    </Layout>
  );
}

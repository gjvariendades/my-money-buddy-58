import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFinance } from '@/contexts/FinanceContext';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function MonthSelector() {
  const { currentMonth, setCurrentMonth, getAvailableMonths } = useFinance();
  const months = getAvailableMonths();

  const formatMonthLabel = (monthKey: string) => {
    const date = parse(monthKey, 'yyyy-MM', new Date());
    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
  };

  const currentIndex = months.indexOf(currentMonth);
  const canGoBack = currentIndex < months.length - 1;
  const canGoForward = currentIndex > 0;

  const goBack = () => {
    if (canGoBack) {
      setCurrentMonth(months[currentIndex + 1]);
    }
  };

  const goForward = () => {
    if (canGoForward) {
      setCurrentMonth(months[currentIndex - 1]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={goBack}
        disabled={!canGoBack}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Select value={currentMonth} onValueChange={setCurrentMonth}>
        <SelectTrigger className="w-[200px]">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue>
            {formatMonthLabel(currentMonth)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {months.map(month => (
            <SelectItem key={month} value={month}>
              {formatMonthLabel(month)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={goForward}
        disabled={!canGoForward}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

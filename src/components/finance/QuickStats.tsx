import { Button } from '@/components/ui/button';

type Period = 'today' | 'week' | 'month' | 'year' | 'custom';

interface QuickStatsProps {
  activePeriod: Period;
  onPeriodChange: (period: Period) => void;
}

export const QuickStats = ({ activePeriod, onPeriodChange }: QuickStatsProps) => {
  const periods: { key: Period; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {periods.map(({ key, label }) => (
        <Button
          key={key}
          variant={activePeriod === key ? 'default' : 'secondary'}
          size="sm"
          onClick={() => onPeriodChange(key)}
          className="rounded-full px-4 flex-shrink-0"
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

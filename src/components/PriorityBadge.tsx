import { useTranslation } from 'react-i18next';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

const styles: Record<string, string> = {
  low: 'bg-success/15 text-success',
  medium: 'bg-warning/15 text-warning',
  high: 'bg-destructive/15 text-destructive',
};

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const { t } = useTranslation();
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles[priority]}`}>
      {t(priority)}
    </span>
  );
};

export default PriorityBadge;

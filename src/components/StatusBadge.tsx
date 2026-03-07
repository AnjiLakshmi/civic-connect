import { useTranslation } from 'react-i18next';

interface StatusBadgeProps {
  status: 'pending' | 'assigned' | 'inProgress' | 'resolved';
}

const statusStyles: Record<string, string> = {
  pending: 'bg-warning/15 text-warning border-warning/30',
  assigned: 'bg-info/15 text-info border-info/30',
  inProgress: 'bg-accent/15 text-accent border-accent/30',
  resolved: 'bg-success/15 text-success border-success/30',
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation();
  const labels: Record<string, string> = { pending: t('pending'), assigned: t('assigned'), inProgress: t('inProgress'), resolved: t('resolved') };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'resolved' ? 'bg-success' : status === 'pending' ? 'bg-warning' : status === 'assigned' ? 'bg-info' : 'bg-accent'}`} />
      {labels[status]}
    </span>
  );
};

export default StatusBadge;

import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import ComplaintCard from '@/components/ComplaintCard';
import { mockComplaints } from '@/data/mockData';
import { LayoutDashboard, FileWarning, MapPin, Bell, User, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

const CitizenDashboard = () => {
  const { t } = useTranslation();

  const sidebarItems = [
    { label: t('dashboard'), icon: <LayoutDashboard className="w-4 h-4" />, path: '/citizen' },
    { label: t('reportIssue'), icon: <AlertTriangle className="w-4 h-4" />, path: '/citizen/report' },
    { label: t('myComplaints'), icon: <FileWarning className="w-4 h-4" />, path: '/citizen/complaints' },
    { label: t('nearbyIssues'), icon: <MapPin className="w-4 h-4" />, path: '/citizen/nearby' },
    { label: t('notifications'), icon: <Bell className="w-4 h-4" />, path: '/citizen/notifications' },
    { label: t('profile'), icon: <User className="w-4 h-4" />, path: '/citizen/profile' },
  ];

  const stats = { total: 6, pending: 2, assigned: 2, resolved: 1 };

  return (
    <DashboardLayout sidebarItems={sidebarItems} title={t('dashboard')}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title={t('totalComplaints')} value={stats.total} icon={FileWarning} color="primary" delay={0} />
          <StatsCard title={t('pendingIssues')} value={stats.pending} icon={Clock} color="warning" delay={0.1} />
          <StatsCard title={t('assignedIssues')} value={stats.assigned} icon={Zap} color="info" delay={0.2} />
          <StatsCard title={t('resolvedIssues')} value={stats.resolved} icon={CheckCircle} color="success" delay={0.3} />
        </div>

        {/* Map placeholder */}
        <div className="card-elevated rounded-xl border border-border/50 p-6">
          <h3 className="text-lg font-semibold font-display mb-4">{t('nearbyComplaints')}</h3>
          <div className="h-64 rounded-lg bg-secondary/50 flex items-center justify-center border border-border/30">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-10 h-10 mx-auto mb-2 text-primary/40" />
              <p className="text-sm">Google Maps integration — add API key to enable</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold font-display mb-4">{t('recentComplaints')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockComplaints.slice(0, 4).map((c, i) => (
              <ComplaintCard key={c.id} complaint={c} index={i} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;

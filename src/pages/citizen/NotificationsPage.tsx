import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import { mockNotifications } from '@/data/mockData';
import { LayoutDashboard, AlertTriangle, FileWarning, MapPin, Bell, User, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const sidebarItems = [
    { label: t('dashboard'), icon: <LayoutDashboard className="w-4 h-4" />, path: '/citizen' },
    { label: t('reportIssue'), icon: <AlertTriangle className="w-4 h-4" />, path: '/citizen/report' },
    { label: t('myComplaints'), icon: <FileWarning className="w-4 h-4" />, path: '/citizen/complaints' },
    { label: t('nearbyIssues'), icon: <MapPin className="w-4 h-4" />, path: '/citizen/nearby' },
    { label: t('notifications'), icon: <Bell className="w-4 h-4" />, path: '/citizen/notifications' },
    { label: t('profile'), icon: <User className="w-4 h-4" />, path: '/citizen/profile' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} title={t('notifications')}>
      <div className="max-w-2xl mx-auto space-y-3">
        {mockNotifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`card-elevated rounded-xl border p-5 flex items-start gap-4 ${n.read ? 'border-border/30 opacity-70' : 'border-primary/30'}`}
          >
            <div className={`p-2 rounded-lg ${n.read ? 'bg-muted' : 'bg-primary/10'}`}>
              {n.read ? <CheckCircle className="w-5 h-5 text-muted-foreground" /> : <Bell className="w-5 h-5 text-primary" />}
            </div>
            <div>
              <p className="text-sm text-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;

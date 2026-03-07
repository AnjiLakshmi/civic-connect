import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import ComplaintCard from '@/components/ComplaintCard';
import { mockComplaints } from '@/data/mockData';
import { LayoutDashboard, AlertTriangle, FileWarning, MapPin, Bell, User } from 'lucide-react';

const MyComplaintsPage = () => {
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
    <DashboardLayout sidebarItems={sidebarItems} title={t('myComplaints')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockComplaints.map((c, i) => (
          <ComplaintCard key={c.id} complaint={c} index={i} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default MyComplaintsPage;

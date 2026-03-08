import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import ComplaintCard from '@/components/ComplaintCard';
import { LayoutDashboard, AlertTriangle, FileWarning, MapPin, Bell, User } from 'lucide-react';
import { api } from '@/lib/api';
import { Complaint } from '@/types';

const NearbyIssuesPage = () => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const sidebarItems = [
    { label: t('dashboard'), icon: <LayoutDashboard className="w-4 h-4" />, path: '/citizen' },
    { label: t('reportIssue'), icon: <AlertTriangle className="w-4 h-4" />, path: '/citizen/report' },
    { label: t('myComplaints'), icon: <FileWarning className="w-4 h-4" />, path: '/citizen/complaints' },
    { label: t('nearbyIssues'), icon: <MapPin className="w-4 h-4" />, path: '/citizen/nearby' },
    { label: t('notifications'), icon: <Bell className="w-4 h-4" />, path: '/citizen/notifications' },
    { label: t('profile'), icon: <User className="w-4 h-4" />, path: '/citizen/profile' },
  ];

  useEffect(() => {
    api.get<Complaint[]>('/complaints').then(res => setComplaints(res.data));
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} title={t('nearbyIssues')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {complaints.length > 0 ? (
          complaints.map((c, i) => (
            <ComplaintCard key={c._id} complaint={c} index={i} />
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No nearby issues found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NearbyIssuesPage;

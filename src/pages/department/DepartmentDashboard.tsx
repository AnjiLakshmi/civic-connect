import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import ComplaintCard from '@/components/ComplaintCard';
import StatsCard from '@/components/StatsCard';
import { mockComplaints, Complaint } from '@/data/mockData';
import { ClipboardList, MapPin, TrendingUp, CheckCircle, FileWarning, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface DeptDashboardProps {
  deptName: 'BBMP' | 'BESCOM';
}

const DepartmentDashboard = ({ deptName }: DeptDashboardProps) => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>(
    mockComplaints.filter(c => c.assignedDept === deptName || c.aiSuggestedDept === deptName)
  );

  const sidebarItems = [
    { label: t('assignedIssues'), icon: <ClipboardList className="w-4 h-4" />, path: `/${deptName.toLowerCase()}` },
    { label: t('mapView'), icon: <MapPin className="w-4 h-4" />, path: `/${deptName.toLowerCase()}` },
    { label: t('workProgress'), icon: <TrendingUp className="w-4 h-4" />, path: `/${deptName.toLowerCase()}` },
    { label: t('completedIssues'), icon: <CheckCircle className="w-4 h-4" />, path: `/${deptName.toLowerCase()}` },
  ];

  const stats = {
    assigned: complaints.filter(c => c.status === 'assigned').length,
    inProgress: complaints.filter(c => c.status === 'inProgress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  const handleAction = (action: string, id: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;
      if (action === 'start') { toast.info(`Started work on ${id}`); return { ...c, status: 'inProgress' as const }; }
      if (action === 'resolve') { toast.success(`${id} marked as resolved`); return { ...c, status: 'resolved' as const }; }
      return c;
    }));
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} title={`${deptName} ${t('dashboard')}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard title={t('assignedIssues')} value={stats.assigned} icon={FileWarning} color="info" />
          <StatsCard title={t('inProgress')} value={stats.inProgress} icon={Clock} color="warning" delay={0.1} />
          <StatsCard title={t('resolvedIssues')} value={stats.resolved} icon={CheckCircle} color="success" delay={0.2} />
        </div>

        <h3 className="text-lg font-semibold font-display">{t('assignedIssues')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complaints.map((c, i) => (
            <ComplaintCard key={c.id} complaint={c} index={i} showActions onAction={handleAction} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentDashboard;

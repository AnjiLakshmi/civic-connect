import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import { mockComplaints } from '@/data/mockData';
import { LayoutDashboard, FileWarning, ClipboardList, Building2, Map, BarChart3, ScrollText, CheckCircle, Clock, Zap, MapPin, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState(mockComplaints);
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'heatmap'>('overview');

  const sidebarItems = [
    { label: t('overview'), icon: <LayoutDashboard className="w-4 h-4" />, path: '/admin' },
    { label: t('allComplaints'), icon: <FileWarning className="w-4 h-4" />, path: '/admin' },
    { label: t('assignIssues'), icon: <ClipboardList className="w-4 h-4" />, path: '/admin' },
    { label: t('departments'), icon: <Building2 className="w-4 h-4" />, path: '/admin' },
    { label: t('issueHeatmap'), icon: <Map className="w-4 h-4" />, path: '/admin' },
    { label: t('analytics'), icon: <BarChart3 className="w-4 h-4" />, path: '/admin' },
    { label: t('systemLogs'), icon: <ScrollText className="w-4 h-4" />, path: '/admin' },
  ];

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    bbmpLoad: complaints.filter(c => c.assignedDept === 'BBMP').length,
    bescomLoad: complaints.filter(c => c.assignedDept === 'BESCOM').length,
  };

  const assignDept = (id: string, dept: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, assignedDept: dept, status: 'assigned' as const } : c));
    toast.success(`Issue ${id} assigned to ${dept}`);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} title={`${t('admin')} ${t('dashboard')}`}>
      <div className="space-y-6">
        {/* Tab navigation */}
        <div className="flex gap-2">
          {(['overview', 'complaints', 'heatmap'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
            >
              {tab === 'overview' ? t('overview') : tab === 'complaints' ? t('allComplaints') : t('issueHeatmap')}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard title={t('totalComplaints')} value={stats.total} icon={FileWarning} color="primary" delay={0} />
              <StatsCard title={t('pendingIssues')} value={stats.pending} icon={Clock} color="warning" delay={0.1} />
              <StatsCard title={t('resolvedIssues')} value={stats.resolved} icon={CheckCircle} color="success" delay={0.2} />
              <StatsCard title={t('deptWorkload')} value={stats.bbmpLoad + stats.bescomLoad} icon={Zap} color="accent" delay={0.3} />
            </div>

            {/* Department workload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-elevated rounded-xl border border-border/50 p-6">
                <h3 className="font-semibold font-display mb-4">BBMP Workload</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Assigned</span><span className="font-medium">{stats.bbmpLoad}</span></div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(stats.bbmpLoad / stats.total) * 100}%` }} />
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-elevated rounded-xl border border-border/50 p-6">
                <h3 className="font-semibold font-display mb-4">BESCOM Workload</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Assigned</span><span className="font-medium">{stats.bescomLoad}</span></div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(stats.bescomLoad / stats.total) * 100}%` }} />
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {activeTab === 'complaints' && (
          <div className="card-elevated rounded-xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('issueId')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('citizenName')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('issueType')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('priority')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('aiSuggested')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('status')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-primary">{c.id}</td>
                      <td className="px-4 py-3">{c.citizenName}</td>
                      <td className="px-4 py-3">{c.issueType}</td>
                      <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{c.aiSuggestedDept}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3">
                        {c.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => assignDept(c.id, 'BBMP')} className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary hover:bg-primary/20">BBMP</button>
                            <button onClick={() => assignDept(c.id, 'BESCOM')} className="px-2 py-1 text-xs rounded-md bg-accent/10 text-accent hover:bg-accent/20">BESCOM</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'heatmap' && (
          <div className="card-elevated rounded-xl border border-border/50 p-6">
            <h3 className="text-lg font-semibold font-display mb-4">{t('issueHeatmap')}</h3>
            <div className="h-96 rounded-lg bg-secondary/50 flex items-center justify-center border border-border/30">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-primary/40" />
                <p>Heatmap visualization — add Google Maps API key to enable</p>
                <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-success" /> Low</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-warning" /> Medium</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-destructive" /> High</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

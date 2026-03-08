import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import GoogleMapDisplay from '@/components/GoogleMapDisplay';
import { LayoutDashboard, FileWarning, ClipboardList, Building2, Map, BarChart3, ScrollText, CheckCircle, Clock, Zap, MapPin, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Complaint } from '@/types';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'heatmap'>('overview');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    // Load complaints
    api.get<Complaint[]>('/complaints/all').then(res => setComplaints(res.data)).catch(err => {
      console.error(err);
      toast.error('Failed to load complaints');
    });

    // Load emergency alerts
    api.get<Complaint[]>('/complaints/alerts/emergency').then(res => setEmergencyAlerts(res.data)).catch(err => {
      console.error(err);
    });
  }, []);

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
    emergency: emergencyAlerts.length,
  };

  const assignDept = async (id: string, dept: string) => {
    try {
      const complaint = complaints.find(c => c._id === id);
      const res = await api.put<Complaint>(`/complaints/${id}/assign`, { 
        department: dept,
        priority: complaint?.priority 
      });
      setComplaints(prev => prev.map(c => (c._id === id ? res.data : c)));
      toast.success(`Issue assigned to ${dept}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign');
    }
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatsCard title={t('totalComplaints')} value={stats.total} icon={FileWarning} color="primary" delay={0} />
              <StatsCard title={t('pendingIssues')} value={stats.pending} icon={Clock} color="warning" delay={0.1} />
              <StatsCard title={t('resolvedIssues')} value={stats.resolved} icon={CheckCircle} color="success" delay={0.2} />
              <StatsCard title={t('deptWorkload')} value={stats.bbmpLoad + stats.bescomLoad} icon={Zap} color="accent" delay={0.3} />
              {stats.emergency > 0 && (
                <StatsCard title="Emergency" value={stats.emergency} icon={AlertTriangle} color="destructive" delay={0.4} />
              )}
            </div>

            {/* Emergency Alerts */}
            {emergencyAlerts.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <h3 className="font-semibold font-display text-destructive">Emergency Issues</h3>
                </div>
                <div className="space-y-2">
                  {emergencyAlerts.slice(0, 5).map(alert => (
                    <div key={alert._id} className="flex justify-between items-center p-3 bg-card/50 rounded-lg border border-destructive/20">
                      <div>
                        <p className="font-medium text-foreground">{alert.issueType} at {alert.location}</p>
                        <p className="text-xs text-muted-foreground">{alert.nearbyCount} complaints nearby</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-destructive text-destructive-foreground">EMERGENCY</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Department workload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-elevated rounded-xl border border-border/50 p-6">
                <h3 className="font-semibold font-display mb-4">BBMP Workload</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Assigned</span><span className="font-medium">{stats.bbmpLoad}</span></div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(stats.bbmpLoad / stats.total) * 100  || 0}%` }} />
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-elevated rounded-xl border border-border/50 p-6">
                <h3 className="font-semibold font-display mb-4">BESCOM Workload</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Assigned</span><span className="font-medium">{stats.bescomLoad}</span></div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(stats.bescomLoad / stats.total) * 100 || 0}%` }} />
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
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('issueType')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Location</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('citizenName')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nearby</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('priority')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('aiSuggested')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Est. Days</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('status')}</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints
                    .sort((a, b) => (b.isEmergency ? 1 : 0) - (a.isEmergency ? 1 : 0))
                    .map((c) => (
                    <tr key={c._id} className={`border-b border-border/30 hover:bg-secondary/20 transition-colors ${c.isEmergency ? 'bg-destructive/5' : ''}`}>
                      <td className="px-4 py-3 font-medium flex items-center gap-2">
                        {c.issueType}
                        {c.isEmergency && <AlertTriangle className="w-4 h-4 text-destructive" />}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{c.location}</td>
                      <td className="px-4 py-3">{c.citizenName || 'User'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          c.nearbyCount >= 5 ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-muted-foreground'
                        }`}>
                          {c.nearbyCount}
                        </span>
                      </td>
                      <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{c.aiSuggestedDept}</td>
                      <td className="px-4 py-3 text-sm font-medium">{c.estimatedResolutionDays}d</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3">
                        {c.status === 'pending' && (
                          <div className="flex gap-1">
                            <button onClick={() => assignDept(c._id, 'BBMP')} className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary hover:bg-primary/20 font-medium">BBMP</button>
                            <button onClick={() => assignDept(c._id, 'BESCOM')} className="px-2 py-1 text-xs rounded-md bg-accent/10 text-accent hover:bg-accent/20 font-medium">BESCOM</button>
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
          <div className="card-elevated rounded-xl border border-border/50 p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold font-display mb-4">{t('issueHeatmap')}</h3>
              <GoogleMapDisplay
                complaints={complaints}
                onMarkerClick={(complaint) => setSelectedComplaint(complaint)}
                height="400px"
              />
            </div>

            {selectedComplaint && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary/50 rounded-xl border border-border/50 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{ selectedComplaint.issueType}</h4>
                    <p className="text-sm text-muted-foreground">{selectedComplaint.location}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedComplaint(null)}
                    className="text-muted-foreground hover:text-foreground text-xl"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Priority</p>
                    <PriorityBadge priority={selectedComplaint.priority} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Status</p>
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Nearby</p>
                    <p className="font-medium">{selectedComplaint.nearbyCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Est. Resolution</p>
                    <p className="font-medium">{selectedComplaint.estimatedResolutionDays} days</p>
                  </div>
                </div>
                {selectedComplaint.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => {
                        assignDept(selectedComplaint._id, 'BBMP');
                        setSelectedComplaint(null);
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                    >
                      Assign to BBMP
                    </button>
                    <button 
                      onClick={() => {
                        assignDept(selectedComplaint._id, 'BESCOM');
                        setSelectedComplaint(null);
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-lg bg-accent/10 text-accent hover:bg-accent/20 font-medium"
                    >
                      Assign to BESCOM
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

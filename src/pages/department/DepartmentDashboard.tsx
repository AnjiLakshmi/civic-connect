import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import ComplaintCard from '@/components/ComplaintCard';
import StatsCard from '@/components/StatsCard';
import { ClipboardList, MapPin, TrendingUp, CheckCircle, FileWarning, Clock, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Complaint } from '@/types';

interface DeptDashboardProps {
  deptName: 'BBMP' | 'BESCOM';
}

const DepartmentDashboard = ({ deptName }: DeptDashboardProps) => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.get<Complaint[]>(`/complaints/department/${deptName}`).then(res => setComplaints(res.data)).catch(err => {
      console.error(err);
      toast.error('Failed to load complaints');
    });
  }, [deptName]);

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

  const handleAction = async (action: string, id: string) => {
    if (action === 'resolve') {
      // Open modal for proof upload
      const complaint = complaints.find(c => c._id === id);
      if (complaint) {
        setSelectedComplaint(complaint);
        setResolveModalOpen(true);
      }
    } else if (action === 'start') {
      // Start work without proof
      try {
        const res = await api.put<Complaint>(`/complaints/${id}`, { status: 'inProgress' });
        setComplaints(prev => prev.map(c => (c._id === id ? res.data : c)));
        toast.info(`Started work on issue`);
      } catch (err) {
        console.error(err);
        toast.error('Failed to update complaint');
      }
    }
  };

  const handleResolveWithProof = async () => {
    if (!selectedComplaint) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (proofImage) {
        formData.append('proof', proofImage);
      }

      const res = await api.put<Complaint>(
        `/complaints/${selectedComplaint._id}/resolve`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setComplaints(prev => prev.map(c => (c._id === selectedComplaint._id ? res.data : c)));
      toast.success(`Issue resolved with proof`);
      
      // Close modal and reset
      setResolveModalOpen(false);
      setSelectedComplaint(null);
      setProofImage(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to resolve complaint');
    } finally {
      setIsSubmitting(false);
    }
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
          {complaints
            .filter(c => c.status !== 'resolved')
            .map((c, i) => (
            <ComplaintCard key={c._id} complaint={c} index={i} showActions onAction={handleAction} />
          ))}
        </div>

        {/* Resolve Modal */}
        <AnimatePresence>
          {resolveModalOpen && selectedComplaint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-end z-50"
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full bg-background border-t border-border/50 p-6 rounded-t-2xl max-h-[80vh] overflow-y-auto"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold font-display">{selectedComplaint.issueType}</h3>
                    <p className="text-sm text-muted-foreground">{selectedComplaint.location}</p>
                  </div>

                  <div className="bg-secondary/50 rounded-xl p-4">
                    <p className="text-sm"><span className="text-muted-foreground">Issue:</span> {selectedComplaint.description}</p>
                  </div>

                  {/* Proof Image Upload */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-2">
                      Upload Proof of Completion
                    </label>
                    <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center">
                      {proofImage ? (
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                            <CheckCircle className="w-6 h-6 text-success" />
                          </div>
                          <p className="text-sm font-medium text-foreground">{proofImage.name}</p>
                          <button
                            onClick={() => setProofImage(null)}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Change file
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setProofImage(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload proof image</p>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-border/30">
                    <button
                      onClick={() => {
                        setResolveModalOpen(false);
                        setSelectedComplaint(null);
                        setProofImage(null);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleResolveWithProof}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 rounded-lg bg-success text-success-foreground hover:bg-success/90 font-medium disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resolved Section */}
        {complaints.filter(c => c.status === 'resolved').length > 0 && (
          <div>
            <h3 className="text-lg font-semibold font-display mb-4">Completed Issues</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complaints
                .filter(c => c.status === 'resolved')
                .map((c, i) => (
                <ComplaintCard key={c._id} complaint={c} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DepartmentDashboard;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import GoogleMapPicker from '@/components/GoogleMapPicker';
import { LayoutDashboard, AlertTriangle, FileWarning, MapPin, Bell, User, Upload, Sparkles, Building2, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PriorityBadge from '@/components/PriorityBadge';
import { toast } from 'sonner';
import { api } from '@/lib/api';

// local copy of mapping used for dropdown
const aiIssueMapping: Record<string, { dept: string; priority: 'low' | 'medium' | 'high' }> = {
  'Streetlight Not Working': { dept: 'BESCOM', priority: 'medium' },
  'Electric Pole Damage': { dept: 'BESCOM', priority: 'high' },
  'Power Line Issue': { dept: 'BESCOM', priority: 'high' },
  'Garbage Pile': { dept: 'BBMP', priority: 'medium' },
  'Pothole': { dept: 'BBMP', priority: 'high' },
  'Drainage Issue': { dept: 'BBMP', priority: 'high' },
  'Road Crack': { dept: 'BBMP', priority: 'low' },
  'Broken Footpath': { dept: 'BBMP', priority: 'medium' },
};


const issueTypes = Object.keys(aiIssueMapping);

const ReportIssuePage = () => {
  const { t } = useTranslation();
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [lat, setLat] = useState(12.9716);
  const [lng, setLng] = useState(77.5946);
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sidebarItems = [
    { label: t('dashboard'), icon: <LayoutDashboard className="w-4 h-4" />, path: '/citizen' },
    { label: t('reportIssue'), icon: <AlertTriangle className="w-4 h-4" />, path: '/citizen/report' },
    { label: t('myComplaints'), icon: <FileWarning className="w-4 h-4" />, path: '/citizen/complaints' },
    { label: t('nearbyIssues'), icon: <MapPin className="w-4 h-4" />, path: '/citizen/nearby' },
    { label: t('notifications'), icon: <Bell className="w-4 h-4" />, path: '/citizen/notifications' },
    { label: t('profile'), icon: <User className="w-4 h-4" />, path: '/citizen/profile' },
  ];

  const aiResult = selectedType ? aiIssueMapping[selectedType] : null;

  const handleDetect = async () => {
    if (!selectedType) return;
    try {
      const res = await api.get('/ai/suggest', { params: { type: selectedType } });
      // display result from backend
      aiResult.dept = res.data.dept;
      aiResult.priority = res.data.priority;
      setShowAI(true);
    } catch (err) {
      console.error(err);
      setShowAI(true); // still show local suggestion
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('issueType', selectedType);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('lat', lat.toString());
      formData.append('lng', lng.toString());
      if (image) {
        formData.append('image', image);
      }
      await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSubmitted(true);
      toast.success('Complaint submitted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit complaint');
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} title={t('reportIssue')}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated rounded-2xl border border-border/50 p-8"
        >
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold font-display text-foreground">Complaint Submitted!</h3>
              <p className="text-muted-foreground mt-2">Status: Pending</p>
              <button onClick={() => { setSubmitted(false); setShowAI(false); setSelectedType(''); setDescription(''); }} className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all">
                Report Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo upload */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">{t('uploadPhoto')}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImage(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Issue type selector */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">{t('issueType')}</label>
                <select
                  value={selectedType}
                  onChange={e => { setSelectedType(e.target.value); setShowAI(false); }}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select issue type</option>
                  {issueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">{t('issueDescription')}</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Describe the issue in detail..."
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">{t('location')}</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Enter location name"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
                />
                <GoogleMapPicker
                  lat={lat}
                  lng={lng}
                  onLocationChange={(newLat, newLng, locName) => {
                    setLat(newLat);
                    setLng(newLng);
                    if (!location.includes(',')) {
                      setLocation(locName);
                    }
                  }}
                  height="250px"
                />
                <div className="flex gap-2 mt-3">
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={e => setLat(parseFloat(e.target.value))}
                    placeholder="Latitude"
                    className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={e => setLng(parseFloat(e.target.value))}
                    placeholder="Longitude"
                    className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* AI detect button */}
              {selectedType && !showAI && (
                <button type="button" onClick={handleDetect} className="w-full py-3 rounded-xl bg-accent/10 text-accent font-medium hover:bg-accent/20 transition-all flex items-center justify-center gap-2 border border-accent/20">
                  <Sparkles className="w-4 h-4" />
                  Run AI Analysis
                </button>
              )}

              {/* AI results */}
              <AnimatePresence>
                {showAI && aiResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl bg-primary/5 border border-primary/20 p-5 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                      <Sparkles className="w-4 h-4" />
                      AI Analysis Results
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex flex-col items-center p-3 rounded-lg bg-card/50">
                        <AlertTriangle className="w-5 h-5 text-warning mb-1" />
                        <span className="text-muted-foreground text-xs">{t('aiDetectedType')}</span>
                        <span className="font-semibold text-foreground">{selectedType}</span>
                      </div>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-card/50">
                        <Building2 className="w-5 h-5 text-info mb-1" />
                        <span className="text-muted-foreground text-xs">{t('aiSuggestedDept')}</span>
                        <span className="font-semibold text-foreground">{aiResult.dept}</span>
                      </div>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-card/50">
                        <Gauge className="w-5 h-5 text-accent mb-1" />
                        <span className="text-muted-foreground text-xs">{t('priority')}</span>
                        <PriorityBadge priority={aiResult.priority} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={!selectedType || !description}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('submitComplaint')}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ReportIssuePage;

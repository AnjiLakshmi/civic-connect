import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/DashboardLayout';
import { LayoutDashboard, AlertTriangle, FileWarning, MapPin, Bell, User, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Notification } from '@/types';

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

  const [notes, setNotes] = useState<Notification[]>([]);

  useEffect(() => {
    api.get<Notification[]>('/notifications')
      .then(res => setNotes(res.data))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load notifications');
      });
  }, []);

  const markRead = async (id: string) => {
    try {
      const res = await api.put<Notification>(`/notifications/${id}/read`);
      setNotes(prev => prev.map(n => (n._id === id ? res.data : n)));
    } catch (err) {
      console.error(err);
      toast.error('Failed to mark as read');
    }
  };

  const unreadCount = notes.filter(n => !n.read).length;

  return (
    <DashboardLayout sidebarItems={sidebarItems} title={t('notifications')}>
      <div className="max-w-3xl mx-auto space-y-4">
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3"
          >
            <Bell className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm text-primary font-medium">{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</p>
          </motion.div>
        )}

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notes
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((n, i) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !n.read && markRead(n._id)}
                className={`card-elevated rounded-xl border p-4 flex items-start gap-4 cursor-pointer transition-all ${
                  n.read ? 'border-border/30 opacity-70 bg-secondary/20' : 'border-primary/30 bg-primary/5 hover:border-primary/50'
                }`}
              >
                <div className={`p-2 rounded-lg flex-shrink-0 ${n.read ? 'bg-muted' : 'bg-primary/10'}`}>
                  {n.recipientType === 'department' ? (
                    <Clock className={`w-5 h-5 ${n.read ? 'text-muted-foreground' : 'text-primary'}`} />
                  ) : (
                    <CheckCircle className={`w-5 h-5 ${n.read ? 'text-muted-foreground' : 'text-primary'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${n.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.date).toLocaleDateString()} {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;

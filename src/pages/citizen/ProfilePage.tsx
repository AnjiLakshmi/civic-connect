import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { LayoutDashboard, AlertTriangle, FileWarning, MapPin, Bell, User, Mail, UserCircle } from 'lucide-react';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const sidebarItems = [
    { label: t('dashboard'), icon: <LayoutDashboard className="w-4 h-4" />, path: '/citizen' },
    { label: t('reportIssue'), icon: <AlertTriangle className="w-4 h-4" />, path: '/citizen/report' },
    { label: t('myComplaints'), icon: <FileWarning className="w-4 h-4" />, path: '/citizen/complaints' },
    { label: t('nearbyIssues'), icon: <MapPin className="w-4 h-4" />, path: '/citizen/nearby' },
    { label: t('notifications'), icon: <Bell className="w-4 h-4" />, path: '/citizen/notifications' },
    { label: t('profile'), icon: <User className="w-4 h-4" />, path: '/citizen/profile' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} title={t('profile')}>
      <div className="max-w-2xl mx-auto">
        <div className="card-elevated rounded-xl border border-border/50 p-8 space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground disabled:opacity-75"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Role</label>
              <input
                type="text"
                value={user?.role || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground disabled:opacity-75 capitalize"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/30">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Member Since</p>
              <p className="text-sm font-semibold text-foreground">2026</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Account Status</p>
              <p className="text-sm font-semibold text-success">Active</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;

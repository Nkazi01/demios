import React from 'react';
import { ArrowLeft, Bell, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import GlassButton from './ui/glass-button';
import GlassCard from './ui/glass-card';
import { Badge } from './ui/badge';

interface NotificationCenterProps {
  notifications: any[];
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function NotificationCenter({ notifications, onBack, onNavigate }: NotificationCenterProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'reminder':
        return <Bell className="w-5 h-5 text-blue-400" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <GlassCard variant="gradient" className="mb-6">
          <div className="flex items-center gap-4">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </GlassButton>
            <h1 className="text-xl font-semibold text-white">Notifications</h1>
            <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-blue-400/30">
              {notifications.filter(n => !n.read).length} new
            </Badge>
          </div>
        </GlassCard>

        {/* Notifications list */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <GlassCard variant="default" className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No notifications yet</h3>
              <p className="text-gray-300 text-sm">
                You'll receive updates about appointments, health tips, and more.
              </p>
            </GlassCard>
          ) : (
            notifications.map((notification, index) => (
              <GlassCard
                key={index}
                variant={notification.read ? "minimal" : "default"}
                className={`transition-all hover:scale-[1.02] ${
                  !notification.read ? 'border-blue-400/50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white text-sm">
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-300 whitespace-nowrap">
                          {getTimeAgo(notification.created_at)}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    {notification.type === 'appointment' && (
                      <GlassButton
                        variant="accent"
                        size="sm"
                        className="mt-3"
                        onClick={() => onNavigate('dashboard')}
                      >
                        View Appointments
                      </GlassButton>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        {/* Clear all button */}
        {notifications.length > 0 && (
          <div className="mt-8 text-center">
            <GlassButton
              variant="secondary"
              size="sm"
              className="opacity-70 hover:opacity-100"
            >
              Mark All as Read
            </GlassButton>
          </div>
        )}
      </div>
    </div>
  );
}
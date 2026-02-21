"use client";

import Navbar from '@/app/components/Navbar';
import { Bell, Clock, Calendar, BookOpen, ArrowLeft, MoreVertical, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_NOTIFICATIONS, Notification } from '@/app/lib/mockData';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'availability': return <CheckCircle2 size={20} className="text-green-600" />;
      case 'reminder': return <Clock size={20} className="text-orange-600" />;
      default: return <Info size={20} className="text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'availability': return 'bg-green-50 border-green-100';
      case 'reminder': return 'bg-orange-50 border-orange-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-usant-red to-usant-orange pt-12 pb-24 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition backdrop-blur-sm border border-white/20 cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft size={18} />
            </button>
            <Link href="/student#browse" className="text-white/80 hover:text-white transition font-bold text-sm">
              Back to Browse
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
              <p className="text-white/90 text-lg">
                Stay updated with book availability and library reminders.
              </p>
            </div>
            <button 
              onClick={markAllAsRead}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/20 transition backdrop-blur-sm"
            >
              Mark all as read
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-8 -mt-16 pb-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[400px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-6 transition-all hover:bg-gray-50 flex gap-4 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                >
                  <div className={`p-3 rounded-xl border self-start ${getBgColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-bold text-gray-900 leading-tight ${!notification.read ? 'text-usant-red' : ''}`}>
                        {notification.title}
                      </h3>
                      <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap uppercase tracking-wider">
                        {new Date(notification.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {notification.message}
                    </p>
                    {notification.bookId && (
                      <Link 
                        href={`/book/${notification.bookId}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-usant-red hover:underline"
                      >
                        <BookOpen size={14} /> View Book Details
                      </Link>
                    )}
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-usant-red rounded-full mt-2 flex-shrink-0"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Bell size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                We'll notify you here about your reserved books and library activities.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

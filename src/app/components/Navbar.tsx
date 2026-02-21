// src/components/Navbar.tsx
"use client";

import { LogOut, User, Library, Heart, Bell } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_NOTIFICATIONS } from '@/app/lib/mockData';
import LogoutConfirmationCard from './LogoutConfirmationCard';

interface NavbarProps {
  userName: string;
  userRole: string;
}

export default function Navbar({ userName, userRole }: NavbarProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutText, setLogoutText] = useState("Logout");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // In a real app, this would fetch from an API
    const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, []);

  const getDashboardLink = () => {
    if (userRole === 'Student') return '/student';
    if (userRole === 'Faculty') return '/faculty';
    if (userRole === 'Librarian' || userRole === 'Staff') return '/librarian';
    if (userRole === 'Admin') return '/admin';
    return '/';
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    const slogans = [
      "See you soon, USANTian!",
      "Knowledge is power. Back soon!",
      "Keep on reading!",
      "Success starts with a book!",
      "The library misses you already!"
    ];
    
    setIsLoggingOut(true);
    setLogoutText(slogans[Math.floor(Math.random() * slogans.length)]);
    setShowLogoutConfirm(false);
    
    // Simulate a brief delay for the "catchy" logout experience
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  return (
    <nav className="bg-gradient-to-r from-usant-red to-usant-orange text-white px-8 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href={getDashboardLink()} className="flex items-center gap-3 hover:opacity-90 transition">
          <Image src="/logo.png" alt="USANT Logo" width={48} height={48} className="object-contain rounded-full bg-white/90 p-0.5 shadow-sm" />
          <div className="leading-tight">
            <h1 className="text-xl font-bold tracking-tight">LBRS</h1>
            <p className="text-[10px] uppercase tracking-wider opacity-80">USANT</p>
          </div>
        </Link>

        {/* Center Links */}
        {userRole === 'Student' && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/student" className="opacity-90 hover:opacity-100 hover:text-white transition">
              Browse
            </Link>
            <Link href="/student/shelf" className="opacity-90 hover:opacity-100 hover:text-white transition flex items-center gap-2">
              <Library size={16} /> My Shelf
            </Link>
            <Link href="/student/wishlist-page" className="opacity-90 hover:opacity-100 hover:text-white transition flex items-center gap-2">
              <Heart size={16} /> Wishlist
            </Link>
            <Link href="/student/notifications-page" className="relative opacity-90 hover:opacity-100 hover:text-white transition flex items-center gap-2">
              <Bell size={16} /> Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-usant-red text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-sm">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        )}

        {userRole === 'Faculty' && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/faculty" className="opacity-90 hover:opacity-100 hover:text-white transition">
              Browse
            </Link>
          </div>
        )}

        {/* User Profile Section (Matches Screenshot) */}
        <div className="flex items-center gap-4">
          
          {/* User Pill */}
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 shadow-sm">
            <div className="p-1.5 bg-white/30 rounded-full">
              <User size={18} className="text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold leading-none tracking-wide">{userName}</p>
              <p className="text-[11px] opacity-90 leading-none mt-1 font-medium">{userRole}</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 text-sm font-bold opacity-90 hover:opacity-100 transition hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer disabled:opacity-50"
          >
            {isLoggingOut ? (
              <span className="animate-pulse flex items-center gap-2">
                {logoutText}
              </span>
            ) : (
              <>
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </>
            )}
          </button>
        </div>
      </div>

      <LogoutConfirmationCard
        isOpen={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        isLoading={isLoggingOut}
      />
    </nav>
  );
}
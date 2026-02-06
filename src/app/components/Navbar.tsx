// src/components/Navbar.tsx
"use client";

import { LogOut, User, Library } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
  userName: string;
  userRole: string;
}

export default function Navbar({ userName, userRole }: NavbarProps) {
  const getDashboardLink = () => {
    if (userRole === 'Student') return '/student';
    if (userRole === 'Faculty') return '/faculty';
    if (userRole === 'Librarian' || userRole === 'Staff') return '/librarian';
    if (userRole === 'Admin') return '/admin';
    return '/';
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
        {(userRole === 'Student' || userRole === 'Faculty') && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href={getDashboardLink()} className="opacity-90 hover:opacity-100 hover:text-white transition">
              Browse
            </Link>
            <Link href="/student/shelf" className="opacity-90 hover:opacity-100 hover:text-white transition flex items-center gap-2">
              <Library size={16} /> My Shelf
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
          <Link href="/" className="flex items-center gap-2 text-sm font-bold opacity-90 hover:opacity-100 transition hover:bg-white/10 px-3 py-2 rounded-lg">
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
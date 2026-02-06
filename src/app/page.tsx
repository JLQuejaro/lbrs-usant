"use client";

import { useState } from 'react';
import { ArrowRight, UserPlus, CheckCircle } from 'lucide-react'; 
import Image from 'next/image';
import { userTypesByRole, UserRole, UserType } from './lib/mockData';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  
  // 1. State to toggle between "login" and "register" views
  const [isRegistering, setIsRegistering] = useState(false);

  // Form States
  const [role, setRole] = useState<UserRole>('student');
  const [userType, setUserType] = useState<UserType>(userTypesByRole['student'][0]);
  
  // Registration Specific States
  const [fullName, setFullName] = useState('');
  const [course, setCourse] = useState('Computer Science');
  const [yearLevel, setYearLevel] = useState('1st Year');

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setUserType(userTypesByRole[newRole][0]);
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      // Simulate Registration
      alert(`Account created for ${fullName}!`);
      setIsRegistering(false); // Switch back to login after registering
    } else {
      // Handle Login Routing
      if (role === 'admin') router.push('/admin');
      else if (role === 'staff' && userType === 'Librarian') router.push('/librarian');
      else if (role === 'faculty') router.push('/faculty');
      else router.push('/student');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-usant-red to-usant-orange">
      
      {/* LEFT SIDE: Branding (Static) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 text-white relative">
        <div className="z-10 animate-in fade-in slide-in-from-left duration-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="rounded-full shadow-2xl bg-white/10 backdrop-blur-md p-1 border border-white/20">
               <Image src="/logo.png" alt="USANT Logo" width={90} height={90} className="object-contain rounded-full" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-shadow-sm">USANT LBRS</h1>
              <p className="text-sm opacity-90 font-medium">Library Book Recommendation System</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-semibold mb-4 text-shadow-sm">Welcome to USANT</h2>
          <p className="text-lg opacity-90 max-w-md leading-relaxed drop-shadow-md">
            Discover your next favorite book with our intelligent recommendation system. 
            Powered by advanced algorithms to enhance your academic journey.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-2xl border border-white/50 animate-in fade-in zoom-in duration-300">
          
          {/* Header toggles based on mode */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-usant-red mb-2">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500">
              {isRegistering ? 'Join USANT Library System' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleAuthAction} className="space-y-4">
            
            {/* REGISTER ONLY: Full Name */}
            {isRegistering && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-usant-red focus:outline-none transition-all" 
                />
              </div>
            )}

            {/* Email (Common) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" placeholder="you@usant.edu" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-usant-red focus:outline-none transition-all" />
            </div>

            {/* Password (Common) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-usant-red focus:outline-none transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Role Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="relative">
                  <select 
                    value={role} 
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-usant-red text-gray-900 appearance-none"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* User Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                <div className="relative">
                  <select 
                    value={userType} 
                    onChange={(e) => setUserType(e.target.value as UserType)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-usant-red text-gray-900 appearance-none"
                  >
                    {userTypesByRole[role].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* REGISTER ONLY: Course & Year (Only for Students) */}
            {isRegistering && role === 'student' && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                   <select 
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-usant-red text-gray-900"
                   >
                     <option>Computer Science</option>
                     <option>Information Tech</option>
                     <option>Engineering</option>
                     <option>Education</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
                   <select 
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-usant-red text-gray-900"
                   >
                     <option>1st Year</option>
                     <option>2nd Year</option>
                     <option>3rd Year</option>
                     <option>4th Year</option>
                   </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="w-full bg-usant-red hover:bg-red-800 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 shadow-lg shadow-red-100">
              {isRegistering ? (
                 <>Create Account <UserPlus size={18} /></>
              ) : (
                 <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
             <p className="text-sm text-gray-600">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                <button 
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="font-bold text-usant-red hover:underline focus:outline-none"
                >
                  {isRegistering ? "Login" : "Register"}
                </button>
             </p>
          </div>
          
          {/* Quick Demo Login (Only Show in Login Mode) */}
          {!isRegistering && (
             <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-center text-xs text-gray-400 mb-4">Quick Demo Login:</p>
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => setRole('student')} className="text-[10px] py-1 border rounded text-usant-red border-usant-red hover:bg-red-50">Student</button>
                  <button onClick={() => setRole('faculty')} className="text-[10px] py-1 border rounded text-orange-600 border-orange-600 hover:bg-orange-50">Faculty</button>
                  <button onClick={() => {setRole('staff'); setUserType('Librarian')}} className="text-[10px] py-1 border rounded text-gray-600 border-gray-600 hover:bg-gray-50">Librarian</button>
                  <button onClick={() => setRole('admin')} className="text-[10px] py-1 border rounded text-gray-600 border-gray-600 hover:bg-gray-50">Admin</button>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
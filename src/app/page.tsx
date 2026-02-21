"use client";

import { useState } from 'react';
import { ArrowRight, UserPlus, CheckCircle } from 'lucide-react'; 
import Image from 'next/image';
import { userTypesByRole, UserRole, UserType, MOCK_USERS } from './lib/mockData';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [userType, setUserType] = useState<UserType>(userTypesByRole['student'][0]);
  
  const [fullName, setFullName] = useState('');
  const [course, setCourse] = useState('Computer Science');
  const [yearLevel, setYearLevel] = useState('1st Year');

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setUserType(userTypesByRole[newRole][0]);
  };

  const quickLogin = (e: string) => {
    setEmail(e);
    const user = MOCK_USERS.find(u => u.email === e);
    if (user) {
      if (user.role === 'admin') router.push('/admin');
      else if (user.role === 'staff' && user.userType === 'Librarian') router.push('/librarian');
      else if (user.role === 'faculty') router.push('/faculty');
      else router.push('/student');
    }
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      alert(`Account created for ${fullName}!`);
      setIsRegistering(false);
    } else {
      const user = MOCK_USERS.find(u => u.email === email);
      if (user) {
        if (user.role === 'admin') router.push('/admin');
        else if (user.role === 'staff' && user.userType === 'Librarian') router.push('/librarian');
        else if (user.role === 'faculty') router.push('/faculty');
        else router.push('/student');
      } else {
        alert("Invalid email or password (try the demo buttons below!)");
      }
    }
  };

  const handleGoogleAuth = () => {
    // TODO: Replace with your Google OAuth provider call e.g. signIn('google')
    alert('Google OAuth coming soon!');
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
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-2xl border border-white/50 animate-in fade-in zoom-in duration-300">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-usant-red mb-2">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500">
              {isRegistering ? 'Join USANT Library System' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleAuthAction} className="space-y-4">
            
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="you@usant.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-usant-red focus:outline-none transition-all" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-usant-red focus:outline-none transition-all" 
              />
            </div>

            {isRegistering && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
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
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {role !== 'student' && (
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
                )}
              </div>
            )}

            {isRegistering && role === 'student' && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                   <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-usant-red text-gray-900"
                   >
                     <option value="">Select a course</option>
                     <optgroup label="College of Information and Business Management">
                       <option>Business Administration</option>
                       <option>Hospitality Management</option>
                       <option>Tourism Management</option>
                       <option>Computer Science</option>
                       <option>Library and Information Science</option>
                       <option>Office Administration</option>
                     </optgroup>
                     <optgroup label="College of Accountancy">
                       <option>Accountancy</option>
                       <option>Accounting Information System</option>
                       <option>Internal Auditing</option>
                       <option>Management Accounting</option>
                     </optgroup>
                     <optgroup label="College of Engineering and Architecture">
                       <option>Architecture</option>
                       <option>Civil Engineering</option>
                     </optgroup>
                     <optgroup label="College of Maritime Education">
                       <option>Marine Transportation</option>
                       <option>Marine Engineering</option>
                     </optgroup>
                     <optgroup label="College of Criminal Justice Education">
                       <option>Criminology</option>
                     </optgroup>
                     <optgroup label="College of Health Care Education">
                       <option>Nursing</option>
                     </optgroup>
                     <optgroup label="College of Liberal Arts">
                       <option>Psychology</option>
                       <option>Communication</option>
                       <option>English Language</option>
                       <option>Political Science</option>
                     </optgroup>
                     <optgroup label="College of Teacher Education">
                       <option>Elementary Education</option>
                       <option>Secondary Education</option>
                       <option>Technology and Livelihood Education</option>
                       <option>Early Childhood Education</option>
                       <option>Physical Education</option>
                       <option>Special Needs Education</option>
                     </optgroup>
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
                     <option>5th Year</option>
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

            {/* OR Divider */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.611 20.083H42V20H24v8h11.303C33.653 32.773 29.28 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.259 0-9.608-3.299-11.285-7.935l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
              </svg>
              Continue with Google
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
                  <button onClick={() => quickLogin('john@usant.edu')} className="text-[10px] py-1 border rounded text-usant-red border-usant-red hover:bg-red-50">Student</button>
                  <button onClick={() => quickLogin('rob@usant.edu')} className="text-[10px] py-1 border rounded text-orange-600 border-orange-600 hover:bg-orange-50">Faculty</button>
                  <button onClick={() => quickLogin('maria@usant.edu')} className="text-[10px] py-1 border rounded text-gray-600 border-gray-600 hover:bg-gray-50">Librarian</button>
                  <button onClick={() => quickLogin('admin@usant.edu')} className="text-[10px] py-1 border rounded text-gray-600 border-gray-600 hover:bg-gray-50">Admin</button>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
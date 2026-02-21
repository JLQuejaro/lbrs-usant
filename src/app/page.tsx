"use client";

import { useState } from 'react';
import { ArrowRight, UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { userTypesByRole, UserRole, UserType } from './lib/mockData';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'staff': return '/librarian';
      case 'faculty': return '/faculty';
      case 'student': return '/student';
      default: return '/';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Use AuthContext to store user data
      login(data.user, data.token);

      // Redirect based on role
      const redirectPath = getRedirectPath(data.user.role);
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: fullName,
          email,
          password,
          role,
          userType,
          course: role === 'student' ? course : undefined,
          yearLevel: role === 'student' ? yearLevel : undefined,
          department: role === 'faculty' ? 'Computer Science' : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Use AuthContext to store user data
      login(data.user, data.token);

      // Show success and switch to login
      alert(`Account created for ${fullName}! Redirecting to dashboard...`);
      setIsRegistering(false);

      // Redirect based on role
      const redirectPath = getRedirectPath(data.user.role);
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthAction = (e: React.FormEvent) => {
    if (isRegistering) {
      handleRegister(e);
    } else {
      handleLogin(e);
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
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthAction} className="space-y-4">

            {/* REGISTER ONLY: Full Name */}
            {isRegistering && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="Jericho Ramos"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-usant-red focus:outline-none transition-all"
                />
              </div>
            )}

            {/* Email (Common) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-usant-red focus:outline-none transition-all"
              />
            </div>

            {/* Password (Common) */}
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
                    </select>
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* User Type Dropdown (Hidden for Students) */}
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
                     <option value="">Select a course</option>
                     {/* College of Information and Business Management */}
                     <optgroup label="College of Information and Business Management">
                       <option>Business Administration</option>
                       <option>Hospitality Management</option>
                       <option>Tourism Management</option>
                       <option>Computer Science</option>
                       <option>Library and Information Science</option>
                       <option>Office Administration</option>
                     </optgroup>
                     {/* College of Accountancy */}
                     <optgroup label="College of Accountancy">
                       <option>Accountancy</option>
                       <option>Accounting Information System</option>
                       <option>Internal Auditing</option>
                       <option>Management Accounting</option>
                     </optgroup>
                     {/* College of Engineering and Architecture */}
                     <optgroup label="College of Engineering and Architecture">
                       <option>Architecture</option>
                       <option>Civil Engineering</option>
                     </optgroup>
                     {/* College of Maritime Education */}
                     <optgroup label="College of Maritime Education">
                       <option>Marine Transportation</option>
                       <option>Marine Engineering</option>
                     </optgroup>
                     {/* College of Criminal Justice Education */}
                     <optgroup label="College of Criminal Justice Education">
                       <option>Criminology</option>
                     </optgroup>
                     {/* College of Health Care Education */}
                     <optgroup label="College of Health Care Education">
                       <option>Nursing</option>
                     </optgroup>
                     {/* College of Liberal Arts */}
                     <optgroup label="College of Liberal Arts">
                       <option>Psychology</option>
                       <option>Communication</option>
                       <option>English Language</option>
                       <option>Political Science</option>
                     </optgroup>
                     {/* College of Teacher Education */}
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
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-usant-red hover:bg-red-800 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 shadow-lg shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : isRegistering ? (
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

          {/* Demo Access (Development Only) */}
          {!isRegistering && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-center text-xs text-gray-400 mb-3 font-bold uppercase tracking-wider">Demo Access (Development)</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setEmail('admin@usant.edu'); setPassword('admin123'); }}
                  className="text-xs py-2 px-3 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  👤 Admin
                </button>
                <button
                  onClick={() => { setEmail('john@usant.edu'); setPassword('student123'); }}
                  className="text-xs py-2 px-3 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  📚 Student
                </button>
                <button
                  onClick={() => { setEmail('rob@usant.edu'); setPassword('faculty123'); }}
                  className="text-xs py-2 px-3 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  🎓 Faculty
                </button>
                <button
                  onClick={() => { setEmail('maria@usant.edu'); setPassword('librarian123'); }}
                  className="text-xs py-2 px-3 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  📖 Librarian
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                Click a role to auto-fill credentials, then click Sign In
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

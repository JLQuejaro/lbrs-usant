"use client";

import { useState } from 'react';
import { ArrowRight, UserPlus, Loader2, Check, X, AlertCircle, Shield } from 'lucide-react';
import Image from 'next/image';
import { userTypesByRole, UserRole, UserType } from './lib/userTypes';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
import { validatePassword, getStrengthColor, getStrengthLabel, getStrengthProgress } from './lib/passwordValidation';
import LibraryInfoModal from './components/LibraryInfoModal';
import LibraryInfoPanel from './components/LibraryInfoPanel';

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [userType, setUserType] = useState<UserType>(userTypesByRole['student'][0]);
  const [emailError, setEmailError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<ReturnType<typeof validatePassword> | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [fullName, setFullName] = useState('');
  const [course, setCourse] = useState('Computer Science');
  const [yearLevel, setYearLevel] = useState('1st Year');

  // Modal states (kept for mobile view)
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showHoursModal, setShowHoursModal] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setUserType(userTypesByRole[newRole][0]);
  };

  const validateEmail = (email: string) => {
    if (email && !email.toLowerCase().endsWith('@usant.edu.ph')) {
      setEmailError('Only @usant.edu.ph email addresses are allowed');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) validateEmail(value);
    // Re-validate password if it exists (to check for email in password)
    if (isRegistering && password) {
      const validation = validatePassword(password, fullName, value);
      setPasswordValidation(validation);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    // Only validate during registration
    if (isRegistering && value) {
      const validation = validatePassword(value, fullName, email);
      setPasswordValidation(validation);
      
      // Check confirm password match if it exists
      if (confirmPassword) {
        setConfirmPasswordError(value !== confirmPassword ? 'Passwords do not match' : '');
      }
    } else {
      setPasswordValidation(null);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value) {
      setConfirmPasswordError(value !== password ? 'Passwords do not match' : '');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    
    // Re-validate password if it exists (to check for name in password)
    if (password) {
      const validation = validatePassword(password, value, email);
      setPasswordValidation(validation);
    }
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

      login(data.user, data.token);
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
    
    // Final validation before submission
    if (!passwordValidation?.isValid) {
      setError('Please fix password errors before submitting');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
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

      login(data.user, data.token);
      alert(`Account created for ${fullName}! Redirecting to dashboard...`);
      setIsRegistering(false);

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

  // Reset validation when switching modes
  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setPassword('');
    setConfirmPassword('');
    setPasswordValidation(null);
    setConfirmPasswordError('');
    setError('');
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100">

      {/* LEFT SIDE: Picture Catalog, Branding & Info Panel */}
      <div className="hidden lg:flex w-1/2 flex-col relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image 
            src="/pic1.jpg" 
            alt="USANT Library" 
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-usant-red/95 via-usant-red/90 to-usant-orange/85"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-start h-full p-12">
          
          {/* Top: Logo & Branding */}
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <div className="flex items-center gap-4 mb-8">
              <div className="rounded-2xl shadow-2xl bg-white p-2 border-2 border-white/30">
                <Image src="/logo.png" alt="USANT Logo" width={70} height={70} className="object-contain" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">USANT LBRS</h1>
                <p className="text-sm text-white/90 font-medium">Library Book Recommendation System</p>
              </div>
            </div>

            <div className="space-y-4 max-w-lg mb-8">
              <h2 className="text-3xl font-bold text-white leading-tight drop-shadow-md">
                Your Gateway to Academic Excellence
              </h2>
              <p className="text-base text-white/95 leading-relaxed drop-shadow">
                Access thousands of resources, get personalized book recommendations, and enhance your learning journey.
              </p>
            </div>

            {/* Library Info Panel - Below Branding */}
            <div className="max-w-lg">
              <LibraryInfoPanel />
            </div>
          </div>


        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo & Info Buttons */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image src="/logo.png" alt="USANT Logo" width={50} height={50} className="object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-usant-red">USANT LBRS</h1>
                <p className="text-xs text-gray-600">Library System</p>
              </div>
            </div>
            {/* Mobile Info Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowRulesModal(true)}
                className="flex-1 px-4 py-2 bg-usant-red/10 hover:bg-usant-red/20 border border-usant-red rounded-lg text-usant-red font-semibold text-xs transition-all"
              >
                Rules & Regulations
              </button>
              <button
                type="button"
                onClick={() => setShowHoursModal(true)}
                className="flex-1 px-4 py-2 bg-usant-orange/10 hover:bg-usant-orange/20 border border-usant-orange rounded-lg text-usant-orange font-semibold text-xs transition-all"
              >
                Library Hours
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-10 animate-in fade-in zoom-in duration-300">

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600">
                {isRegistering ? 'Join the USANT community' : 'Sign in to continue your journey'}
              </p>
              {!isRegistering && (
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full">
                  <div className="w-2 h-2 bg-usant-red rounded-full animate-pulse"></div>
                  <p className="text-xs text-usant-red font-semibold">
                    Only @usant.edu.ph emails permitted
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-in slide-in-from-top-2 duration-300">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleAuthAction} className="space-y-5">

              {/* REGISTER ONLY: Full Name */}
              {isRegistering && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Juan Dela Cruz"
                    value={fullName}
                    onChange={handleFullNameChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-usant-red focus:bg-white focus:ring-4 focus:ring-red-50 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">University Email</label>
                <input
                  required
                  type="email"
                  placeholder="you@usant.edu.ph"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-3.5 rounded-xl bg-gray-50 border-2 ${
                    emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-50' : 'border-gray-200 focus:border-usant-red focus:ring-red-50'
                  } focus:bg-white focus:ring-4 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400`}
                />
                {emailError && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  required
                  type="password"
                  placeholder={isRegistering ? "Min 12 chars, uppercase, lowercase, number, special" : "••••••••"}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3.5 rounded-xl bg-gray-50 border-2 ${
                    isRegistering && passwordValidation && !passwordValidation.isValid
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-50'
                      : 'border-gray-200 focus:border-usant-red focus:ring-red-50'
                  } focus:bg-white focus:ring-4 focus:outline-none transition-all text-gray-900`}
                />
                
                {/* Password Strength Indicator (Registration Only) */}
                {isRegistering && password && passwordValidation && (
                  <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    {/* Strength Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-600">Password Strength</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                          getStrengthColor(passwordValidation.strength)
                        }`}>
                          {getStrengthLabel(passwordValidation.strength)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            passwordValidation.strength === 'weak' ? 'bg-red-500' :
                            passwordValidation.strength === 'moderate' ? 'bg-orange-500' :
                            passwordValidation.strength === 'strong' ? 'bg-blue-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${getStrengthProgress(passwordValidation.score)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Errors */}
                    {passwordValidation.errors.length > 0 && (
                      <div className="space-y-1.5">
                        {passwordValidation.errors.map((error, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs text-red-600">
                            <X size={14} className="flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {passwordValidation.suggestions.length > 0 && (
                      <div className="space-y-1.5">
                        {passwordValidation.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs text-blue-600">
                            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                            <span>{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Success Message */}
                    {passwordValidation.isValid && (
                      <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded-lg border border-green-200">
                        <Shield size={14} className="flex-shrink-0" />
                        <span className="font-medium">Strong password! You can now confirm it below.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password (Registration Only - Enabled only if password is valid) */}
              {isRegistering && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <input
                    required
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    disabled={!passwordValidation?.isValid}
                    className={`w-full px-4 py-3.5 rounded-xl bg-gray-50 border-2 ${
                      confirmPasswordError
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-50'
                        : confirmPassword && !confirmPasswordError
                        ? 'border-green-500 focus:border-green-500 focus:ring-green-50'
                        : 'border-gray-200 focus:border-usant-red focus:ring-red-50'
                    } focus:bg-white focus:ring-4 focus:outline-none transition-all text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {confirmPasswordError && (
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                      <X size={14} />
                      {confirmPasswordError}
                    </p>
                  )}
                  {confirmPassword && !confirmPasswordError && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                      <Check size={14} />
                      Passwords match!
                    </p>
                  )}
                </div>
              )}

              {isRegistering && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                    <select
                      value={role}
                      onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                      className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-usant-red focus:bg-white focus:ring-4 focus:ring-red-50 focus:outline-none transition-all text-gray-900 appearance-none cursor-pointer"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                    </select>
                  </div>

                  {role !== 'student' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                      <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value as UserType)}
                        className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-usant-red focus:bg-white focus:ring-4 focus:ring-red-50 focus:outline-none transition-all text-gray-900 appearance-none cursor-pointer"
                      >
                        {userTypesByRole[role].map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {isRegistering && role === 'student' && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-usant-red focus:bg-white focus:ring-4 focus:ring-red-50 focus:outline-none transition-all text-gray-900 cursor-pointer"
                    >
                      <option value="">Select course</option>
                      <optgroup label="Information & Business">
                        <option>Business Administration</option>
                        <option>Computer Science</option>
                        <option>Hospitality Management</option>
                      </optgroup>
                      <optgroup label="Accountancy">
                        <option>Accountancy</option>
                        <option>Internal Auditing</option>
                      </optgroup>
                      <optgroup label="Engineering">
                        <option>Architecture</option>
                        <option>Civil Engineering</option>
                      </optgroup>
                      <optgroup label="Maritime">
                        <option>Marine Transportation</option>
                        <option>Marine Engineering</option>
                      </optgroup>
                      <optgroup label="Other Programs">
                        <option>Criminology</option>
                        <option>Nursing</option>
                        <option>Psychology</option>
                        <option>Education</option>
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                    <select
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-usant-red focus:bg-white focus:ring-4 focus:ring-red-50 focus:outline-none transition-all text-gray-900 cursor-pointer"
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

              {/* Forgot Password Link (Login Only) */}
              {!isRegistering && (
                <div className="text-right">
                  <button type="button" className="text-sm text-usant-red hover:underline font-medium">
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading || (isRegistering && (!passwordValidation?.isValid || password !== confirmPassword))}
                className="w-full bg-gradient-to-r from-usant-red to-usant-orange hover:from-red-700 hover:to-orange-600 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-8 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : isRegistering ? (
                  <>
                    <span>Create Account</span>
                    <UserPlus size={20} />
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Link */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={toggleMode}
                  className="font-bold text-usant-red hover:text-red-700 focus:outline-none transition-colors"
                >
                  {isRegistering ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>

          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By continuing, you agree to USANT's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Library Info Modals */}
      <LibraryInfoModal 
        isOpen={showRulesModal} 
        onClose={() => setShowRulesModal(false)} 
        type="rules" 
      />
      <LibraryInfoModal 
        isOpen={showHoursModal} 
        onClose={() => setShowHoursModal(false)} 
        type="hours" 
      />
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuthStore } from '../store/authStore';
import { Sparkles, Key, CheckCircle, ArrowRight, ShieldCheck, Mail, Lock, User, RefreshCw, Eye, EyeOff, BookOpen, HeartHandshake, Zap } from 'lucide-react';
import { Logo } from '../components/layout/Logo';

export const AuthLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'>('LOGIN');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in both email and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.login({ email: email.trim(), password });
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, accessToken, refreshToken);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Check your email & password.');
    } finally {
      setLoading(false);
    }
  };

  // Password validation criteria helper
  const getPasswordCriteria = (pass: string, confirm: string = '') => {
    return [
      { id: 'len', label: 'At least 8 characters', met: pass.length >= 8 },
      { id: 'upper', label: '1 uppercase letter (A-Z)', met: /[A-Z]/.test(pass) },
      { id: 'lower', label: '1 lowercase letter (a-z)', met: /[a-z]/.test(pass) },
      { id: 'digit', label: '1 number (0-9)', met: /[0-9]/.test(pass) },
      { id: 'special', label: '1 special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(pass) },
      ...(confirm !== undefined ? [{ id: 'match', label: 'Passwords match', met: pass.length > 0 && pass === confirm }] : [])
    ];
  };

  const registerCriteria = getPasswordCriteria(password, confirmPassword);
  const registerAllMet = registerCriteria.slice(0, 5).every(c => c.met);
  const registerScore = registerCriteria.slice(0, 5).filter(c => c.met).length;

  const resetCriteria = getPasswordCriteria(newPassword);
  const resetAllMet = resetCriteria.slice(0, 5).every(c => c.met);

  // Email format RFC validator
  const isValidEmail = (em: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(em.trim());
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid, complete email address (e.g. yourname@gmail.com)');
      return;
    }
    if (!registerAllMet) {
      setError('Password does not meet all 5 security criteria. Please check the rules below.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-type your confirm password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await api.register({ name: name.trim(), email: email.trim().toLowerCase(), password });
      try {
        const loginRes = await api.login({ email: email.trim().toLowerCase(), password });
        const { user: loggedInUser, accessToken, refreshToken } = loginRes.data.data;
        setAuth(loggedInUser, accessToken, refreshToken);
        window.location.href = '/';
        return;
      } catch (loginErr) {
        setSuccessMessage(`Account registered successfully! Please sign in with ${email}.`);
        setActiveTab('LOGIN');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Email might already exist in database.');
    } finally {
      setLoading(false);
    }
  };

  const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '236418381713-v49dnelbt02udf5euipsnpb1a58dp7mq.apps.googleusercontent.com';

  // Helper to parse Google JWT credential
  const parseGoogleJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to parse Google JWT', e);
      return null;
    }
  };

  // Google Credential Callback
  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response || !response.credential) return;
    const payload = parseGoogleJwt(response.credential);
    if (!payload || !payload.email) {
      setError('Could not retrieve Google account information');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.googleLogin({
        email: payload.email,
        name: payload.name || payload.given_name || 'Reader',
        profileImage: payload.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      });
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, accessToken, refreshToken);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize Google Identity Services
  React.useEffect(() => {
    const initGoogle = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
          });

          const btnLogin = document.getElementById('googleSignInBtnLogin');
          if (btnLogin) {
            (window as any).google.accounts.id.renderButton(btnLogin, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'continue_with',
              shape: 'pill',
            });
          }

          const btnRegister = document.getElementById('googleSignInBtnRegister');
          if (btnRegister) {
            (window as any).google.accounts.id.renderButton(btnRegister, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signup_with',
              shape: 'pill',
            });
          }
        } catch (e) {
          console.error('Google One Tap init error', e);
        }
      }
    };

    const timer = setTimeout(initGoogle, 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Google Sign-in Trigger
  const handleGoogleAuth = async () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to quick email login if popup suppressed
            fallbackGooglePrompt();
          }
        });
      } catch (e) {
        fallbackGooglePrompt();
      }
    } else {
      fallbackGooglePrompt();
    }
  };

  const fallbackGooglePrompt = async () => {
    const promptEmail = prompt('Enter your Google Account email address:', email.trim() || 'aditya.sharma@gmail.com');
    if (!promptEmail) return;
    setError('');
    setLoading(true);
    try {
      const res = await api.googleLogin({
        email: promptEmail.trim(),
        name: promptEmail.split('@')[0],
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      });
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, accessToken, refreshToken);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Request
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.sendOtp(email.trim());
      const returnedOtp = res.data?.data || '';
      setOtpSent(true);
      if (returnedOtp) {
        setOtp(returnedOtp);
        setSuccessMessage(`OTP sent! Your 6-digit code is: ${returnedOtp}`);
      } else {
        setSuccessMessage(res.data?.message || '6-digit OTP code sent! Check your inbox.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check email address.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Reset Verification
  const handleVerifyOtpReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || !newPassword) {
      setError('Please enter both OTP code and new password');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.verifyOtpReset({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
      setSuccessMessage('Password reset successfully! You can now log in with your new password.');
      setActiveTab('LOGIN');
      setOtpSent(false);
      setOtp('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-orange-50/40 via-background to-background">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-gray-200/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Visual Brand Hero */}
        <div className="lg:col-span-5 bg-gradient-to-br from-primary via-[#24243e] to-[#1A1A2E] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Logo */}
          <div className="relative z-10 space-y-2">
            <Logo size="lg" variant="light" clickable={false} />
            <p className="text-xs text-gray-300 font-medium">India's Premier Book Discovery &amp; Reader Marketplace</p>
          </div>

          {/* Value Props */}
          <div className="relative z-10 my-8 space-y-5">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-accent shrink-0 backdrop-blur-md">
                <Sparkles size={17} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Curated Bestsellers &amp; AI Discovery</h4>
                <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                  Personalized recommendations across 10,000+ fiction, self-help, business, and tech titles.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-accent shrink-0 backdrop-blur-md">
                <HeartHandshake size={17} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">P2P Pre-Loved Book Marketplace</h4>
                <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                  Buy and sell used books in ₹ INR with up to 70% discount and 100% escrow buyer protection.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-white/10 text-accent shrink-0 backdrop-blur-md">
                <ShieldCheck size={17} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Instant OTP &amp; Enterprise Security</h4>
                <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                  Military-grade JWT encryption with passwordless 6-digit OTP reset and Google Sign-In.
                </p>
              </div>
            </div>
          </div>

          {/* Guest Link */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-gray-400">Want to explore first?</span>
            <Link
              to="/books"
              className="text-xs font-bold text-accent hover:text-white flex items-center space-x-1.5 transition-colors"
            >
              <span>Browse Catalog as Guest</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Tabs Switcher */}
          {activeTab !== 'FORGOT_PASSWORD' ? (
            <div className="flex bg-gray-100/90 p-1.5 rounded-2xl mb-6 shadow-inner">
              <button
                type="button"
                onClick={() => { setActiveTab('LOGIN'); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'LOGIN'
                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                    : 'text-gray-500 hover:text-primary'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('REGISTER'); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'REGISTER'
                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                    : 'text-gray-500 hover:text-primary'
                }`}
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h3 className="font-serif font-bold text-xl text-primary flex items-center gap-2">
                <Key size={19} className="text-accent" /> Reset Password with OTP
              </h3>
              <button
                type="button"
                onClick={() => { setActiveTab('LOGIN'); setError(''); setOtpSent(false); }}
                className="text-xs text-accent font-bold hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {/* Feedback Banners */}
          {error && (
            <div className="p-3.5 mb-5 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-100 flex items-center gap-2 animate-in fade-in">
              <span className="shrink-0 font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3.5 mb-5 bg-green-50 text-green-700 text-xs rounded-2xl border border-green-100 flex items-center gap-2 animate-in fade-in">
              <CheckCircle size={16} className="shrink-0 text-green-600" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent font-medium text-gray-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('FORGOT_PASSWORD'); setError(''); }}
                    className="text-[11px] text-accent font-bold hover:underline"
                  >
                    Forgot Password? (OTP)
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent font-medium text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-accent focus:ring-accent"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-accent text-white font-bold text-sm rounded-xl hover:bg-accent-hover transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to Bookify</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Google Sign-in */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-gray-400 font-semibold">or sign in with</span></div>
              </div>

              {/* Official Google Identity Button */}
              <div id="googleSignInBtnLogin" className="w-full flex justify-center min-h-[40px]" />

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2.5 transition-all shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google One-Tap</span>
              </button>

            </form>
          )}

          {/* 2. CREATE ACCOUNT FORM */}
          {activeTab === 'REGISTER' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent font-medium text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent font-medium text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent font-medium text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Live Password Strength Meter */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-gray-500">Password Strength:</span>
                      <span className={
                        registerScore <= 1 ? 'text-red-500' :
                        registerScore <= 3 ? 'text-amber-500' :
                        registerScore === 4 ? 'text-blue-600' : 'text-emerald-600'
                      }>
                        {registerScore <= 1 ? 'Very Weak' :
                         registerScore <= 3 ? 'Medium' :
                         registerScore === 4 ? 'Strong' : 'Very Strong ✨'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            level <= registerScore
                              ? registerScore <= 1 ? 'bg-red-500'
                                : registerScore <= 3 ? 'bg-amber-500'
                                : registerScore === 4 ? 'bg-blue-500'
                                : 'bg-emerald-500'
                              : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent font-medium text-gray-800"
                  />
                </div>
              </div>

              {/* Real-time 6 Criteria Checklist */}
              <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#EDE5D8] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Security Requirements:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {registerCriteria.map((c) => (
                    <div
                      key={c.id}
                      className={`flex items-center space-x-1.5 font-medium transition-colors ${
                        c.met ? 'text-emerald-700 font-bold' : 'text-gray-400'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                        c.met ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {c.met ? '✓' : '•'}
                      </span>
                      <span>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !registerAllMet || password !== confirmPassword}
                className="w-full py-3.5 bg-accent text-white font-bold text-sm rounded-xl hover:bg-accent-hover transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? 'Creating account...' : 'Create Free Account'}
              </button>

              {/* Official Google Identity Button */}
              <div id="googleSignInBtnRegister" className="w-full flex justify-center min-h-[40px]" />

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2.5 transition-all shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign up with Google One-Tap</span>
              </button>
            </form>
          )}

          {/* 3. OTP PASSWORD RESET */}
          {activeTab === 'FORGOT_PASSWORD' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Enter your account email to receive a secure 6-digit numeric OTP code for instant password recovery.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Registered Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-accent text-white font-bold text-sm rounded-xl hover:bg-accent-hover transition-all shadow-md disabled:opacity-50"
                  >
                    {loading ? 'Sending OTP Code...' : 'Send 6-Digit OTP Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-3.5 py-3 text-xl font-mono text-center tracking-[0.5em] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        placeholder="Create strong new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Reset Password Criteria */}
                    <div className="mt-3 p-3 bg-[#FAF6F0] rounded-2xl border border-[#EDE5D8] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        New Password Requirements:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                        {resetCriteria.slice(0, 5).map((c) => (
                          <div
                            key={c.id}
                            className={`flex items-center space-x-1 font-medium ${
                              c.met ? 'text-emerald-700 font-bold' : 'text-gray-400'
                            }`}
                          >
                            <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${
                              c.met ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {c.met ? '✓' : '•'}
                            </span>
                            <span>{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !resetAllMet}
                    className="w-full py-3.5 bg-accent text-white font-bold text-sm rounded-xl hover:bg-accent-hover transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Resetting Password...' : 'Verify OTP & Reset Password'}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full text-center text-xs text-gray-500 hover:text-primary flex items-center justify-center space-x-1.5 pt-1"
                  >
                    <RefreshCw size={13} />
                    <span>Resend OTP Code</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


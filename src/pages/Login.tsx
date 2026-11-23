import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from || '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetNotice, setResetNotice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }
    const res = login(email, password);
    if (!res.ok) {
      setError(res.message ?? 'Login failed.');
      return;
    }
    navigate(email.trim().toLowerCase() === 'admin@campuscart.edu.in' ? '/admin' : redirectTo, {
      replace: true,
    });
  };

  const handleDemoFill = (demoEmail: string, demoPassword: string, target: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    const res = login(demoEmail, demoPassword);
    if (res.ok) {
      navigate(target, { replace: true });
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetNotice(
      `Demo prototype notice: password reset instructions would be sent to ${resetEmail.trim()} once backend email delivery is connected.`
    );
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-[#1E293B] font-display">Welcome back</h1>
          <p className="text-sm text-[#475569]">
            Sign in to save preferences, submit student reviews, and manage your profile.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] text-xs font-medium text-[#991B1B]"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-[#475569] mb-1.5">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu.in"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="text-xs font-semibold text-[#475569]">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowForgot((prev) => !prev);
                  setResetNotice('');
                }}
                className="text-xs font-medium text-[#2563EB] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            <span>Login</span>
          </button>
        </form>

        {showForgot && (
          <form
            onSubmit={handleForgotSubmit}
            className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E293B]">
              <KeyRound className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
              <span>Reset Demo Password</span>
            </div>
            <input
              type="email"
              required
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter registered email"
              className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg bg-[#FFFFFF]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#1E293B] text-white text-xs font-semibold"
            >
              Send Reset Link
            </button>
            {resetNotice && <p className="text-xs text-[#16A34A]">{resetNotice}</p>}
          </form>
        )}

        {/* Quick Demo Sign-In Helper */}
        <div className="pt-4 border-t border-[#E2E8F0] space-y-2.5">
          <p className="text-xs font-semibold text-[#475569]">
            Demo Accounts (Local Prototype)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('aarav.sharma@iitb.ac.in', 'student123', redirectTo)}
              className="px-3 py-2 rounded-lg bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#1E293B] text-xs font-semibold text-left transition-colors"
            >
              Demo Student Login
              <span className="block font-normal text-[11px] text-[#475569]">
                aarav.sharma@iitb.ac.in
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin@campuscart.edu.in', 'admin123', '/admin')}
              className="px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#1E293B] text-xs font-semibold text-left transition-colors"
            >
              Demo Admin Login
              <span className="block font-normal text-[11px] text-[#475569]">
                admin@campuscart.edu.in
              </span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-[#475569] pt-2 border-t border-[#E2E8F0]">
          New to CampusCart?{' '}
          <Link to="/register" className="font-semibold text-[#2563EB] hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { StudentType } from '../types';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [studentType, setStudentType] = useState<StudentType>('Hostel');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = register({
      fullName,
      email,
      password,
      university,
      studentType,
    });

    if (!res.ok) {
      setError(res.message ?? 'Could not create account.');
      return;
    }

    navigate('/profile', { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-[#1E293B] font-display">
            Create Student Account
          </h1>
          <p className="text-sm text-[#475569]">
            Join CampusCart to personalize recommendations and publish product reviews.
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
            <label htmlFor="reg-name" className="block text-xs font-semibold text-[#475569] mb-1.5">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Priya Nair"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-[#475569] mb-1.5">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@university.ac.in"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-xs font-semibold text-[#475569] mb-1.5">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label htmlFor="reg-univ" className="block text-xs font-semibold text-[#475569] mb-1.5">
              University Name
            </label>
            <input
              id="reg-univ"
              type="text"
              required
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g., NIT Trichy / Delhi University"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#475569] mb-1.5">
              Student Type
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {(['Hostel', 'Day Scholar'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setStudentType(type)}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-semibold transition-colors ${
                    studentType === type
                      ? 'bg-[#DBEAFE] border-[#2563EB] text-[#1E293B]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:text-[#1E293B]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
          >
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            <span>Create Account</span>
          </button>
        </form>

        <p className="text-center text-sm text-[#475569] pt-2 border-t border-[#E2E8F0]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#2563EB] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

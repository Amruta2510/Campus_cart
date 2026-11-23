import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, Check, Star } from 'lucide-react';
import { StudentType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { formatDate } from '../utils/format';

export function Profile() {
  const { user, isAuthenticated, isAdmin, updateProfile, logout } = useAuth();
  const { categories, reviews, getProductById } = useCatalog();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [university, setUniversity] = useState(user?.university ?? '');
  const [studentType, setStudentType] = useState<StudentType>(user?.studentType ?? 'Hostel');
  const [preferredCategories, setPreferredCategories] = useState<string[]>(
    user?.preferredCategories ?? []
  );
  const [savedNotice, setSavedNotice] = useState('');

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#1E293B] font-display">Sign in required</h1>
        <p className="text-sm text-[#475569]">
          Please sign in to view your student profile, preferred categories, and submitted reviews.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#2563EB] text-white text-sm font-semibold"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const myReviews = reviews.filter((r) => r.userId === user.id);

  const togglePreferredCategory = (categoryId: string) => {
    setPreferredCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setSavedNotice('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateProfile({
      fullName: fullName.trim() || user.fullName,
      university: university.trim() || user.university,
      studentType,
      preferredCategories,
    });
    if (res.ok) {
      setSavedNotice('Profile preferences updated and saved locally.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-[#2563EB]">
            {isAdmin ? 'Administrator Account' : `${user.studentType} Student`}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] font-display">
            {user.fullName}
          </h1>
          <p className="text-sm text-[#475569]">
            {user.email} <span aria-hidden="true">·</span> {user.university}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Admin Dashboard</span>
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#1E293B] text-sm font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4 text-[#DC2626]" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Account Settings & Preferred Categories */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-6 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-5"
        >
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="text-lg font-bold text-[#1E293B] font-display">Account Settings</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Update your campus profile and shopping interests.
            </p>
          </div>

          {savedNotice && (
            <div className="p-3 rounded-lg bg-[#DCFCE7] border border-[#86EFAC] text-xs font-medium text-[#166534]">
              {savedNotice}
            </div>
          )}

          <div>
            <label htmlFor="prof-name" className="block text-xs font-semibold text-[#475569] mb-1.5">
              Student Name
            </label>
            <input
              id="prof-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B]"
            />
          </div>

          <div>
            <label htmlFor="prof-univ" className="block text-xs font-semibold text-[#475569] mb-1.5">
              University
            </label>
            <input
              id="prof-univ"
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B]"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#475569] mb-1.5">Student Type</span>
            <div className="grid grid-cols-2 gap-2">
              {(['Hostel', 'Day Scholar'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setStudentType(type)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-colors ${
                    studentType === type
                      ? 'bg-[#DBEAFE] border-[#2563EB] text-[#1E293B]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#475569] mb-2">
              Preferred Categories
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = preferredCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => togglePreferredCategory(cat.id)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#DBEAFE] border-[#93C5FD] text-[#1E293B]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:text-[#1E293B]'
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />}
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
          >
            Save Preferences
          </button>
        </form>

        {/* Submitted Reviews */}
        <section className="lg:col-span-6 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1E293B] font-display">Submitted Reviews</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Track moderation status of reviews you shared.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-[#64748B]">
              {myReviews.length} total
            </span>
          </div>

          {myReviews.length > 0 ? (
            <div className="space-y-3">
              {myReviews.map((rev) => {
                const prod = getProductById(rev.productId);
                return (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={`/products/${rev.productId}`}
                          className="text-xs font-semibold text-[#2563EB] hover:underline"
                        >
                          {prod?.name ?? 'Product'}
                        </Link>
                        <h3 className="text-sm font-semibold text-[#1E293B]">{rev.title}</h3>
                      </div>
                      <span
                        className={`text-[11px] font-semibold whitespace-nowrap ${
                          rev.status === 'approved'
                            ? 'text-[#16A34A]'
                            : rev.status === 'rejected'
                            ? 'text-[#DC2626]'
                            : 'text-[#D97706]'
                        }`}
                      >
                        {rev.status === 'approved'
                          ? 'Approved'
                          : rev.status === 'rejected'
                          ? 'Rejected'
                          : 'Pending Review'}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">{rev.comment}</p>
                    <div className="flex items-center justify-between text-[11px] text-[#64748B] tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                        {rev.rating.toFixed(1)}
                      </span>
                      <span>{formatDate(rev.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-[#64748B]">You have not submitted any reviews yet.</p>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#DBEAFE] text-[#1E293B] text-xs font-semibold"
              >
                Explore Products to Review
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

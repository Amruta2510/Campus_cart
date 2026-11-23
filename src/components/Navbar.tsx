import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, Scale, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';

export function Navbar() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { compareIds } = useCompare();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 pb-0.5 border-b-2 ${
      isActive
        ? 'text-[#2563EB] border-[#2563EB]'
        : 'text-[#475569] border-transparent hover:text-[#1E293B] hover:border-[#CBD5E1]'
    }`;

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          onClick={closeMobile}
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#1E293B] whitespace-nowrap shrink-0 font-display"
        >
          <span className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center text-sm font-bold">
            CC
          </span>
          <span>CampusCart</span>
        </Link>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Categories
          </NavLink>
          <NavLink to="/compare" className={navLinkClass}>
            <span className="inline-flex items-center gap-1.5">
              <span>Compare</span>
              {compareIds.length > 0 && (
                <span className="font-mono text-xs tabular-nums text-[#2563EB] font-semibold">
                  ({compareIds.length})
                </span>
              )}
            </span>
          </NavLink>
          <NavLink to="/recommendations" className={navLinkClass}>
            Recommendations
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="hidden md:flex items-center shrink-0">
          {isAuthenticated && user ? (
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#DBEAFE] text-[#1E293B] hover:bg-[#BFDBFE] text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150"
            >
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              ) : (
                <UserIcon className="w-4 h-4 text-[#2563EB]" />
              )}
              <span className="max-w-[140px] truncate">{user.fullName.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150"
            >
              Login / Sign Up
            </Link>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/compare"
            aria-label={`Compare products (${compareIds.length} selected)`}
            className="p-2.5 rounded-lg text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9] relative"
          >
            <Scale className="w-5 h-5" />
            {compareIds.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[10px] font-mono tabular-nums flex items-center justify-center">
                {compareIds.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-2.5 rounded-lg text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-[#FFFFFF] px-4 py-4 space-y-2">
          <NavLink
            to="/"
            end
            onClick={closeMobile}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? 'bg-[#DBEAFE] text-[#2563EB]' : 'text-[#1E293B] hover:bg-[#F8FAFC]'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={closeMobile}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? 'bg-[#DBEAFE] text-[#2563EB]' : 'text-[#1E293B] hover:bg-[#F8FAFC]'
              }`
            }
          >
            Categories &amp; Products
          </NavLink>
          <NavLink
            to="/compare"
            onClick={closeMobile}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? 'bg-[#DBEAFE] text-[#2563EB]' : 'text-[#1E293B] hover:bg-[#F8FAFC]'
              }`
            }
          >
            Compare ({compareIds.length}/3)
          </NavLink>
          <NavLink
            to="/recommendations"
            onClick={closeMobile}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? 'bg-[#DBEAFE] text-[#2563EB]' : 'text-[#1E293B] hover:bg-[#F8FAFC]'
              }`
            }
          >
            Recommendations
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={closeMobile}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-[#DBEAFE] text-[#2563EB]' : 'text-[#1E293B] hover:bg-[#F8FAFC]'
                }`
              }
            >
              Admin Dashboard
            </NavLink>
          )}
          <div className="pt-2 border-t border-[#E2E8F0]">
            {isAuthenticated && user ? (
              <Link
                to="/profile"
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-[#DBEAFE] text-[#1E293B] text-sm font-semibold"
              >
                <UserIcon className="w-4 h-4 text-[#2563EB]" />
                <span>My Profile ({user.fullName.split(' ')[0]})</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={closeMobile}
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-[#2563EB] text-white text-sm font-semibold"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

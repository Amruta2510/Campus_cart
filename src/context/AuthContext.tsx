import React, { createContext, useContext, useEffect, useState } from 'react';
import { StudentType, User } from '../types';
import { storageService } from '../services/storageService';

interface AuthActionResult {
  ok: boolean;
  message?: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  university: string;
  studentType: StudentType;
}

interface AuthContextValue {
  user: User | null;
  allUsers: User[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => AuthActionResult;
  register: (payload: RegisterPayload) => AuthActionResult;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'fullName' | 'university' | 'studentType' | 'preferredCategories'>>) => AuthActionResult;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function sanitizeUser(u: User): User {
  const { password: _omitted, ...safe } = u;
  return safe;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());
  const [sessionUserId, setSessionUserId] = useState<string | null>(() =>
    storageService.getSessionUserId()
  );

  useEffect(() => {
    storageService.saveUsers(users);
  }, [users]);

  useEffect(() => {
    storageService.saveSessionUserId(sessionUserId);
  }, [sessionUserId]);

  const currentUserRecord = users.find((u) => u.id === sessionUserId) ?? null;
  const user = currentUserRecord ? sanitizeUser(currentUserRecord) : null;

  const login = (email: string, password: string): AuthActionResult => {
    const normalizedEmail = email.trim().toLowerCase();
    const matched = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );
    if (!matched) {
      return {
        ok: false,
        message: 'Invalid email or password. Use the demo credentials below or create a student account.',
      };
    }
    setSessionUserId(matched.id);
    return { ok: true };
  };

  const register = (payload: RegisterPayload): AuthActionResult => {
    const normalizedEmail = payload.email.trim().toLowerCase();
    if (!payload.fullName.trim() || !normalizedEmail || !payload.password || !payload.university.trim()) {
      return { ok: false, message: 'Please fill out all required registration fields.' };
    }
    if (payload.password.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters long.' };
    }
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: payload.fullName.trim(),
      email: normalizedEmail,
      password: payload.password,
      university: payload.university.trim(),
      studentType: payload.studentType,
      role: 'student',
      preferredCategories:
        payload.studentType === 'Hostel'
          ? ['cat-hostel', 'cat-study']
          : ['cat-daily', 'cat-study'],
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setUsers((prev) => [...prev, newUser]);
    setSessionUserId(newUser.id);
    return { ok: true };
  };

  const logout = () => {
    setSessionUserId(null);
  };

  const updateProfile: AuthContextValue['updateProfile'] = (updates) => {
    if (!sessionUserId) {
      return { ok: false, message: 'You must be signed in to update your profile.' };
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === sessionUserId ? { ...u, ...updates } : u))
    );
    return { ok: true, message: 'Profile preferences saved.' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers: users.map(sanitizeUser),
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

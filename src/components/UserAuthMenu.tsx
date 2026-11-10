import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogIn,
  LogOut,
  User as UserIcon,
  Star,
  MessageSquare,
  Check,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Briefcase,
  Code2,
  Users
} from 'lucide-react';
import { useAuth, UserProfile } from '../context/AuthContext';

interface UserAuthMenuProps {
  onOpenInquiries?: () => void;
}

export default function UserAuthMenu({ onOpenInquiries }: UserAuthMenuProps) {
  const { user, profile, loading, signIn, signOut, updateRoleAndBio, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserProfile['role']>('visitor');
  const [bioInput, setBioInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      setSelectedRole(profile.role || 'visitor');
      setBioInput(profile.bio || '');
    }
  }, [profile]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignIn = async () => {
    if (isSigningIn) return;
    setErrorMsg(null);
    setIsPopupBlocked(false);
    setIsSigningIn(true);
    try {
      await signIn();
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked')) {
        setIsPopupBlocked(true);
      } else if (err?.code !== 'auth/cancelled-popup-request' && err?.code !== 'auth/popup-closed-by-user') {
        const msg = err instanceof Error ? err.message : 'Google sign-in could not be completed.';
        setErrorMsg(msg);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateRoleAndBio(selectedRole, bioInput);
      setIsEditingRole(false);
    } catch (err) {
      console.warn('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const starredCount = profile?.starredProjects?.length ?? 0;

  if (loading) {
    return (
      <div className="h-8 w-20 bg-black/10 dark:bg-white/10 animate-pulse rounded-xl" />
    );
  }

  if (!user) {
    return (
      <div className="relative">
        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 hover:border-[#FFD000] text-[#050505] dark:text-[#FFFFFF] transition-all disabled:opacity-70 group cursor-pointer"
          title="Sign in with Google to bookmark projects and track inquiries"
        >
          {isSigningIn ? (
            <div className="w-3.5 h-3.5 border-2 border-[#050505]/30 dark:border-white/30 border-t-[#FFD000] rounded-full animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          )}
          <span>{isSigningIn ? 'Connecting...' : 'Sign In'}</span>
        </button>

        {isPopupBlocked && (
          <div className="absolute top-full mt-2 right-0 w-72 p-3 bg-[#FFFFFF] dark:bg-[#101010] border border-[#FFD000]/50 text-[#050505] dark:text-[#FFFFFF] text-xs rounded-xl shadow-2xl z-50">
            <div className="font-semibold flex items-center space-x-1.5 text-[#050505] dark:text-[#FFD000] mb-1">
              <span>Pop-up Blocked</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#525252] dark:text-[#A1A1A1] mb-2">
              Your browser prevented the Google Sign-In window. Please allow pop-ups for this site, or open the portfolio in a new tab.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-black/10 dark:border-white/10">
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#050505] dark:text-[#FFD000] underline"
              >
                Open in New Window ↗
              </a>
              <button
                onClick={() => setIsPopupBlocked(false)}
                className="text-[10px] text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF] px-1.5 py-0.5 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="absolute top-full mt-2 right-0 w-64 p-2 bg-[#101010] border border-[#FFD000]/40 text-[#FFFFFF] text-[11px] rounded-lg shadow-xl z-50">
            {errorMsg}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 pl-1.5 pr-2 rounded-full border border-black/10 dark:border-white/12 hover:border-[#FFD000] bg-[#FAFAFA] dark:bg-[#101010] transition-all group cursor-pointer"
        aria-label="User Account Menu"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-[#FFD000]/60"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#FFD000] text-[#050505] flex items-center justify-center text-xs font-bold">
            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
          </div>
        )}
        <span className="text-xs font-medium text-[#050505] dark:text-[#FFFFFF] max-w-[90px] truncate hidden sm:inline">
          {user.displayName?.split(' ')[0] || 'Account'}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[#525252] dark:text-[#A1A1A1] group-hover:text-[#FFD000] transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#FFFFFF] dark:bg-[#101010] border border-black/10 dark:border-white/12 shadow-2xl p-4 text-left z-50 overflow-hidden"
          >
            {/* Header / Avatar */}
            <div className="flex items-start space-x-3 pb-3 border-b border-black/10 dark:border-white/10">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#FFD000]/60"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#FFD000] text-[#050505] flex items-center justify-center text-sm font-bold">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <h4 className="text-xs font-bold text-[#050505] dark:text-[#FFFFFF] truncate">
                    {user.displayName || 'Visitor'}
                  </h4>
                  {isAdmin && (
                    <span className="inline-flex items-center px-1.5 py-0.5 bg-[#FFD000] text-[#050505] text-[9px] font-mono font-bold rounded">
                      <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                      OWNER
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#525252] dark:text-[#A1A1A1] truncate">
                  {user.email}
                </p>
                <div className="mt-1 flex items-center space-x-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#FFD000] animate-pulse" />
                  <span className="text-[10px] font-mono text-[#050505] dark:text-[#FFD000] font-semibold uppercase">
                    {profile?.role || 'Visitor'}
                  </span>
                </div>
              </div>
            </div>

            {/* Role & Persona Settings */}
            <div className="py-3 border-b border-black/10 dark:border-white/10">
              {!isEditingRole ? (
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-[#525252] dark:text-[#A1A1A1]">
                    <span className="font-semibold text-[#050505] dark:text-[#FFFFFF]">Role: </span>
                    <span className="capitalize">{profile?.role || 'Visitor'}</span>
                    {profile?.bio && (
                      <p className="text-[10px] text-[#525252] dark:text-[#A1A1A1] italic mt-0.5 truncate">
                        "{profile.bio}"
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsEditingRole(true)}
                    className="text-[10px] font-mono font-bold text-[#050505] dark:text-[#FFD000] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-[#525252] dark:text-[#A1A1A1] font-bold uppercase">
                    Your Persona:
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserProfile['role'])}
                    className="w-full text-xs p-1.5 rounded-lg border border-black/10 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#171717] text-[#050505] dark:text-[#FFFFFF]"
                  >
                    <option value="recruiter">Recruiter / Talent Partner</option>
                    <option value="developer">Software Engineer / Tech Lead</option>
                    <option value="collaborator">Project Collaborator</option>
                    <option value="visitor">Portfolio Visitor</option>
                  </select>
                  <input
                    type="text"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="Short note or company (optional)"
                    maxLength={100}
                    className="w-full text-xs p-1.5 rounded-lg border border-black/10 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#171717] text-[#050505] dark:text-[#FFFFFF]"
                  />
                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      onClick={() => setIsEditingRole(false)}
                      className="text-[10px] text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-2.5 py-1 text-[10px] font-bold rounded bg-[#FFD000] text-[#050505] hover:brightness-105 cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions / Activity */}
            <div className="py-2 space-y-1">
              <a
                href="#projects"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-[#050505] dark:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-[#171717] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Star className="w-3.5 h-3.5 text-[#FFD000] fill-[#FFD000]/30" />
                  <span>Starred Projects</span>
                </div>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-[#171717] text-[#050505] dark:text-[#FFD000]">
                  {starredCount}
                </span>
              </a>

              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenInquiries) {
                    onOpenInquiries();
                  } else {
                    const el = document.getElementById('contact');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-[#050505] dark:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-[#171717] transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#FFD000]" />
                  <span>Inquiries Portal</span>
                </div>
                <span className="text-[10px] font-mono text-[#050505] dark:text-[#FFD000] font-bold">
                  View
                </span>
              </button>

              <a
                href="#testimonials"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-[#050505] dark:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-[#171717] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD000]" />
                  <span>Visitor Guestbook</span>
                </div>
                <span className="text-[10px] font-mono text-[#050505] dark:text-[#FFD000] font-bold">
                  Sign
                </span>
              </a>
            </div>

            {/* Sign Out */}
            <div className="pt-2 mt-1 border-t border-black/10 dark:border-white/10">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-[#171717] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Trash2,
  LogIn,
  CheckCircle2,
  Clock,
  Heart,
  User,
  ShieldCheck
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, serverTimestamp } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export interface GuestbookRecord {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  userEmail?: string;
  message: string;
  createdAt?: {
    toDate?: () => Date;
    seconds?: number;
  } | string;
}

export default function Guestbook() {
  const { user, profile, signIn, isAdmin } = useAuth();
  const [entries, setEntries] = useState<GuestbookRecord[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInNotice, setSignInNotice] = useState<string | null>(null);

  const handleGuestbookSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    setSignInNotice(null);
    try {
      await signIn();
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked')) {
        setSignInNotice('Pop-up blocked by browser. Please enable pop-ups or open portfolio in a new tab.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    const gbPath = 'guestbook';
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: GuestbookRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<GuestbookRecord, 'id'>),
          });
        });
        setEntries(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, gbPath);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorNotice('Please sign in with Google below to leave a community endorsement.');
      return;
    }

    const trimmed = messageText.trim();
    if (trimmed.length < 3) {
      setErrorNotice('Message must be at least 3 characters.');
      return;
    }
    if (trimmed.length > 500) {
      setErrorNotice('Message cannot exceed 500 characters.');
      return;
    }

    setSubmitting(true);
    setErrorNotice(null);

    const entryId = `gb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const path = `guestbook/${entryId}`;

    const newEntry: Record<string, unknown> = {
      id: entryId,
      userId: user.uid,
      userName: user.displayName || 'Portfolio Visitor',
      message: trimmed,
      createdAt: serverTimestamp(),
    };

    if (user.photoURL) {
      newEntry.userPhoto = user.photoURL;
    }
    if (user.email) {
      newEntry.userEmail = user.email;
    }

    try {
      await setDoc(doc(db, 'guestbook', entryId), newEntry);
      setMessageText('');
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!user) return;
    const path = `guestbook/${entryId}`;
    try {
      await deleteDoc(doc(db, 'guestbook', entryId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const formatTimestamp = (val?: GuestbookRecord['createdAt']) => {
    if (!val) return 'Just now';
    if (typeof val === 'object' && 'toDate' in val && typeof val.toDate === 'function') {
      return val.toDate().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return 'Recently';
  };

  return (
    <div className="space-y-8 text-left">
      {/* Submission Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 relative z-10 flex-wrap gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-[#FFD000]/15 border border-[#FFD000]/40 text-[#050505] dark:text-[#FFD000]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#050505] dark:text-[#FFFFFF] font-display tracking-wide">
              Leave a Peer Endorsement / Guestbook Note
            </h4>
          </div>
          <span className="text-[10px] font-mono text-[#050505] dark:text-[#FFD000] bg-[#FFD000]/15 border border-[#FFD000]/40 px-2.5 py-0.5 rounded uppercase tracking-wider">
            Verified Firestore Sync
          </span>
        </div>

        {user ? (
          <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
            <div className="flex items-center space-x-2 text-xs text-[#525252] dark:text-[#A1A1A1] mb-1">
              <span>Posting as:</span>
              <span className="font-semibold text-[#050505] dark:text-[#FFFFFF]">
                {user.displayName || user.email}
              </span>
              {profile?.role && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/5 dark:bg-[#171717] border border-black/10 dark:border-white/12 text-[#050505] dark:text-[#FFD000]">
                  {profile.role}
                </span>
              )}
            </div>

            <div className="relative">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Share your feedback, endorsement, or congratulatory note for Shiwanshu..."
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/12 bg-white dark:bg-[#050505] focus:border-[#FFD000] focus:outline-none text-[#050505] dark:text-[#FFFFFF] placeholder-[#525252] dark:placeholder-[#A1A1A1]/60 resize-none font-sans transition-all"
              />
              <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-[#525252] dark:text-[#A1A1A1]">
                {messageText.length}/500
              </span>
            </div>

            {errorNotice && (
              <p className="text-xs text-[#050505] dark:text-[#FFD000] font-mono">{errorNotice}</p>
            )}

            {successNotice && (
              <p className="text-xs text-[#050505] dark:text-[#FFD000] flex items-center space-x-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Your endorsement has been added to the verified registry!</span>
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || messageText.trim().length < 3}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#FFD000] hover:brightness-105 text-[#050505] font-bold text-xs font-mono tracking-wider transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'TRANSMITTING...' : 'TRANSMIT ENDORSEMENT'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="py-4 px-5 rounded-xl bg-white dark:bg-[#050505] border border-black/10 dark:border-white/12 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#050505] dark:text-[#FFFFFF] font-display">
                  Authenticated Visitor Endorsements
                </p>
                <p className="text-[11px] text-[#525252] dark:text-[#A1A1A1] mt-0.5">
                  Sign in with Google to attach your verified identity to the community registry.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGuestbookSignIn}
                disabled={isSigningIn}
                className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold font-mono tracking-wider rounded-xl bg-[#FFD000] hover:brightness-105 text-[#050505] transition-all shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {isSigningIn ? (
                  <div className="w-3.5 h-3.5 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-3.5 h-3.5" />
                )}
                <span>{isSigningIn ? 'CONNECTING...' : 'SIGN IN WITH GOOGLE'}</span>
              </button>
            </div>
            {signInNotice && (
              <div className="mt-3 pt-2.5 border-t border-black/10 dark:border-white/10 text-[11px] text-[#050505] dark:text-[#FFD000] flex items-center justify-between flex-wrap gap-2">
                <span>{signInNotice}</span>
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-[#050505] dark:text-[#FFD000]"
                >
                  Open in Tab ↗
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#525252] dark:text-[#A1A1A1] uppercase tracking-widest font-mono flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FFD000] animate-pulse inline-block" />
            <span>Community & Peer Endorsements ({entries.length})</span>
          </h4>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-[#FFD000] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center p-6 rounded-2xl border border-dashed border-black/15 dark:border-white/15 text-[#525252] dark:text-[#A1A1A1] text-xs font-mono">
            No community guestbook notes yet. Be the first to leave a verified endorsement!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry) => {
              const isOwner = user?.uid === entry.userId;
              const canDelete = isOwner || isAdmin;

              return (
                <div
                  key={entry.id}
                  className="p-5 rounded-2xl bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 hover:border-[#FFD000]/50 transition-all flex flex-col justify-between space-y-3 relative group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        {entry.userPhoto ? (
                          <img
                            src={entry.userPhoto}
                            alt={entry.userName}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#FFD000]/50"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#FFD000]/15 border border-[#FFD000]/40 text-[#050505] dark:text-[#FFD000] flex items-center justify-center text-xs font-bold font-mono">
                            {entry.userName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-[#050505] dark:text-[#FFFFFF] flex items-center space-x-1.5">
                            <span>{entry.userName}</span>
                            {entry.userEmail === 'shiwanshusingh153@gmail.com' && (
                              <span className="text-[9px] font-mono text-[#050505] bg-[#FFD000] px-1.5 rounded uppercase font-bold">
                                OWNER
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[#525252] dark:text-[#A1A1A1]">
                            {formatTimestamp(entry.createdAt)}
                          </span>
                        </div>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-1 text-[#525252] dark:text-[#A1A1A1] hover:text-[#FFD000] transition-colors cursor-pointer"
                          title="Delete endorsement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-[#050505]/90 dark:text-[#FFFFFF]/90 leading-relaxed font-sans italic">
                      "{entry.message}"
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-[#525252] dark:text-[#A1A1A1]">
                    <span className="text-[#050505] dark:text-[#FFD000] flex items-center space-x-1">
                      <Heart className="w-3 h-3 fill-[#FFD000] text-[#FFD000]" />
                      <span>Verified Peer</span>
                    </span>
                    <span className="text-[9px] text-[#525252] dark:text-[#A1A1A1]">Firebase Auth</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

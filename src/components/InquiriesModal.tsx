import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  User,
  Trash2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export interface UserMessage {
  id: string;
  userId: string;
  name: string;
  email: string;
  message: string;
  status: 'sent' | 'read' | 'replied';
  createdAt?: {
    toDate?: () => Date;
    seconds?: number;
  } | string;
}

interface InquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiriesModal({ isOpen, onClose }: InquiriesModalProps) {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<UserMessage | null>(null);

  useEffect(() => {
    if (!isOpen || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const messagesPath = `users/${user.uid}/messages`;
    const messagesCol = collection(db, 'users', user.uid, 'messages');
    const q = query(messagesCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: UserMessage[] = [];
        snapshot.forEach((docSnap) => {
          list.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<UserMessage, 'id'>)
          });
        });
        setMessages(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, messagesPath);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen, user]);

  const handleDelete = async (msgId: string) => {
    if (!user) return;
    const path = `users/${user.uid}/messages/${msgId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'messages', msgId));
      if (activeMessage?.id === msgId) {
        setActiveMessage(null);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleUpdateStatus = async (msgId: string, newStatus: 'sent' | 'read' | 'replied') => {
    if (!user || !isAdmin) return;
    const path = `users/${user.uid}/messages/${msgId}`;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'messages', msgId), {
        status: newStatus
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const formatMessageDate = (val?: UserMessage['createdAt']) => {
    if (!val) return 'Just now';
    if (typeof val === 'object' && 'toDate' in val && typeof val.toDate === 'function') {
      return val.toDate().toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'Recently';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#101010] rounded-2xl border border-black/10 dark:border-white/12 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#FFD000]/15 text-[#050505] dark:text-[#FFD000] border border-[#FFD000]/40">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-[#050505] dark:text-[#FFFFFF]">
                    My Inquiry & Placement Messages
                  </h3>
                  <p className="text-xs text-[#525252] dark:text-[#A1A1A1]">
                    Track delivery status of direct inquiries sent to Shiwanshu
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-2 border-[#FFD000] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-[#525252] dark:text-[#A1A1A1] font-mono">
                    Querying secure Firestore messages...
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#FAFAFA] dark:bg-[#171717] border border-black/10 dark:border-white/12 flex items-center justify-center text-[#525252] dark:text-[#A1A1A1]">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#050505] dark:text-[#FFFFFF]">
                    No inquiries submitted yet
                  </h4>
                  <p className="text-xs text-[#525252] dark:text-[#A1A1A1] max-w-sm mx-auto">
                    When you send a message through the contact form below, your inquiry history and delivery status will appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-xl border border-black/10 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#171717] hover:border-[#FFD000]/50 transition-all space-y-2 text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full ${
                              msg.status === 'replied'
                                ? 'bg-[#FFD000] text-[#050505]'
                                : msg.status === 'read'
                                ? 'bg-[#FFD000]/20 text-[#050505] dark:text-[#FFD000] border border-[#FFD000]/40'
                                : 'bg-black/5 dark:bg-white/10 text-[#525252] dark:text-[#A1A1A1] border border-black/10 dark:border-white/12'
                            }`}
                          >
                            ● {msg.status}
                          </span>
                          <span className="text-[11px] font-mono text-[#525252] dark:text-[#A1A1A1]">
                            {formatMessageDate(msg.createdAt)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-1 text-[#525252] dark:text-[#A1A1A1] hover:text-[#FFD000] rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          title="Delete message from record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs font-semibold text-[#050505] dark:text-[#FFFFFF]">
                        {msg.name} ({msg.email})
                      </div>

                      <p className="text-xs text-[#050505]/90 dark:text-[#FFFFFF]/90 whitespace-pre-wrap leading-relaxed bg-white dark:bg-[#050505] p-3 rounded-lg border border-black/10 dark:border-white/10 font-sans">
                        {msg.message}
                      </p>

                      {isAdmin && (
                        <div className="pt-2 flex items-center space-x-2">
                          <span className="text-[10px] text-[#525252] dark:text-[#A1A1A1] font-mono">
                            Owner Status:
                          </span>
                          {(['sent', 'read', 'replied'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateStatus(msg.id, st)}
                              className={`text-[10px] px-2 py-0.5 rounded capitalize font-mono cursor-pointer ${
                                msg.status === st
                                  ? 'bg-[#FFD000] text-[#050505] font-bold'
                                  : 'bg-black/5 dark:bg-[#101010] text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF]'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#FAFAFA] dark:bg-[#101010] border-t border-black/10 dark:border-white/10 flex justify-between items-center text-xs text-[#525252] dark:text-[#A1A1A1]">
              <span className="text-[11px] font-mono">
                Stored in Firestore with Zero-Trust Security Rules
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-[#FFD000] hover:brightness-105 text-[#050505] font-bold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

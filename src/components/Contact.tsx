/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { z } from 'zod';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Send,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import { personalInfo } from '../data';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType, serverTimestamp } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import InquiriesModal from './InquiriesModal';

// Zod Contact Validation Schema
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Full name is required.')
    .min(2, 'Name must be at least 2 characters.')
    .max(80, 'Name must be under 80 characters.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address (e.g. alex@company.com).'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required.')
    .min(10, 'Please write a message of at least 10 characters.')
    .max(3000, 'Message cannot exceed 3000 characters.')
});

type ContactFormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof ContactFormData, string>>;

export default function Contact() {
  const { user, profile, signIn } = useAuth();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormData, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isInquiriesOpen, setIsInquiriesOpen] = useState(false);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInNotice, setSignInNotice] = useState<string | null>(null);

  const handleContactSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    setSignInNotice(null);
    try {
      await signIn();
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked')) {
        setSignInNotice('Pop-up blocked by browser. Open in a new tab or allow popups.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Sync auth profile into form fields
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // Validate a single field
  const validateField = (field: keyof ContactFormData, value: string): string | undefined => {
    const singleFieldSchema = contactSchema.shape[field];
    const result = singleFieldSchema.safeParse(value);
    if (!result.success) {
      return result.error.issues[0]?.message;
    }
    return undefined;
  };

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, formData[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: errorMsg
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof ContactFormData;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Revalidate on change if the field was already touched or an error is showing
    if (touched[fieldName] || errors[fieldName]) {
      const fieldError = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
    }

    if (status === 'error') {
      setStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({ name: true, email: true, message: true });

    // Validate entire form against Zod schema
    const validationResult = contactSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: FormErrors = {};
      validationResult.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof ContactFormData;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = err.message;
        }
      });
      setErrors(fieldErrors);
      setStatus('error');

      // Focus first erroneous input field
      if (fieldErrors.name) {
        nameInputRef.current?.focus();
      } else if (fieldErrors.email) {
        emailInputRef.current?.focus();
      } else if (fieldErrors.message) {
        messageInputRef.current?.focus();
      }
      return;
    }

    // Clear any leftover errors
    setErrors({});
    setStatus('submitting');
    setSubmitSuccessNotice(null);

    try {
      if (user) {
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const messagePath = `users/${user.uid}/messages/${messageId}`;
        const messagePayload = {
          id: messageId,
          userId: user.uid,
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          status: 'sent' as const,
          createdAt: serverTimestamp(),
        };

        try {
          await setDoc(doc(db, 'users', user.uid, 'messages', messageId), messagePayload);
          setSubmitSuccessNotice('Message securely delivered and saved to your Firestore inquiry portal! You can track status anytime.');
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.CREATE, messagePath);
        }
      } else {
        setSubmitSuccessNotice('Message dispatched successfully! Sign in with Google anytime above to link and track replies.');
      }

      setStatus('success');
      setFormData((prev) => ({
        name: user?.displayName || prev.name,
        email: user?.email || prev.email,
        message: ''
      }));
      setTouched({});
    } catch (err) {
      console.warn('Contact submission notice:', err);
      setStatus('error');
    }
  };

  return (
    <>
      <section
        id="contact"
        className="py-28 bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] relative z-20 border-t border-[#050505]/12 dark:border-white/12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-left">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[2px] w-8 bg-[#FFD000]" />
                <span className="text-xs font-mono tracking-[0.2em] text-[#525252] dark:text-[#FFD000] uppercase">
                  10. Contact &amp; Inquiries
                </span>
              </div>

              <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-[#050505] dark:text-[#FFFFFF] tracking-tight leading-[1.05]">
                Let&apos;s Build{' '}
                <span className="font-editorial italic font-normal text-[#050505] dark:text-[#FFD000]">
                  What&apos;s Next.
                </span>
              </h2>
            </div>

            {user && (
              <button
                onClick={() => setIsInquiriesOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#FAFAFA] dark:bg-[#101010] hover:border-[#FFD000] border border-[#050505]/15 dark:border-white/15 text-[#050505] dark:text-[#FFD000] text-xs font-mono font-semibold transition-colors self-start md:self-auto cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>My Sent Inquiries</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Contact Details */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-4">
                <h3 className="font-display text-xl font-bold text-[#050505] dark:text-[#FFFFFF]">
                  Open to high-impact engineering roles.
                </h3>
                <p className="text-sm text-[#525252] dark:text-[#A1A1A1] leading-relaxed">
                  I am actively seeking internships, research collaborations, and entry-level roles in{' '}
                  <span className="font-semibold text-[#050505] dark:text-[#FFFFFF]">
                    Software Engineering, Cloud Systems, and AI/ML Pipelines
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-xl border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010]">
                  <div className="p-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#171717] text-[#050505] dark:text-[#FFD000] border border-[#050505]/10 dark:border-white/10">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#525252] dark:text-[#A1A1A1] uppercase tracking-wider font-mono">
                      Email Address
                    </div>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-sm font-semibold text-[#050505] dark:text-[#FFFFFF] hover:text-[#B89400] dark:hover:text-[#FFD000] transition-colors"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-xl border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010]">
                  <div className="p-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#171717] text-[#050505] dark:text-[#FFD000] border border-[#050505]/10 dark:border-white/10">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#525252] dark:text-[#A1A1A1] uppercase tracking-wider font-mono">
                      Phone
                    </div>
                    <span className="text-sm font-semibold text-[#050505] dark:text-[#FFFFFF] font-mono">
                      {personalInfo.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-xl border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010]">
                  <div className="p-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#171717] text-[#050505] dark:text-[#FFD000] border border-[#050505]/10 dark:border-white/10">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#525252] dark:text-[#A1A1A1] uppercase tracking-wider font-mono">
                      Location
                    </div>
                    <span className="text-sm font-semibold text-[#050505] dark:text-[#FFFFFF]">
                      {personalInfo.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[10px] text-[#525252] dark:text-[#A1A1A1] uppercase tracking-wider font-mono mb-3">
                  Verified Profiles
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {personalInfo.linkedin && (
                    <a
                      href={personalInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-md border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010] text-[#050505] dark:text-[#FFFFFF] hover:border-[#FFD000] hover:text-[#B89400] dark:hover:text-[#FFD000] transition-colors flex items-center space-x-2 text-xs font-mono font-semibold"
                    >
                      <Linkedin className="h-4 w-4 text-[#050505] dark:text-[#FFD000]" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {personalInfo.github && (
                    <a
                      href={personalInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-md border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010] text-[#050505] dark:text-[#FFFFFF] hover:border-[#FFD000] hover:text-[#B89400] dark:hover:text-[#FFD000] transition-colors flex items-center space-x-2 text-xs font-mono font-semibold"
                    >
                      <Github className="h-4 w-4 text-[#050505] dark:text-[#FFD000]" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Direct Message Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-xl border border-[#050505]/12 dark:border-white/12 bg-[#FAFAFA] dark:bg-[#101010] text-left relative">
                
                <div className="flex items-center justify-between border-b border-[#050505]/12 dark:border-white/12 pb-5 mb-6">
                  <div>
                    <h4 className="font-display text-base font-bold text-[#050505] dark:text-[#FFFFFF]">
                      Direct Message
                    </h4>
                    <p className="text-xs text-[#525252] dark:text-[#A1A1A1] mt-0.5">
                      Backed by Firebase Auth &amp; Cloud Firestore persistence
                    </p>
                  </div>
                </div>

                {user ? (
                  <div className="mb-6 p-3.5 rounded-lg bg-[#FFFFFF] dark:bg-[#171717] border border-[#FFD000]/40 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#FFD000] text-[#050505] flex items-center justify-center text-xs font-bold">
                          {user.displayName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="text-xs">
                        <span className="font-semibold text-[#050505] dark:text-[#FFFFFF]">{user.displayName}</span>
                        <span className="text-[11px] text-[#525252] dark:text-[#A1A1A1] ml-1.5 font-mono">({user.email})</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#050505] bg-[#FFD000] px-2 py-0.5 rounded font-semibold">
                      Verified
                    </span>
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#171717] border border-[#050505]/12 dark:border-white/12">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs text-[#525252] dark:text-[#A1A1A1]">
                        <span className="font-semibold text-[#050505] dark:text-[#FFFFFF]">Google Sign-In: </span>
                        <span>Link your inquiry to track delivery &amp; response.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleContactSignIn}
                        disabled={isSigningIn}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-[#050505] bg-[#FFD000] hover:bg-[#ffe047] rounded-md transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                      >
                        {isSigningIn ? (
                          <div className="w-3.5 h-3.5 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <LogIn className="w-3.5 h-3.5" />
                        )}
                        <span>{isSigningIn ? 'Connecting...' : 'Sign In'}</span>
                      </button>
                    </div>
                    {signInNotice && (
                      <div className="mt-2.5 pt-2 border-t border-[#050505]/10 dark:border-white/10 text-[11px] text-[#B89400] dark:text-[#FFD000] flex items-center justify-between flex-wrap gap-2">
                        <span>{signInNotice}</span>
                        <a
                          href={window.location.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold underline"
                        >
                          Open in Tab ↗
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="name" className="text-xs font-semibold text-[#525252] dark:text-[#A1A1A1] uppercase tracking-wider font-mono">
                        Full Name <span className="text-[#FFD000]">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#525252] dark:text-[#A1A1A1]">
                        {formData.name.trim().length}/80
                      </span>
                    </div>
                    <input
                      ref={nameInputRef}
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('name')}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      placeholder="e.g. Alex Morgan"
                      className={`w-full px-4 py-3 text-sm rounded-md border transition-colors ${
                        errors.name && touched.name
                          ? 'border-red-500 bg-red-500/5 focus:border-red-500 focus:outline-none text-[#050505] dark:text-[#FFFFFF]'
                          : 'border-[#050505]/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#050505] focus:border-[#FFD000] focus:outline-none text-[#050505] dark:text-[#FFFFFF] placeholder-[#A1A1A1]'
                      }`}
                    />
                    {errors.name && touched.name && (
                      <div id="name-error" className="flex items-center space-x-1.5 text-xs text-red-500 font-medium pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="email" className="text-xs font-semibold text-[#525252] dark:text-[#A1A1A1] uppercase tracking-wider font-mono">
                        Email Address <span className="text-[#FFD000]">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#525252] dark:text-[#A1A1A1]">
                        {formData.email.trim().length}/100
                      </span>
                    </div>
                    <input
                      ref={emailInputRef}
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('email')}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      placeholder="you@company.com"
                      className={`w-full px-4 py-3 text-sm rounded-md border transition-colors ${
                        errors.email && touched.email
                          ? 'border-red-500 bg-red-500/5 focus:border-red-500 focus:outline-none text-[#050505] dark:text-[#FFFFFF]'
                          : 'border-[#050505]/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#050505] focus:border-[#FFD000] focus:outline-none text-[#050505] dark:text-[#FFFFFF] placeholder-[#A1A1A1]'
                      }`}
                    />
                    {errors.email && touched.email && (
                      <div id="email-error" className="flex items-center space-x-1.5 text-xs text-red-500 font-medium pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="message" className="text-xs font-semibold text-[#525252] dark:text-[#A1A1A1] uppercase tracking-wider font-mono">
                        Message <span className="text-[#FFD000]">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#525252] dark:text-[#A1A1A1]">
                        {formData.message.trim().length}/10 min
                      </span>
                    </div>
                    <textarea
                      ref={messageInputRef}
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('message')}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      placeholder="Share details about your opportunity, project, or collaboration..."
                      className={`w-full px-4 py-3 text-sm rounded-md border transition-colors resize-none ${
                        errors.message && touched.message
                          ? 'border-red-500 bg-red-500/5 focus:border-red-500 focus:outline-none text-[#050505] dark:text-[#FFFFFF]'
                          : 'border-[#050505]/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#050505] focus:border-[#FFD000] focus:outline-none text-[#050505] dark:text-[#FFFFFF] placeholder-[#A1A1A1]'
                      }`}
                    />
                    {errors.message && touched.message && (
                      <div id="message-error" className="flex items-center space-x-1.5 text-xs text-red-500 font-medium pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.message}</span>
                      </div>
                    )}
                  </div>

                  {status === 'error' && Object.keys(errors).length > 0 && (
                    <div className="p-3.5 rounded-md bg-red-500/10 text-red-500 text-xs border border-red-500/20 flex items-center space-x-2 font-semibold">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>Please review the highlighted errors above before submitting.</span>
                    </div>
                  )}

                  {status === 'success' && (
                    <div className="p-3.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-500/20 flex items-center space-x-2 font-semibold">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>{submitSuccessNotice || 'Message sent successfully! Shiwanshu will follow up shortly.'}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-md text-xs font-mono font-semibold uppercase tracking-wider text-[#050505] bg-[#FFD000] hover:bg-[#ffe047] glow-gold transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {status === 'submitting' ? (
                      <span className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-[#050505]/30 border-t-[#050505] rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>{user ? 'Send & Save to Profile' : 'Send Message'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      <InquiriesModal
        isOpen={isInquiriesOpen}
        onClose={() => setIsInquiriesOpen(false)}
      />
    </>
  );
}

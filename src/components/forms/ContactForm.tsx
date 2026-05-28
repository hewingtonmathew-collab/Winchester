"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const roles = ["Headteacher", "Deputy Head", "DSL", "DPO", "ICT Manager", "SBM", "Governor", "MAT Director", "LA Officer", "Other"];
const subjects = ["General enquiry", "Book a readiness review", "Platform access", "Press / media", "Partnership", "Other"];

type FormState = { name: string; email: string; organisation: string; role: string; subject: string; message: string; consent: boolean };
const initial: FormState = { name: "", email: "", organisation: "", role: "", subject: "", message: "", consent: false };

export default function ContactForm({ className }: { className?: string }) {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof FormState, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "A valid email address is required";
    if (!form.message.trim()) e.message = "Please include a message";
    if (!form.consent) e.consent = "Please confirm you have read our privacy policy";
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setSuccess(true);
  };

  const fieldCls = "field-glass w-full px-4 py-3 text-body-sm rounded-lg";
  const labelCls = "block text-body-sm text-on-surface-variant mb-1.5";
  const errCls = "mt-1 text-[11px] text-error";

  if (success) {
    return (
      <div className={cn("glass-panel rounded-xl p-8 text-center", className)} role="status" aria-live="polite">
        <div className="w-14 h-14 rounded-full bg-rag-green/10 border border-rag-green/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-rag-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-headline-md font-semibold text-on-surface mb-2">Message sent</h3>
        <p className="text-body-md text-on-surface-variant max-w-sm mx-auto">
          Thank you for getting in touch. We aim to respond to all enquiries within 2 working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-label="Contact SafeShield" className={cn("space-y-5", className)}>
      <div>
        <label htmlFor="cf-name" className={labelCls}>Name <span className="text-error" aria-hidden="true">*</span></label>
        <input id="cf-name" type="text" autoComplete="name" className={fieldCls} value={form.name} onChange={e => set("name", e.target.value)} />
        {errors.name && <p role="alert" className={errCls}>{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="cf-email" className={labelCls}>Email address <span className="text-error" aria-hidden="true">*</span></label>
        <input id="cf-email" type="email" autoComplete="email" className={fieldCls} value={form.email} onChange={e => set("email", e.target.value)} />
        {errors.email && <p role="alert" className={errCls}>{errors.email}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-org" className={labelCls}>Organisation</label>
          <input id="cf-org" type="text" autoComplete="organization" className={fieldCls} value={form.organisation} onChange={e => set("organisation", e.target.value)} />
        </div>
        <div>
          <label htmlFor="cf-role" className={labelCls}>Your role</label>
          <select id="cf-role" className={fieldCls} value={form.role} onChange={e => set("role", e.target.value)}>
            <option value="">Select…</option>
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="cf-subject" className={labelCls}>Subject</label>
        <select id="cf-subject" className={fieldCls} value={form.subject} onChange={e => set("subject", e.target.value)}>
          <option value="">Select…</option>
          {subjects.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="cf-message" className={labelCls}>Message <span className="text-error" aria-hidden="true">*</span></label>
        <textarea id="cf-message" rows={5} className={cn(fieldCls, "resize-none")} placeholder="Tell us how we can help…" value={form.message} onChange={e => set("message", e.target.value)} />
        {errors.message && <p role="alert" className={errCls}>{errors.message}</p>}
      </div>
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required checked={form.consent} onChange={e => set("consent", e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-outline-variant bg-surface-low text-primary focus:ring-primary/50 flex-shrink-0" />
          <span className="text-body-sm text-on-surface-variant">
            I agree to SafeShield&apos;s{" "}
            <a href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary-tint transition-colors">privacy policy</a>.{" "}
            <span className="text-error" aria-hidden="true">*</span>
          </span>
        </label>
        {errors.consent && <p role="alert" className={errCls}>{errors.consent}</p>}
      </div>
      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? (
          <>
            <svg className="w-4 h-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending…
          </>
        ) : "Send message"}
      </button>
    </form>
  );
}

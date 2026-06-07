"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  className?: string;
  variant?: "full" | "compact";
}

const jobTitles = ["Headteacher", "Deputy Head", "DSL", "DPO", "ICT Manager", "SBM", "Governor", "MAT Director", "LA Officer", "Other"];
const schoolTypes = ["Single academy", "Multi-academy trust", "Local authority maintained", "Independent school", "Other"];
const pupilRanges = ["Under 200", "200–500", "500–1,000", "1,000–2,000", "Over 2,000"];
const contactMethods = ["Email", "Phone call", "Video call"];
const concernAreas = [
  "Digital safeguarding",
  "Cyber security",
  "GDPR and DPIAs",
  "AI governance",
  "Filtering and monitoring",
  "Accessibility and SEND",
  "Governor oversight",
];

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  organisation: string;
  schoolType: string;
  pupils: string;
  concerns: string[];
  contactMethod: string;
  message: string;
  consent: boolean;
};

const initial: FormState = {
  firstName: "", lastName: "", email: "", jobTitle: "",
  organisation: "", schoolType: "", pupils: "", concerns: [],
  contactMethod: "Email", message: "", consent: false,
};

export default function BookingForm({ className, variant = "full" }: BookingFormProps) {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field: keyof FormState, value: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleConcern = (area: string) => {
    set("concerns", form.concerns.includes(area)
      ? form.concerns.filter((c) => c !== area)
      : [...form.concerns, area]);
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "A valid email address is required";
    if (!form.organisation.trim()) e.organisation = "Organisation name is required";
    if (!form.consent) e.consent = "Please confirm you have read our privacy policy";
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className={cn("glass-panel rounded-xl p-8 text-center", className)}>
        <div className="w-14 h-14 rounded-full bg-rag-green/10 border border-rag-green/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-rag-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-headline-md font-semibold text-on-surface mb-2">Request received</h3>
        <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
          Thank you for requesting a SafeShield Readiness Review. A member of our team will be in touch within 2 working days.
        </p>
      </div>
    );
  }

  const fieldClass = "field-glass w-full px-4 py-3 text-body-sm rounded-lg";
  const labelClass = "block text-body-sm text-on-surface-variant mb-1.5";
  const errorClass = "mt-1 text-[11px] text-error";

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label="Book a Readiness Review"
      className={cn("space-y-6", className)}
    >
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="bf-firstName" className={labelClass}>First name <span className="text-error" aria-hidden="true">*</span></label>
          <input id="bf-firstName" type="text" autoComplete="given-name" required className={fieldClass}
            value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
          {errors.firstName && <p role="alert" className={errorClass}>{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="bf-lastName" className={labelClass}>Last name <span className="text-error" aria-hidden="true">*</span></label>
          <input id="bf-lastName" type="text" autoComplete="family-name" required className={fieldClass}
            value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
          {errors.lastName && <p role="alert" className={errorClass}>{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="bf-email" className={labelClass}>Email address <span className="text-error" aria-hidden="true">*</span></label>
        <input id="bf-email" type="email" autoComplete="email" required className={fieldClass}
          value={form.email} onChange={(e) => set("email", e.target.value)} />
        {errors.email && <p role="alert" className={errorClass}>{errors.email}</p>}
      </div>

      {/* Job title + Org */}
      {variant === "full" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bf-jobTitle" className={labelClass}>Job title</label>
            <select id="bf-jobTitle" className={fieldClass}
              value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)}>
              <option value="">Select…</option>
              {jobTitles.map((j) => <option key={j}>{j}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="bf-org" className={labelClass}>Organisation <span className="text-error" aria-hidden="true">*</span></label>
            <input id="bf-org" type="text" autoComplete="organization" required className={fieldClass}
              value={form.organisation} onChange={(e) => set("organisation", e.target.value)} />
            {errors.organisation && <p role="alert" className={errorClass}>{errors.organisation}</p>}
          </div>
        </div>
      )}

      {variant === "compact" && (
        <div>
          <label htmlFor="bf-org-c" className={labelClass}>Organisation <span className="text-error" aria-hidden="true">*</span></label>
          <input id="bf-org-c" type="text" autoComplete="organization" required className={fieldClass}
            value={form.organisation} onChange={(e) => set("organisation", e.target.value)} />
          {errors.organisation && <p role="alert" className={errorClass}>{errors.organisation}</p>}
        </div>
      )}

      {variant === "full" && (
        <>
          {/* School type + Pupils */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bf-type" className={labelClass}>School / trust type</label>
              <select id="bf-type" className={fieldClass}
                value={form.schoolType} onChange={(e) => set("schoolType", e.target.value)}>
                <option value="">Select…</option>
                {schoolTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="bf-pupils" className={labelClass}>Approximate number of pupils</label>
              <select id="bf-pupils" className={fieldClass}
                value={form.pupils} onChange={(e) => set("pupils", e.target.value)}>
                <option value="">Select…</option>
                {pupilRanges.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Concern areas */}
          <fieldset>
            <legend className={labelClass}>Which areas are you most concerned about?</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {concernAreas.map((area) => (
                <label key={area} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.concerns.includes(area)}
                    onChange={() => toggleConcern(area)}
                    className="w-4 h-4 rounded border-outline-variant bg-surface-low text-primary focus:ring-primary/50"
                  />
                  <span className="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                    {area}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Contact method */}
          <fieldset>
            <legend className={labelClass}>Preferred contact method</legend>
            <div className="flex flex-wrap gap-4 mt-2">
              {contactMethods.map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value={m}
                    checked={form.contactMethod === m}
                    onChange={() => set("contactMethod", m)}
                    className="w-4 h-4 border-outline-variant bg-surface-low text-primary focus:ring-primary/50"
                  />
                  <span className="text-body-sm text-on-surface-variant">{m}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}

      {/* Message */}
      <div>
        <label htmlFor="bf-message" className={labelClass}>
          {variant === "full" ? "Anything else we should know?" : "Brief message"}
        </label>
        <textarea id="bf-message" rows={4} className={cn(fieldClass, "resize-none")}
          placeholder="Tell us about your school context, any specific concerns, or questions you have…"
          value={form.message} onChange={(e) => set("message", e.target.value)} />
      </div>

      {/* Consent */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={form.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-outline-variant bg-surface-low text-primary focus:ring-primary/50 flex-shrink-0"
          />
          <span className="text-body-sm text-on-surface-variant">
            I agree to SafeShield&apos;s{" "}
            <a href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary-tint transition-colors">
              privacy policy
            </a>{" "}
            and understand my information will be used to arrange a readiness review. <span className="text-error" aria-hidden="true">*</span>
          </span>
        </label>
        {errors.consent && <p role="alert" className={errorClass}>{errors.consent}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <svg className="w-4 h-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Submitting…
          </>
        ) : (
          "Request Your Readiness Review"
        )}
      </button>
    </form>
  );
}

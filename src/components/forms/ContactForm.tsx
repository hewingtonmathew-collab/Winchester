"use client";

import { useFormState } from "react-dom";
import { contactAction, type ContactState } from "@/app/actions";
import SubmitButton from "./SubmitButton";
import GlassCard from "@/components/ui/GlassCard";
import { CheckCircle, AlertCircle } from "lucide-react";

const initialState: ContactState = {
  success: false,
  message: "",
  errors: {},
};

const inputCls =
  "bg-[rgba(11,17,24,0.6)] border border-[#2A3340] rounded-lg px-4 py-3 font-inter text-white text-sm placeholder-[#4a5568] focus:outline-none focus:border-[rgba(201,168,76,0.5)] transition-colors w-full";
const labelCls =
  "font-inter text-[#A7B1BE] text-xs tracking-wider uppercase";

export default function ContactForm() {
  const [state, formAction] = useFormState(contactAction, initialState);

  if (state.success) {
    return (
      <GlassCard className="flex flex-col items-center text-center gap-6 py-14">
        <CheckCircle
          size={48}
          className="text-[#C9A84C]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <h3 className="font-cinzel font-bold text-white text-xl">
          Message Sent
        </h3>
        <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed max-w-sm">
          {state.message}
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="flex flex-col gap-5">
      <h2 className="font-cinzel font-bold text-white text-2xl mb-2">
        Send a Message
      </h2>

      <form action={formAction} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className={labelCls}>
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              className={inputCls}
              aria-describedby={state.errors?.name ? "name-error" : undefined}
            />
            {state.errors?.name && (
              <p
                id="name-error"
                role="alert"
                className="font-inter text-red-400 text-xs flex items-center gap-1"
              >
                <AlertCircle size={11} aria-hidden="true" />
                {state.errors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={labelCls}>
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@school.ac.uk"
              className={inputCls}
              aria-describedby={state.errors?.email ? "email-error" : undefined}
            />
            {state.errors?.email && (
              <p
                id="email-error"
                role="alert"
                className="font-inter text-red-400 text-xs flex items-center gap-1"
              >
                <AlertCircle size={11} aria-hidden="true" />
                {state.errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="organisation" className={labelCls}>
            Organisation{" "}
            <span className="normal-case text-[#4a5568]">(optional)</span>
          </label>
          <input
            id="organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            placeholder="Oakwood Academy Trust"
            className={inputCls}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className={labelCls}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Tell us about your compliance challenge or how we can help…"
            className={`${inputCls} resize-none`}
            aria-describedby={state.errors?.message ? "message-error" : undefined}
          />
          {state.errors?.message && (
            <p
              id="message-error"
              role="alert"
              className="font-inter text-red-400 text-xs flex items-center gap-1"
            >
              <AlertCircle size={11} aria-hidden="true" />
              {state.errors.message}
            </p>
          )}
        </div>

        {state.message && !state.success && (
          <p role="alert" className="font-inter text-red-400 text-sm">
            {state.message}
          </p>
        )}

        <SubmitButton />
      </form>
    </GlassCard>
  );
}

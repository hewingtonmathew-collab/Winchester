"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg
        bg-[rgba(27,36,48,0.9)] border border-[#2A3340] text-white font-inter font-medium text-sm tracking-wide
        hover:bg-[#2A3340] hover:border-[rgba(201,168,76,0.5)] transition-all duration-200 mt-2
        disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 size={15} className="animate-spin" aria-hidden="true" />
          Sending…
        </>
      ) : (
        <>
          Send Message
          <ArrowRight size={15} aria-hidden="true" />
        </>
      )}
    </button>
  );
}

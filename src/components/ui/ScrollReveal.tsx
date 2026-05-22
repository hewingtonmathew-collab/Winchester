"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Use a lower threshold (e.g. 0.05) for tall sections */
  threshold?: number;
};

export default function ScrollReveal({ children, className, threshold = 0.12 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    const targets = container.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-scale");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

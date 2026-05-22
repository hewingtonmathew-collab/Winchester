export type TrustItem = {
  icon: "award" | "users" | "target" | "lock";
  value?: string;
  label: string;
  sub: string;
};

export const trustItems: TrustItem[] = [
  {
    icon: "award",
    value: "16+",
    label: "Years Combined Experience",
    sub: "SBM & ICT leadership in schools",
  },
  {
    icon: "users",
    label: "Trusted by Schools & Trusts",
    sub: "Strong relationships across the sector",
  },
  {
    icon: "target",
    label: "Focused on Outcomes",
    sub: "Practical solutions. Measurable impact.",
  },
  {
    icon: "lock",
    label: "Secure. Compliant. Responsible.",
    sub: "Information governance at the heart of all we do.",
  },
];

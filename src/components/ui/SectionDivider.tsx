import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function SectionDivider({ className }: Props) {
  return <hr className={cn("divider-gold w-full border-0", className)} aria-hidden="true" />;
}

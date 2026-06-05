import {
  Shield,
  Columns2,
  Cpu,
  BarChart2,
  Users,
  Lock,
  Database,
  Briefcase,
  HeartPulse,
} from "lucide-react";
import type { ServiceIconName } from "@/data/services";

type Props = {
  name: ServiceIconName;
  size?: number;
  className?: string;
};

const iconMap: Record<ServiceIconName, React.ElementType> = {
  shield: Shield,
  columns: Columns2,
  cpu: Cpu,
  "bar-chart": BarChart2,
  users: Users,
  lock: Lock,
  database: Database,
  briefcase: Briefcase,
  "heart-pulse": HeartPulse,
  "bar-chart-2": BarChart2,
};

export default function ServiceIcon({ name, size = 20, className }: Props) {
  const Icon = iconMap[name];
  return (
    <Icon
      size={size}
      className={className ?? "text-[#C9A84C]"}
      strokeWidth={1.5}
      aria-hidden="true"
    />
  );
}

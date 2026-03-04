import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: LucideIcon;
}

const StatCard = ({ label, value, change, changeType, icon: Icon }: StatCardProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:glow-primary">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 stat-number text-3xl text-foreground">{value}</p>
          <p className={`mt-1 text-xs font-medium ${
            changeType === "up" ? "text-success" : changeType === "down" ? "text-destructive" : "text-muted-foreground"
          }`}>
            {change}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;

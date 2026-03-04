import { Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const tryOns = [
  { id: "TRY-4821", user: "Sarah Chen", brand: "Zara", status: "completed", time: "2s ago", latency: "4.2s" },
  { id: "TRY-4820", user: "James Miller", brand: "Gucci", status: "completed", time: "15s ago", latency: "6.1s" },
  { id: "TRY-4819", user: "Amira Patel", brand: "H&M", status: "processing", time: "20s ago", latency: "—" },
  { id: "TRY-4818", user: "Luca Rossi", brand: "Fendi", status: "failed", time: "1m ago", latency: "—" },
  { id: "TRY-4817", user: "Emma Wilson", brand: "Uniqlo", status: "completed", time: "2m ago", latency: "3.8s" },
  { id: "TRY-4816", user: "David Kim", brand: "Nike", status: "completed", time: "3m ago", latency: "5.5s" },
];

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  processing: { icon: Loader2, color: "text-warning", bg: "bg-warning/10" },
  failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

const RecentTryOns = () => {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Try-Ons</h3>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" /> Live
        </span>
      </div>
      <div className="divide-y divide-border">
        {tryOns.map((item) => {
          const config = statusConfig[item.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          return (
            <div key={item.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className={`flex h-7 w-7 items-center justify-center rounded-md ${config.bg}`}>
                  <StatusIcon className={`h-3.5 w-3.5 ${config.color} ${item.status === "processing" ? "animate-spin" : ""}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.user}</p>
                  <p className="text-xs text-muted-foreground">{item.brand}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs text-muted-foreground">{item.id}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.time}</span>
                  {item.latency !== "—" && (
                    <span className="font-mono text-primary">{item.latency}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTryOns;

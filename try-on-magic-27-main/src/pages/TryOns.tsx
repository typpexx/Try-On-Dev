import { useMemo, useState } from "react";
import { Search, Filter, CheckCircle2, XCircle, Loader2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const tryOnData = [
  { id: "TRY-4821", user: "Sarah Chen", email: "sarah@email.com", brand: "Zara", item: "Oversized Blazer", status: "completed", latency: "4.2s", date: "2026-02-16 14:32" },
  { id: "TRY-4820", user: "James Miller", email: "james@email.com", brand: "Gucci", item: "Silk Shirt", status: "completed", latency: "6.1s", date: "2026-02-16 14:31" },
  { id: "TRY-4819", user: "Amira Patel", email: "amira@email.com", brand: "H&M", item: "Denim Jacket", status: "processing", latency: "—", date: "2026-02-16 14:30" },
  { id: "TRY-4818", user: "Luca Rossi", email: "luca@email.com", brand: "Fendi", item: "Cashmere Coat", status: "failed", latency: "—", date: "2026-02-16 14:29" },
  { id: "TRY-4817", user: "Emma Wilson", email: "emma@email.com", brand: "Uniqlo", item: "Puffer Vest", status: "completed", latency: "3.8s", date: "2026-02-16 14:27" },
  { id: "TRY-4816", user: "David Kim", email: "david@email.com", brand: "Nike", item: "Track Jacket", status: "completed", latency: "5.5s", date: "2026-02-16 14:25" },
  { id: "TRY-4815", user: "Sofia Garcia", email: "sofia@email.com", brand: "Zara", item: "Midi Dress", status: "completed", latency: "4.9s", date: "2026-02-16 14:22" },
  { id: "TRY-4814", user: "Alex Turner", email: "alex@email.com", brand: "COS", item: "Wool Trousers", status: "completed", latency: "5.1s", date: "2026-02-16 14:20" },
];

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-success", label: "Completed" },
  processing: { icon: Loader2, color: "text-warning", label: "Processing" },
  failed: { icon: XCircle, color: "text-destructive", label: "Failed" },
};

const TryOns = () => {
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return tryOnData.filter((item) => {
      const byQuery = `${item.id} ${item.user} ${item.brand} ${item.item}`.toLowerCase().includes(query.toLowerCase());
      const byBrand = brandFilter === "all" || item.brand === brandFilter;
      const byStatus = statusFilter === "all" || item.status === statusFilter;
      return byQuery && byBrand && byStatus;
    });
  }, [query, brandFilter, statusFilter]);

  const exportCsv = () => {
    const header = "id,user,email,brand,item,status,latency,date";
    const rows = filtered.map((item) =>
      [item.id, item.user, item.email, item.brand, item.item, item.status, item.latency, item.date].join(","),
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "try-on-activity.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Try-On History</h1>
          <p className="mt-1 text-sm text-muted-foreground">All virtual try-on generations</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={exportCsv}>
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, user, or brand..."
            className="pl-9 bg-card border-border"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 rounded-md border px-3">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={brandFilter}
            onChange={(event) => setBrandFilter(event.target.value)}
            className="bg-transparent py-2 text-sm outline-none"
          >
            <option value="all">All brands</option>
            <option value="Zara">Zara</option>
            <option value="Gucci">Gucci</option>
            <option value="H&M">H&M</option>
            <option value="Fendi">Fendi</option>
            <option value="Uniqlo">Uniqlo</option>
            <option value="Nike">Nike</option>
            <option value="COS">COS</option>
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-md border px-3">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="bg-transparent py-2 text-sm outline-none"
          >
            <option value="all">All status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brand / Item</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Latency</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((item) => {
              const config = statusConfig[item.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              return (
                <tr key={item.id} className="transition-colors hover:bg-secondary/30">
                  <td className="px-5 py-3 font-mono text-sm text-primary">{item.id}</td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-foreground">{item.user}</p>
                    <p className="text-xs text-muted-foreground">{item.email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm text-foreground">{item.brand}</p>
                    <p className="text-xs text-muted-foreground">{item.item}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.color}`}>
                      <StatusIcon className={`h-3 w-3 ${item.status === "processing" ? "animate-spin" : ""}`} />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-sm text-muted-foreground">{item.latency}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{item.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TryOns;

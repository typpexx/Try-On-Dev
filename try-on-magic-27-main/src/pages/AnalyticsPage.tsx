import { useMemo, useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Input } from "@/components/ui/input";

const weeklyData = [
  { day: "Mon", tryOns: 4200, revenue: 1450 },
  { day: "Tue", tryOns: 5100, revenue: 1780 },
  { day: "Wed", tryOns: 4800, revenue: 1620 },
  { day: "Thu", tryOns: 6200, revenue: 2140 },
  { day: "Fri", tryOns: 7500, revenue: 2590 },
  { day: "Sat", tryOns: 8900, revenue: 3100 },
  { day: "Sun", tryOns: 6100, revenue: 2080 },
];

const brandShare = [
  { name: "Zara", value: 26 },
  { name: "Nike", value: 19 },
  { name: "Gucci", value: 18 },
  { name: "H&M", value: 13 },
  { name: "Others", value: 24 },
];

const affiliateClicks = [
  { brand: "Zara", clicks: 1540, estRevenue: 462, date: "2026-02-15" },
  { brand: "Gucci", clicks: 1024, estRevenue: 840, date: "2026-02-15" },
  { brand: "Fashion Nova", clicks: 1302, estRevenue: 286, date: "2026-02-14" },
  { brand: "Versace", clicks: 412, estRevenue: 302, date: "2026-02-14" },
  { brand: "Fendi", clicks: 388, estRevenue: 294, date: "2026-02-13" },
];

const COLORS = [
  "hsl(175, 70%, 50%)",
  "hsl(260, 60%, 60%)",
  "hsl(38, 90%, 55%)",
  "hsl(150, 60%, 45%)",
  "hsl(220, 14%, 30%)",
];

const tooltipStyle = {
  backgroundColor: "hsl(220, 18%, 10%)",
  border: "1px solid hsl(220, 14%, 18%)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(210, 20%, 92%)",
};

const AnalyticsPage = () => {
  const [brandFilter, setBrandFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const filteredAffiliate = useMemo(() => {
    return affiliateClicks.filter((item) => {
      const byBrand = brandFilter === "all" || item.brand === brandFilter;
      const byDate = !dateFilter || item.date === dateFilter;
      return byBrand && byDate;
    });
  }, [brandFilter, dateFilter]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform performance and insights</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Try-Ons */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Weekly Try-Ons</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="tryOns" fill="hsl(175, 70%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Brand Share */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Brand Share</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={brandShare} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                {brandShare.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {brandShare.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-mono text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(150, 60%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(150, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="revenue" stroke="hsl(150, 60%, 45%)" fill="url(#revGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">Affiliate Tracking</h3>
          <div className="flex gap-2">
            <select
              value={brandFilter}
              onChange={(event) => setBrandFilter(event.target.value)}
              className="rounded-md border bg-background px-2 py-1 text-xs"
            >
              <option value="all">All brands</option>
              <option value="Zara">Zara</option>
              <option value="Gucci">Gucci</option>
              <option value="Fashion Nova">Fashion Nova</option>
              <option value="Versace">Versace</option>
              <option value="Fendi">Fendi</option>
            </select>
            <Input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="h-8 w-[150px] text-xs"
            />
          </div>
        </div>
        <div className="space-y-2">
          {filteredAffiliate.map((row) => (
            <div key={`${row.brand}-${row.date}`} className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-3 py-2 text-sm">
              <span className="font-medium">{row.brand}</span>
              <span className="font-mono text-muted-foreground">{row.date}</span>
              <span>{row.clicks.toLocaleString()} clicks</span>
              <span className="font-semibold text-success">${row.estRevenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

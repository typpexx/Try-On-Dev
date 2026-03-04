import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", tryOns: 120, latency: 4.2 },
  { time: "04:00", tryOns: 45, latency: 3.8 },
  { time: "08:00", tryOns: 280, latency: 5.1 },
  { time: "12:00", tryOns: 520, latency: 6.8 },
  { time: "14:00", tryOns: 680, latency: 7.2 },
  { time: "16:00", tryOns: 590, latency: 5.9 },
  { time: "18:00", tryOns: 750, latency: 8.1 },
  { time: "20:00", tryOns: 430, latency: 4.5 },
  { time: "22:00", tryOns: 310, latency: 4.0 },
];

const PerformanceChart = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Try-On Volume (24h)</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Try-Ons</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tryOnGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(175, 70%, 50%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(175, 70%, 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" stroke="currentColor" strokeOpacity={0.2} />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 18%, 10%)",
              border: "1px solid hsl(220, 14%, 18%)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "hsl(210, 20%, 92%)",
            }}
          />
          <Area type="monotone" dataKey="tryOns" stroke="hsl(175, 70%, 50%)" fill="url(#tryOnGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;

import { Shirt, Users, Building2, Zap, Timer, TrendingUp } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import RecentTryOns from "@/components/admin/RecentTryOns";
import PerformanceChart from "@/components/admin/PerformanceChart";

const Dashboard = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Virtual Try-On platform overview</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Try-Ons" value="48,293" change="+12.5% vs last week" changeType="up" icon={Shirt} />
        <StatCard label="Active Users" value="3,842" change="+8.2% vs last week" changeType="up" icon={Users} />
        <StatCard label="Partner Brands" value="24" change="+3 this month" changeType="up" icon={Building2} />
        <StatCard label="Avg Latency" value="5.2s" change="-0.8s improvement" changeType="up" icon={Timer} />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PerformanceChart />
        </div>
        <div className="lg:col-span-2">
          <RecentTryOns />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">API Calls Today</h3>
          </div>
          <p className="mt-3 stat-number text-2xl text-foreground">12,847</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
            <div className="h-1.5 rounded-full gradient-primary" style={{ width: "64%" }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">64% of daily quota</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <h3 className="text-sm font-semibold text-foreground">Success Rate</h3>
          </div>
          <p className="mt-3 stat-number text-2xl text-foreground">97.3%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
            <div className="h-1.5 rounded-full bg-success" style={{ width: "97.3%" }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Target: 95%</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-foreground">GPU Utilization</h3>
          </div>
          <p className="mt-3 stat-number text-2xl text-foreground">78%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
            <div className="h-1.5 rounded-full bg-warning" style={{ width: "78%" }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">4x NVIDIA A100</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

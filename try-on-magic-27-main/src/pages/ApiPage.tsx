import { Copy, Eye, EyeOff, Globe, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ApiPage = () => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">API & Extensions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage API keys, SDK, and browser extension</p>
      </div>

      {/* API Key */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground">API Key</h3>
        <p className="mt-1 text-xs text-muted-foreground">Use this key to authenticate API requests</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 font-mono text-sm text-foreground">
            {showKey ? "tryon_sk_live_4f8a2b1c9d3e7f6a5b8c2d1e0f9a3b7c" : "tryon_sk_live_••••••••••••••••••••••••••••"}
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowKey(!showKey)} className="gap-2">
            {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showKey ? "Hide" : "Show"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
        </div>
      </div>

      {/* Integration Options */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">SDK Integration</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Embed the try-on widget directly into your brand's website with a simple script tag.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-secondary p-4">
            <code className="font-mono text-xs text-primary">
              {'<script src="https://cdn.tryon.ai/sdk/v1.js"></script>'}
            </code>
          </div>
          <Button variant="outline" size="sm" className="mt-4 gap-2">
            View Docs <Globe className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
            <Puzzle className="h-5 w-5 text-warning" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">Chrome Extension</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Adds a "Try This On" button to any fashion e-commerce site. Users can try on clothes from any product page.
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-secondary p-4">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">MVP Ready - v1.0.0 (load unpacked package)</span>
          </div>
          <Button variant="outline" size="sm" className="mt-4 gap-2">
            Download Package <Puzzle className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Webhook Config */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground">Webhooks</h3>
        <p className="mt-1 text-xs text-muted-foreground">Receive real-time events for try-on completions and failures</p>
        <div className="mt-4 space-y-3">
          {[
            { event: "try_on.completed", url: "https://api.brand.com/webhooks/tryon", status: "active" },
            { event: "try_on.failed", url: "https://api.brand.com/webhooks/errors", status: "active" },
          ].map((wh) => (
            <div key={wh.event} className="flex items-center justify-between rounded-lg border border-border bg-secondary px-4 py-3">
              <div>
                <p className="font-mono text-xs text-primary">{wh.event}</p>
                <p className="text-xs text-muted-foreground">{wh.url}</p>
              </div>
              <span className="inline-flex h-5 items-center rounded-full bg-success/10 px-2 text-[10px] font-semibold uppercase tracking-wider text-success">
                {wh.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiPage;

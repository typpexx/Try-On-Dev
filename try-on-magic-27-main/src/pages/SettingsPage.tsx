import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const SettingsPage = () => {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform configuration</p>
      </div>

      {/* General */}
      <section className="mb-8 rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">General</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Platform Name</label>
            <Input defaultValue="TryOn AI" className="mt-1 bg-secondary border-border" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Support Email</label>
            <Input defaultValue="support@tryon.ai" className="mt-1 bg-secondary border-border" />
          </div>
        </div>
      </section>

      {/* AI Settings */}
      <section className="mb-8 rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">AI Engine</h3>
        <div className="mt-4 space-y-5">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Primary AI API Key</label>
            <Input defaultValue="sk-live-demo-key" className="mt-1 bg-secondary border-border" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Try-On Endpoint</label>
            <Input defaultValue="https://api.tryon.ai/v1/generate" className="mt-1 bg-secondary border-border" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">High Quality Mode</p>
              <p className="text-xs text-muted-foreground">Better results, slower generation (~8s)</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Auto Retry on Failure</p>
              <p className="text-xs text-muted-foreground">Automatically retry failed generations</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">NSFW Filter</p>
              <p className="text-xs text-muted-foreground">Block inappropriate content</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="mb-8 rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Rate Limits</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Max Try-Ons Per User (Daily)</label>
            <Input type="number" defaultValue="50" className="mt-1 bg-secondary border-border w-32" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">API Rate Limit (req/min)</label>
            <Input type="number" defaultValue="100" className="mt-1 bg-secondary border-border w-32" />
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Extension Settings</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Active brand selectors JSON</label>
            <Textarea
              defaultValue={`{
  "zara": { "image": ".product-main img", "title": "h1", "price": ".price" },
  "gucci": { "image": ".product-gallery img", "title": "h1", "price": ".price" }
}`}
              className="mt-1 min-h-28 bg-secondary border-border font-mono text-xs"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Enable extension on inactive brands</p>
              <p className="text-xs text-muted-foreground">Use fallback selectors for unsupported pages</p>
            </div>
            <Switch />
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Storage & Retention</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">User photo retention (days)</label>
            <Input type="number" defaultValue="30" className="mt-1 bg-secondary border-border w-32" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Try-on history retention (days)</label>
            <Input type="number" defaultValue="90" className="mt-1 bg-secondary border-border w-32" />
          </div>
        </div>
      </section>

      <Button className="gradient-primary text-primary-foreground font-semibold">Save Changes</Button>
    </div>
  );
};

export default SettingsPage;

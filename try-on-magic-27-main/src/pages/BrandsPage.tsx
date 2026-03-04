import { useMemo, useState } from "react";
import { ExternalLink, Pencil, Plus, Power, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BrandItem = {
  id: string;
  name: string;
  url: string;
  affiliateLink: string;
  logoUrl: string;
  status: "active" | "inactive";
  productSelector: string;
  tryOns: number;
  clicks: number;
};

const seedBrands: BrandItem[] = [
  { id: "zara", name: "Zara", url: "https://www.zara.com", affiliateLink: "https://zara.com?ref=tryon", logoUrl: "ZA", status: "active", productSelector: ".product-main img", tryOns: 12430, clicks: 8142 },
  { id: "gucci", name: "Gucci", url: "https://www.gucci.com", affiliateLink: "https://gucci.com?utm=tryon", logoUrl: "GC", status: "active", productSelector: ".product-gallery img", tryOns: 8912, clicks: 6011 },
  { id: "fashion-nova", name: "Fashion Nova", url: "https://www.fashionnova.com", affiliateLink: "https://fashionnova.com?utm=tryon", logoUrl: "FN", status: "active", productSelector: ".product-main-image img", tryOns: 6204, clicks: 5220 },
  { id: "versace", name: "Versace", url: "https://www.versace.com", affiliateLink: "https://versace.com?utm=tryon", logoUrl: "VS", status: "inactive", productSelector: ".gallery img", tryOns: 2320, clicks: 1193 },
];

const BrandsPage = () => {
  const [brands, setBrands] = useState(seedBrands);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newBrandName, setNewBrandName] = useState("");

  const totals = useMemo(() => {
    const active = brands.filter((brand) => brand.status === "active").length;
    const tryOns = brands.reduce((acc, b) => acc + b.tryOns, 0);
    const clicks = brands.reduce((acc, b) => acc + b.clicks, 0);
    return { active, tryOns, clicks };
  }, [brands]);

  const updateBrand = (id: string, patch: Partial<BrandItem>) => {
    setBrands((current) => current.map((brand) => (brand.id === id ? { ...brand, ...patch } : brand)));
  };

  const deleteBrand = (id: string) => {
    setBrands((current) => current.filter((brand) => brand.id !== id));
  };

  const addBrand = () => {
    if (!newBrandName.trim()) return;
    const id = newBrandName.trim().toLowerCase().replace(/\s+/g, "-");
    setBrands((current) => [
      {
        id,
        name: newBrandName.trim(),
        url: "https://",
        affiliateLink: "https://",
        logoUrl: newBrandName.slice(0, 2).toUpperCase(),
        status: "inactive",
        productSelector: "img",
        tryOns: 0,
        clicks: 0,
      },
      ...current,
    ]);
    setNewBrandName("");
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brand Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add/edit/delete brands, affiliate links, and extension selectors</p>
        </div>
        <Button size="sm" className="gradient-primary text-primary-foreground font-semibold gap-2" onClick={addBrand}>
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Active Brands</p>
          <p className="mt-1 text-2xl font-bold">{totals.active}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Try-Ons</p>
          <p className="mt-1 text-2xl font-bold">{totals.tryOns.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Affiliate Clicks</p>
          <p className="mt-1 text-2xl font-bold">{totals.clicks.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4 max-w-sm">
        <Input
          value={newBrandName}
          onChange={(event) => setNewBrandName(event.target.value)}
          placeholder="New brand name"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {brands.map((brand) => (
          <div key={brand.id} className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:glow-primary">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-bold">
                    {brand.logoUrl}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{brand.name}</h3>
                </div>
              </div>
              <span className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider ${
                brand.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
              }`}>
                {brand.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Try-ons</p>
                <p className="font-mono text-lg font-bold text-foreground">{brand.tryOns.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Clicks</p>
                <p className="font-mono text-lg font-bold text-success">{brand.clicks.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-border pt-3">
              <Input value={brand.url} onChange={(event) => updateBrand(brand.id, { url: event.target.value })} />
              <Input
                value={brand.affiliateLink}
                onChange={(event) => updateBrand(brand.id, { affiliateLink: event.target.value })}
                placeholder="Affiliate URL"
              />
              <Input
                value={brand.productSelector}
                onChange={(event) => updateBrand(brand.id, { productSelector: event.target.value })}
                placeholder="Extension image selector"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="gap-1" onClick={() => setEditingId(brand.id)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => updateBrand(brand.id, { status: brand.status === "active" ? "inactive" : "active" })}
              >
                <Power className="h-3.5 w-3.5" />
                {brand.status === "active" ? "Deactivate" : "Activate"}
              </Button>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => deleteBrand(brand.id)}>
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
              <Button size="sm" variant="outline" className="gap-1" asChild>
                <a href={brand.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Visit
                </a>
              </Button>
            </div>
            {editingId === brand.id && (
              <p className="mt-3 inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                <Save className="h-3.5 w-3.5" />
                Changes saved locally
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsPage;

import { useMemo, useState } from "react";
import { ExternalLink, Filter, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getBrands, getAffiliateClicks, trackAffiliateClick } from "@/lib/platformStore";

const BrandHubPage = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "luxury" | "high-street" | "streetwear">("all");
  const brands = getBrands();
  const clicks = getAffiliateClicks();

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      if (category !== "all" && brand.category !== category) {
        return false;
      }
      return brand.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [brands, category, query]);

  const clicksByBrand = useMemo(() => {
    return clicks.reduce<Record<string, number>>((acc, item) => {
      acc[item.brandId] = (acc[item.brandId] ?? 0) + 1;
      return acc;
    }, {});
  }, [clicks]);

  const onVisit = (brandId: string, affiliateUrl: string) => {
    trackAffiliateClick(brandId, "brand-hub");
    window.open(affiliateUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Brand Hub</h1>
        <p className="text-muted-foreground">
          Browse popular fashion brands, redirect with affiliate tracking, and launch try-ons from one place.
        </p>
      </div>

      <div className="mb-8 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Active Brands</p>
          <p className="mt-1 text-2xl font-semibold">{brands.filter((brand) => brand.active).length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Tracked Clicks</p>
          <p className="mt-1 text-2xl font-semibold">{clicks.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Top Brand</p>
          <p className="mt-1 text-2xl font-semibold">
            {Object.keys(clicksByBrand).length > 0
              ? brands.find((b) => b.id === Object.entries(clicksByBrand).sort((a, b) => b[1] - a[1])[0][0])?.name ?? "N/A"
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search brands..."
          className="md:max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as typeof category)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="all">All categories</option>
            <option value="luxury">Luxury</option>
            <option value="high-street">High street</option>
            <option value="streetwear">Streetwear</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredBrands.map((brand) => (
          <Card key={brand.id} className="border-border">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {brand.logoText}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{brand.name}</CardTitle>
                    <p className="text-xs capitalize text-muted-foreground">{brand.category}</p>
                  </div>
                </div>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                  {brand.active ? "active" : "inactive"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-secondary/40 p-3 text-xs text-muted-foreground">
                Extension selectors configured:
                <ul className="mt-1 space-y-1 font-mono">
                  <li>image: {brand.selectors.productImage}</li>
                  <li>title: {brand.selectors.title}</li>
                  <li>price: {brand.selectors.price}</li>
                </ul>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Clicks tracked</span>
                <span className="font-semibold">{clicksByBrand[brand.id] ?? 0}</span>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 gap-2" onClick={() => onVisit(brand.id, brand.affiliateUrl)}>
                  <ExternalLink className="h-4 w-4" />
                  Visit Store
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={() => onVisit(brand.id, brand.websiteUrl)}>
                  <MousePointerClick className="h-4 w-4" />
                  Open Site
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BrandHubPage;

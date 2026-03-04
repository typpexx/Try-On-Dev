import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTryOnHistory, getBrands } from "@/lib/platformStore";

const TryOnHistoryPage = () => {
  const [query, setQuery] = useState("");
  const history = getTryOnHistory();
  const brands = getBrands();

  const rows = useMemo(() => {
    return history.filter((item) => {
      const brand = brands.find((b) => b.id === item.brandId);
      return (
        brand?.name.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase()) ||
        item.productImageUrl.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [history, query, brands]);

  const exportCsv = () => {
    const header = "id,brand,productImage,createdAt,status,bodyType";
    const lines = rows.map((item) => {
      const brand = brands.find((b) => b.id === item.brandId)?.name ?? item.brandId;
      return [item.id, brand, item.productImageUrl, item.createdAt, item.status, item.bodyType].join(",");
    });
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "try-on-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Try-On History</h1>
          <p className="mt-1 text-muted-foreground">Review previously generated outfits and export records.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportCsv}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search history..." className="mb-4 md:max-w-sm" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((item) => {
          const brand = brands.find((b) => b.id === item.brandId)?.name ?? item.brandId;
          return (
            <article key={item.id} className="rounded-xl border bg-card p-4">
              <img src={item.resultImageDataUrl} alt={`${brand} try on`} className="h-56 w-full rounded-md object-cover" />
              <div className="mt-3 space-y-1 text-sm">
                <p className="font-semibold">{brand}</p>
                <p className="text-xs text-muted-foreground">ID: {item.id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Body type: {item.bodyType}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default TryOnHistoryPage;

import { useMemo, useState, type ChangeEvent } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBrands, getProfile, saveTryOnRecord, type BodyType } from "@/lib/platformStore";
import { generateTryOnImage } from "@/lib/tryOnEngine";
import { useToast } from "@/hooks/use-toast";

const TryOnStudioPage = () => {
  const profile = getProfile();
  const brands = getBrands();
  const { toast } = useToast();
  const [brandId, setBrandId] = useState(brands[0]?.id ?? "");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [userPhotoUrl, setUserPhotoUrl] = useState(profile.photoDataUrl ?? "");
  const [resultImage, setResultImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedBrand = useMemo(() => brands.find((brand) => brand.id === brandId), [brandId, brands]);

  const onUserPhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUserPhotoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onGenerate = async () => {
    if (!productImageUrl || !userPhotoUrl || !selectedBrand) {
      toast({ title: "Missing data", description: "Add product image URL and user photo first." });
      return;
    }
    try {
      setIsGenerating(true);
      const output = await generateTryOnImage(userPhotoUrl, productImageUrl);
      setResultImage(output);
      saveTryOnRecord({
        id: crypto.randomUUID(),
        brandId: selectedBrand.id,
        productImageUrl,
        createdAt: new Date().toISOString(),
        resultImageDataUrl: output,
        bodyType: (profile.bodyType || "M") as BodyType,
        status: "completed",
      });
      toast({ title: "Try-on complete", description: `Generated with ${selectedBrand.name}.` });
    } catch (error) {
      toast({ title: "Generation failed", description: String(error), variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">AI Try-On Studio</h1>
      <p className="mt-2 text-muted-foreground">
        MVP flow: user photo + product image {"->"} body/cloth blend preview, then saved to history.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Input</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Brand</label>
              <select
                value={brandId}
                onChange={(event) => setBrandId(event.target.value)}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Product image URL</label>
              <Input
                value={productImageUrl}
                onChange={(event) => setProductImageUrl(event.target.value)}
                className="mt-2"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">User photo</label>
              <Input type="file" accept="image/*" onChange={onUserPhotoUpload} className="mt-2" />
            </div>
            <Button onClick={onGenerate} className="w-full gap-2" disabled={isGenerating}>
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Virtual Try-On"}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Output</h2>
          <div className="mt-4 flex min-h-[360px] items-center justify-center rounded-lg border border-dashed p-4">
            {resultImage ? (
              <img src={resultImage} alt="Generated try-on output" className="max-h-[520px] rounded-lg object-contain" />
            ) : (
              <p className="text-sm text-muted-foreground">Generate a result to preview your try-on.</p>
            )}
          </div>
          {selectedBrand && (
            <p className="mt-3 text-xs text-muted-foreground">
              Selector profile loaded for {selectedBrand.name}: {selectedBrand.selectors.productImage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TryOnStudioPage;

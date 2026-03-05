import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveProfile, getProfile, type BodyType } from "@/lib/platformStore";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const initial = getProfile();
  const [fullName, setFullName] = useState(initial.fullName);
  const [email, setEmail] = useState(initial.email);
  const [bodyType, setBodyType] = useState<BodyType>(initial.bodyType);
  const [heightCm, setHeightCm] = useState(initial.heightCm);
  const [weightKg, setWeightKg] = useState(initial.weightKg);
  const [photoDataUrl, setPhotoDataUrl] = useState(initial.photoDataUrl);
  const { toast } = useToast();

  const onPhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSave = () => {
    saveProfile({
      fullName,
      email,
      bodyType,
      heightCm,
      weightKg,
      photoDataUrl,
    });
    toast({ title: "Profile saved", description: "Your avatar and measurements are ready for try-on." });
  };

  return (
    <div className="container mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <p className="mt-2 text-muted-foreground">
        Upload your photo and body measurements for better virtual try-on personalization.
      </p>

      <div className="mt-8 rounded-xl border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">Full name</label>
            <Input value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Body type</label>
            <select
              value={bodyType}
              onChange={(event) => setBodyType(event.target.value as BodyType)}
              className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Height (cm)</label>
              <Input
                type="number"
                value={heightCm}
                onChange={(event) => setHeightCm(Number(event.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Weight (kg)</label>
              <Input
                type="number"
                value={weightKg}
                onChange={(event) => setWeightKg(Number(event.target.value))}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm text-muted-foreground">Profile photo</label>
          <Input type="file" accept="image/*" onChange={onPhotoUpload} className="mt-2" />
          {photoDataUrl && <img src={photoDataUrl} alt="Profile avatar" className="mt-4 h-56 w-44 rounded-lg object-cover" />}
        </div>

        <Button className="mt-6" onClick={onSave}>
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;

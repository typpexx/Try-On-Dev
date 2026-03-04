import { brandDirectory, type Brand } from "@/data/brands";

export type BodyType = "S" | "M" | "L";

export type UserProfile = {
  fullName: string;
  email: string;
  bodyType: BodyType;
  heightCm: number;
  weightKg: number;
  photoDataUrl?: string;
};

export type TryOnRecord = {
  id: string;
  brandId: string;
  productImageUrl: string;
  createdAt: string;
  resultImageDataUrl: string;
  bodyType: BodyType;
  status: "completed" | "failed";
};

export type AffiliateClick = {
  id: string;
  brandId: string;
  sessionId: string;
  source: "brand-hub" | "try-on-studio";
  clickedAt: string;
};

const PROFILE_KEY = "vf_profile";
const TRY_ON_KEY = "vf_try_on_history";
const CLICKS_KEY = "vf_affiliate_clicks";
const SESSION_KEY = "vf_session_id";

const defaultProfile: UserProfile = {
  fullName: "",
  email: "",
  bodyType: "M",
  heightCm: 170,
  weightKg: 65,
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSessionId() {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }
  const sessionId = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

export function getProfile() {
  return readJson<UserProfile>(PROFILE_KEY, defaultProfile);
}

export function saveProfile(profile: UserProfile) {
  writeJson(PROFILE_KEY, profile);
}

export function getTryOnHistory() {
  return readJson<TryOnRecord[]>(TRY_ON_KEY, []);
}

export function saveTryOnRecord(record: TryOnRecord) {
  const all = getTryOnHistory();
  writeJson(TRY_ON_KEY, [record, ...all].slice(0, 100));
}

export function getAffiliateClicks() {
  return readJson<AffiliateClick[]>(CLICKS_KEY, []);
}

export function trackAffiliateClick(brandId: string, source: AffiliateClick["source"]) {
  const event: AffiliateClick = {
    id: crypto.randomUUID(),
    brandId,
    source,
    sessionId: getSessionId(),
    clickedAt: new Date().toISOString(),
  };
  const all = getAffiliateClicks();
  writeJson(CLICKS_KEY, [event, ...all].slice(0, 500));
}

export function getBrands() {
  return brandDirectory;
}

export function getBrandById(brandId: string): Brand | undefined {
  return brandDirectory.find((b) => b.id === brandId);
}

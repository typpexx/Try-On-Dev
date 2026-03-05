const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_V1 = `${API_BASE}/api/v1`;

export type UserRole = "user" | "admin";
export type SubscriptionStatus = "starter" | "pro" | "enterprise";
export type UserStatus = "active" | "inactive" | "suspended";

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  api_key: string | null;
  subscription_status: SubscriptionStatus;
  body_type: "S" | "M" | "L";
  height_cm: number;
  weight_kg: number;
  photo_url: string | null;
  status: UserStatus;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface MessageResponse {
  message: string;
}

export async function register(
  email: string,
  password: string,
  fullName: string
): Promise<MessageResponse> {
  const res = await fetch(`${API_V1}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name: fullName }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Registration failed");
  }
  return res.json();
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_V1}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Invalid email or password");
  }
  return res.json();
}

export async function googleLogin(idToken: string): Promise<TokenResponse> {
  const res = await fetch(`${API_V1}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Google sign-in failed");
  }
  return res.json();
}

export async function getMe(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_V1}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Session expired");
  return res.json();
}

/** Create Stripe Checkout session for subscription. Returns redirect URL. Requires auth. */
export async function createCheckoutSession(
  token: string,
  options: { plan_id?: string; success_url?: string; cancel_url?: string } = {}
): Promise<{ url: string }> {
  if (!token) {
    throw new Error("Please sign in before starting checkout.");
  }
  const res = await fetch(`${API_V1}/payments/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(options),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Could not start checkout");
  }
  return res.json();
}

export { API_BASE, API_V1 };

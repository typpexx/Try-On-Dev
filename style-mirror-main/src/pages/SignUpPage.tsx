import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (res: { credential: string }) => void;
          }) => void;
          prompt: (callback?: (token: { id_token: string } | null) => void) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      toast({
        title: "Error",
        description: "Please fill in name, email, and password.",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Use at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password, fullName.trim());
      toast({ title: "Account created", description: "Welcome to TryOn.ai!" });
      navigate("/brands", { replace: true });
    } catch (err) {
      toast({
        title: "Sign up failed",
        description: err instanceof Error ? err.message : "Could not create account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    if (!GOOGLE_CLIENT_ID) {
      toast({
        title: "Google Sign-In not configured",
        description: "Set VITE_GOOGLE_CLIENT_ID in your environment.",
        variant: "destructive",
      });
      return;
    }
    if (!window.google?.accounts?.id) {
      toast({
        title: "Loading…",
        description: "Google Sign-In is loading. Try again in a moment.",
        variant: "destructive",
      });
      return;
    }
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (res) => {
        setLoading(true);
        try {
          await loginWithGoogle(res.credential);
          toast({ title: "Signed in", description: "Welcome to TryOn.ai!" });
          navigate("/brands", { replace: true });
        } catch (err) {
          toast({
            title: "Google sign-in failed",
            description: err instanceof Error ? err.message : "Something went wrong.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
    });
    window.google.accounts.id.prompt();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-md px-6 pt-24 pb-12">
        <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign up to save your profile and try-on history.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2"
                autoComplete="name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Sign up"}
            </Button>
          </form>

          {GOOGLE_CLIENT_ID && (
            <>
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={handleGoogleSignUp}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/sign-in" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

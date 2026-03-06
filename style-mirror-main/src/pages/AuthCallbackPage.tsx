import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const hash = window.location.hash?.slice(1) || "";
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      loginWithToken(accessToken)
        .then(() => navigate("/brands", { replace: true }))
        .catch(() => navigate("/sign-in", { replace: true }));
    } else {
      navigate("/sign-in", { replace: true });
    }
  }, [loginWithToken, navigate]);

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <p className="text-muted-foreground">Signing you in…</p>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createCheckoutSession } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    period: "14-day trial",
    description: "Perfect for testing the waters with your store.",
    features: [
      "100 try-ons per month",
      "Basic garment extraction",
      "Web widget integration",
      "Standard resolution output",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$15",
    period: "/month",
    description: "For growing brands ready to boost conversions.",
    features: [
      "10,000 try-ons per month",
      "Advanced AI fitting engine",
      "Chrome extension support",
      "HD resolution output",
      "Custom branding & white-label",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "tailored pricing",
    description: "For large-scale brands with high-volume needs.",
    features: [
      "Unlimited try-ons",
      "Dedicated GPU infrastructure",
      "Native SDK integration",
      "Ultra-HD output",
      "White-label everything",
      "Custom AI model training",
      "SLA & dedicated account manager",
      "On-premise deployment option",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const Pricing = () => {
  const { token, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoadingPlan, setIsLoadingPlan] = useState<string | null>(null);

  const handlePlanAction = async (planId: string) => {
    if (planId === "starter") {
      navigate(isAuthenticated ? "/try-on" : "/sign-up");
      return;
    }

    if (planId === "enterprise") {
      window.location.href = "mailto:sales@tryon.ai?subject=Enterprise%20Plan%20Inquiry";
      return;
    }

    if (!isAuthenticated || !token) {
      toast({
        title: "Sign in required",
        description: "Please sign in before upgrading to Pro.",
        variant: "destructive",
      });
      navigate("/sign-in");
      return;
    }

    setIsLoadingPlan(planId);
    try {
      const successUrl = `${window.location.origin}/profile?subscription=success`;
      const cancelUrl = `${window.location.origin}/#pricing`;
      const { url } = await createCheckoutSession(token, {
        plan_id: planId,
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      if (!url || (!url.startsWith("https://checkout.stripe.com/") && !url.startsWith("https://pay.stripe.com/"))) {
        throw new Error("Invalid checkout URL returned by server.");
      }
      window.location.assign(url);
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "Unable to start secure checkout.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPlan(null);
    }
  };

  return (
    <section className="py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Glow behind highlighted card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px] rounded-full bg-primary/6 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-4">
            Plans that{" "}
            <span className="text-gradient-gold">scale with you</span>
          </h2>
          <p className="text-muted-foreground font-body mt-4 max-w-lg mx-auto">
            Start free, upgrade when you're ready. No hidden fees — pay only for what you use.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary/50 bg-card glow-gold scale-[1.02]"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-block px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold font-display tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold font-display mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm font-body">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold font-display">{plan.price}</span>
                <span className="text-muted-foreground text-sm font-body ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm font-body">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-secondary-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePlanAction(plan.id)}
                disabled={isLoadingPlan === plan.id}
                className={`w-full py-3.5 rounded-lg font-display font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground glow-gold"
                    : "border border-border bg-secondary text-secondary-foreground hover:border-primary/40"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isLoadingPlan === plan.id ? "Redirecting..." : plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

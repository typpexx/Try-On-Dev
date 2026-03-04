import { motion } from "framer-motion";
import { Zap, Eye, Globe, ShieldCheck, Layers, Timer } from "lucide-react";

const features = [
  {
    icon: Timer,
    title: "Under 10 Seconds",
    description: "GPU-accelerated pipeline delivers realistic try-on results faster than any competitor.",
  },
  {
    icon: Eye,
    title: "Photorealistic Output",
    description: "Advanced diffusion models create wrinkle-accurate, lighting-matched clothing overlays.",
  },
  {
    icon: Globe,
    title: "Works With Any Brand",
    description: "Paste a URL from Zara, Gucci, H&M — our engine extracts and fits the garment.",
  },
  {
    icon: Layers,
    title: "Browser Extension",
    description: "Coming soon: a Chrome extension that adds 'Try On' buttons to any fashion site.",
  },
  {
    icon: Zap,
    title: "Brand SDK",
    description: "One script tag lets brands embed native try-on into their own e-commerce experience.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description: "Photos are processed in real-time and never stored. Your data stays yours.",
  },
];

const Features = () => {
  return (
    <section className="py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body">Features</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-4">
            Built for the future of{" "}
            <span className="text-gradient-gold">fashion</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-card p-7 hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold font-display mb-2">{feature.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

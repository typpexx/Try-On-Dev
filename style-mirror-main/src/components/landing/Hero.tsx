import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-tryon.jpg";

const MotionLink = motion(Link);

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Virtual try-on technology"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Gold glow accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[120px] animate-pulse-gold" />

      <div className="container relative z-10 mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-gold" />
            <span className="text-sm font-medium text-primary font-body">AI-Powered Virtual Try-On</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-display leading-[1.1] mb-6">
            Try before you{" "}
            <span className="text-gradient-gold">buy.</span>
            <br />
            <span className="text-muted-foreground">Virtually.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 font-body leading-relaxed">
            Upload your photo, pick any clothing from any brand — see yourself wearing it in under 10 seconds. Powered by cutting-edge AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <MotionLink
              to="/try-on"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg glow-gold transition-all"
            >
              Try It Now - Free
            </MotionLink>
            <MotionLink
              to="/brands"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-lg border border-border bg-secondary text-secondary-foreground font-display font-medium text-lg hover:border-primary/50 transition-all"
            >
              Browse Brands
            </MotionLink>
          </div>

          <div className="mt-14 flex items-center gap-8 text-muted-foreground text-sm font-body">
            <div className="flex items-center gap-2">
              <span className="text-primary font-semibold text-lg">&lt;10s</span>
              <span>Generation</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-primary font-semibold text-lg">Any</span>
              <span>Brand</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-primary font-semibold text-lg">AI</span>
              <span>Powered</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

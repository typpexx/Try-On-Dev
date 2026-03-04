import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionLink = motion(Link);

const CTA = () => {
  return (
    <section className="py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary/8 blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Ready to revolutionize{" "}
            <span className="text-gradient-gold">online shopping?</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg mb-10 leading-relaxed">
            Whether you're a shopper who wants to see before buying, or a brand looking to boost conversions — we've got you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MotionLink
              to="/try-on"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg glow-gold transition-all"
            >
              Start Try-On
            </MotionLink>
            <MotionLink
              to="/brands"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-lg border border-border bg-secondary text-secondary-foreground font-display font-medium text-lg hover:border-primary/50 transition-all"
            >
              Open Brand Hub
            </MotionLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;

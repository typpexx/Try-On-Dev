import { motion } from "framer-motion";

const brands = ["ZARA", "GUCCI", "FENDI", "H&M", "UNIQLO", "PRADA"];

const BrandsBar = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground text-sm tracking-widest uppercase font-body mb-12"
        >
          Designed to integrate with leading brands
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {brands.map((brand, i) => (
            <motion.span
              key={brand}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-2xl md:text-3xl font-display font-bold text-muted-foreground/30 hover:text-primary/60 transition-colors duration-300 cursor-default select-none"
            >
              {brand}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsBar;

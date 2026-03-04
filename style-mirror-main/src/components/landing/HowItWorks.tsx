import { motion } from "framer-motion";
import stepUpload from "@/assets/step-upload.jpg";
import stepSelect from "@/assets/step-select.jpg";
import stepResult from "@/assets/step-result.jpg";

const steps = [
  {
    number: "01",
    title: "Upload Your Photo",
    description: "Take a full-body photo or upload an existing one. Our AI detects your body shape and pose instantly.",
    image: stepUpload,
  },
  {
    number: "02",
    title: "Pick Any Clothing",
    description: "Upload a clothing image or paste a product URL from any fashion website. We extract the garment automatically.",
    image: stepSelect,
  },
  {
    number: "03",
    title: "See the Magic",
    description: "Our AI fits the clothing to your body with realistic wrinkles, lighting, and proportions — in seconds.",
    image: stepResult,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body">How it works</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-4">
            Three steps to your{" "}
            <span className="text-gradient-gold">perfect fit</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/40 transition-all duration-500"
            >
              <div className="absolute -top-4 left-8">
                <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold font-display">
                  {step.number}
                </span>
              </div>
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-6 bg-muted">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">{step.title}</h3>
              <p className="text-muted-foreground font-body leading-relaxed text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

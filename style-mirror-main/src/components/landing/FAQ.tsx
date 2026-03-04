import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the virtual try-on work?",
    answer:
      "Our AI analyzes your uploaded photo to detect your body shape, pose, and proportions. It then extracts the selected garment and realistically fits it onto your body — matching wrinkles, lighting, and shadows for a photorealistic result.",
  },
  {
    question: "What kind of photos should I upload?",
    answer:
      "For best results, upload a front-facing, full-body photo with good lighting and a simple background. Avoid heavily cropped images or photos with multiple people.",
  },
  {
    question: "Which brands and websites are supported?",
    answer:
      "You can try on clothing from any brand. Simply upload a clothing image or paste a product URL from sites like Zara, H&M, Gucci, ASOS, and more. Our AI extracts the garment automatically.",
  },
  {
    question: "How fast is the generation?",
    answer:
      "Most try-on results are generated in under 10 seconds thanks to our GPU-accelerated inference pipeline. Complex garments with intricate patterns may take a few seconds longer.",
  },
  {
    question: "Is my photo data stored or shared?",
    answer:
      "No. Your photos are processed in real-time and immediately discarded after generating the try-on result. We never store, share, or use your images for training purposes.",
  },
  {
    question: "How does brand integration work?",
    answer:
      "Brands can integrate our try-on technology via a simple SDK — just one script tag on your product pages. We also offer a Chrome extension for shoppers and a full white-label solution for enterprise clients.",
  },
];

const FAQ = () => {
  return (
    <section className="py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase font-body">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-4">
            Got{" "}
            <span className="text-gradient-gold">questions?</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border bg-card px-6 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-sm md:text-base hover:no-underline hover:text-primary transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-body text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;

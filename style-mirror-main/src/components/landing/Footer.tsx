const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm font-display font-bold text-gradient-gold">
          TryOn<span className="text-foreground">.ai</span>
        </span>
        <p className="text-muted-foreground text-xs font-body">
          © 2026 TryOn.ai — AI-Powered Virtual Try-On. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

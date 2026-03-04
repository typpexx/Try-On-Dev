import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-glass"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-display font-bold text-gradient-gold tracking-tight">
          TryOn<span className="text-foreground">.ai</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-body text-muted-foreground">
          <a href="/#how" className="hover:text-foreground transition-colors">How It Works</a>
          <Link to="/brands" className="hover:text-foreground transition-colors">Brand Hub</Link>
          <Link to="/try-on" className="hover:text-foreground transition-colors">Try-On Studio</Link>
          <Link to="/history" className="hover:text-foreground transition-colors">History</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border bg-secondary text-secondary-foreground hover:border-primary/40 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/profile" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-display font-semibold hover:opacity-90 transition-opacity">
            My Profile
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border bg-card px-6 py-4 flex flex-col gap-4"
        >
          <a href="/#how" className="text-sm text-muted-foreground hover:text-foreground">How It Works</a>
          <Link to="/brands" className="text-sm text-muted-foreground hover:text-foreground">Brand Hub</Link>
          <Link to="/try-on" className="text-sm text-muted-foreground hover:text-foreground">Try-On Studio</Link>
          <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground">History</Link>
          <button
            onClick={toggleTheme}
            className="w-full py-2 rounded-lg border border-border bg-secondary text-secondary-foreground text-sm font-display font-medium flex items-center justify-center gap-2"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          <Link to="/profile" className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-display font-semibold text-center">
            My Profile
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    try {
      googleLogout();
    } catch {
      // ignore if Google OAuth not loaded
    }
    logout();
    // Use window.location for redirect to avoid useNavigate outside router context
    window.location.href = "/";
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-glass"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-display font-bold text-gradient-gold tracking-tight">
          tryons<span className="text-foreground">.ai</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-body text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">How It Works</Link>
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
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-border">
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{user.full_name || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/sign-in" className="px-4 py-2 rounded-lg border border-border text-sm font-display font-medium hover:bg-secondary transition-colors">
                Sign in
              </Link>
              <Link to="/sign-up" className="px-4 py-2 rounded-lg border border-border text-sm font-display font-medium hover:bg-secondary transition-colors">
                Sign up
              </Link>
            </>
          )}
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
          {isAuthenticated && user ? (
            <>
              <Link to="/profile" className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-display font-semibold text-center">
                My Profile
              </Link>
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="w-full py-2 rounded-lg border border-destructive text-destructive text-sm font-display font-medium"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="w-full py-2 rounded-lg border border-border text-sm font-display font-medium text-center" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link to="/sign-up" className="w-full py-2 rounded-lg border border-border text-sm font-display font-medium text-center" onClick={() => setOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

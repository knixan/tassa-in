import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Hem" },
  { to: "/tjanster", label: "Tjänster" },
  { to: "/om-oss", label: "Om oss" },
  { to: "/boka", label: "Boka tid" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <PawPrint className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
          <span className="font-decorative text-4xl text-primary leading-none pt-2">
            Tassa in!
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-base font-semibold transition-colors ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="lg" variant="default" className="h-auto rounded-full px-6 py-3.5 gap-2 text-base font-semibold">
            <Link to="/boka">
              Boka tid nu!
              <PawPrint className="h-4 w-4" />
            </Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t border-border/60 bg-background px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === link.to
                  ? "bg-secondary text-primary"
                  : "text-foreground/80 hover:text-primary hover:bg-secondary/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

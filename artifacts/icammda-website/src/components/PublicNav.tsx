import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export default function PublicNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[hsl(222,47%,14%)] shadow-md" data-testid="public-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group" data-testid="nav-logo">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">IC</span>
            </div>
            <span className="text-white font-bold text-sm leading-tight hidden sm:block">
              ICAMMDA
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  location === l.href
                    ? "text-primary bg-primary/10"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/sign-in">
              <Button size="sm" variant="outline" className="ml-2 border-primary text-primary hover:bg-primary hover:text-white" data-testid="nav-admin-link">
                Admin
              </Button>
            </Link>
          </nav>

          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setOpen(!open)}
            data-testid="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[hsl(222,47%,12%)] border-t border-white/10 px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded text-sm font-medium ${
                location === l.href
                  ? "text-primary bg-primary/10"
                  : "text-slate-300 hover:text-white"
              }`}
              data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/sign-in" onClick={() => setOpen(false)}>
            <span className="block px-3 py-2 rounded text-sm font-medium text-primary hover:text-white hover:bg-primary/20">
              Admin Login
            </span>
          </Link>
        </div>
      )}
    </header>
  );
}

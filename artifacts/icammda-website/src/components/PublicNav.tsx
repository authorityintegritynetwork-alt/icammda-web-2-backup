import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export default function PublicNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled || open || !isHome
          ? "bg-[#07101e]/96 backdrop-blur-md border-b border-white/8 shadow-2xl shadow-black/30"
          : "bg-transparent"
      }`}
      data-testid="public-nav"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo — real ICAMMDA logo */}
          <Link href="/" className="flex items-center gap-3 group" data-testid="nav-logo">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors shrink-0">
              <img
                src="/icammda-logo-circle.png"
                alt="ICAMMDA"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm leading-none tracking-wider">ICAMMDA</p>
              <p className="text-white/35 text-[9px] leading-none tracking-widest uppercase mt-1">Federal University Oye-Ekiti</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location === l.href || location.startsWith(l.href + "/")
                    ? "text-cyan-400 bg-cyan-400/8"
                    : "text-white/65 hover:text-white hover:bg-white/6"
                }`}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              className="ml-4 px-4 py-2 rounded-lg text-sm font-semibold text-[#07101e] bg-cyan-400 hover:bg-cyan-300 transition-all duration-200"
              data-testid="nav-admin-link"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setOpen(!open)}
            data-testid="nav-mobile-toggle"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-white/8 bg-[#07101e]">
          <nav className="px-5 py-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location === l.href
                    ? "text-cyan-400 bg-cyan-400/10"
                    : "text-white/65 hover:text-white"
                }`}
                data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10">
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-cyan-400"
              >
                Admin Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

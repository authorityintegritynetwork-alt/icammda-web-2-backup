import { Link } from "wouter";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Our Team" },
  { href: "/contact", label: "Contact" },
];

export default function PublicFooter() {
  return (
    <footer className="bg-[#07101e] text-white relative overflow-hidden" data-testid="public-footer">
      {/* Subtle ambient — matches logo blue */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[250px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* CTA strip */}
        <div className="border-b border-white/8 py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="font-serif text-white text-3xl md:text-4xl leading-tight mb-2">
                Advancing public health<br />
                <span className="text-gradient">through science and data.</span>
              </h2>
              <p className="text-white/40 text-sm mt-3 max-w-md">
                Join ICAMMDA's growing network of researchers, institutions, and health partners working to build a healthier Africa.
              </p>
            </div>
            <Link href="/contact">
              <button className="group flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#07101e] font-bold px-6 py-3 rounded-xl transition-all duration-200 whitespace-nowrap text-sm">
                Get in Touch
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Main columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-400/25">
                <img src="/icammda-logo-circle.png" alt="ICAMMDA" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-bold text-base tracking-wide">ICAMMDA</p>
                <p className="text-white/25 text-[9px] tracking-widest uppercase">Federal University Oye-Ekiti</p>
              </div>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs">
              International Centre for Applied Mathematical Modelling and Data Analytics. A proud member of WAMCAD — West Africa Mathematical Modelling Capacity Development.
            </p>
            <p className="text-white/20 text-[10px] mt-4 italic tracking-wide">
              "Scientific Innovation with Character and Competence"
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-white/25 text-[10px] font-bold tracking-widest uppercase mb-5">Quick Links</p>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/45 text-sm hover:text-cyan-400 transition-colors" data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/25 text-[10px] font-bold tracking-widest uppercase mb-5">Contact</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={13} className="text-cyan-400/60 mt-0.5 shrink-0" />
                <span className="text-white/40 text-xs leading-relaxed">ICT Centre, Oye-Campus<br />Federal University Oye-Ekiti<br />Ekiti State, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={13} className="text-cyan-400/60 shrink-0" />
                <a href="tel:+2349016073157" className="text-white/40 text-xs hover:text-cyan-400 transition-colors">+234 901 607 3157</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={13} className="text-cyan-400/60 shrink-0" />
                <a href="mailto:info@icammda.org" className="text-white/40 text-xs hover:text-cyan-400 transition-colors">info@icammda.org</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-white/20">
          <p>&copy; {new Date().getFullYear()} ICAMMDA, Federal University Oye-Ekiti. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors" data-testid="footer-link-privacy">
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-white/15">·</span>
            <Link href="/terms" className="hover:text-cyan-400 transition-colors" data-testid="footer-link-terms">
              Terms of Use
            </Link>
            <span aria-hidden="true" className="text-white/15">·</span>
            <span>WAMCAD Member · Ekiti State, Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

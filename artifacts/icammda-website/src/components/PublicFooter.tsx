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
    <footer className="bg-[#0a0c14] text-white relative overflow-hidden" data-testid="public-footer">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Top CTA strip */}
        <div className="border-b border-white/10 py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-2">
                Advancing public health<br />
                <span className="text-gradient">through science and data.</span>
              </h2>
              <p className="text-white/50 text-sm mt-3 max-w-md">
                Join ICAMMDA's network of researchers, institutions, and health partners working to build a healthier Africa.
              </p>
            </div>
            <Link href="/contact">
              <button className="group flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-black font-semibold px-6 py-3 rounded-xl transition-all duration-200 whitespace-nowrap text-sm">
                Get in Touch
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Main footer columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500" />
                <span className="relative text-black font-bold text-sm z-10">IC</span>
              </div>
              <div>
                <p className="text-white font-bold text-base tracking-wide">ICAMMDA</p>
                <p className="text-white/30 text-[9px] tracking-widest uppercase">Federal University Oye-Ekiti</p>
              </div>
            </Link>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              International Centre for Applied Mathematical Modelling and Data Analytics. A proud member of WAMCAD — West Africa Mathematical Modelling Capacity Development.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-white/30 text-[10px] font-semibold tracking-widest uppercase mb-4">Quick Links</p>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/55 text-sm hover:text-teal-400 transition-colors" data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/30 text-[10px] font-semibold tracking-widest uppercase mb-4">Contact</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={13} className="text-teal-400 mt-0.5 shrink-0" />
                <span className="text-white/50 text-xs leading-relaxed">ICT Centre, Oye-Campus<br />Federal University Oye-Ekiti<br />Ekiti State, Nigeria</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={13} className="text-teal-400 shrink-0" />
                <a href="tel:+2349016073157" className="text-white/50 text-xs hover:text-teal-400 transition-colors">+234 901 607 3157</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={13} className="text-teal-400 shrink-0" />
                <a href="mailto:info@icammda.org" className="text-white/50 text-xs hover:text-teal-400 transition-colors">info@icammda.org</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <p>&copy; {new Date().getFullYear()} ICAMMDA, Federal University Oye-Ekiti. All rights reserved.</p>
          <p>WAMCAD Member Institution</p>
        </div>
      </div>
    </footer>
  );
}

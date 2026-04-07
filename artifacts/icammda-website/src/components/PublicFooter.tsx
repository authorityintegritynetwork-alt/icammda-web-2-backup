import { Link } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-[hsl(222,47%,11%)] text-slate-300 mt-16" data-testid="public-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded bg-primary flex items-center justify-center">
                <span className="text-white font-bold">IC</span>
              </div>
              <span className="text-white font-bold text-sm leading-tight">ICAMMDA</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              International Centre for Applied Mathematical Modelling and Data Analytics.
              Advancing public health through science, data, and collaboration.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/news", label: "News & Updates" },
                { href: "/events", label: "Events & Programs" },
                { href: "/team", label: "Our Team" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-primary transition-colors" data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-primary mt-0.5 shrink-0" />
                <span className="text-slate-400">ICT Centre, Oye-Campus<br />Federal University Oye-Ekiti<br />Ekiti State, Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-primary shrink-0" />
                <a href="tel:+2349016073157" className="text-slate-400 hover:text-primary transition-colors">+234 901 607 3157</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-primary shrink-0" />
                <a href="mailto:info@icammda.org" className="text-slate-400 hover:text-primary transition-colors">info@icammda.org</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ICAMMDA, Federal University Oye-Ekiti. All rights reserved.</p>
          <p>Member of WAMCAD — West Africa Mathematical Modelling Capacity Development</p>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "wouter";
import { Compass, ArrowRight, Mail, Newspaper, Users } from "lucide-react";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEO from "@/components/SEO";

const suggestions = [
  { href: "/news-events", icon: Newspaper, title: "News & Events", desc: "Latest announcements, publications, and upcoming events." },
  { href: "/team", icon: Users, title: "Our Team", desc: "Meet the researchers and faculty at ICAMMDA." },
  { href: "/contact", icon: Mail, title: "Contact Us", desc: "Get in touch about research, training, or partnerships." },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved. Browse our latest news, research, and team."
        noIndex
      />
      <PublicNav />
      <main className="flex-1 flex items-center bg-gradient-to-b from-cyan-50/40 to-background py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-500/10 text-cyan-600 mb-6">
              <Compass size={36} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-600 uppercase mb-3">
              Error 404
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight mb-4">
              We couldn't find that page
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              The link may be outdated, mistyped, or the content has moved. Try one of the popular destinations below — or head back to the homepage.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors shadow-sm hover:shadow-md"
                data-testid="back-home-btn"
              >
                Return to homepage <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
                data-testid="report-link-btn"
              >
                Report a broken link
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-16">
            {suggestions.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group bg-card border border-card-border rounded-2xl p-5 hover:border-cyan-300 hover:shadow-md transition-all"
                  data-testid={`suggest-${s.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Icon size={20} className="text-cyan-600 mb-3" />
                  <h3 className="text-sm font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-cyan-600 group-hover:gap-1.5 transition-all">
                    Visit <ArrowRight size={11} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

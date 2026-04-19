import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: Crumb[];
  /** Optional visual variant. Default = light text on dark hero. */
  variant?: "dark" | "light";
}

export default function Breadcrumbs({ items, variant = "dark" }: Props) {
  const onDark = variant === "dark";
  const baseColor = onDark ? "text-white/40" : "text-muted-foreground";
  const hoverColor = onDark ? "hover:text-cyan-400" : "hover:text-cyan-600";
  const currentColor = onDark ? "text-white/70" : "text-foreground";
  const sepColor = onDark ? "text-white/20" : "text-muted-foreground/40";

  // Build full path including Home + current page (last item).
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  // JSON-LD BreadcrumbList for SEO.
  const siteUrl =
    (typeof window !== "undefined" ? window.location.origin : "") || "";
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${siteUrl}${c.href}` } : {}),
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center"
      data-testid="breadcrumbs"
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-xs">
        {trail.map((c, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight
                  size={12}
                  className={sepColor}
                  aria-hidden="true"
                />
              )}
              {isLast || !c.href ? (
                <span
                  className={`${currentColor} font-medium`}
                  aria-current={isLast ? "page" : undefined}
                  data-testid={`breadcrumb-${i}`}
                >
                  {i === 0 ? (
                    <Home size={12} className="inline" aria-hidden="true" />
                  ) : (
                    c.label
                  )}
                </span>
              ) : (
                <Link
                  href={c.href}
                  className={`${baseColor} ${hoverColor} transition-colors inline-flex items-center gap-1`}
                  data-testid={`breadcrumb-${i}`}
                >
                  {i === 0 ? (
                    <>
                      <Home size={12} aria-hidden="true" />
                      <span className="sr-only">{c.label}</span>
                    </>
                  ) : (
                    c.label
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </nav>
  );
}

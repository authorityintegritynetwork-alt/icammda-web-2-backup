export const SITE_URL: string =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://icammda.org";

export const SITE_NAME = "ICAMMDA";
export const SITE_FULL_NAME =
  "International Centre for Applied Mathematical Modelling and Data Analytics";
export const ORGANIZATION = {
  name: SITE_NAME,
  fullName: SITE_FULL_NAME,
  parent: "Federal University Oye-Ekiti",
  country: "Nigeria",
  email: "info@icammda.org",
  url: SITE_URL,
  logo: `${SITE_URL}/icammda-logo-circle.png`,
  socialLinks: [] as string[],
};

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

export function truncate(s: string, max = 160): string {
  const trimmed = s.trim().replace(/\s+/g, " ");
  return trimmed.length <= max ? trimmed : trimmed.slice(0, max - 1).trimEnd() + "…";
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    name: SITE_FULL_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: ORGANIZATION.logo,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Federal University Oye-Ekiti",
      address: {
        "@type": "PostalAddress",
        addressCountry: "NG",
        addressRegion: "Ekiti",
        addressLocality: "Oye-Ekiti",
      },
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "general inquiries",
      email: ORGANIZATION.email,
    },
  };
}

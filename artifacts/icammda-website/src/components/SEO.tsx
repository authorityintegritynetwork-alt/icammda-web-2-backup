import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import { absoluteUrl, SITE_NAME, SITE_FULL_NAME, truncate } from "@/lib/seo";

interface Props {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  canonical?: string;
  jsonLd?: object | object[];
  publishedTime?: string;
  modifiedTime?: string;
}

const DEFAULT_DESCRIPTION =
  "ICAMMDA — the International Centre for Applied Mathematical Modelling and Data Analytics at Federal University Oye-Ekiti, Nigeria. Research, training, and collaboration in mathematical modelling, data analytics, and applied health sciences across West Africa.";

const DEFAULT_OG_IMAGE = "/opengraph.jpg";

export default function SEO({
  title,
  description,
  image,
  type = "website",
  noIndex,
  canonical,
  jsonLd,
  publishedTime,
  modifiedTime,
}: Props) {
  const [location] = useLocation();
  const url = canonical ? absoluteUrl(canonical) : absoluteUrl(location);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const desc = truncate(description ?? DEFAULT_DESCRIPTION, 200);
  const ogImage = absoluteUrl(image ?? DEFAULT_OG_IMAGE);

  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow" />}

      <meta property="og:site_name" content={SITE_FULL_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_NG" />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLdArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}

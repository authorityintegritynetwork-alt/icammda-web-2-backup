import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Privacy() {
  const lastUpdated = "April 2026";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Privacy Policy"
        description="How ICAMMDA collects, uses, and protects information about visitors and users of icammda.org."
        canonical="/privacy"
      />
      <PublicNav />

      {/* Hero */}
      <section id="main-content" tabIndex={-1} className="bg-[#07101e] pt-28 pb-16 outline-none">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Privacy Policy" }]} />
          <p className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mt-6 mb-3">
            Legal
          </p>
          <h1
            className="font-serif text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-4"
            data-testid="privacy-title"
          >
            Privacy Policy
          </h1>
          <p className="text-white/45 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Body */}
      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 prose prose-slate prose-headings:font-serif prose-headings:text-foreground prose-a:text-cyan-700 hover:prose-a:text-cyan-800 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-p:text-muted-foreground prose-li:text-muted-foreground max-w-none">
          <p>
            The International Centre for Applied Mathematical Modelling and Data Analytics ("ICAMMDA", "we", "us", or "our") respects your privacy. This policy explains what information we collect when you visit <a href="https://icammda.org">icammda.org</a> or interact with our services, how we use it, and the choices you have.
          </p>

          <h2>1. Information we collect</h2>
          <h3>Information you provide</h3>
          <ul>
            <li><strong>Contact form submissions.</strong> When you send us a message, we collect your name, email address, optional subject, and message content.</li>
            <li><strong>Career applications.</strong> When you apply for a position, we collect the information you provide via our recruitment partner (e.g. name, email, CV, cover letter).</li>
            <li><strong>Event registrations.</strong> When you register for an event, the information you supply is collected by the registration provider listed on that event's page.</li>
          </ul>

          <h3>Information collected automatically</h3>
          <ul>
            <li><strong>Server logs.</strong> Our servers record standard request metadata (IP address, user agent, timestamp, requested URL) to operate the site, troubleshoot issues, and protect against abuse.</li>
            <li><strong>Cookies.</strong> We use a small number of strictly necessary cookies set by our authentication provider (Clerk) for the admin area. The public website does not set marketing or advertising cookies.</li>
          </ul>

          <h2>2. How we use information</h2>
          <ul>
            <li>To respond to your inquiries and provide the information or services you requested.</li>
            <li>To operate, secure, and improve the site.</li>
            <li>To comply with legal obligations and university policies.</li>
          </ul>
          <p>
            We do not sell, rent, or trade your personal information.
          </p>

          <h2>3. Sharing of information</h2>
          <p>
            We share information only with service providers that help us run this website and our research operations, including:
          </p>
          <ul>
            <li><strong>Hosting and email delivery</strong> (e.g. our cloud platform and Resend, used to deliver contact-form notifications).</li>
            <li><strong>Authentication</strong> (Clerk, used to sign in administrators).</li>
            <li><strong>Embedded content providers</strong> (e.g. YouTube and LinkedIn for embedded media; Google Forms where used for registration).</li>
          </ul>
          <p>
            We may also disclose information when required by law or to protect the rights, property, or safety of ICAMMDA, our community, or others.
          </p>

          <h2>4. Data retention</h2>
          <p>
            We keep contact-form messages for as long as needed to respond to your inquiry and to maintain our records, after which they are archived or deleted in accordance with university record-keeping policies.
          </p>

          <h2>5. Your rights</h2>
          <p>
            Subject to applicable law (including the Nigeria Data Protection Act 2023), you may request access to, correction of, or deletion of personal information we hold about you. To exercise these rights, contact us at <a href="mailto:info@icammda.org">info@icammda.org</a>.
          </p>

          <h2>6. Security</h2>
          <p>
            We use industry-standard safeguards — including HTTPS in transit, access controls, and regular updates — to protect information against unauthorised access, alteration, or disclosure. No method of transmission over the internet is fully secure, and we cannot guarantee absolute security.
          </p>

          <h2>7. Children</h2>
          <p>
            Our site is intended for a general academic and professional audience. We do not knowingly collect personal information from children under 13.
          </p>

          <h2>8. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The "Last updated" date above indicates when it was last revised. Material changes will be highlighted on the site.
          </p>

          <h2>9. Contact</h2>
          <p>
            ICAMMDA, ICT Centre, Federal University Oye-Ekiti, Ekiti State, Nigeria.
            <br />
            Email: <a href="mailto:info@icammda.org">info@icammda.org</a>
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Terms() {
  const lastUpdated = "April 2026";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Terms of Use"
        description="Terms governing your use of the ICAMMDA website and resources."
        canonical="/terms"
      />
      <PublicNav />

      {/* Hero */}
      <section id="main-content" tabIndex={-1} className="bg-[#07101e] pt-28 pb-16 outline-none">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Terms of Use" }]} />
          <p className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mt-6 mb-3">
            Legal
          </p>
          <h1
            className="font-serif text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-4"
            data-testid="terms-title"
          >
            Terms of Use
          </h1>
          <p className="text-white/45 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Body */}
      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 prose prose-slate prose-headings:font-serif prose-headings:text-foreground prose-a:text-cyan-700 hover:prose-a:text-cyan-800 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3 prose-p:text-muted-foreground prose-li:text-muted-foreground max-w-none">
          <p>
            These Terms of Use ("Terms") govern your access to and use of <a href="https://icammda.org">icammda.org</a> (the "Site"), operated by the International Centre for Applied Mathematical Modelling and Data Analytics ("ICAMMDA"), a research centre of Federal University Oye-Ekiti. By using the Site, you agree to these Terms.
          </p>

          <h2>1. Use of the Site</h2>
          <p>
            You may browse the Site for personal, academic, and professional purposes. You agree not to:
          </p>
          <ul>
            <li>Use the Site in a way that violates any applicable law or regulation.</li>
            <li>Attempt to gain unauthorised access to any portion of the Site, related systems, or data.</li>
            <li>Interfere with or disrupt the integrity or performance of the Site (e.g. through scraping that imposes unreasonable load, automated attacks, or denial-of-service activity).</li>
            <li>Use the Site to transmit malware or any harmful code.</li>
          </ul>

          <h2>2. Intellectual property</h2>
          <p>
            All content on the Site — including text, graphics, logos, images, datasets, and software — is the property of ICAMMDA, Federal University Oye-Ekiti, or its content suppliers and is protected by applicable intellectual-property laws. You may quote brief excerpts for non-commercial academic use with proper attribution. Any other reproduction, redistribution, or commercial use requires our prior written permission.
          </p>

          <h2>3. Research content and accuracy</h2>
          <p>
            Information published on the Site, including research summaries, news, and event details, is provided for informational purposes. While we strive for accuracy, we do not warrant that all content is complete, current, or free from error. The Site does not constitute professional, medical, legal, or financial advice.
          </p>

          <h2>4. User submissions</h2>
          <p>
            Information you submit through the contact form, career portal, or event registrations is handled in accordance with our <a href="/privacy">Privacy Policy</a>. You represent that any information you submit is accurate and that you have the right to share it.
          </p>

          <h2>5. Third-party links and embeds</h2>
          <p>
            The Site may link to or embed content from third-party sites (for example, YouTube videos, LinkedIn posts, or Google Forms). We are not responsible for the content, policies, or practices of those third parties. Use of such content is governed by the third party's terms.
          </p>

          <h2>6. Disclaimer of warranties</h2>
          <p>
            The Site is provided "as is" and "as available" without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>

          <h2>7. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, ICAMMDA, Federal University Oye-Ekiti, and their respective officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Site.
          </p>

          <h2>8. Changes to the Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Site after changes are posted constitutes your acceptance of the updated Terms.
          </p>

          <h2>9. Governing law</h2>
          <p>
            These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to its conflict-of-law principles.
          </p>

          <h2>10. Contact</h2>
          <p>
            Questions about these Terms? Contact us at <a href="mailto:info@icammda.org">info@icammda.org</a>.
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { Link } from "wouter";
import {
  GraduationCap,
  Globe,
  ArrowRight,
  CheckCircle2,
  Mail,
  Calendar,
  Briefcase,
  Users,
} from "lucide-react";

const cohorts = [
  { name: "Cohort 1", period: "February – April", deadline: "January 15" },
  { name: "Cohort 2", period: "June – August", deadline: "May 15" },
  { name: "Cohort 3", period: "October – December", deadline: "September 15" },
];

export default function Careers() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/section-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101e]/97 via-[#07101e]/92 to-[#07101e]/80" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">Career Paths</p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-6">
            Join us in shaping<br /><em className="text-gradient">Africa's health future</em>
          </h1>
          <p className="text-white/45 text-lg max-w-2xl leading-relaxed mb-8">
            Through data, science, and innovation.
          </p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-[#07101e] font-semibold text-sm hover:bg-cyan-300 transition-colors"
          >
            View Opportunities <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* ═══════════ FEATURED PATHS ═══════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3">
            <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-4">Featured Paths</p>
            <h2 className="font-serif text-foreground text-3xl sm:text-4xl leading-snug mb-6">
              A mission-driven team tackling Africa's most urgent health challenges
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At the International Centre for Applied Mathematical Modelling and Data Analytics (ICAMMDA), we are driven by a mission to advance health in Africa through science, data, and innovation. Our team is made up of passionate professionals working across disciplines to solve complex public health challenges.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We welcome individuals who share our vision of using data-driven solutions to improve lives. Whether you are a modeller, data analyst, epidemiologist, software developer, or health professional — there is a place for you at ICAMMDA.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We invite scholars from around the globe to become part of our esteemed team. Our application, interview, and selection processes are conducted at various times throughout the year. To submit your application, please select the appropriate category below.
            </p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="bg-[#07101e] rounded-2xl p-6 border border-white/8">
              <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-4">Who We Welcome</p>
              <ul className="space-y-2.5">
                {[
                  "Mathematical Modellers",
                  "Data Analysts & Scientists",
                  "Epidemiologists",
                  "Software Developers",
                  "Health Professionals",
                  "Early-Career Researchers",
                ].map((role) => (
                  <li key={role} className="flex items-center gap-2.5 text-white/60 text-sm">
                    <CheckCircle2 size={13} className="text-cyan-400 shrink-0" />
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ APPLICATION CATEGORIES ═══════════ */}
      <section id="apply" className="relative py-20 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15" style={{ backgroundImage: "url('/hero-bg.png')" }} />
        <div className="absolute inset-0 bg-[#07101e]/92" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-3">Apply</p>
            <h2 className="font-serif text-white text-3xl sm:text-4xl">Choose Your Path</h2>
            <p className="text-white/40 text-sm mt-3 max-w-xl mx-auto">
              Select the category that best describes you and submit your application through the appropriate channel.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Internship Application ── */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-7 flex flex-col hover:border-cyan-500/25 hover:bg-white/7 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center mb-5 shrink-0">
                <Briefcase className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-3">Internship Application</span>
              <h3 className="text-white font-semibold text-lg leading-snug mb-4">
                Elevate your modelling proficiency
              </h3>
              <p className="text-white/50 text-sm leading-relaxed flex-1">
                ICAMMDA welcomes global scholars in pursuit of internship opportunities to elevate their mathematical modelling proficiency and gain a competitive edge in their careers.
              </p>
              <div className="mt-6 pt-5 border-t border-white/8">
                <a
                  href="mailto:careers@icammda.org?subject=Internship Application"
                  className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors"
                >
                  Apply Now <ArrowRight size={13} />
                </a>
              </div>
            </div>

            {/* ── Visiting Scholars ── */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-7 flex flex-col hover:border-violet-500/25 hover:bg-white/7 transition-all duration-300 lg:scale-[1.02]">
              <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mb-5 shrink-0">
                <Globe className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">Visiting Scholars Application</span>
              <h3 className="text-white font-semibold text-lg leading-snug mb-4">
                Enriching learning for Masters &amp; PhD scholars
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                ICAMMDA is delighted to invite Visiting Scholars, both Masters and Ph.D. candidates, from across the globe. Join us for an enriching learning journey, sharpen your capabilities, and leverage mathematical modelling to combat infectious diseases.
              </p>

              {/* Cohort table */}
              <div className="bg-white/5 rounded-xl overflow-hidden border border-white/8 mb-5">
                <div className="grid grid-cols-3 px-3 py-2 border-b border-white/8">
                  <span className="text-white/30 text-[10px] font-bold uppercase tracking-wide">Cohort</span>
                  <span className="text-white/30 text-[10px] font-bold uppercase tracking-wide">Period</span>
                  <span className="text-white/30 text-[10px] font-bold uppercase tracking-wide">Deadline</span>
                </div>
                {cohorts.map((c) => (
                  <div key={c.name} className="grid grid-cols-3 px-3 py-2.5 border-b border-white/5 last:border-0">
                    <span className="text-violet-300 text-xs font-semibold">{c.name}</span>
                    <span className="text-white/55 text-xs">{c.period}</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={10} className="text-white/30 shrink-0" />
                      <span className="text-white/55 text-xs">{c.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-5 border-t border-white/8">
                <a
                  href="mailto:careers@icammda.org?subject=Visiting Scholar Application"
                  className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold hover:text-violet-300 transition-colors"
                >
                  Apply Now <ArrowRight size={13} />
                </a>
              </div>
            </div>

            {/* ── Graduate Internship Training ── */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-7 flex flex-col hover:border-green-500/25 hover:bg-white/7 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center mb-5 shrink-0">
                <GraduationCap className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 mb-3">Graduate Internship Training</span>
              <h3 className="text-white font-semibold text-lg leading-snug mb-4">
                Real-world experience for BSc &amp; MSc graduates
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                Our Graduate Internship Program is designed for BSc and MSc graduates who wish to apply their skills to real-world health challenges.
              </p>
              <ul className="space-y-2.5 flex-1">
                {[
                  "Hands-on experience with applied modelling, data analysis, and health systems research",
                  "Contribute to active projects that influence policy and practice",
                  "Duration: 3–12 months (flexible)",
                ].map((item) => (
                  <li key={item} className="flex gap-2 items-start text-white/45 text-xs leading-relaxed">
                    <CheckCircle2 size={12} className="text-green-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-white/8">
                <a
                  href="mailto:careers@icammda.org?subject=Graduate Internship Application"
                  className="inline-flex items-center gap-2 text-green-400 text-sm font-semibold hover:text-green-300 transition-colors"
                >
                  Apply Now <ArrowRight size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
        <div className="bg-gradient-to-br from-cyan-500/10 via-cyan-600/5 to-transparent border border-cyan-500/15 rounded-3xl p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center mb-5">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="font-serif text-foreground text-2xl sm:text-3xl mb-3 leading-snug">
                Not sure which path is right for you?
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                We are always happy to hear from motivated researchers and professionals. Reach out to us and we will help you find the right opportunity within ICAMMDA.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:careers@icammda.org"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400 text-[#07101e] font-semibold text-sm hover:bg-cyan-300 transition-colors"
              >
                <Mail size={15} />
                careers@icammda.org
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                General Enquiries <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

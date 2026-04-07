import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { Link } from "wouter";
import {
  GraduationCap,
  Microscope,
  Globe,
  Users,
  BookOpen,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Mail,
  Briefcase,
} from "lucide-react";

const openings = [
  {
    category: "PhD Studentships",
    icon: GraduationCap,
    accent: "cyan",
    positions: [
      {
        title: "PhD Studentship in Mathematical Modelling of Malaria Transmission",
        type: "Full-time · 4 Years",
        deadline: "Rolling — open until filled",
        summary:
          "Develop and analyse compartmental and agent-based models to understand malaria transmission dynamics and evaluate the impact of interventions across endemic regions of sub-Saharan Africa.",
        requirements: ["First-class or 2:1 BSc/MSc in Mathematics, Statistics, or related field", "Strong mathematical background (ODEs, stochastic processes)", "Interest in epidemiology or public health"],
      },
      {
        title: "PhD Studentship in Data-Driven Modelling of Vaccine-Preventable Diseases",
        type: "Full-time · 4 Years",
        deadline: "Rolling — open until filled",
        summary:
          "Use large-scale epidemiological datasets and modern statistical/ML methods to model the spread of vaccine-preventable diseases and design optimised immunisation strategies.",
        requirements: ["MSc or strong BSc in Statistics, Data Science, or Applied Mathematics", "Programming experience in R, Python, or MATLAB", "Background in public health or epidemiology is an advantage"],
      },
    ],
  },
  {
    category: "Postdoctoral Fellowships",
    icon: Microscope,
    accent: "violet",
    positions: [
      {
        title: "Postdoctoral Research Fellow — Cholera Dynamics & Outbreak Modelling",
        type: "Full-time · 2–3 Years",
        deadline: "Open until filled",
        summary:
          "Lead research into the environmental and social drivers of cholera outbreaks in Nigeria, working closely with national and international health agencies to translate model outputs into actionable policy guidance.",
        requirements: ["PhD in Applied Mathematics, Epidemiology, Computational Science, or related discipline", "Publication record in relevant areas", "Experience with outbreak modelling (SEIR or similar)"],
      },
      {
        title: "Postdoctoral Research Fellow — Machine Learning for Health Systems",
        type: "Full-time · 2 Years",
        deadline: "Open until filled",
        summary:
          "Apply machine learning and AI approaches to healthcare data to improve prediction and forecasting of disease burden, resource needs, and intervention impacts at national scale.",
        requirements: ["PhD in Computer Science, Statistics, or related field", "Proficiency in Python/TensorFlow/PyTorch", "Demonstrable experience with health data or epidemiological modelling"],
      },
    ],
  },
  {
    category: "Visiting & Collaborative Positions",
    icon: Globe,
    accent: "green",
    positions: [
      {
        title: "Visiting Researcher Programme",
        type: "Flexible Duration · 1–12 Months",
        deadline: "Applications accepted year-round",
        summary:
          "We welcome researchers from other institutions or countries to collaborate on joint projects. ICAMMDA provides desk space, computing resources, and a stimulating intellectual environment.",
        requirements: ["Ongoing research in a relevant area", "Endorsement from home institution", "Clear collaborative research plan"],
      },
      {
        title: "Research Internship (Masters & Undergraduate)",
        type: "Part-time / Full-time · 3–6 Months",
        deadline: "Applications accepted year-round",
        summary:
          "Undergraduate and Masters students with strong quantitative skills are invited to join ICAMMDA for short-term placements, contributing to live research projects under mentorship.",
        requirements: ["Current enrolment in a relevant programme", "Strong quantitative skills", "Genuine interest in mathematical modelling or data analytics"],
      },
    ],
  },
];

const benefits = [
  { icon: BookOpen, label: "Funded Research", text: "Access to competitive internal and external research funding, conference travel grants, and publication support." },
  { icon: Users, label: "World-Class Mentorship", text: "Work alongside experienced academics and collaborators from leading institutions across Africa and beyond." },
  { icon: Globe, label: "Global Partnerships", text: "Opportunities to collaborate with international bodies, including WHO, CDC Africa, and BMGF-funded consortia." },
  { icon: Lightbulb, label: "Cutting-Edge Environment", text: "State-of-the-art computing infrastructure, access to major epidemiological datasets, and a culture of innovation." },
  { icon: Briefcase, label: "Career Development", text: "Structured career development pathways, writing workshops, and exposure to policy-relevant research and stakeholder engagement." },
  { icon: GraduationCap, label: "Competitive Stipends", text: "Competitive PhD stipends and postdoctoral salaries benchmarked against national and international standards." },
];

const steps = [
  { step: "01", heading: "Read the position description", body: "Review the requirements and project description carefully to ensure alignment with your background and interests." },
  { step: "02", heading: "Prepare your application", body: "Prepare a CV, personal statement (up to 2 pages), and contact details for two academic referees. PhD applicants should also include a research proposal outline." },
  { step: "03", heading: "Submit by email", body: 'Email your application to careers@icammda.org with the subject line: [Position Title] \u2014 Application \u2014 [Your Name]. We acknowledge all applications within 5 working days.' },
  { step: "04", heading: "Interview & decision", body: "Shortlisted candidates will be invited to an online interview. We aim to make decisions within 4–6 weeks of the closing date." },
];

const accentMap: Record<string, string> = {
  cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  violet: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  green: "text-green-400 bg-green-400/10 border-green-400/20",
};

const accentBadge: Record<string, string> = {
  cyan: "bg-cyan-400/10 text-cyan-300",
  violet: "bg-violet-400/10 text-violet-300",
  green: "bg-green-400/10 text-green-300",
};

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
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">Join Us</p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-6">
            Careers at<br /><em className="text-gradient">ICAMMDA</em>
          </h1>
          <p className="text-white/45 text-lg max-w-2xl leading-relaxed mb-8">
            Build a career at the forefront of data-driven public health — training the next generation of African modellers and analysts.
          </p>
          <a
            href="#openings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-[#07101e] font-semibold text-sm hover:bg-cyan-300 transition-colors"
          >
            View Open Positions <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* ═══════════ WHY ICAMMDA ═══════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3">
            <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-4">Why ICAMMDA</p>
            <h2 className="font-serif text-foreground text-3xl sm:text-4xl leading-snug mb-6">
              Shape the future of African public health
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ICAMMDA was founded with a clear mandate: to develop homegrown mathematical modelling and data analytics capacity that directly informs public health decision-making across Africa. Our researchers tackle some of the continent's most urgent health challenges — malaria, cholera, Lassa fever, vaccine-preventable diseases, and more.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you join ICAMMDA, you join a community of passionate scientists, collaborators, and policy partners committed to rigorous, relevant, and impactful science. We foster a culture of curiosity, collaboration, and ambition — where junior researchers are given real responsibility and world-class mentorship.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are a prospective PhD student, an early-career postdoc, or a visiting scholar, ICAMMDA offers an environment in which you can grow as a scientist and make a genuine difference.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="bg-[#07101e] rounded-2xl p-6 border border-white/8">
              <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-4">Current Opportunities</p>
              <ul className="space-y-3">
                {openings.map((o) => {
                  const Icon = o.icon;
                  return (
                    <li key={o.category} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${accentMap[o.accent]}`}>
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm font-medium leading-tight">{o.category}</p>
                        <p className="text-white/35 text-xs">{o.positions.length} position{o.positions.length !== 1 ? "s" : ""} open</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5 pt-5 border-t border-white/8">
                <p className="text-white/35 text-xs">Don&apos;t see the right fit?</p>
                <a href="mailto:careers@icammda.org" className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors">
                  careers@icammda.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ OPEN POSITIONS ═══════════ */}
      <section id="openings" className="relative py-20 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15" style={{ backgroundImage: "url('/hero-bg.png')" }} />
        <div className="absolute inset-0 bg-[#07101e]/92" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-3">Vacancies</p>
            <h2 className="font-serif text-white text-3xl sm:text-4xl">Open Positions</h2>
            <p className="text-white/40 text-sm mt-3 max-w-xl mx-auto">We are actively recruiting talented individuals across the following areas. All positions are based at Federal University Oye-Ekiti, Nigeria.</p>
          </div>

          <div className="space-y-12">
            {openings.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.category}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${accentMap[group.accent]}`}>
                      <Icon size={15} />
                    </div>
                    <h3 className="text-white font-semibold text-lg">{group.category}</h3>
                    <div className="flex-1 h-px bg-white/8" />
                  </div>

                  {/* Position cards */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {group.positions.map((pos) => (
                      <div key={pos.title} className="bg-white/5 border border-white/8 rounded-2xl p-6 hover:border-white/14 hover:bg-white/7 transition-all duration-300">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${accentBadge[group.accent]}`}>{group.category.replace(" Positions", "").replace("ships", "ship")}</span>
                          <span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/6 text-white/45">{pos.type}</span>
                        </div>
                        <h4 className="text-white font-semibold text-base leading-snug mb-3">{pos.title}</h4>
                        <p className="text-white/50 text-sm leading-relaxed mb-4">{pos.summary}</p>
                        <div className="space-y-1.5 mb-5">
                          {pos.requirements.map((req) => (
                            <div key={req} className="flex gap-2 items-start text-white/45 text-xs">
                              <CheckCircle2 size={12} className={`shrink-0 mt-0.5 ${accentMap[group.accent].split(" ")[0]}`} />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-white/8">
                          <span className="text-white/30 text-[10px]">Deadline: {pos.deadline}</span>
                          <a
                            href="mailto:careers@icammda.org"
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${accentMap[group.accent].split(" ")[0]} hover:opacity-80`}
                          >
                            Apply <ArrowRight size={11} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ BENEFITS ═══════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
        <div className="text-center mb-14">
          <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-3">What We Offer</p>
          <h2 className="font-serif text-foreground text-3xl sm:text-4xl">Life at ICAMMDA</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.label} className="bg-muted/40 border border-border/60 rounded-2xl p-6 hover:border-cyan-500/20 transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-cyan-500" />
                </div>
                <h3 className="text-foreground font-semibold text-sm mb-2">{b.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════ HOW TO APPLY ═══════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/section-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101e]/97 via-[#07101e]/92 to-[#07101e]/80" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-3">Application Process</p>
            <h2 className="font-serif text-white text-3xl sm:text-4xl">How to Apply</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(100%+12px)] w-full h-px border-t border-dashed border-white/15 z-10" />
                )}
                <div className="bg-white/5 border border-white/8 rounded-2xl p-5 h-full">
                  <p className="text-cyan-400/60 text-xs font-bold tracking-widest mb-3">{s.step}</p>
                  <h4 className="text-white font-semibold text-sm mb-2 leading-snug">{s.heading}</h4>
                  <p className="text-white/45 text-xs leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
        <div className="bg-gradient-to-br from-cyan-500/10 via-cyan-600/5 to-transparent border border-cyan-500/15 rounded-3xl p-10 md:p-14 text-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7 text-cyan-400" />
          </div>
          <h2 className="font-serif text-foreground text-3xl sm:text-4xl mb-4">
            Have questions about our opportunities?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            We are always happy to hear from motivated researchers. If you are interested in joining ICAMMDA but don't see a suitable opening, you're welcome to send us a speculative application or enquiry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:careers@icammda.org"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-[#07101e] font-semibold text-sm hover:bg-cyan-300 transition-colors"
            >
              <Mail size={15} />
              careers@icammda.org
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              General Enquiries <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

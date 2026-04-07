import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { useState } from "react";
import {
  PlayCircle,
  ChevronDown,
  BookOpen,
  BarChart2,
  Activity,
  Shuffle,
  Clock,
  GraduationCap,
  Globe,
  ArrowRight,
} from "lucide-react";

interface Lesson {
  title: string;
  duration?: string;
  youtubeId?: string;
}

interface Course {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  accent: string;
  lessons: Lesson[];
}

const courses: Course[] = [
  {
    id: "time-series",
    icon: BarChart2,
    title: "Time Series Modelling and Forecasting",
    description:
      "Learn how to analyse temporal data and build forecasting models relevant to infectious disease surveillance and public health planning.",
    accent: "cyan",
    lessons: [
      { title: "Introduction to Time Series Analysis" },
      { title: "Stationarity, Trends, and Seasonality" },
      { title: "ARIMA and Exponential Smoothing Models" },
      { title: "Forecasting Infectious Disease Incidence" },
      { title: "Evaluating and Validating Forecast Models" },
    ],
  },
  {
    id: "infectious-diseases",
    icon: Activity,
    title: "Overview of Infectious Diseases",
    description:
      "An introduction to the epidemiology and biology of infectious diseases, laying the groundwork for mathematical modelling approaches.",
    accent: "violet",
    lessons: [
      { title: "Principles of Infectious Disease Epidemiology" },
      { title: "Transmission Dynamics and the Basic Reproduction Number" },
      { title: "Host–Pathogen Interactions" },
      { title: "Disease Surveillance and Data Collection" },
      { title: "Case Studies: Malaria, Cholera, and Lassa Fever" },
    ],
  },
  {
    id: "qualitative-quantitative",
    icon: BookOpen,
    title: "Model Qualitative and Quantitative Analysis",
    description:
      "Develop skills to rigorously analyse mathematical models using both qualitative (stability, bifurcation) and quantitative (parameter estimation, fitting) techniques.",
    accent: "amber",
    lessons: [
      { title: "Equilibrium Analysis and Stability Theory" },
      { title: "Bifurcation Analysis and Sensitivity" },
      { title: "Parameter Estimation from Data" },
      { title: "Model Fitting and Likelihood Methods" },
      { title: "Uncertainty Quantification" },
    ],
  },
  {
    id: "stochastic",
    icon: Shuffle,
    title: "Stochastic Modelling",
    description:
      "Go beyond deterministic models to capture the inherent randomness of disease outbreaks through stochastic differential equations and agent-based simulations.",
    accent: "green",
    lessons: [
      { title: "Introduction to Probability and Stochastic Processes" },
      { title: "Discrete-Time Markov Chains in Epidemiology" },
      { title: "Continuous-Time Stochastic Models" },
      { title: "Gillespie Algorithm and Monte Carlo Simulation" },
      { title: "Comparing Stochastic and Deterministic Outputs" },
    ],
  },
];

const accentClasses: Record<string, { icon: string; badge: string; border: string; chevron: string }> = {
  cyan:   { icon: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",   badge: "bg-cyan-500/10 text-cyan-400",   border: "border-cyan-500/20",   chevron: "text-cyan-400" },
  violet: { icon: "bg-violet-500/15 text-violet-400 border-violet-500/20", badge: "bg-violet-500/10 text-violet-400", border: "border-violet-500/20", chevron: "text-violet-400" },
  amber:  { icon: "bg-amber-500/15 text-amber-400 border-amber-500/20",  badge: "bg-amber-500/10 text-amber-400",  border: "border-amber-500/20",  chevron: "text-amber-400" },
  green:  { icon: "bg-green-500/15 text-green-400 border-green-500/20",  badge: "bg-green-500/10 text-green-400",  border: "border-green-500/20",  chevron: "text-green-400" },
};

const stats = [
  { value: "4", label: "Course Modules" },
  { value: "20+", label: "Lessons" },
  { value: "Free", label: "Full Access" },
  { value: "Africa-wide", label: "Reach" },
];

export default function ELearning() {
  const [openCourse, setOpenCourse] = useState<string | null>("time-series");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden pt-32 pb-28">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/section-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101e]/97 via-[#07101e]/92 to-[#07101e]/80" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">eLearning Hub</p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-6">
            Learn from<br /><em className="text-gradient">the experts</em>
          </h1>
          <p className="text-white/45 text-lg max-w-2xl leading-relaxed mb-8">
            Explore lectures, seminars, and tutorials from ICAMMDA. Learn from experts shaping the future of public health analytics and mathematical modelling.
          </p>
          <a
            href="#courses"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-cyan-400 text-[#07101e] font-semibold text-sm hover:bg-cyan-300 transition-colors"
          >
            <PlayCircle size={16} />
            Start Learning Now
          </a>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="border-b border-border/60">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/60">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <p className="font-serif text-foreground text-3xl font-bold mb-1">{s.value}</p>
                <p className="text-muted-foreground text-xs uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ABOUT ═══════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3">
            <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-4">About This Platform</p>
            <h2 className="font-serif text-foreground text-3xl sm:text-4xl leading-snug mb-6">
              Free, high-quality learning — for all of Africa
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The ICAMMDA eLearning Hub provides free access to high-quality educational content in mathematical modelling, epidemiology, statistics, computer science and public health analytics.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our goal is to strengthen capacity throughout Africa by equipping students, researchers and professionals with the tools they need to navigate complex health problems using data and modelling.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              New lessons, seminars and recorded workshops are added regularly.
            </p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="bg-[#07101e] rounded-2xl p-6 border border-white/8">
              <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-4">Who This Is For</p>
              <ul className="space-y-3">
                {[
                  { icon: GraduationCap, text: "Undergraduate & postgraduate students" },
                  { icon: BookOpen, text: "Early-career researchers & postdocs" },
                  { icon: Activity, text: "Public health practitioners" },
                  { icon: Globe, text: "Professionals across Africa & beyond" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-white/60 text-sm">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-cyan-400" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ COURSES ═══════════ */}
      <section id="courses" className="relative py-20 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15" style={{ backgroundImage: "url('/hero-bg.png')" }} />
        <div className="absolute inset-0 bg-[#07101e]/92" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-3">Curriculum</p>
            <h2 className="font-serif text-white text-3xl sm:text-4xl">Course Modules</h2>
            <p className="text-white/40 text-sm mt-3 max-w-xl mx-auto">
              Self-paced modules taught by ICAMMDA faculty and collaborating experts.
            </p>
          </div>

          <div className="space-y-4">
            {courses.map((course, idx) => {
              const Icon = course.icon;
              const ac = accentClasses[course.accent];
              const isOpen = openCourse === course.id;

              return (
                <div
                  key={course.id}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isOpen ? `border-white/14 bg-white/7` : "border-white/8 bg-white/4 hover:bg-white/6"
                  }`}
                >
                  {/* Header — clickable */}
                  <button
                    className="w-full flex items-center gap-4 p-6 text-left"
                    onClick={() => setOpenCourse(isOpen ? null : course.id)}
                  >
                    {/* Number */}
                    <div className="shrink-0 w-8 h-8 rounded-full border border-white/12 flex items-center justify-center">
                      <span className="text-white/30 text-xs font-bold font-mono">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    {/* Icon */}
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${ac.icon}`}>
                      <Icon size={18} />
                    </div>
                    {/* Title & description */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-base leading-snug">{course.title}</h3>
                      {!isOpen && (
                        <p className="text-white/35 text-xs mt-0.5 line-clamp-1">{course.description}</p>
                      )}
                    </div>
                    {/* Lesson count badge */}
                    <span className={`hidden sm:flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${ac.badge}`}>
                      <Clock size={10} />{course.lessons.length} lessons
                    </span>
                    {/* Chevron */}
                    <ChevronDown
                      size={18}
                      className={`shrink-0 transition-transform duration-300 ${ac.chevron} ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div className="px-6 pb-6">
                      <p className="text-white/50 text-sm leading-relaxed mb-6 pl-[4.5rem]">{course.description}</p>
                      <div className="pl-[4.5rem] space-y-2">
                        {course.lessons.map((lesson, lIdx) => (
                          <div
                            key={lIdx}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/6 group cursor-pointer hover:border-white/12 hover:bg-white/8 transition-all"
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${ac.badge}`}>
                              <PlayCircle size={14} />
                            </div>
                            <span className="text-white/70 text-sm group-hover:text-white transition-colors flex-1">{lesson.title}</span>
                            {lesson.duration && (
                              <span className="text-white/30 text-xs flex items-center gap-1 shrink-0">
                                <Clock size={10} />{lesson.duration}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
        <div className="bg-gradient-to-br from-cyan-500/10 via-cyan-600/5 to-transparent border border-cyan-500/15 rounded-3xl p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="font-serif text-foreground text-2xl sm:text-3xl mb-3 leading-snug">
                Want to contribute a lecture or seminar?
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                We collaborate with researchers, institutions, and practitioners worldwide to expand our curriculum. If you have expertise to share, we would love to hear from you.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:elearning@icammda.org"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400 text-[#07101e] font-semibold text-sm hover:bg-cyan-300 transition-colors"
              >
                <PlayCircle size={15} />
                elearning@icammda.org
              </a>
              <a
                href="mailto:elearning@icammda.org?subject=eLearning Collaboration"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Propose a Course <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

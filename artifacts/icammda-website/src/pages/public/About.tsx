import { FlaskConical, GraduationCap, Globe, Users, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { useListTeamMembers } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const units = [
  {
    icon: FlaskConical,
    number: "01",
    title: "Research & Modelling Unit",
    desc: "Developing mathematical models, epidemiological analyses, and policy-relevant research. Our work spans malaria, schistosomiasis, Lassa fever, and vaccine-preventable diseases.",
  },
  {
    icon: GraduationCap,
    number: "02",
    title: "Capacity Building & Training",
    desc: "Workshops, short courses, and mentorship programmes equipping African researchers with cutting-edge analytical and modelling skills.",
  },
  {
    icon: Globe,
    number: "03",
    title: "International Partnerships",
    desc: "Through WAMCAD and beyond, active collaborations with universities, research centres, and public health agencies across West Africa, Europe, and North America.",
  },
  {
    icon: Users,
    number: "04",
    title: "Community & Mentorship",
    desc: "Journal clubs to book reading circles — our community-oriented approach ensures researchers grow together and support each other's professional development.",
  },
];

const wamcadPartners = [
  "University of Thies, Senegal",
  "University of Conakry, Guinea",
  "Bandim Health Project, Guinea Bissau",
  "University of Ghana",
  "ICAMMDA, Federal University Oye-Ekiti, Nigeria",
];

export default function About() {
  const { data: team, isLoading } = useListTeamMembers();
  const director = team?.find((m) => m.role === "director");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative bg-[#07101e] overflow-hidden pt-32 pb-24">
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">Who We Are</p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-6" data-testid="about-title">
            About<br /><em className="text-gradient">ICAMMDA</em>
          </h1>
          <p className="text-white/45 text-lg max-w-2xl leading-relaxed">
            Empowering Africa's health future through rigorous analytics, bold innovation, and sustainable capacity building.
          </p>
        </div>
      </section>

      {/* ═══════════ OVERVIEW ═══════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20" data-testid="about-overview">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-4">Our Context</p>
            <p className="text-foreground text-lg leading-relaxed mb-4">
              ICAMMDA is a member of the <strong>West Africa Mathematical Modelling Capacity Development (WAMCAD)</strong> — an Anglophone–Francophone–Lusophone scientific partnership with a bold vision: train a critical mass of modelling scientists retained within West Africa.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Situated in the ICT Centre of Federal University Oye-Ekiti, our state-of-the-art computing and simulation laboratory hosts seminars, workshops, and trainings on modelling, data analytics, and computational skills.
            </p>
          </div>
          <div className="bg-[#07101e] rounded-2xl p-6">
            <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-4">WAMCAD Members</p>
            <ul className="space-y-3">
              {wamcadPartners.map((partner) => (
                <li key={partner} className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  <span className="text-white/60 text-xs leading-relaxed">{partner}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════ DIRECTOR ═══════════ */}
      <section className="bg-muted/40 border-y border-border/60" data-testid="director-section">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
          <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-10">Leadership</p>

          <div className="grid md:grid-cols-3 gap-10 items-start">
            {/* Photo */}
            <div className="flex flex-col items-center md:items-start">
              {isLoading ? (
                <Skeleton className="w-48 h-56 rounded-2xl" />
              ) : director?.photoUrl ? (
                <img src={director.photoUrl} alt={director.name} className="w-48 h-56 rounded-2xl object-cover" data-testid="director-photo" />
              ) : (
                <div className="w-48 h-56 rounded-2xl bg-[#07101e] flex items-center justify-center">
                  <Users size={48} className="text-cyan-400/30" />
                </div>
              )}
              <div className="mt-4 text-center md:text-left">
                <div className="font-serif text-foreground text-lg" data-testid="director-name">
                  {isLoading ? <Skeleton className="h-5 w-44" /> : director?.name ?? "Prof Emmanuel Afolabi Bakare"}
                </div>
                <div className="text-cyan-600 text-xs font-semibold mt-1">
                  {isLoading ? <Skeleton className="h-3 w-28 mt-1" /> : director?.title ?? "Director, ICAMMDA"}
                </div>
              </div>
            </div>

            {/* Letter */}
            <div className="md:col-span-2 relative">
              <div className="absolute -top-4 -left-4 text-8xl font-serif text-cyan-100 leading-none select-none pointer-events-none">"</div>
              <div className="relative space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p className="text-foreground font-medium">Dear Visitor,</p>
                <p>
                  Welcome to the International Centre for Applied Mathematical Modelling and Data Analytics (ICAMMDA). At ICAMMDA, we believe science and data should do more than sit in reports. They should guide decisions and save lives.
                </p>
                <p>
                  Our team is committed to building tools that address real public health challenges, training Africa's next generation of scientific leaders, and working closely with partners across the continent and beyond.
                </p>
                <p>
                  Our passion is driven by purpose — to create solutions rooted in Africa and relevant to the world. We are building something here that will last generations, and I invite you to be part of it.
                </p>
                <p className="font-medium text-foreground">
                  Warm regards,<br />
                  <strong>Prof Emmanuel Afolabi Bakare</strong><br />
                  <span className="text-cyan-600 font-normal text-xs">Director, ICAMMDA · Federal University Oye-Ekiti</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STRUCTURE ═══════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20" data-testid="structure-section">
        <div className="mb-12">
          <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-3">Our Structure</p>
          <h2 className="font-serif text-foreground text-4xl md:text-5xl">Four Core Units</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {units.map((unit) => (
            <div key={unit.title} className="group bg-card border border-card-border rounded-2xl p-7 hover-lift transition-all" data-testid={`unit-${unit.number}`}>
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <unit.icon size={19} />
                </div>
                <span className="text-muted-foreground/30 font-mono text-sm font-bold">{unit.number}</span>
              </div>
              <h3 className="font-serif text-foreground text-lg mb-2">{unit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{unit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="bg-[#07101e] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-serif text-white text-3xl md:text-4xl mb-2">Meet the team<br />behind the science.</h2>
            <p className="text-white/40 text-sm">Researchers, scientists, and staff driving ICAMMDA's mission.</p>
          </div>
          <Link href="/team">
            <button className="group flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 whitespace-nowrap">
              Meet Our Team
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

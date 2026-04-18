import { FlaskConical, GraduationCap, Globe, Users, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { useListTeamMembers } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { useSiteContent } from "@/hooks/useSiteContent";

const wamcadPartners = [
  "University of Thies, Senegal",
  "University of Conakry, Guinea",
  "Bandim Health Project, Guinea Bissau",
  "University of Ghana",
  "ICAMMDA, Federal University Oye-Ekiti, Nigeria",
];

export default function About() {
  const c = useSiteContent();
  const { data: team, isLoading } = useListTeamMembers();
  const director = team?.find((m) => m.role === "director");

  const units = [
    { icon: FlaskConical, number: "01", title: c("about.units.01.title", "Research & Modelling Unit"), desc: c("about.units.01.desc", "Developing mathematical models, epidemiological analyses, and policy-relevant research. Our work spans malaria, schistosomiasis, Lassa fever, and vaccine-preventable diseases.") },
    { icon: GraduationCap, number: "02", title: c("about.units.02.title", "Capacity Building & Training"), desc: c("about.units.02.desc", "Workshops, short courses, and mentorship programmes equipping African researchers with cutting-edge analytical and modelling skills.") },
    { icon: Globe, number: "03", title: c("about.units.03.title", "International Partnerships"), desc: c("about.units.03.desc", "Through WAMCAD and beyond, active collaborations with universities, research centres, and public health agencies across West Africa, Europe, and North America.") },
    { icon: Users, number: "04", title: c("about.units.04.title", "Community & Mentorship"), desc: c("about.units.04.desc", "Journal clubs to book reading circles — our community-oriented approach ensures researchers grow together and support each other's professional development.") },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/section-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101e]/97 via-[#07101e]/92 to-[#07101e]/80" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">Who We Are</p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-6" data-testid="about-title">
            About<br /><em className="text-gradient">ICAMMDA</em>
          </h1>
          <p className="text-white/45 text-lg max-w-2xl leading-relaxed">
            {c("about.hero.subtitle", "Empowering Africa's health future through rigorous analytics, bold innovation, and sustainable capacity building.")}
          </p>
        </div>
      </section>

      {/* ═══════════ OVERVIEW ═══════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20" data-testid="about-overview">
        {/* Research desk image — full width visual */}
        <div className="rounded-2xl overflow-hidden mb-12 relative aspect-[21/8]">
          <img src="/research-desk.png" alt="ICAMMDA Research Environment" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07101e]/80 via-[#07101e]/20 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8">
            <div className="max-w-xs">
              <p className="text-white font-serif text-xl leading-snug mb-2">Where Mathematics<br />Meets Medicine.</p>
              <p className="text-white/50 text-xs leading-relaxed">Our laboratory hosts world-class computing, simulation, and modelling resources.</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-4">Our Context</p>
            <p className="text-foreground text-lg leading-relaxed mb-4">
              {c("about.overview.body1", "International Centre for Applied Mathematical Modelling and Data Analytics (ICAMMDA), Federal University Oye-Ekiti, Ekiti State, Nigeria is a member of the West Africa Mathematical Modelling Capacity Development (WAMCAD) which is an Anglophone – Francophone – Lusophone partnership comprising several International Research Institution: University of Thies, Senegal; University of Conakry, Guinea; Bandim Health Project, Guinea Bissau; University of Ghana and International Centre for Applied Mathematical Modelling and Data Analytics, Federal University Oye-Ekiti, Ekiti State, Nigeria.")}
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
                <p>{c("about.director.letter.p1", "Welcome to the International Centre for Applied Mathematical Modelling and Data Analytics (ICAMMDA). At ICAMMDA, we believe science and data should do more than sit in reports. They should guide decisions and save lives.")}</p>
                <p>{c("about.director.letter.p2", "Our team is committed to building tools that address real public health challenges, training Africa's next generation of scientific leaders, and working closely with partners across the continent and beyond.")}</p>
                <p>{c("about.director.letter.p3", "Our passion is driven by purpose — to create solutions rooted in Africa and relevant to the world. We are building something here that will last generations, and I invite you to be part of it.")}</p>
                <p className="font-medium text-foreground">Warm regards,</p>
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

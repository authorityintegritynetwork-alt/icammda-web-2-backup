import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { FlaskConical, Microscope, Bug, Droplets, Brain, Heart, Users } from "lucide-react";

const researchAreas = [
  {
    icon: Bug,
    title: "Malaria Modelling & Forecasting",
    description:
      "Supporting targeted interventions and early warning systems across endemic regions through advanced compartmental and agent-based models.",
  },
  {
    icon: FlaskConical,
    title: "Vaccine Preventable Diseases (VPD)",
    description:
      "Harnessing data and modelling to strengthen vaccine strategies and eliminate preventable diseases through optimised immunisation programmes.",
  },
  {
    icon: Microscope,
    title: "Lassa Fever & Emerging Infections",
    description:
      "Developing models that help predict outbreaks and guide rapid response for Lassa fever and other emerging infectious threats in West Africa.",
  },
  {
    icon: Droplets,
    title: "Cholera Dynamics & Intervention",
    description:
      "Helping to predict outbreaks and optimise response strategies for cholera-prone regions, integrating environmental and epidemiological data.",
  },
  {
    icon: Brain,
    title: "Cerebrospinal Meningitis (CSM)",
    description:
      "Supporting surveillance, prevention, and emergency response plans for meningitis outbreaks across the meningitis belt of sub-Saharan Africa.",
  },
  {
    icon: Heart,
    title: "Neglected Tropical Diseases (NTDs)",
    description:
      "Creating models to guide elimination strategies for diseases that disproportionately affect underserved communities across the continent.",
  },
];

const researchGroups = [
  {
    name: "Malaria Modelling Research Group",
    members: [
      { name: "Afeez ABIDEMI (Ph.D)", role: "Post-doctoral Scientist", email: "afeez.abidemi@icammda.org" },
      { name: "Oluwaseun MOGBOJURI", role: "PhD Scholar", email: "oluwaseun.mogbojuri@icammda.org" },
      { name: "Dolapo ONIYELU", role: "PhD Scholar", email: "dolapo.oniyelu@icammda.org" },
      { name: "Aaron Onyebuchi NWANA", role: "PhD Scholar", email: "aaron.nwana@icammda.org" },
      { name: "Idowu Isaac OLASUPO", role: "PhD Scholar", email: "idowu.olasupo@icammda.org" },
      { name: "Samuel Abidemi OSIKOYA", role: "PhD Scholar", email: "samuel.osikoya@icammda.org" },
      { name: "Oluwasegun KOSOKO", role: "PhD Scholar", email: null },
      { name: "Steven IKEDIASHI", role: "MSc Scholar", email: "steven.ikediashi@icammda.org" },
      { name: "Happiness ISMAIL", role: "MSc Scholar", email: "happiness.ismail@icammda.org" },
    ],
  },
  {
    name: "Neglected Tropical Diseases Research Group",
    members: [
      { name: "Ronke OLORUNFEMI", role: "PhD Scholar", email: null },
      { name: "Samson OLAGBAMI", role: "MSc Scholar", email: "samson.olagbami@icammda.org" },
    ],
  },
  {
    name: "Cerebrospinal Meningitis Research Group",
    members: [
      { name: "Gabriel OGBAN", role: "PhD Scholar", email: null },
    ],
  },
  {
    name: "Lassa Fever Modelling Research Group",
    members: [
      { name: "Itunu Olayinka OMOSUYI", role: "PhD Student", email: null },
      { name: "Sodiq OROGUN", role: "MSc Student", email: null },
    ],
  },
];

const visitingScholars = [
  { name: "Dolapo BAKARE", affiliation: "NYSC" },
  { name: "Faith OSAMOKA (Ph.D)", affiliation: "FUOYE" },
  { name: "Omodasola ADEBISI", affiliation: "University of Ibadan" },
  { name: "Testimony OBALADE", affiliation: "Obafemi Awolowo University" },
  { name: "Charis AKANBI", affiliation: "Bowen University" },
];

function getInitials(name: string) {
  return name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export default function Research() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/section-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101e]/97 via-[#07101e]/92 to-[#07101e]/80" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">Science for Impact</p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-6">
            Research &amp;<br /><em className="text-gradient">Projects</em>
          </h1>
          <p className="text-white/45 text-lg max-w-2xl leading-relaxed">
            Shaping public health with data, models, and insight.
          </p>
        </div>
      </section>

      {/* ═══════════ OUR FOCUS ═══════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3">
            <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-4">Our Focus</p>
            <h2 className="font-serif text-foreground text-3xl sm:text-4xl leading-snug mb-6">
              Transforming data &amp; models into real-world impact
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At ICAMMDA, our research is driven by a shared purpose: to transform data and models into practical solutions that improve health outcomes and strengthen health systems across Africa.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We are at the forefront of using science for impact. By combining mathematical modelling, epidemiology, computer science, and advanced analytics, we tackle some of the region's most urgent public health challenges — from infectious diseases like malaria, cholera, and Lassa fever to broader health system issues such as resource allocation and pandemic preparedness.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our vision is to build a future where African health decisions are powered by local data, local expertise, and homegrown innovation — creating lasting impact for generations to come.
            </p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="bg-[#07101e] rounded-2xl p-6">
              <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-4">Our Approach</p>
              <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
                <li className="flex gap-2.5 items-start"><span className="text-cyan-400 mt-0.5">→</span> Cross-disciplinary teams: mathematics, biology, statistics, epidemiology &amp; computer science</li>
                <li className="flex gap-2.5 items-start"><span className="text-cyan-400 mt-0.5">→</span> Partnerships with governments, national disease control programmes, NGOs &amp; international agencies</li>
                <li className="flex gap-2.5 items-start"><span className="text-cyan-400 mt-0.5">→</span> Locally relevant, scientifically rigorous, and actionable outputs</li>
                <li className="flex gap-2.5 items-start"><span className="text-cyan-400 mt-0.5">→</span> Evidence-based strategies to guide national policy decisions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ RESEARCH AREAS ═══════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: "url('/hero-bg.png')" }} />
        <div className="absolute inset-0 bg-[#07101e]/90" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-3">Diseases &amp; Health Priorities</p>
            <h2 className="font-serif text-white text-3xl sm:text-4xl">Our Research Areas</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="bg-white/5 border border-white/8 rounded-2xl p-6 hover:border-cyan-500/30 hover:bg-white/8 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2 leading-snug">{area.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{area.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ RESEARCH GROUPS ═══════════ */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
        <div className="mb-14">
          <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-3">Scientific Teams</p>
          <h2 className="font-serif text-foreground text-3xl sm:text-4xl">Research Groups</h2>
        </div>

        <div className="space-y-14">
          {researchGroups.map((group) => (
            <div key={group.name}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <h3 className="text-foreground font-semibold text-lg">{group.name}</h3>
                <div className="flex-1 h-px bg-border" />
                <span className="text-muted-foreground text-xs">{group.members.length} member{group.members.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.members.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center gap-4 bg-muted/40 rounded-xl p-4 border border-border/60"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-600/30 to-cyan-800/40 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <span className="text-cyan-300 text-xs font-bold">{getInitials(member.name)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground text-sm font-medium leading-snug truncate">{member.name}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{member.role}</p>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-cyan-600 text-[10px] hover:text-cyan-500 transition-colors truncate block mt-0.5"
                        >
                          {member.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Visiting Scholars ── */}
        <div className="mt-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h3 className="text-foreground font-semibold text-lg">Visiting Scholars &amp; Interns</h3>
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-xs">{visitingScholars.length} members</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visitingScholars.map((scholar) => (
              <div
                key={scholar.name}
                className="flex items-center gap-4 bg-muted/40 rounded-xl p-4 border border-border/60"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-600/20 to-violet-800/30 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <span className="text-violet-300 text-xs font-bold">{getInitials(scholar.name)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-foreground text-sm font-medium leading-snug">{scholar.name}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{scholar.affiliation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

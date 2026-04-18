import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { FlaskConical, Microscope, Bug, Droplets, Brain, Heart, Users, BookOpen, ExternalLink } from "lucide-react";
import { useListResearchGroups, useListResearchMembers, useListResearchPublications } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteContent } from "@/hooks/useSiteContent";

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

function getPhotoSrc(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("/objects/")) return `/api/storage/objects/${url.slice("/objects/".length)}`;
  return url;
}

function MemberCard({ member, variant = "cyan" }: { member: { id: number; name: string; role: string; email?: string | null; photoUrl?: string | null; affiliation?: string | null }; variant?: "cyan" | "violet" }) {
  const colors = variant === "violet"
    ? "from-violet-600/30 to-violet-800/40 border-violet-500/20 text-violet-300"
    : "from-cyan-600/30 to-cyan-800/40 border-cyan-500/20 text-cyan-300";

  return (
    <div className="flex items-center gap-4 bg-muted/40 rounded-xl p-4 border border-border/60">
      {member.photoUrl ? (
        <img
          src={getPhotoSrc(member.photoUrl)}
          alt={member.name}
          className="w-11 h-11 rounded-full object-cover shrink-0 border border-border"
        />
      ) : (
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${colors.split(" ").slice(0, 2).join(" ")} border ${colors.split(" ")[2]} flex items-center justify-center shrink-0`}>
          <span className={`${colors.split(" ")[3]} text-xs font-bold`}>{getInitials(member.name)}</span>
        </div>
      )}
      <div className="min-w-0">
        <p className="text-foreground text-sm font-medium leading-snug truncate">{member.name}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{member.role}{member.affiliation ? ` · ${member.affiliation}` : ""}</p>
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
  );
}

function GroupSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-64 rounded" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    </div>
  );
}

export default function Research() {
  const c = useSiteContent();
  const { data: groups, isLoading: groupsLoading } = useListResearchGroups();
  const { data: visitingMembers, isLoading: visitorsLoading } = useListResearchMembers({ visiting: true } as Parameters<typeof useListResearchMembers>[0]);
  const { data: publications, isLoading: pubsLoading } = useListResearchPublications();

  const researchAreas = [
    { icon: Bug,      title: c("research.areas.01.title", "Malaria Modelling & Forecasting"),        description: c("research.areas.01.desc", "Supporting targeted interventions and early warning systems across endemic regions through advanced compartmental and agent-based models.") },
    { icon: FlaskConical, title: c("research.areas.02.title", "Vaccine Preventable Diseases (VPD)"), description: c("research.areas.02.desc", "Harnessing data and modelling to strengthen vaccine strategies and eliminate preventable diseases through optimised immunisation programmes.") },
    { icon: Microscope, title: c("research.areas.03.title", "Lassa Fever & Emerging Infections"),   description: c("research.areas.03.desc", "Developing models that help predict outbreaks and guide rapid response for Lassa fever and other emerging infectious threats in West Africa.") },
    { icon: Droplets, title: c("research.areas.04.title", "Cholera Dynamics & Intervention"),        description: c("research.areas.04.desc", "Helping to predict outbreaks and optimise response strategies for cholera-prone regions, integrating environmental and epidemiological data.") },
    { icon: Brain,    title: c("research.areas.05.title", "Cerebrospinal Meningitis (CSM)"),          description: c("research.areas.05.desc", "Supporting surveillance, prevention, and emergency response plans for meningitis outbreaks across the meningitis belt of sub-Saharan Africa.") },
    { icon: Heart,    title: c("research.areas.06.title", "Neglected Tropical Diseases (NTDs)"),      description: c("research.areas.06.desc", "Creating models to guide elimination strategies for diseases that disproportionately affect underserved communities across the continent.") },
  ];

  const visitors = (visitingMembers ?? []).filter((m) => m.groupId == null || m.isVisiting);

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
            {c("research.hero.subtitle", "Rigorous science. Real-world impact. Tackling Africa's most pressing public health challenges through data-driven models.")}
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
              By combining mathematical modelling, epidemiology, computer science, and advanced analytics, we tackle some of the region's most urgent public health challenges — from infectious diseases like malaria, cholera, and Lassa fever to broader health system issues such as resource allocation and pandemic preparedness.
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
          {groupsLoading ? (
            <>
              <GroupSkeleton />
              <GroupSkeleton />
            </>
          ) : !groups || groups.length === 0 ? (
            <p className="text-muted-foreground text-sm">No research groups have been added yet.</p>
          ) : (
            groups.map((group) => (
              <div key={group.id}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <h3 className="text-foreground font-semibold text-lg">{group.name}</h3>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-muted-foreground text-xs">{group.members.length} member{group.members.length !== 1 ? "s" : ""}</span>
                </div>
                {group.description && <p className="text-muted-foreground text-sm mb-4 -mt-2">{group.description}</p>}
                {group.members.length === 0 ? (
                  <p className="text-muted-foreground text-xs italic">No members yet.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.members.map((member) => (
                      <MemberCard key={member.id} member={member} variant="cyan" />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ── Visiting Scholars ── */}
        {(visitorsLoading || (visitors && visitors.length > 0)) && (
          <div className="mt-14">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <h3 className="text-foreground font-semibold text-lg">Visiting Scholars &amp; Interns</h3>
              <div className="flex-1 h-px bg-border" />
              {!visitorsLoading && <span className="text-muted-foreground text-xs">{visitors.length} member{visitors.length !== 1 ? "s" : ""}</span>}
            </div>
            {visitorsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visitors.map((member) => (
                  <MemberCard key={member.id} member={member} variant="violet" />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ═══════════ PUBLICATIONS ═══════════ */}
      <section className="relative py-20 overflow-hidden border-t border-border/60">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/30 to-transparent dark:from-cyan-500/5" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="mb-12">
            <p className="text-cyan-600 text-xs font-bold tracking-widest uppercase mb-3">Scholarly Outputs</p>
            <h2 className="font-serif text-foreground text-3xl sm:text-4xl mb-4">Publications</h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Peer-reviewed journal articles, book chapters, and research reports authored by ICAMMDA scientists and collaborators.
            </p>
          </div>

          {pubsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : !publications || publications.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl">
              <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">Publications will appear here as they are added.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {publications.map((p) => {
                const link = p.url || (p.doi ? `https://doi.org/${p.doi}` : null);
                const Wrapper: React.ElementType = link ? "a" : "div";
                const wrapperProps = link
                  ? { href: link, target: "_blank", rel: "noopener noreferrer" }
                  : {};
                return (
                  <Wrapper
                    key={p.id}
                    {...wrapperProps}
                    className={`group block bg-card border border-border/70 rounded-2xl p-5 sm:p-6 transition-all ${link ? "hover:border-cyan-500/50 hover:shadow-md cursor-pointer" : ""}`}
                    data-testid={`publication-${p.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-foreground text-lg leading-snug group-hover:text-cyan-700 transition-colors">
                          {p.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1.5">{p.authors}</p>
                        {(p.journal || p.year) && (
                          <p className="text-muted-foreground/80 text-xs mt-1.5">
                            {p.journal && <span className="italic">{p.journal}</span>}
                            {p.journal && p.year ? " · " : ""}
                            {p.year && <span className="font-medium">{p.year}</span>}
                          </p>
                        )}
                        {p.abstract && (
                          <p className="text-foreground/70 text-sm leading-relaxed mt-3 line-clamp-3">
                            {p.abstract}
                          </p>
                        )}
                        {(p.doi || link) && (
                          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-border/60">
                            {p.doi && (
                              <span className="text-[11px] font-mono text-muted-foreground">DOI: {p.doi}</span>
                            )}
                            {link && (
                              <span className="inline-flex items-center gap-1 text-cyan-600 text-xs font-semibold group-hover:text-cyan-700">
                                Read publication <ExternalLink size={11} />
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

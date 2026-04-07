import { Users, User, GraduationCap, Briefcase } from "lucide-react";
import { useListTeamMembers } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const ROLE_CONFIG: Record<string, { label: string; icon: typeof Users; bg: string; tag: string }> = {
  director: { label: "Director", icon: User, bg: "bg-amber-50/60 border-amber-200/50", tag: "bg-amber-50 text-amber-700" },
  researcher: { label: "Researchers", icon: GraduationCap, bg: "bg-teal-50/60 border-teal-200/50", tag: "bg-teal-50 text-teal-700" },
  postdoc: { label: "Postdoctoral Fellows", icon: GraduationCap, bg: "bg-cyan-50/60 border-cyan-200/50", tag: "bg-cyan-50 text-cyan-700" },
  staff: { label: "Staff", icon: Briefcase, bg: "bg-violet-50/60 border-violet-200/50", tag: "bg-violet-50 text-violet-700" },
};
const ROLE_ORDER = ["director", "researcher", "postdoc", "staff"];

export default function Team() {
  const { data: members, isLoading } = useListTeamMembers();

  const grouped = ROLE_ORDER.reduce<Record<string, NonNullable<typeof members>>>((acc, role) => {
    const group = members?.filter((m) => m.role === role) ?? [];
    if (group.length) acc[role] = group;
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="relative bg-[#0a0c14] overflow-hidden pt-32 pb-20">
        <div className="absolute top-0 right-1/4 w-[500px] h-[250px] bg-teal-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-4">People</p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-4" data-testid="team-page-title">
            Our<br /><em className="text-gradient">Team</em>
          </h1>
          <p className="text-white/40 text-lg max-w-xl">
            World-class scientists, researchers, and staff committed to advancing public health through mathematics and data.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-20 space-y-20" data-testid="team-section">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-24 text-muted-foreground" data-testid="no-team-message">
            <Users size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-serif text-2xl">Team members coming soon.</p>
          </div>
        ) : (
          ROLE_ORDER.map((role) => {
            const group = grouped[role];
            if (!group?.length) return null;
            const config = ROLE_CONFIG[role];
            const Icon = config.icon;
            return (
              <div key={role} data-testid={`team-group-${role}`}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#0a0c14] text-teal-400 flex items-center justify-center">
                      <Icon size={13} />
                    </div>
                    <h2 className="font-serif text-foreground text-2xl">{config.label}</h2>
                  </div>
                  <div className="flex-1 h-px bg-border/60" />
                  <span className="text-xs text-muted-foreground font-mono">{group.length}</span>
                </div>

                <div className={`grid ${role === "director" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"} gap-5`}>
                  {group.map((member) => (
                    <div
                      key={member.id}
                      className={`border ${config.bg} rounded-2xl p-5 hover-lift transition-all`}
                      data-testid={`team-member-${member.id}`}
                    >
                      <div className={`${role === "director" ? "w-20 h-20" : "w-16 h-16"} rounded-xl overflow-hidden mb-4 bg-white/70 border border-border/30`}>
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                            <User size={role === "director" ? 32 : 24} />
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${config.tag}`}>
                        {member.title ?? config.label}
                      </span>
                      <h3 className="font-serif text-foreground text-base mt-2" data-testid={`member-name-${member.id}`}>
                        {member.name}
                      </h3>
                      {member.bio && (
                        <p className="text-muted-foreground text-xs leading-relaxed mt-2 line-clamp-3" data-testid={`member-bio-${member.id}`}>
                          {member.bio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      <PublicFooter />
    </div>
  );
}

import { Mail, Users } from "lucide-react";
import { useListTeamMembers } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const roleLabel: Record<string, string> = {
  director: "Director",
  researcher: "Researcher",
  postdoc: "Postdoctoral Scientist",
  staff: "Staff",
};

const roleOrder = ["director", "researcher", "postdoc", "staff"];

export default function Team() {
  const { data: members, isLoading } = useListTeamMembers();

  const grouped = roleOrder.reduce((acc, role) => {
    const group = members?.filter((m) => m.role === role) ?? [];
    if (group.length > 0) acc.push({ role, members: group });
    return acc;
  }, [] as { role: string; members: typeof members }[]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      <section className="bg-[hsl(222,47%,11%)] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">People</p>
          <h1 className="text-4xl font-bold font-serif mb-3" data-testid="team-page-title">Our Team</h1>
          <p className="text-slate-300">Meet the researchers, scientists, and staff powering ICAMMDA's mission.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
          </div>
        ) : grouped.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground" data-testid="no-team-message">
            <Users size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium">Team information coming soon.</p>
          </div>
        ) : (
          grouped.map(({ role, members: group }) => (
            <div key={role} className="mb-12" data-testid={`team-group-${role}`}>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold font-serif text-foreground">{roleLabel[role] || role}</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className={`grid gap-6 ${role === "director" ? "sm:grid-cols-1 max-w-sm" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                {group?.map((member) => (
                  <div
                    key={member.id}
                    className="bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    data-testid={`team-member-${member.id}`}
                  >
                    <div className="aspect-[4/3] bg-muted overflow-hidden">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          data-testid={`member-photo-${member.id}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <Users size={32} className="text-primary/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <Badge variant="secondary" className="text-xs mb-2">{roleLabel[member.role] || member.role}</Badge>
                      <h3 className="font-semibold text-foreground" data-testid={`member-name-${member.id}`}>{member.name}</h3>
                      <p className="text-sm text-primary font-medium mb-2" data-testid={`member-title-${member.id}`}>{member.title}</p>
                      {member.bio && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{member.bio}</p>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                          data-testid={`member-email-${member.id}`}
                        >
                          <Mail size={12} /> {member.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <PublicFooter />
    </div>
  );
}

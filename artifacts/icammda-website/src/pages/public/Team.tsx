import { Users, GraduationCap, Briefcase, Mail } from "lucide-react";
import { useListTeamMembers } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const AVATAR_PALETTE = [
  { bg: "#164e63", text: "#a5f3fc" },
  { bg: "#134e4a", text: "#99f6e4" },
  { bg: "#312e81", text: "#c7d2fe" },
  { bg: "#4c1d95", text: "#ddd6fe" },
  { bg: "#78350f", text: "#fde68a" },
  { bg: "#1e3a8a", text: "#bfdbfe" },
  { bg: "#831843", text: "#fbcfe8" },
  { bg: "#14532d", text: "#bbf7d0" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function getPhotoSrc(photoUrl: string | null | undefined): string | null {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("/objects/")) {
    return `/api/storage/objects/${photoUrl.slice("/objects/".length)}`;
  }
  return photoUrl;
}

const ROLE_CONFIG: Record<string, { label: string; icon: typeof Users; bg: string; tag: string }> = {
  director: { label: "Director", icon: GraduationCap, bg: "bg-amber-50/60 border-amber-200/50", tag: "bg-amber-50 text-amber-700" },
  researcher: { label: "Researchers", icon: GraduationCap, bg: "bg-cyan-50/60 border-cyan-200/50", tag: "bg-cyan-50 text-cyan-700" },
  postdoc: { label: "Postdoctoral Fellows", icon: GraduationCap, bg: "bg-cyan-50/60 border-cyan-200/50", tag: "bg-cyan-50 text-cyan-700" },
  staff: { label: "Staff", icon: Briefcase, bg: "bg-violet-50/60 border-violet-200/50", tag: "bg-violet-50 text-violet-700" },
};
const ROLE_ORDER = ["director", "researcher", "postdoc", "staff"];

interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  size: "lg" | "md";
}

function MemberAvatar({ name, photoUrl, size }: AvatarProps) {
  const src = getPhotoSrc(photoUrl);
  const dim = size === "lg" ? "w-20 h-20" : "w-16 h-16";
  const textSize = size === "lg" ? "text-xl" : "text-base";
  const color = getAvatarColor(name);

  if (src) {
    return (
      <div className={`${dim} rounded-xl overflow-hidden shrink-0 border border-border/30`}>
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.style.background = color.bg;
              parent.innerHTML = `<span style="color:${color.text};font-size:${size === "lg" ? "1.25rem" : "1rem"};font-weight:600;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${getInitials(name)}</span>`;
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${dim} rounded-xl overflow-hidden shrink-0 flex items-center justify-center font-bold ${textSize}`}
      style={{ background: color.bg, color: color.text }}
    >
      {getInitials(name)}
    </div>
  );
}

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

      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/section-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101e]/97 via-[#07101e]/92 to-[#07101e]/80" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">People</p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-4" data-testid="team-page-title">
            Our<br /><em className="text-gradient">Team</em>
          </h1>
          <p className="text-white/40 text-lg max-w-xl">
            World-class scientists, researchers, and staff committed to advancing public health through mathematics and data.
          </p>
        </div>
      </section>

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
                    <div className="w-7 h-7 rounded-lg bg-[#07101e] text-cyan-400 flex items-center justify-center">
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
                      <MemberAvatar
                        name={member.name}
                        photoUrl={member.photoUrl}
                        size={role === "director" ? "lg" : "md"}
                      />
                      <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full mt-4 ${config.tag}`}>
                        {config.label}
                      </span>
                      <h3 className="font-serif text-foreground text-base mt-2" data-testid={`member-name-${member.id}`}>
                        {member.name}
                      </h3>
                      <p className="text-muted-foreground text-xs mt-0.5">{member.title}</p>
                      {member.bio && (
                        <p className="text-muted-foreground text-xs leading-relaxed mt-2 line-clamp-3" data-testid={`member-bio-${member.id}`}>
                          {member.bio}
                        </p>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-500 mt-3 transition-colors"
                        >
                          <Mail size={11} />
                          <span className="truncate">{member.email}</span>
                        </a>
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

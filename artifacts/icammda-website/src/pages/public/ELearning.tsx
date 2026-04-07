import { useState } from "react";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  PlayCircle,
  ChevronDown,
  BookOpen,
  GraduationCap,
  Globe,
  Activity,
  ArrowRight,
  ExternalLink,
  Youtube,
  Clock,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface YTThumbnail { url: string; width?: number; height?: number }
interface YTSnippet {
  title: string;
  description: string;
  thumbnails: { default?: YTThumbnail; medium?: YTThumbnail; high?: YTThumbnail; maxres?: YTThumbnail };
  publishedAt?: string;
  resourceId?: { videoId: string };
}
interface YTPlaylist { id: string; snippet: YTSnippet; contentDetails: { itemCount: number } }
interface YTPlaylistItem { id: string; snippet: YTSnippet }

const CHANNEL_URL = "https://www.youtube.com/@IcammdaFuoye";

/* ─── Accent cycling ────────────────────────────────────────────────────── */
const ACCENTS = ["cyan", "violet", "amber", "green", "rose", "blue"] as const;
type Accent = typeof ACCENTS[number];
const accentClasses: Record<Accent, { icon: string; badge: string; play: string; hover: string }> = {
  cyan:   { icon: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",   badge: "bg-cyan-500/10 text-cyan-300",   play: "text-cyan-400",   hover: "hover:border-cyan-500/30" },
  violet: { icon: "bg-violet-500/15 text-violet-400 border-violet-500/20", badge: "bg-violet-500/10 text-violet-300", play: "text-violet-400", hover: "hover:border-violet-500/30" },
  amber:  { icon: "bg-amber-500/15 text-amber-400 border-amber-500/20",  badge: "bg-amber-500/10 text-amber-300",  play: "text-amber-400",  hover: "hover:border-amber-500/30" },
  green:  { icon: "bg-green-500/15 text-green-400 border-green-500/20",  badge: "bg-green-500/10 text-green-300",  play: "text-green-400",  hover: "hover:border-green-500/30" },
  rose:   { icon: "bg-rose-500/15 text-rose-400 border-rose-500/20",    badge: "bg-rose-500/10 text-rose-300",    play: "text-rose-400",   hover: "hover:border-rose-500/30" },
  blue:   { icon: "bg-blue-500/15 text-blue-400 border-blue-500/20",    badge: "bg-blue-500/10 text-blue-300",    play: "text-blue-400",   hover: "hover:border-blue-500/30" },
};

const stats = [
  { value: "15+", label: "Playlists" },
  { value: "50+", label: "Lectures" },
  { value: "Free", label: "Full Access" },
  { value: "Africa-wide", label: "Reach" },
];

/* ─── API fetchers ──────────────────────────────────────────────────────── */
const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchPlaylists(): Promise<YTPlaylist[]> {
  const res = await fetch(`${apiBase}/api/youtube/playlists`);
  if (!res.ok) throw new Error("Failed to load playlists");
  const data = await res.json();
  return (data.items ?? []) as YTPlaylist[];
}

async function fetchPlaylistItems(playlistId: string): Promise<YTPlaylistItem[]> {
  const res = await fetch(`${apiBase}/api/youtube/playlist/${playlistId}`);
  if (!res.ok) throw new Error("Failed to load videos");
  const data = await res.json();
  return (data.items ?? []) as YTPlaylistItem[];
}

/* ─── Sub-component: expanded playlist videos ───────────────────────────── */
function PlaylistVideos({ playlistId, accent }: { playlistId: string; accent: Accent }) {
  const ac = accentClasses[accent];
  const { data: videos, isLoading } = useQuery({
    queryKey: ["youtube-playlist", playlistId],
    queryFn: () => fetchPlaylistItems(playlistId),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-xl bg-white/5" />)}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return <p className="text-white/30 text-sm italic">No videos in this playlist yet.</p>;
  }

  return (
    <div className="space-y-2">
      {videos.map((v, idx) => {
        const videoId = v.snippet.resourceId?.videoId;
        const thumb = v.snippet.thumbnails?.medium?.url ?? v.snippet.thumbnails?.default?.url;
        return (
          <a
            key={v.id}
            href={videoId ? `https://www.youtube.com/watch?v=${videoId}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/6 group transition-all duration-200 hover:bg-white/9 ${ac.hover}`}
          >
            {/* Thumbnail */}
            {thumb ? (
              <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 relative">
                <img src={thumb} alt={v.snippet.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle size={16} className="text-white" />
                </div>
              </div>
            ) : (
              <div className={`w-14 h-10 rounded-lg shrink-0 flex items-center justify-center border ${ac.icon}`}>
                <PlayCircle size={14} />
              </div>
            )}
            {/* Index + title */}
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-sm group-hover:text-white transition-colors leading-snug line-clamp-2">
                {v.snippet.title}
              </p>
            </div>
            <span className={`shrink-0 text-[10px] font-mono ${ac.play} opacity-0 group-hover:opacity-100 transition-opacity`}>
              {String(idx + 1).padStart(2, "0")}
            </span>
            <ExternalLink size={12} className="shrink-0 text-white/20 group-hover:text-white/50 transition-colors" />
          </a>
        );
      })}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function ELearning() {
  const [openId, setOpenId] = useState<string | null>(null);

  const { data: playlists, isLoading, isError } = useQuery({
    queryKey: ["youtube-playlists"],
    queryFn: fetchPlaylists,
    staleTime: 5 * 60 * 1000,
  });

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
          <div className="flex flex-wrap gap-3">
            <a
              href="#courses"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-cyan-400 text-[#07101e] font-semibold text-sm hover:bg-cyan-300 transition-colors"
            >
              <PlayCircle size={16} /> Start Learning Now
            </a>
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-white/15 text-white/70 text-sm font-medium hover:border-white/30 hover:text-white transition-all"
            >
              <Youtube size={15} /> Visit our YouTube
            </a>
          </div>
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
              New lessons, seminars and recorded workshops are added regularly — subscribe to our YouTube channel to be notified.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="bg-[#07101e] rounded-2xl p-6 border border-white/8">
              <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-4">Who This Is For</p>
              <ul className="space-y-3">
                {[
                  { icon: GraduationCap, text: "Undergraduate & postgraduate students" },
                  { icon: BookOpen,      text: "Early-career researchers & postdocs" },
                  { icon: Activity,      text: "Public health practitioners" },
                  { icon: Globe,         text: "Professionals across Africa & beyond" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-white/60 text-sm">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-cyan-400" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-5 border-t border-white/8">
                <a
                  href={CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors"
                >
                  <Youtube size={14} /> Subscribe on YouTube <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PLAYLISTS / COURSES ═══════════ */}
      <section id="courses" className="relative py-20 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15" style={{ backgroundImage: "url('/hero-bg.png')" }} />
        <div className="absolute inset-0 bg-[#07101e]/92" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-3">Curriculum</p>
            <h2 className="font-serif text-white text-3xl sm:text-4xl">Course Playlists</h2>
            <p className="text-white/40 text-sm mt-3 max-w-xl mx-auto">
              All content is hosted on YouTube and updated automatically. Click a playlist to browse its lectures.
            </p>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-2xl bg-white/5" />)}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="text-center py-16">
              <p className="text-white/40 text-sm mb-4">Could not load playlists right now.</p>
              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold hover:text-cyan-300"
              >
                <Youtube size={14} /> Browse on YouTube <ArrowRight size={12} />
              </a>
            </div>
          )}

          {/* Playlist accordion */}
          {playlists && playlists.length > 0 && (
            <div className="space-y-3">
              {playlists.map((pl, idx) => {
                const accent = ACCENTS[idx % ACCENTS.length];
                const ac = accentClasses[accent];
                const isOpen = openId === pl.id;
                const thumb = pl.snippet.thumbnails?.medium?.url ?? pl.snippet.thumbnails?.default?.url;

                return (
                  <div
                    key={pl.id}
                    className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                      isOpen ? "border-white/14 bg-white/7" : "border-white/8 bg-white/4 hover:bg-white/6"
                    }`}
                  >
                    {/* Header */}
                    <button
                      className="w-full flex items-center gap-4 p-5 text-left"
                      onClick={() => setOpenId(isOpen ? null : pl.id)}
                    >
                      {/* Number */}
                      <div className="shrink-0 w-8 h-8 rounded-full border border-white/12 flex items-center justify-center">
                        <span className="text-white/30 text-xs font-bold font-mono">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Thumbnail (if available) or icon */}
                      {thumb ? (
                        <div className="shrink-0 w-14 h-10 rounded-lg overflow-hidden">
                          <img src={thumb} alt={pl.snippet.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${ac.icon}`}>
                          <PlayCircle size={17} />
                        </div>
                      )}

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm sm:text-base leading-snug line-clamp-2">
                          {pl.snippet.title}
                        </h3>
                      </div>

                      {/* Video count */}
                      <span className={`hidden sm:flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${ac.badge}`}>
                        <Clock size={10} />{pl.contentDetails.itemCount} video{pl.contentDetails.itemCount !== 1 ? "s" : ""}
                      </span>

                      {/* Chevron */}
                      <ChevronDown
                        size={17}
                        className={`shrink-0 transition-transform duration-300 ${ac.play} ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Videos */}
                    {isOpen && (
                      <div className="px-5 pb-5 pl-[5.5rem]">
                        {pl.snippet.description && (
                          <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-3">{pl.snippet.description}</p>
                        )}
                        <PlaylistVideos playlistId={pl.id} accent={accent} />
                        <a
                          href={`https://www.youtube.com/playlist?list=${pl.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 mt-4 text-xs font-semibold transition-colors ${ac.play} hover:opacity-80`}
                        >
                          <Youtube size={12} /> Open full playlist on YouTube <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400 text-[#07101e] font-semibold text-sm hover:bg-cyan-300 transition-colors"
              >
                <Youtube size={15} /> Visit YouTube Channel
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

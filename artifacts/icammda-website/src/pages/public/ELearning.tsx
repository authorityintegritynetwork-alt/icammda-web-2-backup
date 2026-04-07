import { useState, useEffect } from "react";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  PlayCircle,
  BookOpen,
  GraduationCap,
  Globe,
  Activity,
  ArrowRight,
  Youtube,
  ChevronRight,
  List,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface YTThumbnail { url: string }
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
const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";

/* ─── API fetchers ──────────────────────────────────────────────────────── */
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

/* ─── Stat bar ──────────────────────────────────────────────────────────── */
const stats = [
  { value: "15+", label: "Playlists" },
  { value: "50+", label: "Lectures" },
  { value: "Free", label: "Full Access" },
  { value: "Africa-wide", label: "Reach" },
];

/* ─── Player + Sidebar ───────────────────────────────────────────────────── */
function PlaylistPlayer({ playlist }: { playlist: YTPlaylist }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: videos, isLoading } = useQuery({
    queryKey: ["youtube-playlist", playlist.id],
    queryFn: () => fetchPlaylistItems(playlist.id),
    staleTime: 5 * 60 * 1000,
  });

  // Reset to first video when playlist changes
  useEffect(() => { setActiveIndex(0); }, [playlist.id]);

  const activeVideo = videos?.[activeIndex];
  const activeVideoId = activeVideo?.snippet?.resourceId?.videoId;

  return (
    <div className="flex flex-col lg:flex-row gap-0 rounded-2xl overflow-hidden border border-white/10 bg-[#07101e]">
      {/* Player */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Embed */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {isLoading || !activeVideoId ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="w-14 h-14 rounded-full border-2 border-cyan-400/30 flex items-center justify-center">
                <PlayCircle size={28} className="text-cyan-400/60" />
              </div>
            </div>
          ) : (
            <iframe
              key={activeVideoId}
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=0&rel=0&modestbranding=1`}
              title={activeVideo?.snippet?.title ?? "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* Video meta */}
        <div className="p-5 border-t border-white/8">
          {isLoading ? (
            <Skeleton className="h-5 w-2/3 bg-white/8 rounded-lg" />
          ) : (
            <>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-1">
                {playlist.snippet.title} · {activeIndex + 1} / {videos?.length ?? "…"}
              </p>
              <h3 className="text-white font-semibold text-base leading-snug">
                {activeVideo?.snippet?.title ?? "Select a video"}
              </h3>
            </>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col border-t lg:border-t-0 lg:border-l border-white/8">
        {/* Sidebar header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
          <List size={14} className="text-cyan-400" />
          <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">
            {videos?.length ?? "…"} Videos
          </span>
        </div>

        {/* Video list */}
        <div className="overflow-y-auto flex-1 max-h-[420px] lg:max-h-none">
          {isLoading ? (
            <div className="p-3 space-y-2">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 rounded-xl bg-white/5" />)}
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {videos?.map((v, idx) => {
                const videoId = v.snippet.resourceId?.videoId;
                const thumb = v.snippet.thumbnails?.medium?.url ?? v.snippet.thumbnails?.default?.url;
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all duration-150 ${
                      isActive
                        ? "bg-cyan-500/15 border border-cyan-500/25"
                        : "border border-transparent hover:bg-white/5"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative shrink-0 w-[72px] h-[42px] rounded-lg overflow-hidden bg-white/5">
                      {thumb ? (
                        <img src={thumb} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PlayCircle size={16} className="text-white/20" />
                        </div>
                      )}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                            <PlayCircle size={10} className="text-[#07101e] fill-[#07101e]" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Title + index */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-mono mb-0.5 ${isActive ? "text-cyan-400" : "text-white/25"}`}>
                        {String(idx + 1).padStart(2, "0")}
                      </p>
                      <p className={`text-xs leading-snug line-clamp-2 ${isActive ? "text-white" : "text-white/55"}`}>
                        {v.snippet.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Open on YouTube */}
        <div className="px-4 py-3 border-t border-white/8">
          <a
            href={`https://www.youtube.com/playlist?list=${playlist.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors font-medium"
          >
            <Youtube size={12} /> Open on YouTube <ArrowRight size={10} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function ELearning() {
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  const { data: playlists, isLoading, isError } = useQuery({
    queryKey: ["youtube-playlists"],
    queryFn: fetchPlaylists,
    staleTime: 5 * 60 * 1000,
  });

  // Auto-select first playlist
  useEffect(() => {
    if (playlists && playlists.length > 0 && !activePlaylistId) {
      setActivePlaylistId(playlists[0].id);
    }
  }, [playlists, activePlaylistId]);

  const activePlaylist = playlists?.find((p) => p.id === activePlaylistId) ?? null;

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

      {/* ═══════════ VIDEO PLAYER + PLAYLIST SWITCHER ═══════════ */}
      <section id="courses" className="relative py-20 scroll-mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: "url('/hero-bg.png')" }} />
        <div className="absolute inset-0 bg-[#07101e]/92" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-3">Curriculum</p>
            <h2 className="font-serif text-white text-3xl sm:text-4xl">Course Playlists</h2>
            <p className="text-white/40 text-sm mt-3 max-w-xl mx-auto">
              All content is hosted on YouTube and updated automatically.
            </p>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-[420px] rounded-2xl bg-white/5" />
              <div className="flex gap-2 flex-wrap">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-9 w-40 rounded-xl bg-white/5" />)}
              </div>
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

          {playlists && activePlaylist && (
            <>
              {/* Playlist tab bar */}
              <div className="flex gap-2 flex-wrap mb-5">
                {playlists.map((pl) => {
                  const isActive = pl.id === activePlaylistId;
                  return (
                    <button
                      key={pl.id}
                      onClick={() => setActivePlaylistId(pl.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                        isActive
                          ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                          : "border-white/8 text-white/45 hover:text-white/70 hover:border-white/15 bg-white/3"
                      }`}
                    >
                      <ChevronRight size={11} className={isActive ? "text-cyan-400" : "text-white/20"} />
                      <span className="line-clamp-1 max-w-[180px] text-left">{pl.snippet.title}</span>
                      <span className={`shrink-0 px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-white/6 text-white/30"}`}>
                        {pl.contentDetails.itemCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Player */}
              <PlaylistPlayer key={activePlaylistId} playlist={activePlaylist} />
            </>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

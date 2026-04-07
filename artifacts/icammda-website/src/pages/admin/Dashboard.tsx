import { Link } from "wouter";
import { FileText, Calendar, Users, Handshake, ArrowRight, TrendingUp } from "lucide-react";
import { useGetSiteStats, useGetRecentPosts, useGetUpcomingEvents } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import AdminLayout from "@/components/AdminLayout";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetSiteStats();
  const { data: recentPosts } = useGetRecentPosts();
  const { data: upcomingEvents } = useGetUpcomingEvents();

  const cards = [
    { label: "Total Posts", value: stats?.totalPosts, icon: FileText, href: "/admin/posts", color: "text-blue-500 bg-blue-50" },
    { label: "Total Events", value: stats?.totalEvents, icon: Calendar, href: "/admin/events", color: "text-teal-600 bg-teal-50" },
    { label: "Team Members", value: stats?.totalTeamMembers, icon: Users, href: "/admin/team", color: "text-purple-500 bg-purple-50" },
    { label: "Partners", value: stats?.totalPartners, icon: Handshake, href: "/admin/partners", color: "text-orange-500 bg-orange-50" },
    { label: "Upcoming Events", value: stats?.upcomingEvents, icon: TrendingUp, href: "/admin/events", color: "text-green-500 bg-green-50" },
    { label: "Published Posts", value: stats?.recentPosts, icon: FileText, href: "/admin/posts", color: "text-primary bg-primary/10" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8" data-testid="admin-dashboard">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1 font-serif">Overview</h2>
          <p className="text-sm text-muted-foreground">Welcome to the ICAMMDA admin panel. Manage all website content from here.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4" data-testid="stats-grid">
          {cards.map(({ label, value, icon: Icon, href, color }) => (
            <Link key={label} href={href}>
              <div className="bg-card border border-card-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group" data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon size={18} />
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mb-1" />
                ) : (
                  <p className="text-3xl font-bold text-foreground" data-testid={`stat-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>{value ?? 0}</p>
                )}
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-card border border-card-border rounded-xl p-5" data-testid="recent-posts-widget">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground text-sm">Recent Posts</h3>
              <Link href="/admin/posts" className="text-xs text-primary hover:underline">Manage</Link>
            </div>
            {recentPosts && recentPosts.length > 0 ? (
              <ul className="space-y-2">
                {recentPosts.slice(0, 4).map((post) => (
                  <li key={post.id} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0" data-testid={`recent-post-${post.id}`}>
                    <FileText size={13} className="text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground truncate flex-1">{post.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{format(new Date(post.createdAt), "MMM d")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No posts yet.</p>
            )}
            <Link href="/admin/posts/new">
              <button className="mt-3 w-full text-xs text-primary border border-dashed border-primary/30 rounded-lg py-2 hover:bg-primary/5 transition-colors" data-testid="create-post-quick-btn">
                + Create New Post
              </button>
            </Link>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-5" data-testid="upcoming-events-widget">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground text-sm">Upcoming Events</h3>
              <Link href="/admin/events" className="text-xs text-primary hover:underline">Manage</Link>
            </div>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <ul className="space-y-2">
                {upcomingEvents.slice(0, 4).map((event) => (
                  <li key={event.id} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0" data-testid={`upcoming-event-${event.id}`}>
                    <Calendar size={13} className="text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground truncate flex-1">{event.title}</span>
                    {event.startDate && <span className="text-xs text-muted-foreground shrink-0">{format(new Date(event.startDate), "MMM d")}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming events.</p>
            )}
            <Link href="/admin/events/new">
              <button className="mt-3 w-full text-xs text-primary border border-dashed border-primary/30 rounded-lg py-2 hover:bg-primary/5 transition-colors" data-testid="create-event-quick-btn">
                + Create New Event
              </button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

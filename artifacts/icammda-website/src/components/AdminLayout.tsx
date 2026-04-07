import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  Handshake,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
];

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: Props) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = () => signOut({ redirectUrl: "/" });

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-sidebar text-sidebar-foreground ${mobile ? "p-4" : ""}`}>
      <div className="px-4 py-5 border-b border-sidebar-border flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">IC</span>
        </div>
        <div>
          <p className="font-bold text-sm text-white">ICAMMDA</p>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1" data-testid="admin-nav">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? location === "/admin" : location.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "text-slate-300 hover:bg-sidebar-accent hover:text-white"
              }`}
              data-testid={`admin-nav-${label.toLowerCase()}`}
            >
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        {user && (
          <div className="mb-3 px-2">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="text-sm font-medium text-white truncate" data-testid="admin-user-email">
              {user.primaryEmailAddress?.emailAddress ?? user.username}
            </p>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full border-sidebar-border text-slate-300 hover:text-white hover:bg-destructive hover:border-destructive"
          onClick={handleSignOut}
          data-testid="admin-signout-btn"
        >
          <LogOut size={14} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-60 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-sidebar shadow-xl">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
            data-testid="admin-mobile-menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-semibold text-foreground text-sm" data-testid="admin-page-title">
            {title ?? "Admin"}
          </h1>
          <div className="ml-auto">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors" data-testid="admin-view-site-link">
              View Site
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6" data-testid="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}

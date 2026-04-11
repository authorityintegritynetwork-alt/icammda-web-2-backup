import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  Handshake,
  FlaskConical,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Linkedin,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/research", label: "Research", icon: FlaskConical },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/linkedin", label: "LinkedIn Feed", icon: Linkedin },
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#07101e] text-white">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8 flex items-center gap-3">
        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500" />
          <span className="relative text-black font-bold text-xs z-10">IC</span>
        </div>
        <div>
          <p className="font-bold text-sm text-white tracking-wide">ICAMMDA</p>
          <p className="text-[10px] text-white/30 tracking-widest uppercase">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5" data-testid="admin-nav">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? location === "/admin" : location.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent"
              }`}
              data-testid={`admin-nav-${label.toLowerCase()}`}
            >
              <Icon size={15} />
              {label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Signout */}
      <div className="px-4 py-4 border-t border-white/8 space-y-3">
        {user && (
          <div className="px-1">
            <p className="text-[10px] text-white/25 tracking-widest uppercase">Signed in as</p>
            <p className="text-xs font-medium text-white/60 truncate mt-0.5" data-testid="admin-user-email">
              {user.primaryEmailAddress?.emailAddress ?? user.username}
            </p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/8 transition-all"
          data-testid="admin-signout-btn"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f6]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-56 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-56 shadow-2xl">
            <SidebarContent />
          </div>
          <button className="absolute top-4 right-4 text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-border/60 px-5 sm:px-7 h-14 flex items-center gap-3">
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
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-600 transition-colors"
              data-testid="admin-view-site-link"
            >
              View Site <ExternalLink size={11} />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-7" data-testid="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}

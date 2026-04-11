import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, Show, useClerk, useUser } from "@clerk/react";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import NewsEvents from "@/pages/public/NewsEvents";
import NewsDetail from "@/pages/public/NewsDetail";
import EventDetail from "@/pages/public/EventDetail";
import Team from "@/pages/public/Team";
import Contact from "@/pages/public/Contact";
import Research from "@/pages/public/Research";
import ELearning from "@/pages/public/ELearning";
import Careers from "@/pages/public/Careers";

import Dashboard from "@/pages/admin/Dashboard";
import PostsList from "@/pages/admin/PostsList";
import PostForm from "@/pages/admin/PostForm";
import EventsList from "@/pages/admin/EventsList";
import EventForm from "@/pages/admin/EventForm";
import TeamList from "@/pages/admin/TeamList";
import PartnersList from "@/pages/admin/PartnersList";
import ResearchAdmin from "@/pages/admin/ResearchAdmin";
import LinkedInAdmin from "@/pages/admin/LinkedInAdmin";

import NotFound from "@/pages/not-found";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
setBaseUrl(apiBase);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-[100dvh] bg-muted/30">
      <SignIn routing="path" path={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ClerkAuthTokenSetter() {
  const { session } = useClerk();

  useEffect(() => {
    setAuthTokenGetter(async () => {
      if (!session) return null;
      return session.getToken();
    });
  }, [session]);

  return null;
}

function AdminRoutes() {
  return (
    <>
      <Show when="signed-in">
        <Switch>
          <Route path="/admin" component={Dashboard} />
          <Route path="/admin/posts" component={PostsList} />
          <Route path="/admin/posts/new" component={PostForm} />
          <Route path="/admin/posts/:id/edit" component={PostForm} />
          <Route path="/admin/events" component={EventsList} />
          <Route path="/admin/events/new" component={EventForm} />
          <Route path="/admin/events/:id/edit" component={EventForm} />
          <Route path="/admin/team" component={TeamList} />
          <Route path="/admin/partners" component={PartnersList} />
          <Route path="/admin/research" component={ResearchAdmin} />
          <Route path="/admin/linkedin" component={LinkedInAdmin} />
          <Route component={NotFound} />
        </Switch>
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
      localization={{
        signIn: {
          start: {
            title: "Sign in to ICAMMDA",
            subtitle: "Admin Portal · Federal University Oye-Ekiti",
          },
          password: {
            title: "Sign in to ICAMMDA",
            subtitle: "Admin Portal · Federal University Oye-Ekiti",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <ClerkAuthTokenSetter />
        <TooltipProvider>
          <Switch>
            {/* Public Routes */}
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/news" component={NewsEvents} />
            <Route path="/news/:slug" component={NewsDetail} />
            <Route path="/events" component={() => <NewsEvents defaultTab="events" />} />
            <Route path="/events/:slug" component={EventDetail} />
            <Route path="/research" component={Research} />
            <Route path="/e-learning" component={ELearning} />
            <Route path="/careers" component={Careers} />
            <Route path="/team" component={Team} />
            <Route path="/contact" component={Contact} />

            {/* Auth */}
            <Route path="/sign-in/*?" component={SignInPage} />

            {/* Admin Routes */}
            <Route path="/admin/*?" component={AdminRoutes} />

            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;

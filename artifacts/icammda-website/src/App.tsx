import { lazy, Suspense, useEffect, useRef } from "react";
import { ClerkProvider, SignIn, Show, useClerk, useUser } from "@clerk/react";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageLoader from "@/components/PageLoader";

// Eager: above-the-fold landing page + 404 (rendered if user lands somewhere bad)
import Home from "@/pages/public/Home";
import NotFound from "@/pages/not-found";

// Lazy: every other public page (most visitors only see Home before navigating)
const About = lazy(() => import("@/pages/public/About"));
const NewsEvents = lazy(() => import("@/pages/public/NewsEvents"));
const NewsDetail = lazy(() => import("@/pages/public/NewsDetail"));
const EventDetail = lazy(() => import("@/pages/public/EventDetail"));
const Team = lazy(() => import("@/pages/public/Team"));
const Contact = lazy(() => import("@/pages/public/Contact"));
const Research = lazy(() => import("@/pages/public/Research"));
const ELearning = lazy(() => import("@/pages/public/ELearning"));
const Careers = lazy(() => import("@/pages/public/Careers"));
const Privacy = lazy(() => import("@/pages/public/Privacy"));
const Terms = lazy(() => import("@/pages/public/Terms"));

// Lazy: admin pages should never load for public visitors
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const PostsList = lazy(() => import("@/pages/admin/PostsList"));
const PostForm = lazy(() => import("@/pages/admin/PostForm"));
const EventsList = lazy(() => import("@/pages/admin/EventsList"));
const EventForm = lazy(() => import("@/pages/admin/EventForm"));
const TeamList = lazy(() => import("@/pages/admin/TeamList"));
const PartnersList = lazy(() => import("@/pages/admin/PartnersList"));
const ResearchAdmin = lazy(() => import("@/pages/admin/ResearchAdmin"));
const LinkedInAdmin = lazy(() => import("@/pages/admin/LinkedInAdmin"));
const ContentAdmin = lazy(() => import("@/pages/admin/ContentAdmin"));
const ContactMessages = lazy(() => import("@/pages/admin/ContactMessages"));
const FormsList = lazy(() => import("@/pages/admin/FormsList"));
const FormBuilder = lazy(() => import("@/pages/admin/FormBuilder"));
const FormSubmissions = lazy(() => import("@/pages/admin/FormSubmissions"));
const FormSubmit = lazy(() => import("@/pages/public/FormSubmit"));

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

function EventsTab() {
  return <NewsEvents defaultTab="events" />;
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
          <Route path="/admin/content" component={ContentAdmin} />
          <Route path="/admin/messages" component={ContactMessages} />
          <Route path="/admin/forms" component={FormsList} />
          <Route path="/admin/forms/:id/edit" component={FormBuilder} />
          <Route path="/admin/forms/:id/submissions" component={FormSubmissions} />
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
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Switch>
                {/* Public Routes */}
                <Route path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/news" component={NewsEvents} />
                <Route path="/news/:slug" component={NewsDetail} />
                <Route path="/events" component={EventsTab} />
                <Route path="/events/:slug" component={EventDetail} />
                <Route path="/research" component={Research} />
                <Route path="/e-learning" component={ELearning} />
                <Route path="/careers" component={Careers} />
                <Route path="/team" component={Team} />
                <Route path="/contact" component={Contact} />
                <Route path="/privacy" component={Privacy} />
                <Route path="/terms" component={Terms} />
                <Route path="/forms/:slug" component={FormSubmit} />

                {/* Auth */}
                <Route path="/sign-in/*?" component={SignInPage} />

                {/* Admin Routes */}
                <Route path="/admin/*?" component={AdminRoutes} />

                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </ErrorBoundary>
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

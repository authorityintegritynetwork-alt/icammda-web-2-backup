import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Only log to console in development to avoid leaking stack traces in prod.
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback(error, this.reset);
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50/40 to-background px-6 py-20">
        <div className="max-w-xl w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 text-red-600 mb-6">
            <AlertTriangle size={36} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold tracking-[0.2em] text-red-600 uppercase mb-3">
            Something broke
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight mb-4">
            We hit an unexpected error
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            Sorry about that — the page failed to load. You can try again, or head back to the homepage. If this keeps happening, please let us know via the contact page.
          </p>

          {import.meta.env.DEV && error.message && (
            <pre className="text-left text-xs bg-muted/60 border border-border rounded-lg p-3 mb-6 overflow-auto max-h-40">
              {error.message}
            </pre>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.reset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors shadow-sm hover:shadow-md"
              data-testid="error-boundary-retry"
            >
              <RotateCw size={14} /> Try again
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
              data-testid="error-boundary-home"
            >
              <Home size={14} /> Return home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

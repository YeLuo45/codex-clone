import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Fallback UI to render when an error is caught. If omitted, a default
   *  full-page error message is shown. */
  fallback?: ReactNode;
  /** Optional label for the boundary (e.g. "SearchModal") — surfaces in logs. */
  label?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * React class error boundary.
 *
 * Goal: ensure that a render-time exception in one component (e.g. Hero)
 * doesn't white-screen the entire SPA. Default fallback is a friendly,
 * copy-paste-able error card with Reload + Home buttons.
 *
 * Coverage: trigger via a child that throws inside a render function, then
 * assert on the rendered fallback.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(`[ErrorBoundary${this.props.label ? ` (${this.props.label})` : ""}]`, error, info.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback !== undefined) return this.props.fallback;
      return (
        <div
          role="alert"
          className="min-h-[60vh] flex items-center justify-center px-6"
          data-testid="error-boundary-fallback"
        >
          <div className="max-w-md text-center">
            <div className="text-5xl mb-4" aria-hidden>
              ⚠
            </div>
            <h1 className="font-display text-2xl font-bold text-ink mb-3">
              出错了 / Something went wrong
            </h1>
            <p className="text-ink-60 mb-2">
              页面渲染时遇到一个意外错误。请刷新页面或返回首页继续。
            </p>
            <p className="text-xs text-ink-60/70 mb-6 font-mono break-all" data-testid="error-boundary-message">
              {this.state.error.message}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={this.reset}
                className="px-4 py-2 bg-ink text-white text-sm rounded-full hover:bg-ink-12 transition"
              >
                重试
              </button>
              <a
                href="#/"
                className="px-4 py-2 border border-ink/15 text-ink text-sm rounded-full hover:border-ink/30 transition"
              >
                回到首页
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

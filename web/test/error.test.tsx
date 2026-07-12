import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { NotFoundPage } from "../src/pages/NotFoundPage";

function Boom({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error("boom-boom-render");
  }
  return <div data-testid="ok-content">child ok</div>;
}

describe("ErrorBoundary", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Silence noisy React error logs during the failing-render tests.
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders children when no error is thrown", () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("ok-content")).toBeInTheDocument();
  });

  it("renders default fallback with error message when a child throws", () => {
    render(
      <ErrorBoundary>
        <Boom shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("error-boundary-fallback")).toBeInTheDocument();
    expect(screen.getByTestId("error-boundary-message").textContent).toContain("boom-boom-render");
    // Friendly Chinese heading
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">custom</div>}>
        <Boom shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("error-boundary-fallback")).not.toBeInTheDocument();
  });

  it("labels the boundary in console.error via componentDidCatch", () => {
    render(
      <ErrorBoundary label="MyWidget">
        <Boom shouldThrow />
      </ErrorBoundary>
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
    // Find any call whose first arg contains our label
    const matchedCall = consoleErrorSpy.mock.calls.find(
      (args) => typeof args[0] === "string" && args[0].includes("MyWidget")
    );
    expect(matchedCall, "expected at least one console.error with [ErrorBoundary (MyWidget)]").toBeDefined();
  });

  it("recovers (renders children again) after the user clicks 重试", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <Boom shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("error-boundary-fallback")).toBeInTheDocument();

    // Reset by switching to a non-throwing child, then click 重试
    rerender(
      <ErrorBoundary>
        <Boom shouldThrow={false} />
      </ErrorBoundary>
    );
    // After rerender with non-throwing child, internal state.error is still set;
    // click 重试 to reset state.
    fireEvent.click(screen.getByRole("button", { name: /重试/ }));

    // Trigger a fresh render — this time the non-throwing child wins.
    expect(screen.queryByTestId("error-boundary-fallback")).not.toBeInTheDocument();
    expect(screen.getByTestId("ok-content")).toBeInTheDocument();
  });
});

describe("NotFoundPage", () => {
  it("renders 404 heading inside a router", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("exposes a way back to home and to docs", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    const home = screen.getByRole("link", { name: /返回首页/ });
    const docs = screen.getByRole("link", { name: /查看文档/ });
    expect(home.getAttribute("href")).toBe("/");
    expect(docs.getAttribute("href")).toBe("/docs");
  });

  it("sets document.title to 404 via useDocumentHead", async () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    // useDocumentHead writes synchronously inside useEffect after render commit;
    // tick a microtask to allow effects to flush
    await Promise.resolve();
    expect(document.title).toMatch(/404/);
  });

  it("uses Header (search button + nav links) when onSearchOpen provided", () => {
    render(
      <MemoryRouter>
        <NotFoundPage onSearchOpen={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/搜索/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/文档/).length).toBeGreaterThanOrEqual(1);
  });
});

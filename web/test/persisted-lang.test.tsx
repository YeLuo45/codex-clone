import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePersistedLang, getStoredLang, setStoredLang } from "../src/lib/usePersistedLang";

describe("usePersistedLang / getStoredLang / setStoredLang", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("starts at null when localStorage is empty (no hydration side-effect)", async () => {
    const { result } = renderHook(() => usePersistedLang());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    // Empty localStorage → null
    expect(result.current[0]).toBeNull();
    // Setter should still work from null
    await act(async () => {
      result.current[1]("zh");
    });
    expect(result.current[0]).toBe("zh");
  });

  it("hydrates from localStorage on mount", async () => {
    localStorage.setItem("codex:lang", "en");
    const { result } = renderHook(() => usePersistedLang());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(result.current[0]).toBe("en");
  });

  it("ignores garbage values in localStorage", async () => {
    localStorage.setItem("codex:lang", "fr-FR");
    const { result } = renderHook(() => usePersistedLang());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(result.current[0]).toBeNull();
  });

  it("setter writes to localStorage AND updates i18next", async () => {
    const { result } = renderHook(() => usePersistedLang());
    await act(async () => {
      result.current[1]("en");
    });
    expect(localStorage.getItem("codex:lang")).toBe("en");
    const i18n = (await import("../src/lib/i18n")).default;
    expect(i18n.language).toBe("en");
  });

  it("getStoredLang reflects localStorage state", () => {
    expect(getStoredLang()).toBeNull();
    localStorage.setItem("codex:lang", "zh");
    expect(getStoredLang()).toBe("zh");
  });

  it("setStoredLang('zh') + clear → round-trips null", () => {
    setStoredLang("zh");
    expect(getStoredLang()).toBe("zh");
    setStoredLang(null);
    expect(getStoredLang()).toBeNull();
  });

  it("setter toggles language back and forth", async () => {
    const { result } = renderHook(() => usePersistedLang());
    await act(async () => {
      result.current[1]("en");
    });
    expect(result.current[0]).toBe("en");
    await act(async () => {
      result.current[1]("zh");
    });
    expect(result.current[0]).toBe("zh");
    expect(localStorage.getItem("codex:lang")).toBe("zh");
  });

  it("survives a mount → unmount → re-mount cycle (re-hydration)", async () => {
    const first = renderHook(() => usePersistedLang());
    await act(async () => {
      first.result.current[1]("en");
    });
    first.unmount();

    const second = renderHook(() => usePersistedLang());
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    // Hydrated from storage → "en"
    expect(second.result.current[0]).toBe("en");
  });
});

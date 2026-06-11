import { afterEach, describe, expect, it, vi } from "vitest";
import { createProject, seedState, uid, DEFAULT_COLUMNS } from "./data";

describe("uid", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns non-empty strings", () => {
    expect(uid()).toBeTruthy();
    expect(typeof uid()).toBe("string");
  });

  it("does not collide over 10k generations", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 10_000; i++) seen.add(uid());
    expect(seen.size).toBe(10_000);
  });

  it("falls back when crypto.randomUUID is unavailable", () => {
    vi.stubGlobal("crypto", {});
    const id = uid();
    expect(id).toBeTruthy();
    expect(id).not.toContain("-"); // fallback format, not a UUID
  });
});

describe("createProject", () => {
  it("builds the default columns with unique ids", () => {
    const project = createProject("Test", "circle", "#abc");
    expect(project.columns.map((c) => c.title)).toEqual(DEFAULT_COLUMNS);
    const ids = new Set(project.columns.map((c) => c.id));
    expect(ids.size).toBe(project.columns.length);
  });
});

describe("seedState", () => {
  it("produces a consistent first-run state", () => {
    const state = seedState();
    expect(state.projects).toHaveLength(1);
    expect(state.activeProjectId).toBe(state.projects[0].id);
    expect(state.projects[0].columns.length).toBeGreaterThan(0);
  });
});

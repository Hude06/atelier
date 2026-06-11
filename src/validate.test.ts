import { describe, expect, it } from "vitest";
import { normalizeState } from "./validate";
import { DEFAULT_COLUMNS, PALETTE, defaultSettings } from "./data";

const goodState = {
  projects: [
    {
      id: "p1",
      name: "P1",
      icon: "circle",
      color: "#abc",
      columns: [
        {
          id: "a",
          title: "To do",
          cards: [{ id: "a1", title: "Hello", createdAt: 5 }],
        },
      ],
    },
  ],
  activeProjectId: "p1",
  settings: {
    theme: "dark",
    accent: "#abc",
    density: "compact",
    showCounts: false,
  },
};

describe("normalizeState — valid input", () => {
  it("passes a healthy state through untouched", () => {
    const out = normalizeState(JSON.parse(JSON.stringify(goodState)));
    expect(out).not.toBeNull();
    expect(out!.state).toEqual(goodState);
    expect(out!.report).toEqual({
      droppedProjects: 0,
      droppedColumns: 0,
      droppedCards: 0,
      repaired: false,
    });
  });
});

describe("normalizeState — unsalvageable input", () => {
  it("rejects non-objects and missing projects", () => {
    expect(normalizeState(null)).toBeNull();
    expect(normalizeState("x")).toBeNull();
    expect(normalizeState({})).toBeNull();
    expect(normalizeState({ projects: "x" })).toBeNull();
    expect(normalizeState({ projects: [] })).toBeNull();
  });

  it("returns null when every project is broken", () => {
    expect(normalizeState({ projects: [42, "x", null] })).toBeNull();
  });
});

describe("normalizeState — salvage", () => {
  it("drops cards without a usable title and counts them", () => {
    const out = normalizeState({
      projects: [
        {
          id: "p1",
          name: "P",
          icon: "circle",
          color: "#abc",
          columns: [
            {
              id: "a",
              title: "T",
              cards: [
                { id: "ok", title: "Keep me", createdAt: 1 },
                { id: "bad", title: 42, createdAt: 1 },
                { id: "bad2", title: "   ", createdAt: 1 },
              ],
            },
          ],
        },
      ],
    });
    expect(out!.state.projects[0].columns[0].cards.map((c) => c.title)).toEqual([
      "Keep me",
    ]);
    expect(out!.report.droppedCards).toBe(2);
  });

  it("repairs missing card ids and timestamps", () => {
    const out = normalizeState({
      projects: [
        {
          id: "p1",
          name: "P",
          icon: "circle",
          color: "#abc",
          columns: [{ id: "a", title: "T", cards: [{ title: "Just a title" }] }],
        },
      ],
    });
    const card = out!.state.projects[0].columns[0].cards[0];
    expect(card.id).toBeTruthy();
    expect(Number.isFinite(card.createdAt)).toBe(true);
    expect(out!.report.repaired).toBe(true);
    expect(out!.report.droppedCards).toBe(0);
  });

  it("drops non-object columns and rebuilds an empty column set", () => {
    const out = normalizeState({
      projects: [
        { id: "p1", name: "P", icon: "circle", color: "#abc", columns: [42] },
      ],
    });
    expect(out!.report.droppedColumns).toBe(1);
    expect(out!.state.projects[0].columns.map((c) => c.title)).toEqual(
      DEFAULT_COLUMNS
    );
  });

  it("repairs bad project fields", () => {
    const out = normalizeState({
      projects: [{ id: "p1", name: 42, icon: "not-an-icon", color: null }],
    });
    const project = out!.state.projects[0];
    expect(project.name).toBe("Untitled");
    expect(project.icon).toBe("circle");
    expect(project.color).toBe(PALETTE[0].value);
    expect(project.columns.length).toBeGreaterThan(0);
    expect(out!.report.repaired).toBe(true);
  });

  it("drops non-object projects but keeps the rest", () => {
    const out = normalizeState({
      projects: [
        "garbage",
        { id: "p2", name: "Good", icon: "leaf", color: "#abc", columns: [] },
      ],
    });
    expect(out!.state.projects.map((p) => p.name)).toEqual(["Good"]);
    expect(out!.report.droppedProjects).toBe(1);
  });

  it("fixes a dangling activeProjectId", () => {
    const out = normalizeState({
      projects: [
        { id: "p1", name: "P", icon: "circle", color: "#abc", columns: [] },
      ],
      activeProjectId: "ghost",
    });
    expect(out!.state.activeProjectId).toBe("p1");
  });

  it("whitelists settings and falls back to defaults", () => {
    const out = normalizeState({
      projects: [
        { id: "p1", name: "P", icon: "circle", color: "#abc", columns: [] },
      ],
      settings: { theme: "neon", density: "compact", showCounts: "yes" },
    });
    expect(out!.state.settings).toEqual({
      ...defaultSettings,
      density: "compact",
    });
  });
});

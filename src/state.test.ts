import { describe, expect, it } from "vitest";
import type { AppState, Card } from "./types";
import * as mutate from "./state";
import { DEFAULT_COLUMNS } from "./data";

function card(id: string): Card {
  return { id, title: `Card ${id}`, createdAt: 0 };
}

// Project p1 has columns a: [a1, a2, a3], b: [b1], c: [].
function makeState(): AppState {
  return {
    projects: [
      {
        id: "p1",
        name: "P1",
        icon: "circle",
        color: "#abc",
        columns: [
          { id: "a", title: "To do", cards: [card("a1"), card("a2"), card("a3")] },
          { id: "b", title: "Working on", cards: [card("b1")] },
          { id: "c", title: "Completed", cards: [] },
        ],
      },
      {
        id: "p2",
        name: "P2",
        icon: "leaf",
        color: "#def",
        columns: [{ id: "z", title: "Only", cards: [] }],
      },
    ],
    activeProjectId: "p1",
    settings: {
      theme: "system",
      accent: "#c24b2c",
      density: "comfortable",
      showCounts: true,
    },
  };
}

function ids(s: AppState, columnId: string): string[] {
  const column = s.projects[0].columns.find((c) => c.id === columnId);
  return column ? column.cards.map((c) => c.id) : [];
}

describe("moveCard — same column", () => {
  // toIndex is a pre-removal slot: moving down adjusts by -1 after removal.
  it("moves a card down", () => {
    const s = mutate.moveCard(makeState(), "p1", "a", "a", "a1", 2);
    expect(ids(s, "a")).toEqual(["a2", "a1", "a3"]);
  });

  it("moves a card up to index 0", () => {
    const s = mutate.moveCard(makeState(), "p1", "a", "a", "a3", 0);
    expect(ids(s, "a")).toEqual(["a3", "a1", "a2"]);
  });

  it("dropping a card on its own position is a no-op", () => {
    const s = mutate.moveCard(makeState(), "p1", "a", "a", "a2", 1);
    expect(ids(s, "a")).toEqual(["a1", "a2", "a3"]);
  });

  it("moves a card to the end", () => {
    const s = mutate.moveCard(makeState(), "p1", "a", "a", "a1", 3);
    expect(ids(s, "a")).toEqual(["a2", "a3", "a1"]);
  });

  // The keyboard-move formulas (Phase E): down one = index + 2, up one = index - 1.
  it("keyboard 'down one' uses pre-removal index + 2", () => {
    const s = mutate.moveCard(makeState(), "p1", "a", "a", "a2", 1 + 2);
    expect(ids(s, "a")).toEqual(["a1", "a3", "a2"]);
  });

  it("keyboard 'up one' uses index - 1", () => {
    const s = mutate.moveCard(makeState(), "p1", "a", "a", "a2", 1 - 1);
    expect(ids(s, "a")).toEqual(["a2", "a1", "a3"]);
  });
});

describe("moveCard — across columns", () => {
  it("inserts at the given index", () => {
    const s = mutate.moveCard(makeState(), "p1", "a", "b", "a2", 0);
    expect(ids(s, "a")).toEqual(["a1", "a3"]);
    expect(ids(s, "b")).toEqual(["a2", "b1"]);
  });

  it("clamps an out-of-range index to the end", () => {
    const s = mutate.moveCard(makeState(), "p1", "a", "b", "a1", 99);
    expect(ids(s, "b")).toEqual(["b1", "a1"]);
  });

  it("moves into an empty column", () => {
    const s = mutate.moveCard(makeState(), "p1", "a", "c", "a3", 0);
    expect(ids(s, "c")).toEqual(["a3"]);
  });

  it("unknown card id leaves the project untouched", () => {
    const before = makeState();
    const s = mutate.moveCard(before, "p1", "a", "b", "nope", 0);
    expect(s.projects[0]).toBe(before.projects[0]);
  });

  it("unknown source column leaves the project untouched", () => {
    const before = makeState();
    const s = mutate.moveCard(before, "p1", "nope", "b", "a1", 0);
    expect(s.projects[0]).toBe(before.projects[0]);
  });
});

describe("clearColumn", () => {
  it("clears exactly the given column", () => {
    const s = mutate.clearColumn(makeState(), "p1", "a");
    expect(ids(s, "a")).toEqual([]);
    expect(ids(s, "b")).toEqual(["b1"]);
    expect(ids(s, "c")).toEqual([]);
  });
});

describe("deleteProject", () => {
  it("reassigns the active project when it is deleted", () => {
    const s = mutate.deleteProject(makeState(), "p1");
    expect(s.projects.map((p) => p.id)).toEqual(["p2"]);
    expect(s.activeProjectId).toBe("p2");
  });

  it("keeps the active project when another is deleted", () => {
    const s = mutate.deleteProject(makeState(), "p2");
    expect(s.activeProjectId).toBe("p1");
  });

  it("reseeds an Untitled project when the last one is deleted", () => {
    let s = mutate.deleteProject(makeState(), "p1");
    s = mutate.deleteProject(s, "p2");
    expect(s.projects).toHaveLength(1);
    expect(s.projects[0].name).toBe("Untitled");
    expect(s.projects[0].columns.map((c) => c.title)).toEqual(DEFAULT_COLUMNS);
    expect(s.activeProjectId).toBe(s.projects[0].id);
  });
});

describe("cycleProject", () => {
  it("steps forward and wraps", () => {
    const s1 = mutate.cycleProject(makeState(), 1);
    expect(s1.activeProjectId).toBe("p2");
    const s2 = mutate.cycleProject(s1, 1);
    expect(s2.activeProjectId).toBe("p1");
  });

  it("steps backward and wraps", () => {
    const s = mutate.cycleProject(makeState(), -1);
    expect(s.activeProjectId).toBe("p2");
  });
});

describe("card mutations", () => {
  it("addCard appends to the right column", () => {
    const s = mutate.addCard(makeState(), "p1", "b", "New card");
    const cards = s.projects[0].columns[1].cards;
    expect(cards).toHaveLength(2);
    expect(cards[1].title).toBe("New card");
    expect(cards[1].id).toBeTruthy();
  });

  it("updateCard retitles only the target card", () => {
    const s = mutate.updateCard(makeState(), "p1", "a", "a2", "Renamed");
    const titles = s.projects[0].columns[0].cards.map((c) => c.title);
    expect(titles).toEqual(["Card a1", "Renamed", "Card a3"]);
  });

  it("deleteCard removes only the target card", () => {
    const s = mutate.deleteCard(makeState(), "p1", "a", "a2");
    expect(ids(s, "a")).toEqual(["a1", "a3"]);
  });
});

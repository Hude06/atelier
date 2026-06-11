import { describe, expect, it } from "vitest";
import {
  CURRENT_SCHEMA,
  migrate,
  parsePersisted,
  toEnvelope,
} from "./migrations";
import type { AppState } from "./types";

const bareState = {
  projects: [{ id: "p", name: "P", icon: "circle", color: "#abc", columns: [] }],
  activeProjectId: "p",
  settings: { theme: "system", accent: "#c24b2c", density: "comfortable", showCounts: true },
};

describe("parsePersisted", () => {
  it("passes a current envelope through", () => {
    const env = parsePersisted({ schema: 2, savedAt: 42, state: bareState });
    expect(env).toEqual({ schema: 2, savedAt: 42, state: bareState });
  });

  it("wraps the legacy localStorage {v, t} shape as schema 1", () => {
    const env = parsePersisted({ v: bareState, t: 123 });
    expect(env).toEqual({ schema: 1, savedAt: 123, state: bareState });
  });

  it("wraps a bare AppState as schema 1 with savedAt 0", () => {
    const env = parsePersisted(bareState);
    expect(env).toEqual({ schema: 1, savedAt: 0, state: bareState });
  });

  it("rejects unrecognizable values", () => {
    expect(parsePersisted(null)).toBeNull();
    expect(parsePersisted("state")).toBeNull();
    expect(parsePersisted(42)).toBeNull();
    expect(parsePersisted({})).toBeNull();
    expect(parsePersisted({ projects: "not-an-array" })).toBeNull();
  });
});

describe("migrate", () => {
  it("upgrades schema 1 to the current schema without touching the state", () => {
    const out = migrate({ schema: 1, savedAt: 7, state: bareState });
    expect(out).toEqual({ schema: CURRENT_SCHEMA, savedAt: 7, state: bareState });
  });

  it("leaves a current envelope unchanged", () => {
    const out = migrate({ schema: CURRENT_SCHEMA, savedAt: 7, state: bareState });
    expect(out).toEqual({ schema: CURRENT_SCHEMA, savedAt: 7, state: bareState });
  });

  it("rejects envelopes from a newer app version", () => {
    expect(migrate({ schema: CURRENT_SCHEMA + 1, savedAt: 7, state: bareState })).toBeNull();
  });
});

describe("round trip", () => {
  it("toEnvelope → parsePersisted → migrate preserves the state", () => {
    const env = toEnvelope(bareState as AppState);
    expect(env.schema).toBe(CURRENT_SCHEMA);
    const parsed = parsePersisted(JSON.parse(JSON.stringify(env)));
    expect(parsed).not.toBeNull();
    const migrated = migrate(parsed!);
    expect(migrated!.state).toEqual(bareState);
  });
});

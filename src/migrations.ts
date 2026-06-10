import type { AppState } from "./types";

// Schema history:
//   1 — bare AppState (original disk format) or the legacy localStorage
//       wrapper `{ v: AppState, t: number }`
//   2 — envelope `{ schema, savedAt, state }`; state shape unchanged
export const CURRENT_SCHEMA = 2;

export type Envelope = { schema: number; savedAt: number; state: unknown };

export function toEnvelope(state: AppState): Envelope {
  return { schema: CURRENT_SCHEMA, savedAt: Date.now(), state };
}

function isRecord(raw: unknown): raw is Record<string, unknown> {
  return !!raw && typeof raw === "object";
}

// Accepts a current envelope, the legacy localStorage `{v, t}` wrapper, or a
// bare AppState-ish object. Legacy shapes are wrapped as schema 1. Returns
// null when the value is unrecognizable.
export function parsePersisted(raw: unknown): Envelope | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.schema === "number" && "state" in raw) {
    return {
      schema: raw.schema,
      savedAt: typeof raw.savedAt === "number" ? raw.savedAt : 0,
      state: raw.state,
    };
  }
  if ("v" in raw) {
    return {
      schema: 1,
      savedAt: typeof raw.t === "number" ? raw.t : 0,
      state: raw.v,
    };
  }
  if (Array.isArray(raw.projects)) {
    return { schema: 1, savedAt: 0, state: raw };
  }
  return null;
}

type Migration = { from: number; migrate: (state: unknown) => unknown };

const MIGRATIONS: Migration[] = [
  // 1 → 2: the envelope was introduced; the state itself is unchanged.
  { from: 1, migrate: (state) => state },
];

// Runs migrations stepwise up to CURRENT_SCHEMA. Returns null for schemas
// newer than this build understands (user downgraded the app).
export function migrate(env: Envelope): Envelope | null {
  if (env.schema > CURRENT_SCHEMA) return null;
  let schema = env.schema;
  let state = env.state;
  while (schema < CURRENT_SCHEMA) {
    const step = MIGRATIONS.find((m) => m.from === schema);
    if (!step) return null;
    state = step.migrate(state);
    schema += 1;
  }
  return { schema, savedAt: env.savedAt, state };
}

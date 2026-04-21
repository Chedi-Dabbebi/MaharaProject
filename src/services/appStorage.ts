import type { Skill, GeneratedPlan } from '../types';

export interface PersistedUser {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export interface PersistedAppState {
  schemaVersion: number;
  skills: Skill[];
  user: PersistedUser | null;
  acceptedPlans: Record<string, GeneratedPlan>;
  activeSessions: Record<string, { startedAt: string }>;
}

const STORAGE_SCHEMA_VERSION = 1;

declare global {
  // eslint-disable-next-line no-var
  var __MAHARA_APP_STATE__: PersistedAppState | undefined;
}

export function getStorageSchemaVersion(): number {
  return STORAGE_SCHEMA_VERSION;
}

export async function loadPersistedAppState(): Promise<PersistedAppState | null> {
  const snapshot = globalThis.__MAHARA_APP_STATE__;
  if (!snapshot) {
    return null;
  }
  if (snapshot.schemaVersion !== STORAGE_SCHEMA_VERSION) {
    return null;
  }
  return snapshot;
}

export async function savePersistedAppState(state: PersistedAppState): Promise<void> {
  globalThis.__MAHARA_APP_STATE__ = state;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Skill, GeneratedPlan } from '../types';

export interface PersistedUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar_url?: string;
}

export interface PersistedAppState {
  schemaVersion: number;
  skills: Skill[];
  user: PersistedUser | null;
  acceptedPlans: Record<string, GeneratedPlan>;
  activeSessions: Record<string, { startedAt: string }>;
}

const STORAGE_SCHEMA_VERSION = 1;
const STORAGE_KEY = '@app_state';

// In-memory cache of the current persisted state to avoid redundant reads
let stateCache: PersistedAppState | null = null;
// Serialized write queue to prevent race conditions
let saveQueue: Promise<void> = Promise.resolve();

export function getStorageSchemaVersion(): number {
  return STORAGE_SCHEMA_VERSION;
}

export async function loadPersistedAppState(): Promise<PersistedAppState | null> {
  try {
    if (stateCache) return stateCache;
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (!jsonValue) return null;
    const snapshot = JSON.parse(jsonValue) as PersistedAppState;
    if (snapshot.schemaVersion !== STORAGE_SCHEMA_VERSION) {
      return null;
    }
    stateCache = snapshot;
    return snapshot;
  } catch (e) {
    console.error('Error loading state', e);
    return null;
  }
}

export async function savePersistedAppState(state: Partial<PersistedAppState>): Promise<void> {
  // Chain saves sequentially to prevent race conditions
  saveQueue = saveQueue.then(async () => {
    try {
      const existing = stateCache;
      const mergedState: PersistedAppState = {
        schemaVersion: STORAGE_SCHEMA_VERSION,
        skills: state.skills ?? existing?.skills ?? [],
        user: state.user !== undefined ? state.user : (existing?.user ?? null),
        acceptedPlans: state.acceptedPlans ?? existing?.acceptedPlans ?? {},
        activeSessions: state.activeSessions ?? existing?.activeSessions ?? {},
      };
      // Update cache first so subsequent saves in queue see the latest state
      stateCache = mergedState;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mergedState));
    } catch (e) {
      console.error('Error saving state', e);
    }
  });
  return saveQueue;
}

import { createClient } from '@supabase/supabase-js';

const runtimeEnv =
  typeof process !== 'undefined' && process.env
    ? process.env
    : ({} as Record<string, string | undefined>);

const SUPABASE_URL = runtimeEnv.SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = runtimeEnv.SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function createQueryStub() {
  const baseResult = { data: null, error: null } as const;
  const query: any = {
    select: () => query,
    insert: () => query,
    update: () => query,
    upsert: async () => baseResult,
    eq: () => query,
    order: () => query,
    limit: () => query,
    maybeSingle: async () => baseResult,
    single: async () => baseResult,
    then: (resolve: (value: typeof baseResult) => unknown) =>
      Promise.resolve(baseResult).then(resolve),
    catch: () => Promise.resolve(baseResult),
  };
  return query;
}

function createSupabaseStub() {
  return {
    from: () => createQueryStub(),
    auth: {
      signInWithPassword: async () => ({ data: { user: null }, error: null }),
      signUp: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ data: null, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
  };
}

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are missing: SUPABASE_URL / SUPABASE_ANON_KEY');
}

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : createSupabaseStub();

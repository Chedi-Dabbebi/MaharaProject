import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL =
  (typeof process !== 'undefined' ? process.env?.SUPABASE_URL : undefined) ??
  'https://qccrujjwesysyoujqpwv.supabase.co';
const SUPABASE_ANON_KEY =
  (typeof process !== 'undefined' ? process.env?.SUPABASE_ANON_KEY : undefined) ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjY3J1amp3ZXN5c3lvdWpxcHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MTgxNTAsImV4cCI6MjA5MjE5NDE1MH0.hahdw2XHvM_tGDVLg19F--yQxQUYfYnWdLf3HXZtpKk';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
let initializedClient: ReturnType<typeof createClient> | null = null;
let initializationFailed = false;

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
      signInWithOAuth: async () => ({ data: { url: null }, error: null }),
      exchangeCodeForSession: async () => ({ data: { session: null, user: null }, error: null }),
      setSession: async () => ({ data: { session: null, user: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => undefined,
          },
        },
      }),
      signOut: async () => ({ data: null, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
    },
  };
}

function getSupabaseClient() {
  if (initializedClient) {
    return initializedClient;
  }
  if (initializationFailed || !isSupabaseConfigured) {
    return null;
  }

  try {
    initializedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
      },
    });
    return initializedClient;
  } catch (error) {
    initializationFailed = true;
    // eslint-disable-next-line no-console
    console.error('Supabase client initialization failed', error);
    return null;
  }
}

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are missing: SUPABASE_URL / SUPABASE_ANON_KEY');
}

const supabaseStub = createSupabaseStub();

export const supabase = new Proxy(supabaseStub, {
  get(target, property, receiver) {
    const client = getSupabaseClient();
    const source = client ?? target;
    const value = Reflect.get(source as object, property, receiver);
    return typeof value === 'function' ? value.bind(source) : value;
  },
});

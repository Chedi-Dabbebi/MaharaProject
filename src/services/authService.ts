import { isSupabaseConfigured, supabase } from './supabaseClient';
import { Linking } from 'react-native';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
}

export type AuthProvider = 'google' | 'facebook';

const OAUTH_REDIRECT_URL =
  (typeof process !== 'undefined' ? process.env?.SUPABASE_OAUTH_REDIRECT_URL : undefined) ??
  'projectapp://auth/callback';
const OAUTH_REDIRECT_BASE = OAUTH_REDIRECT_URL.split('?')[0];
const SUPABASE_URL =
  (typeof process !== 'undefined' ? process.env?.SUPABASE_URL : undefined) ??
  'https://qccrujjwesysyoujqpwv.supabase.co';

function mapAuthError(message?: string | null): string {
  if (!message) {
    return 'error_network';
  }
  const msg = message.toLowerCase();
  if (msg.includes('invalid login credentials')) {
    return 'error_wrong_password';
  }
  if (msg.includes('user not found')) {
    return 'error_user_not_found';
  }
  if (msg.includes('network')) {
    return 'error_network';
  }
  if (msg.includes('redirect')) {
    return 'error_oauth_start_failed';
  }
  return 'error_network';
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured) {
    // Local fallback for unconfigured environment
    return {
      user: { id: `local-${email}`, email },
      error: null,
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    return { user: null, error: mapAuthError(error.message) };
  }

  if (data.user) {
    const displayName = data.user.user_metadata?.display_name as string | undefined;
    return {
      user: { id: data.user.id, email: data.user.email ?? email, displayName },
      error: null,
    };
  }

  return { user: null, error: 'error_network' };
}

export async function signUp(email: string, password: string, name: string): Promise<AuthResult> {
  if (!isSupabaseConfigured) {
    return {
      user: { id: `local-${email}`, email },
      error: null,
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name,
      },
      emailRedirectTo: undefined,
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  if (data.user) {
    const displayName = data.user.user_metadata?.display_name as string | undefined;
    return {
      user: { id: data.user.id, email: data.user.email ?? email, displayName },
      error: null,
    };
  }

  return { user: null, error: 'error_network' };
}

export async function signInWithOAuthProvider(
  provider: AuthProvider,
): Promise<{ started: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { started: false, error: 'error_social_requires_supabase' };
  }

  const authorizeUrl =
    `${SUPABASE_URL}/auth/v1/authorize?provider=${encodeURIComponent(provider)}` +
    `&redirect_to=${encodeURIComponent(OAUTH_REDIRECT_URL)}`;
  try {
    await Linking.openURL(authorizeUrl);
    return { started: true, error: null };
  } catch {
    return { started: false, error: 'error_oauth_start_failed' };
  }
}

export async function handleAuthDeepLink(url: string): Promise<{ handled: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { handled: false, error: null };
  }

  if (!url.startsWith(OAUTH_REDIRECT_BASE)) {
    return { handled: false, error: null };
  }

  const [pathAndQuery, fragment = ''] = url.split('#');
  const query = pathAndQuery.includes('?') ? pathAndQuery.split('?')[1] : '';
  const queryParams = new URLSearchParams(query);
  const fragmentParams = new URLSearchParams(fragment);
  const code = queryParams.get('code');

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return { handled: true, error: mapAuthError(error.message) };
    }
    return { handled: true, error: null };
  }

  const accessToken = fragmentParams.get('access_token');
  const refreshToken = fragmentParams.get('refresh_token');
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) {
      return { handled: true, error: mapAuthError(error.message) };
    }
    return { handled: true, error: null };
  }

  return { handled: true, error: 'error_oauth_callback_invalid' };
}

export async function resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: true, error: null };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, error: null };
}

export async function signOutCurrentUser(): Promise<void> {
  if (!isSupabaseConfigured) {
    return;
  }
  await supabase.auth.signOut();
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured) {
    return null;
  }
  const session = await supabase.auth.getSession();
  const user = session.data.session?.user;
  if (!user) {
    return null;
  }
  const displayName = user.user_metadata?.display_name as string | undefined;
  return {
    id: user.id,
    email: user.email ?? '',
    displayName,
  };
}

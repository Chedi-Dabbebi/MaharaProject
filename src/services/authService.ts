import { isSupabaseConfigured, supabase } from './supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
}

function canAutoSignUp(errorMessage: string): boolean {
  const lower = errorMessage.toLowerCase();
  return lower.includes('invalid login credentials') || lower.includes('email not confirmed');
}

export async function signInOrSignUp(email: string, password: string): Promise<AuthUser | null> {
  if (!isSupabaseConfigured) {
    return {
      id: `local-${email}`,
      email,
    };
  }

  const signIn = await supabase.auth.signInWithPassword({ email, password });
  if (signIn.data.user && !signIn.error) {
    return {
      id: signIn.data.user.id,
      email: signIn.data.user.email ?? email,
    };
  }

  if (!signIn.error || !canAutoSignUp(signIn.error.message)) {
    return null;
  }

  const signUp = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: undefined },
  });

  if (signUp.error || !signUp.data.user) {
    return null;
  }

  return {
    id: signUp.data.user.id,
    email: signUp.data.user.email ?? email,
  };
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
  return {
    id: user.id,
    email: user.email ?? '',
  };
}

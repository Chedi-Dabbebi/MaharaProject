import { isSupabaseConfigured, supabase } from './supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
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
    let errorMessage = 'error_network';
    const msg = error.message.toLowerCase();
    
    if (msg.includes('invalid login credentials')) {
      // Differentiate between user not found and wrong password if supabase provides distinct flags, 
      // otherwise fallback to a generic wrong credentials
      errorMessage = 'error_wrong_password'; 
    } else if (msg.includes('user not found')) {
      errorMessage = 'error_user_not_found';
    }
    
    return { user: null, error: errorMessage };
  }

  if (data.user) {
    return {
      user: { id: data.user.id, email: data.user.email ?? email },
      error: null,
    };
  }
  
  return { user: null, error: 'error_network' };
}

export async function signUp(email: string, password: string, displayName: string): Promise<AuthResult> {
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
        display_name: displayName,
      },
      emailRedirectTo: undefined,
    },
  });

  if (error) {
    return { user: null, error: error.message }; 
  }

  if (data.user) {
    return {
      user: { id: data.user.id, email: data.user.email ?? email },
      error: null, 
    };
  }
  
  return { user: null, error: 'error_network' };
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
  return {
    id: user.id,
    email: user.email ?? '',
  };
}

import { isSupabaseConfigured, supabase } from './supabaseClient';

export interface ProfileRecord {
  id: string;
  display_name: string;
  email: string;
  initials: string;
}

function buildDisplayFromEmail(email: string) {
  const base = email.split('@')[0] || 'Utilisateur';
  const displayName = base
    .replace(/[._-]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
  const initials = (displayName || 'U')
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
  return {
    displayName: displayName || 'Utilisateur',
    initials: initials || 'U',
  };
}

export async function ensureProfile(userId: string, email: string): Promise<ProfileRecord> {
  const names = buildDisplayFromEmail(email);

  if (!isSupabaseConfigured) {
    return {
      id: userId,
      display_name: names.displayName,
      email,
      initials: names.initials,
    };
  }

  const existing = await supabase
    .from('profiles')
    .select('id, display_name, email, initials')
    .eq('id', userId)
    .maybeSingle();

  if (existing.data) {
    return existing.data as ProfileRecord;
  }

  const inserted = await supabase
    .from('profiles')
    .insert({
      id: userId,
      display_name: names.displayName,
      email,
      initials: names.initials,
    })
    .select('id, display_name, email, initials')
    .single();

  if (inserted.data) {
    return inserted.data as ProfileRecord;
  }

  return {
    id: userId,
    display_name: names.displayName,
    email,
    initials: names.initials,
  };
}

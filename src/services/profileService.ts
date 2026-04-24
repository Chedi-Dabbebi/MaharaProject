import { isSupabaseConfigured, supabase } from './supabaseClient';

export interface ProfileRecord {
  id: string;
  display_name: string;
  email: string;
  initials: string;
  avatar_url?: string;
  weekly_time_budget_minutes?: number;
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
      avatar_url: undefined,
    };
  }

  const existing = await supabase
    .from('profiles')
    .select('id, display_name, email, initials, avatar_url, weekly_time_budget_minutes')
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
    .select('id, display_name, email, initials, avatar_url, weekly_time_budget_minutes')
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

export async function updateProfileBudget(userId: string, minutes: number): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return true;
  }

  const { error } = await supabase
    .from('profiles')
    .update({ weekly_time_budget_minutes: minutes })
    .eq('id', userId);

  return !error;
}

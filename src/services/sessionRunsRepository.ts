import { isSupabaseConfigured, supabase } from './supabaseClient';

export async function createSessionRun(userId: string, skillId: string) {
  if (!isSupabaseConfigured) {
    return;
  }

  const latestSession = await supabase
    .from('plan_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('skill_id', skillId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestSession.data?.id) {
    return;
  }

  await supabase.from('session_runs').insert({
    user_id: userId,
    plan_session_id: latestSession.data.id,
    status: 'started',
    started_at: new Date().toISOString(),
  });
}

export async function completeLatestSessionRun(userId: string, gainedXp: number) {
  if (!isSupabaseConfigured) {
    return;
  }

  const latestRun = await supabase
    .from('session_runs')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'started')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestRun.data?.id) {
    return;
  }

  await supabase
    .from('session_runs')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      gained_xp: gainedXp,
    })
    .eq('id', latestRun.data.id)
    .eq('user_id', userId);
}

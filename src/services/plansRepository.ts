// @ts-nocheck
import type { GeneratedPlan } from '../types';
import { isSupabaseConfigured, supabase } from './supabaseClient';

export async function saveDraftPlan(userId: string, plan: GeneratedPlan, source: 'ai' | 'fallback') {
  if (!isSupabaseConfigured) {
    return;
  }

  await supabase.from('weekly_plans').insert({
    user_id: userId,
    skill_id: plan.skillId,
    difficulty: plan.difficulty,
    status: 'draft',
    sessions_per_week: plan.sessionsPerWeek,
    weekly_time: plan.weeklyTime,
    summary: plan.summary,
    source,
  });
}

export async function acceptLatestPlanForSkill(userId: string, skillId: string) {
  if (!isSupabaseConfigured) {
    return;
  }

  const latest = await supabase
    .from('weekly_plans')
    .select('id')
    .eq('user_id', userId)
    .eq('skill_id', skillId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const planId = latest.data?.id;
  if (!planId) {
    return;
  }

  await supabase
    .from('weekly_plans')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', planId)
    .eq('user_id', userId);
}

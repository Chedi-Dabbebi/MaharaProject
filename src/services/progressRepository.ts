import type { Skill } from '../types';
import { isSupabaseConfigured, supabase } from './supabaseClient';

interface ProgressRow {
  skill_id: string;
  xp: number;
  max_xp: number;
  level: number;
  progress: number;
  streak: number;
}

function mergeSkill(seed: Skill, row?: ProgressRow): Skill {
  if (!row) {
    return seed;
  }
  return {
    ...seed,
    xp: row.xp,
    maxXp: row.max_xp,
    level: row.level,
    progress: row.progress,
    streak: row.streak,
  };
}

export async function bootstrapSkillProgress(userId: string, skills: Skill[]): Promise<void> {
  if (!isSupabaseConfigured) {
    return;
  }

  const rows = skills.map((skill) => ({
    user_id: userId,
    skill_id: skill.id,
    xp: skill.xp,
    max_xp: skill.maxXp,
    level: skill.level,
    progress: skill.progress,
    streak: skill.streak,
  }));

  await supabase.from('skills_progress').upsert(rows, {
    onConflict: 'user_id,skill_id',
    ignoreDuplicates: true,
  });
}

export async function loadSkillProgress(userId: string, skills: Skill[]): Promise<Skill[]> {
  if (!isSupabaseConfigured) {
    return skills;
  }

  const response = await supabase
    .from('skills_progress')
    .select('skill_id, xp, max_xp, level, progress, streak')
    .eq('user_id', userId);

  const rows = (response.data ?? []) as ProgressRow[];
  const bySkillId = new Map(rows.map((row) => [row.skill_id, row]));
  return skills.map((skill) => mergeSkill(skill, bySkillId.get(skill.id)));
}

export async function saveSkillProgress(userId: string, skill: Skill): Promise<void> {
  if (!isSupabaseConfigured) {
    return;
  }

  await supabase.from('skills_progress').upsert(
    {
      user_id: userId,
      skill_id: skill.id,
      xp: skill.xp,
      max_xp: skill.maxXp,
      level: skill.level,
      progress: skill.progress,
      streak: skill.streak,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,skill_id' },
  );
}

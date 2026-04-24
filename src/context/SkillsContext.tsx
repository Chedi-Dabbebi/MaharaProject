import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { skills as seedSkills } from '../data/skills';
import { recalculateAllSkills, toggleTaskForSkill } from '../logic/progression';
import { loadPersistedAppState, savePersistedAppState } from '../services/appStorage';
import { loadSkillProgress, saveSkillProgress } from '../services/progressRepository';
import { useAuth } from '../hooks/useAuth';
import type { Skill } from '../types';

interface SkillsContextType {
  skills: Skill[];
  isLoading: boolean;
  loadError: string | null;
  totalXP: number;
  totalLevel: number;
  longestStreak: number;
  totalCompletedTasks: number;
  totalTasks: number;
  toggleTaskCompletion: (skillId: string, taskId: string) => void;
  getSkillById: (skillId: string | null) => Skill | undefined;
  reload: () => Promise<void>;
}

export const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

export function SkillsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>(() => recalculateAllSkills(seedSkills));
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadSkills = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const persisted = await loadPersistedAppState();
      if (persisted?.skills && persisted.skills.length > 0) {
        setSkills(recalculateAllSkills(persisted.skills));
      }
      if (user?.id) {
        const remoteSkills = await loadSkillProgress(user.id, recalculateAllSkills(seedSkills));
        setSkills(recalculateAllSkills(remoteSkills));
      }
    } catch (e) {
      setLoadError('Failed to load skills');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSkills();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void savePersistedAppState({
      skills,
    });
  }, [skills]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    skills.forEach((skill) => {
      void saveSkillProgress(user.id, skill);
    });
  }, [skills, user?.id]);

  const toggleTaskCompletion = (skillId: string, taskId: string) => {
    setSkills((currentSkills) =>
      currentSkills.map((skill) =>
        skill.id === skillId ? toggleTaskForSkill(skill, taskId) : skill,
      ),
    );
  };

  const totalXP = useMemo(
    () => skills.reduce((sum, skill) => sum + skill.xp, 0),
    [skills],
  );
  const totalLevel = useMemo(
    () => skills.reduce((sum, skill) => sum + skill.level, 0),
    [skills],
  );
  const longestStreak = useMemo(
    () => Math.max(...skills.map((skill) => skill.streak), 0),
    [skills],
  );
  const totalCompletedTasks = useMemo(
    () =>
      skills.reduce(
        (sum, skill) => sum + skill.tasks.filter((task) => task.completed).length,
        0,
      ),
    [skills],
  );
  const totalTasks = useMemo(
    () => skills.reduce((sum, skill) => sum + skill.tasks.length, 0),
    [skills],
  );

  const getSkillById = (skillId: string | null): Skill | undefined =>
    skills.find((skill) => skill.id === skillId);

  return (
    <SkillsContext.Provider
      value={{
        skills,
        isLoading,
        loadError,
        totalXP,
        totalLevel,
        longestStreak,
        totalCompletedTasks,
        totalTasks,
        toggleTaskCompletion,
        getSkillById,
        reload: loadSkills,
      }}
    >
      {children}
    </SkillsContext.Provider>
  );
}


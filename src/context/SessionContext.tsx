import React, { createContext, useContext, useState } from 'react';
import { generatePlan } from '../logic/planGenerator';
import { acceptLatestPlanForSkill, saveDraftPlan as persistDraftPlan } from '../services/plansRepository';
import { completeLatestSessionRun, createSessionRun } from '../services/sessionRunsRepository';
import { loadPersistedAppState, savePersistedAppState } from '../services/appStorage';
import { useAuth } from '../hooks/useAuth';
import { useSkills } from '../hooks/useSkills';
import type { Difficulty, GeneratedPlan } from '../types';

interface SessionContextType {
  acceptedPlans: Record<string, GeneratedPlan>;
  activeSessions: Record<string, { startedAt: string }>;
  createPlan: (skillId: string, difficulty: Difficulty) => GeneratedPlan | null;
  saveDraftPlan: (plan: GeneratedPlan, source: 'ai' | 'fallback') => Promise<void>;
  acceptPlan: (plan: GeneratedPlan) => void;
  startSession: (skillId: string) => { ok: boolean; message: string };
  completeSession: (skillId: string) => { ok: boolean; message: string };
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { skills, toggleTaskCompletion } = useSkills();
  const [acceptedPlans, setAcceptedPlans] = useState<Record<string, GeneratedPlan>>({});
  const [activeSessions, setActiveSessions] = useState<Record<string, { startedAt: string }>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    loadPersistedAppState().then(state => {
      if (state) {
        if (state.acceptedPlans) setAcceptedPlans(state.acceptedPlans);
        if (state.activeSessions) setActiveSessions(state.activeSessions);
      }
      setIsLoaded(true);
    });
  }, []);

  React.useEffect(() => {
    if (isLoaded) {
      void savePersistedAppState({
        acceptedPlans,
        activeSessions,
      });
    }
  }, [acceptedPlans, activeSessions, isLoaded]);

  const createPlan = (skillId: string, difficulty: Difficulty): GeneratedPlan | null => {
    const targetSkill = skills.find((skill) => skill.id === skillId);
    if (!targetSkill) {
      return null;
    }
    return generatePlan(targetSkill, difficulty);
  };

  const acceptPlan = (plan: GeneratedPlan) => {
    setAcceptedPlans((currentPlans) => ({
      ...currentPlans,
      [plan.skillId]: plan,
    }));
    if (user?.id) {
      void acceptLatestPlanForSkill(user.id, plan.skillId);
    }
  };

  const saveDraftPlan = async (plan: GeneratedPlan, source: 'ai' | 'fallback') => {
    if (!user?.id) {
      return;
    }
    await persistDraftPlan(user.id, plan, source);
  };

  const startSession = (skillId: string): { ok: boolean; message: string } => {
    if (!acceptedPlans[skillId]) {
      return { ok: false, message: 'Validez un plan avant de commencer une séance.' };
    }
    if (activeSessions[skillId]) {
      return { ok: false, message: 'Une séance est déjà en cours pour cette compétence.' };
    }

    setActiveSessions((current) => ({
      ...current,
      [skillId]: { startedAt: new Date().toISOString() },
    }));
    if (user?.id) {
      void createSessionRun(user.id, skillId);
    }
    return { ok: true, message: 'Séance démarrée. Quand vous finissez, validez la séance.' };
  };

  const completeSession = (skillId: string): { ok: boolean; message: string } => {
    if (!activeSessions[skillId]) {
      return { ok: false, message: 'Aucune séance active à terminer.' };
    }

    const skill = skills.find((item) => item.id === skillId);
    if (!skill) {
      return { ok: false, message: 'Compétence introuvable.' };
    }

    const planTaskOrder = acceptedPlans[skillId]?.recommendedTaskIds ?? [];
    const nextTaskFromPlan = planTaskOrder
      .map((taskId) => skill.tasks.find((task) => task.id === taskId))
      .find((task): task is NonNullable<typeof task> => Boolean(task && !task.completed));
    const nextTask = nextTaskFromPlan ?? skill.tasks.find((task) => !task.completed);
    if (!nextTask) {
      setActiveSessions((current) => {
        const updated = { ...current };
        delete updated[skillId];
        return updated;
      });
      return { ok: true, message: 'Séance terminée. Toutes les tâches sont déjà complétées.' };
    }

    toggleTaskCompletion(skillId, nextTask.id);
    setActiveSessions((current) => {
      const updated = { ...current };
      delete updated[skillId];
      return updated;
    });
    if (user?.id) {
      void completeLatestSessionRun(user.id, nextTask.xp);
    }

    return { ok: true, message: `Séance terminée. Tâche validée: ${nextTask.title}` };
  };

  return (
    <SessionContext.Provider
      value={{
        acceptedPlans,
        activeSessions,
        createPlan,
        saveDraftPlan,
        acceptPlan,
        startSession,
        completeSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}


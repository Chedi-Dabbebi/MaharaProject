import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Skill, skills as seedSkills } from '../data/skills';
import { Difficulty, GeneratedPlan, generatePlan } from '../logic/planGenerator';
import { recalculateAllSkills, toggleTaskForSkill } from '../logic/progression';
import {
  getStorageSchemaVersion,
  loadPersistedAppState,
  savePersistedAppState,
} from '../services/appStorage';
import { getCurrentAuthUser, signInOrSignUp, signOutCurrentUser } from '../services/authService';
import { ensureProfile } from '../services/profileService';
import { acceptLatestPlanForSkill, saveDraftPlan as persistDraftPlan } from '../services/plansRepository';
import { completeLatestSessionRun, createSessionRun } from '../services/sessionRunsRepository';
import { bootstrapSkillProgress, loadSkillProgress, saveSkillProgress } from '../services/progressRepository';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  initials: string;
}

interface AppStateContextType {
  appReady: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
  skills: Skill[];
  totalXP: number;
  totalLevel: number;
  longestStreak: number;
  totalCompletedTasks: number;
  totalTasks: number;
  acceptedPlans: Record<string, GeneratedPlan>;
  activeSessions: Record<string, { startedAt: string }>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  toggleTaskCompletion: (skillId: string, taskId: string) => void;
  createPlan: (skillId: string, difficulty: Difficulty) => GeneratedPlan | null;
  saveDraftPlan: (plan: GeneratedPlan, source: 'ai' | 'fallback') => Promise<void>;
  acceptPlan: (plan: GeneratedPlan) => void;
  startSession: (skillId: string) => { ok: boolean; message: string };
  completeSession: (skillId: string) => { ok: boolean; message: string };
  getSkillById: (skillId: string | null) => Skill | undefined;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

function toUserProfile(id: string, displayName: string, email: string, initials: string): UserProfile {
  return {
    id,
    name: displayName,
    email,
    initials,
  };
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [appReady, setAppReady] = useState(false);
  const [skills, setSkills] = useState<Skill[]>(() => recalculateAllSkills(seedSkills));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [acceptedPlans, setAcceptedPlans] = useState<Record<string, GeneratedPlan>>({});
  const [activeSessions, setActiveSessions] = useState<Record<string, { startedAt: string }>>({});

  useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      const persisted = await loadPersistedAppState();
      if (!isMounted) {
        return;
      }
      if (persisted) {
        setSkills(recalculateAllSkills(persisted.skills));
        if (persisted.user) {
          setUser({
            id: (persisted.user as UserProfile).id ?? `local-${persisted.user.email}`,
            name: persisted.user.name,
            email: persisted.user.email,
            initials: persisted.user.initials,
          });
        } else {
          setUser(null);
        }
        setAcceptedPlans(persisted.acceptedPlans ?? {});
        setActiveSessions(persisted.activeSessions ?? {});
      }
      const authUser = await getCurrentAuthUser();
      if (authUser) {
        const profile = await ensureProfile(authUser.id, authUser.email);
        setUser(toUserProfile(profile.id, profile.display_name, profile.email, profile.initials));
        await bootstrapSkillProgress(authUser.id, recalculateAllSkills(seedSkills));
        const remoteSkills = await loadSkillProgress(authUser.id, recalculateAllSkills(seedSkills));
        setSkills(recalculateAllSkills(remoteSkills));
      }
      setAppReady(true);
    };
    void hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!appReady) {
      return;
    }
    void savePersistedAppState({
      schemaVersion: getStorageSchemaVersion(),
      skills,
      user,
      acceptedPlans,
      activeSessions,
    });
  }, [acceptedPlans, activeSessions, appReady, skills, user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email.trim() || password.length < 6) {
      return false;
    }
    const authUser = await signInOrSignUp(email.trim(), password);
    if (!authUser) {
      return false;
    }
    const profile = await ensureProfile(authUser.id, authUser.email);
    setUser(toUserProfile(profile.id, profile.display_name, profile.email, profile.initials));
    await bootstrapSkillProgress(authUser.id, recalculateAllSkills(seedSkills));
    const remoteSkills = await loadSkillProgress(authUser.id, recalculateAllSkills(seedSkills));
    setSkills(recalculateAllSkills(remoteSkills));
    return true;
  };

  const logout = async () => {
    await signOutCurrentUser();
    setUser(null);
  };

  const toggleTaskCompletion = (skillId: string, taskId: string) => {
    setSkills((currentSkills) =>
      currentSkills.map((skill) =>
        skill.id === skillId ? toggleTaskForSkill(skill, taskId) : skill,
      ),
    );
  };

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

    setSkills((currentSkills) =>
      currentSkills.map((item) =>
        item.id === skillId ? toggleTaskForSkill(item, nextTask.id) : item,
      ),
    );
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

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    skills.forEach((skill) => {
      void saveSkillProgress(user.id, skill);
    });
  }, [skills, user?.id]);

  return (
    <AppStateContext.Provider
      value={{
        appReady,
        isAuthenticated: user !== null,
        user,
        skills,
        totalXP,
        totalLevel,
        longestStreak,
        totalCompletedTasks,
        totalTasks,
        acceptedPlans,
        activeSessions,
        login,
        logout,
        toggleTaskCompletion,
        createPlan,
        saveDraftPlan,
        acceptPlan,
        startSession,
        completeSession,
        getSkillById,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

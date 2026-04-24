import React, { createContext, useEffect, useState, useCallback } from 'react';
import { Linking } from 'react-native';
import {
  getStorageSchemaVersion,
  loadPersistedAppState,
  savePersistedAppState,
} from '../services/appStorage';
import {
  getCurrentAuthUser,
  signIn,
  signUp,
  resetPassword,
  signOutCurrentUser,
  signInWithOAuthProvider,
  handleAuthDeepLink,
  type AuthProvider,
} from '../services/authService';
import { ensureProfile, updateProfileBudget } from '../services/profileService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { bootstrapSkillProgress } from '../services/progressRepository';
import { recalculateAllSkills } from '../logic/progression';
import { skills as seedSkills } from '../data/skills';
import { hasCompletedOnboarding, markOnboardingComplete } from '../services/onboardingService';
import type { UserProfile } from '../types';

interface AuthContextType {
  appReady: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
  onboardingComplete: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signInWithProvider: (provider: AuthProvider) => Promise<{ success: boolean; error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error: string | null }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: string | null }>;
  completeOnboarding: () => Promise<void>;
  updateUser: (displayName: string, initials: string, budgetMinutes: number, avatarUrl?: string) => Promise<{ success: boolean; error: string | null }>;
  deleteAccount: () => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUserProfile(id: string, name: string, email: string, initials: string, avatarUrl?: string): UserProfile {
  return {
    id,
    name,
    email,
    initials,
    avatar_url: avatarUrl,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [appReady, setAppReady] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const applyAuthUser = useCallback(async (authUser: { id: string; email: string; displayName?: string }) => {
    const profile = await ensureProfile(authUser.id, authUser.email, authUser.displayName);
    setUser(toUserProfile(profile.id, profile.display_name, profile.email, profile.initials, profile.avatar_url));
    await bootstrapSkillProgress(authUser.id, recalculateAllSkills(seedSkills));
  }, []);

  useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      const persisted = await loadPersistedAppState();
      if (!isMounted) {
        return;
      }
      if (persisted?.user) {
        setUser({
          id: (persisted.user as UserProfile).id ?? `local-${persisted.user.email}`,
          name: persisted.user.name,
          email: persisted.user.email,
          initials: persisted.user.initials,
          avatar_url: persisted.user.avatar_url,
        });
      }
      const authUser = await getCurrentAuthUser();
      if (authUser) {
        await applyAuthUser(authUser);
      }
      const onboardingDone = await hasCompletedOnboarding();
      setOnboardingComplete(onboardingDone);
      setAppReady(true);
    };
    void hydrate();

    return () => {
      isMounted = false;
    };
  }, [applyAuthUser]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user;
      if (!nextUser) {
        setUser(null);
        return;
      }
      if (!nextUser.email) {
        return;
      }
      const displayName = nextUser.user_metadata?.display_name as string | undefined;
      void applyAuthUser({
        id: nextUser.id,
        email: nextUser.email,
        displayName,
      });
    });

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [applyAuthUser]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    const consumeUrl = async (url: string) => {
      const result = await handleAuthDeepLink(url);
      if (result.error) {
        console.error('OAuth callback error', result.error);
      }
    };

    void Linking.getInitialURL().then((url) => {
      if (url) {
        void consumeUrl(url);
      }
    });

    const subscription = Linking.addEventListener('url', (event) => {
      void consumeUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!appReady) {
      return;
    }
    void savePersistedAppState({
      schemaVersion: getStorageSchemaVersion(),
      skills: [],
      user,
      acceptedPlans: {},
      activeSessions: {},
    });
  }, [appReady, user]);

  const signInFlow = async (email: string, password: string): Promise<{ success: boolean; error: string | null }> => {
    if (!email.trim() || password.length < 6) return { success: false, error: 'error_email_invalid' };
    const { user: authUser, error } = await signIn(email.trim(), password);
    if (error || !authUser) return { success: false, error };
    await applyAuthUser(authUser);
    return { success: true, error: null };
  };

  const signUpFlow = async (email: string, password: string, name: string): Promise<{ success: boolean; error: string | null }> => {
    if (!email.trim() || password.length < 6 || !name.trim()) return { success: false, error: 'error_email_invalid' };
    const { user: authUser, error } = await signUp(email.trim(), password, name.trim());
    if (error || !authUser) return { success: false, error };
    await applyAuthUser(authUser);
    return { success: true, error: null };
  };

  const signInWithProviderFlow = async (provider: AuthProvider): Promise<{ success: boolean; error: string | null }> => {
    const { started, error } = await signInWithOAuthProvider(provider);
    if (!started) {
      return { success: false, error };
    }
    return { success: true, error: null };
  };

  const resetPasswordFlow = async (email: string): Promise<{ success: boolean; error: string | null }> => {
    const { success, error } = await resetPassword(email.trim());
    return { success, error };
  };

  const completeOnboarding = async () => {
    await markOnboardingComplete();
    setOnboardingComplete(true);
  };

  const updateUser = async (displayName: string, initials: string, budgetMinutes: number, avatarUrl?: string): Promise<{ success: boolean; error: string | null }> => {
    if (!user?.id) return { success: false, error: 'Not authenticated' };
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('profiles')
          .update({
            display_name: displayName,
            initials,
            weekly_time_budget_minutes: budgetMinutes,
            avatar_url: avatarUrl,
          })
          .eq('id', user.id);
        if (error) return { success: false, error: error.message };
      }
      await updateProfileBudget(user.id, budgetMinutes);
      setUser(prev => prev ? {
        ...prev,
        name: displayName,
        initials,
        weekly_time_budget_minutes: budgetMinutes,
        avatar_url: avatarUrl ?? prev.avatar_url
      } : prev);
      return { success: true, error: null };
    } catch {
      return { success: false, error: 'Update failed' };
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error: string | null }> => {
    if (!isSupabaseConfigured) {
      await signOutCurrentUser();
      setUser(null);
      return { success: true, error: null };
    }
    try {
      const { error } = await (supabase as any).rpc('delete_user');
      if (error) return { success: false, error: error.message };
      await signOutCurrentUser();
      setUser(null);
      return { success: true, error: null };
    } catch {
      return { success: false, error: 'Delete failed' };
    }
  };

  const logout = async () => {
    await signOutCurrentUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        appReady,
        isAuthenticated: user !== null,
        user,
        onboardingComplete,
        signIn: signInFlow,
        signInWithProvider: signInWithProviderFlow,
        signUp: signUpFlow,
        resetPassword: resetPasswordFlow,
        completeOnboarding,
        updateUser,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


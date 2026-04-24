-- Android Flaw - Supabase Database Schema
-- This schema creates all necessary tables for the learning platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- User profiles with learning preferences
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  initials TEXT NOT NULL,
  weekly_time_budget_minutes INTEGER DEFAULT 240,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- SKILLS CATALOG TABLE
-- Discoverable skills with learning content
-- ============================================================================
CREATE TABLE IF NOT EXISTS skills_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
  estimated_hours INTEGER DEFAULT 20,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- LEARNING CONTENT TABLE
-- Lessons, exercises, and resources for each skill
-- ============================================================================
CREATE TABLE IF NOT EXISTS learning_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills_catalog(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- lesson, exercise, quiz, resource
  title TEXT NOT NULL,
  description TEXT,
  content_body TEXT, -- markdown content for lessons
  order_index INTEGER NOT NULL,
  estimated_minutes INTEGER DEFAULT 15,
  xp_reward INTEGER DEFAULT 50,
  quiz_data JSONB, -- for quiz questions and answers
  resource_url TEXT, -- for external resources
  video_url TEXT, -- for embedded videos
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- USER SKILLS TABLE
-- Skills that users are actively learning
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills_catalog(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  progress_percentage INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_practice_date DATE,
  difficulty_preference TEXT DEFAULT 'moyen',
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, skill_id)
);

-- ============================================================================
-- USER PROGRESS TABLE
-- Track completion of lessons, exercises, and quizzes
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES learning_content(id) ON DELETE CASCADE,
  user_skill_id UUID REFERENCES user_skills(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER, -- for quizzes
  time_spent_minutes INTEGER,
  attempts INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, content_id)
);

-- ============================================================================
-- WEEKLY PLANS TABLE
-- Generated weekly learning plans
-- ============================================================================
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_skill_id UUID REFERENCES user_skills(id) ON DELETE CASCADE,
  difficulty TEXT NOT NULL,
  sessions_per_week INTEGER NOT NULL,
  weekly_time TEXT NOT NULL,
  recommended_content_ids UUID[], -- array of content IDs
  summary TEXT,
  source TEXT DEFAULT 'ai', -- ai, fallback, manual
  plan_week_start DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- PLAN SESSIONS TABLE
-- Individual sessions within weekly plans
-- ============================================================================
CREATE TABLE IF NOT EXISTS plan_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weekly_plan_id UUID REFERENCES weekly_plans(id) ON DELETE CASCADE,
  day_label TEXT NOT NULL,
  content_id UUID REFERENCES learning_content(id),
  content_title TEXT NOT NULL,
  duration TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  actual_time_spent_minutes INTEGER,
  order_index INTEGER NOT NULL
);

-- ============================================================================
-- SESSION RUNS TABLE
-- Individual session execution records
-- ============================================================================
CREATE TABLE IF NOT EXISTS session_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_session_id UUID REFERENCES plan_sessions(id),
  user_skill_id UUID REFERENCES user_skills(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  completed_at TIMESTAMP WITH TIME ZONE,
  actual_duration_minutes INTEGER,
  xp_earned INTEGER DEFAULT 0,
  reflection_notes TEXT,
  status TEXT DEFAULT 'in_progress', -- in_progress, completed, abandoned
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- ACHIEVEMENTS TABLE
-- Available achievements in the system
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL, -- streak, xp, completion, social
  requirement_type TEXT NOT NULL, -- count, days, total_xp
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 100,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- USER ACHIEVEMENTS TABLE
-- Achievements unlocked by users
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  progress_current INTEGER DEFAULT 0,
  progress_required INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_learning_content_skill_id ON learning_content(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_content_id ON user_progress(content_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_id ON weekly_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plan_sessions_weekly_plan_id ON plan_sessions(weekly_plan_id);
CREATE INDEX IF NOT EXISTS idx_session_runs_user_id ON session_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_catalog_updated_at
  BEFORE UPDATE ON skills_catalog
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/write their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User Skills: Users can only manage their own skills
CREATE POLICY "Users can view own skills" ON user_skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own skills" ON user_skills
  FOR ALL USING (auth.uid() = user_id);

-- User Progress: Users can only manage their own progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Weekly Plans: Users can only manage their own plans
CREATE POLICY "Users can view own plans" ON weekly_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own plans" ON weekly_plans
  FOR ALL USING (auth.uid() = user_id);

-- Plan Sessions: Users can only manage their own sessions
CREATE POLICY "Users can view own plan sessions" ON plan_sessions
  FOR SELECT USING (weekly_plan_id IN (
    SELECT id FROM weekly_plans WHERE user_id = auth.uid()
  ));

-- Session Runs: Users can only manage their own sessions
CREATE POLICY "Users can view own session runs" ON session_runs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own session runs" ON session_runs
  FOR ALL USING (auth.uid() = user_id);

-- User Achievements: Users can only view their own achievements
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA - SKILLS CATALOG
-- ============================================================================
INSERT INTO skills_catalog (name, description, icon, color, difficulty_level, estimated_hours, category) VALUES
  ('Musique', 'Apprenez les bases de la musique: gammes, rythme, et théorie', 'music', '#6366F1', 'beginner', 40, 'Arts'),
  ('Photographie', 'Maîtrisez la composition, la lumière et la retouche photo', 'camera', '#88304E', 'beginner', 30, 'Arts'),
  ('Fitness', 'Développez votre force, endurance et flexibilité', 'dumbbell', '#C94C6D', 'beginner', 50, 'Santé'),
  ('Programmation', 'Apprenez à coder avec des projets pratiques', 'code', '#4F46E5', 'beginner', 80, 'Technologie'),
  ('Architecture Logicielle', 'Concevez des applications robustes et évolutives', 'code', '#A0395F', 'intermediate', 100, 'Technologie'),
  ('Cuisine', 'Découvrez les techniques culinaires de base', 'restaurant', '#059669', 'beginner', 25, 'Lifestyle'),
  ('Dessin', 'Apprenez les bases du dessin et du croquis', 'brush', '#DC2626', 'beginner', 35, 'Arts'),
  ('Écriture', 'Améliorez votre style d''écriture et de narration', 'edit', '#7C3AED', 'beginner', 30, 'Éducation'),
  ('Méditation', 'Développez la pleine conscience et la réduction du stress', 'self-improvement', '#0891B2', 'beginner', 20, 'Santé'),
  ('Finance Personnelle', 'Gérez votre budget et apprenez à investir', 'attach-money', '#0284C7', 'beginner', 15, 'Lifestyle'),
  ('Jardinage', 'Cultivez vos propres plantes et légumes', 'yard', '#16A34A', 'beginner', 40, 'Lifestyle'),
  ('Astronomie', 'Explorez l''univers et les mystères du cosmos', 'star', '#1E3A8A', 'beginner', 30, 'Science'),
  ('Histoire', 'Découvrez les événements qui ont façonné le monde', 'history-edu', '#7F1D1D', 'beginner', 50, 'Éducation'),
  ('Marketing Digital', 'Maîtrisez les réseaux sociaux et le SEO', 'trending-up', '#EA580C', 'beginner', 35, 'Technologie'),
  ('Yoga', 'Améliorez flexibilité, force et équilibre', 'accessibility', '#7E22CE', 'beginner', 40, 'Santé');

-- ============================================================================
-- SEED DATA - ACHIEVEMENTS
-- ============================================================================
INSERT INTO achievements (name, description, icon, category, requirement_type, requirement_value, xp_reward) VALUES
  ('Premiers Pas', 'Complétez votre première session', 'flag', 'completion', 'count', 1, 50),
  ('Débutant Déterminé', 'Complétez 5 sessions', 'local-fire-department', 'completion', 'count', 5, 100),
  ('Apprenti', 'Complétez 10 sessions', 'school', 'completion', 'count', 10, 200),
  ('Expert', 'Complétez 25 sessions', 'emoji-events', 'completion', 'count', 25, 500),
  ('Maître', 'Complétez 50 sessions', 'workspace-premium', 'completion', 'count', 50, 1000),
  ('Streak 3 Jours', 'Maintenez une streak de 3 jours', 'local-fire-department', 'streak', 'days', 3, 75),
  ('Streak 7 Jours', 'Maintenez une streak d''une semaine', 'whatshot', 'streak', 'days', 7, 150),
  ('Streak 30 Jours', 'Maintenez une streak d''un mois', 'emoji-fire', 'streak', 'days', 30, 500),
  ('XP Novice', 'Gagnez 500 XP totaux', 'star', 'xp', 'total_xp', 500, 100),
  ('XP Collecteur', 'Gagnez 2000 XP totaux', 'grade', 'xp', 'total_xp', 2000, 250),
  ('XP Maître', 'Gagnez 5000 XP totaux', 'rewards', 'xp', 'total_xp', 5000, 500),
  ('Multi-Skill', 'Apprenez 3 compétences simultanément', 'diversity-3', 'social', 'count', 3, 150),
  ('Polyglotte', 'Apprenez 5 compétences simultanément', 'language', 'social', 'count', 5, 300),
  ('Rapide', 'Complétez une session en moins de 10 min', 'bolt', 'completion', 'count', 1, 50),
  ('Endurant', 'Complétez une session de 60+ minutes', 'timer', 'completion', 'count', 1, 100);

-- ============================================================================
-- SAMPLE LEARNING CONTENT FOR MUSIC SKILL
-- ============================================================================
DO $$
DECLARE
  music_skill_id UUID;
BEGIN
  SELECT id INTO music_skill_id FROM skills_catalog WHERE name = 'Musique' LIMIT 1;

  INSERT INTO learning_content (skill_id, content_type, title, description, content_body, order_index, estimated_minutes, xp_reward) VALUES
    (music_skill_id, 'lesson', 'Introduction aux Notes', 'Découvrez les 7 notes de la gamme et leur position',
     '# Les Notes de Musique

La musique occidentale utilise 7 notes principales:

## Do - Ré - Mi - Fa - Sol - La - Si

### La Gamme Majeure
La gamme majeure de Do est la plus simple à apprendre car elle ne contient ni dièse (#) ni bémol (b).

### Exercice Pratique
Jouez les notes dans l''ordre:
1. Do (C) - La note fondamentale
2. Ré (D) - Un ton au-dessus
3. Mi (E) - Deux tons au-dessus
4. Fa (F) - Deux tons et demi
5. Sol (G) - Trois tons et demi
6. La (A) - Quatre tons et demi
7. Si (B) - Cinq tons et demi
8. Do (C) - L''octave

### Conseil
Pratiquez lentement et écoutez attentivement chaque note.',
     1, 15, 50),
    (music_skill_id, 'quiz', 'Quiz: Les Notes', 'Testez vos connaissances sur les notes',
     NULL, 2, 10, 30),
    (music_skill_id, 'lesson', 'Les Gammes Majeures', 'Comprendre la structure des gammes majeures',
     '# Les Gammes Majeures

## Structure de la Gamme Majeure

La gamme majeure suit un motif spécifique de tons et demi-tons:

**Ton - Ton - 1/2 Ton - Ton - Ton - Ton - 1/2 Ton**

### Exemple en Do Majeur
- Do → Ré = 1 ton
- Ré → Mi = 1 ton
- Mi → Fa = 1/2 ton
- Fa → Sol = 1 ton
- Sol → La = 1 ton
- La → Si = 1 ton
- Si → Do = 1/2 ton

### Exercice
Pratiquez la gamme de Do majeur à votre instrument.',
     3, 20, 60),
    (music_skill_id, 'exercise', 'Pratique des Gammes', 'Jouez la gamme de Do majeur 5 fois',
     '## Exercice: Gamme de Do Majeur

### Instructions
1. Jouez la gamme ascendante lentement
2. Jouez la gamme descendante
3. Répétez 5 fois
4. Augmentez progressivement la vitesse

### Objectif
- Durée: 20 minutes
- XP: 75',
     4, 20, 75),
    (music_skill_id, 'lesson', 'Le Rythme et la Mesure', 'Apprendre les bases du rythme musical',
     '# Le Rythme et la Mesure

## Qu''est-ce que le Rythme?

Le rythme est l''organisation du temps en musique.

## Les Figures de Notes

| Figure | Nom | Durée |
|--------|-----|-------|
| 𝅝 | Ronde | 4 temps |
| 𝅗𝅥 | Blanche | 2 temps |
| 𝅘𝅥 | Noire | 1 temps |
| 𝅘𝅥𝅮 | Croche | 1/2 temps |
| 𝅘𝅯𝅮 | Double croche | 1/4 temps |

## La Mesure
La mesure la plus commune est 4/4 (quatre temps par mesure).

### Exercice de Rythme
Tapez dans vos mains en comptant: **1 - 2 - 3 - 4**',
     5, 25, 70);
END $$;

-- ============================================================================
-- SAMPLE LEARNING CONTENT FOR PHOTOGRAPHY SKILL
-- ============================================================================
DO $$
DECLARE
  photo_skill_id UUID;
BEGIN
  SELECT id INTO photo_skill_id FROM skills_catalog WHERE name = 'Photographie' LIMIT 1;

  INSERT INTO learning_content (skill_id, content_type, title, description, content_body, order_index, estimated_minutes, xp_reward, quiz_data) VALUES
    (photo_skill_id, 'lesson', 'La Règle des Tiers', 'Comprendre la composition de base',
     '# La Règle des Tiers

## Principe Fondamental

La règle des tiers divise votre image en 9 parties égales:

### Comment l''appliquer
1. Imaginez une grille de 3x3 sur votre image
2. Placez les éléments importants sur les intersections
3. Alignez l''horizon sur une ligne horizontale

### Pourquoi ça marche
Cette composition crée un équilibre naturel et attire l''oeil.',
     1, 15, 50, NULL),
    (photo_skill_id, 'exercise', 'Défi Photo: Règle des Tiers', 'Prenez 5 photos utilisant la règle des tiers',
     '## Défi Photo

### Mission
Prenez 5 photos en appliquant la règle des tiers:
- 1 paysage
- 1 portrait
- 1 objet
- 1 animal
- 1 architecture

### Durée: 45 minutes
### XP: 80',
     2, 45, 80, NULL),
    (photo_skill_id, 'lesson', 'La Lumière Naturelle', 'Maîtriser l''éclairage en photographie',
     '# La Lumière Naturelle

## L''Heure Dorée (Golden Hour)

La meilleure lumière se trouve:
- 1 heure après le lever du soleil
- 1 heure avant le coucher du soleil

## L''Heure Bleue
Juste avant le lever et après le coucher du soleil.

## Conseils
- Évitez le midi (lumière trop dure)
- Utilisez les nuages comme diffuseur naturel
- Expérimentez avec le contre-jour',
     3, 20, 60, NULL),
    (photo_skill_id, 'quiz', 'Quiz: Composition Photo', 'Testez vos connaissances en composition',
     NULL, 4, 10, 30,
     '{"questions": [{"question": "Où placer le sujet principal selon la règle des tiers?", "options": ["Au centre", "Sur les intersections", "N''importe où"], "correct": 1}, {"question": "Quand est la meilleure lumière pour photographier?", "options": ["Midi", "Heure dorée", "Nuit"], "correct": 1}]}'),
    (photo_skill_id, 'resource', 'Meilleurs Logiciels de Retouche', 'Comparatif des logiciels de retouche photo',
     NULL, 5, 10, 20, '{"type": "article", "url": "https://www.adobe.com/products/photoshop.html", "description": "Adobe Photoshop - Le standard professionnel"}');
END $$;

-- ============================================================================
-- SAMPLE LEARNING CONTENT FOR FITNESS SKILL
-- ============================================================================
DO $$
DECLARE
  fitness_skill_id UUID;
BEGIN
  SELECT id INTO fitness_skill_id FROM skills_catalog WHERE name = 'Fitness' LIMIT 1;

  INSERT INTO learning_content (skill_id, content_type, title, description, content_body, order_index, estimated_minutes, xp_reward) VALUES
    (fitness_skill_id, 'lesson', 'Les Bases de la Musculation', 'Comprendre les mouvements fondamentaux',
     '# Les Mouvements Fondamentaux

## Les 5 Mouvements de Base

1. **Squat** - Jambes et fessiers
2. **Deadlift** - Dos et jambes
3. **Bench Press** - Pectoraux et triceps
4. **Overhead Press** - Épaules
5. **Row** - Dos et biceps

### Conseils pour Débutants
- Commencez avec peu de poids
- Concentrez-vous sur la forme
- 3 séries de 10 répétitions',
     1, 20, 60),
    (fitness_skill_id, 'exercise', 'Séance Full Body', 'Entraînement complet du corps',
     '## Séance Full Body - Débutant

### Échauffement (5 min)
- Jumping jacks: 30 sec
- Rotation des bras: 30 sec
- Squats sans poids: 10 reps

### Circuit (3 tours)
1. Squats: 15 reps
2. Push-ups: 10 reps
3. Lunges: 10 reps chaque jambe
4. Planche: 30 sec
5. Burpees: 5 reps

### Repos: 90 sec entre les tours

### Durée totale: 30 min
### XP: 70',
     2, 30, 70),
    (fitness_skill_id, 'lesson', 'La Nutrition Sportive', 'Alimentation pour la performance',
     '# Nutrition pour le Fitness

## Les Macros Essentiels

### Protéines
- Viandes, poissons, oeufs
- Légumineuses, tofu
- 1.6-2g par kg de poids de corps

### Glucides
- Riz, pâtes, quinoa
- Fruits, légumes
- Énergie pour l''entraînement

### Lipides
- Avocat, noix, huile d''olive
- Poissons gras
- Santé hormonale',
     3, 15, 50),
    (fitness_skill_id, 'exercise', 'Cardio HIIT', 'Entraînement par intervalles',
     '## HIIT - 20 Minutes

### Structure
- 30 sec effort maximum
- 30 sec repos
- 10 exercices différents

### Exercices
1. High knees
2. Mountain climbers
3. Jump squats
4. Push-ups
5. Burpees
6. Plank jacks
7. Lunges jump
8. Bicycle crunch
9. Jumping jacks
10. Rest

### XP: 60',
     4, 20, 60),
    (fitness_skill_id, 'resource', 'Vidéos de Référence', 'Exercices en vidéo',
     NULL, 5, 10, 20, '{"type": "video", "url": "https://youtube.com/watch?v=example", "description": "Collection d''exercices démontrés"}');
END $$;

-- ============================================================================
-- SAMPLE LEARNING CONTENT FOR PROGRAMMING SKILL
-- ============================================================================
DO $$
DECLARE
  programming_skill_id UUID;
BEGIN
  SELECT id INTO programming_skill_id FROM skills_catalog WHERE name = 'Programmation' LIMIT 1;

  INSERT INTO learning_content (skill_id, content_type, title, description, content_body, order_index, estimated_minutes, xp_reward, quiz_data) VALUES
    (programming_skill_id, 'lesson', 'Variables et Types', 'Comprendre les bases des variables',
     '# Variables et Types

## Concepts clés
- Variables
- Types primitifs
- Conversion de type

### Exercice
Déclarez 3 variables: un nombre, une chaîne et un booléen.',
     1, 20, 60),
    (programming_skill_id, 'quiz', 'Quiz: Fondamentaux', 'Testez vos bases en programmation',
     NULL, 2, 15, 40,
     '{"questions": [{"question": "Quel mot-clé déclare une constante en JavaScript?", "options": ["var", "let", "const"], "correct": 2}, {"question": "Quel type représente vrai/faux?", "options": ["string", "boolean", "number"], "correct": 1}]}'),
    (programming_skill_id, 'lesson', 'Conditions et Boucles', 'if/else et boucles de répétition',
     '# Conditions et Boucles

## Conditions
Utilisez `if/else` pour contrôler le flux.

## Boucles
`for` et `while` permettent de répéter des actions.',
     3, 25, 70),
    (programming_skill_id, 'exercise', 'Mini Kata', 'Résoudre un petit problème algorithmique',
     '## Exercice

Créez une fonction qui retourne les nombres pairs de 1 à 20.',
     4, 30, 75),
    (programming_skill_id, 'resource', 'Ressource JavaScript', 'Documentation officielle MDN',
     NULL, 5, 10, 20, '{"type": "documentation", "url": "https://developer.mozilla.org/fr/docs/Web/JavaScript", "description": "Référence JavaScript complète"}');
END $$;

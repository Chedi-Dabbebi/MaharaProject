// Skills Catalog Service - Fetch and manage available skills
import type { Skill, Task } from '../types';
import { supabase } from './supabaseClient';

export interface SkillCatalogItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficultyLevel: string;
  estimatedHours: number;
  category: string;
  isActive: boolean;
}

export interface LearningContent {
  id: string;
  skillId: string;
  contentType: 'lesson' | 'exercise' | 'quiz' | 'resource';
  title: string;
  description: string;
  contentBody?: string;
  orderIndex: number;
  estimatedMinutes: number;
  xpReward: number;
  quizData?: QuizData;
  resourceUrl?: string;
  videoUrl?: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

// Local fallback catalog when Supabase is not available
const LOCAL_SKILLS_CATALOG: SkillCatalogItem[] = [
  { id: '1', name: 'Musique', description: 'Apprenez les bases de la musique: gammes, rythme, et théorie', icon: 'music', color: '#6366F1', difficultyLevel: 'beginner', estimatedHours: 40, category: 'Arts', isActive: true },
  { id: '2', name: 'Photographie', description: 'Maîtrisez la composition, la lumière et la retouche photo', icon: 'camera', color: '#88304E', difficultyLevel: 'beginner', estimatedHours: 30, category: 'Arts', isActive: true },
  { id: '3', name: 'Fitness', description: 'Développez votre force, endurance et flexibilité', icon: 'dumbbell', color: '#C94C6D', difficultyLevel: 'beginner', estimatedHours: 50, category: 'Santé', isActive: true },
  { id: '4', name: 'Programmation', description: 'Apprenez à coder avec des projets pratiques', icon: 'code', color: '#4F46E5', difficultyLevel: 'beginner', estimatedHours: 80, category: 'Technologie', isActive: true },
  { id: '5', name: 'Architecture Logicielle', description: 'Concevez des applications robustes et évolutives', icon: 'code', color: '#A0395F', difficultyLevel: 'intermediate', estimatedHours: 100, category: 'Technologie', isActive: true },
  { id: '6', name: 'Cuisine', description: 'Découvrez les techniques culinaires de base', icon: 'restaurant', color: '#059669', difficultyLevel: 'beginner', estimatedHours: 25, category: 'Lifestyle', isActive: true },
  { id: '7', name: 'Dessin', description: 'Apprenez les bases du dessin et du croquis', icon: 'brush', color: '#DC2626', difficultyLevel: 'beginner', estimatedHours: 35, category: 'Arts', isActive: true },
  { id: '8', name: 'Écriture', description: 'Améliorez votre style d\'écriture et de narration', icon: 'edit', color: '#7C3AED', difficultyLevel: 'beginner', estimatedHours: 30, category: 'Éducation', isActive: true },
  { id: '9', name: 'Méditation', description: 'Développez la pleine conscience et la réduction du stress', icon: 'self-improvement', color: '#0891B2', difficultyLevel: 'beginner', estimatedHours: 20, category: 'Santé', isActive: true },
  { id: '10', name: 'Finance Personnelle', description: 'Gérez votre budget et apprenez à investir', icon: 'attach-money', color: '#0284C7', difficultyLevel: 'beginner', estimatedHours: 15, category: 'Lifestyle', isActive: true },
  { id: '11', name: 'Jardinage', description: 'Cultivez vos propres plantes et légumes', icon: 'yard', color: '#16A34A', difficultyLevel: 'beginner', estimatedHours: 40, category: 'Lifestyle', isActive: true },
  { id: '12', name: 'Astronomie', description: 'Explorez l\'univers et les mystères du cosmos', icon: 'star', color: '#1E3A8A', difficultyLevel: 'beginner', estimatedHours: 30, category: 'Science', isActive: true },
  { id: '13', name: 'Histoire', description: 'Découvrez les événements qui ont façonné le monde', icon: 'history-edu', color: '#7F1D1D', difficultyLevel: 'beginner', estimatedHours: 50, category: 'Éducation', isActive: true },
  { id: '14', name: 'Marketing Digital', description: 'Maîtrisez les réseaux sociaux et le SEO', icon: 'trending-up', color: '#EA580C', difficultyLevel: 'beginner', estimatedHours: 35, category: 'Technologie', isActive: true },
  { id: '15', name: 'Yoga', description: 'Améliorez flexibilité, force et équilibre', icon: 'accessibility', color: '#7E22CE', difficultyLevel: 'beginner', estimatedHours: 40, category: 'Santé', isActive: true },
];

// Local learning content for each skill
const LOCAL_LEARNING_CONTENT: LearningContent[] = [
  // Music content
  { id: 'm1', skillId: '1', contentType: 'lesson', title: 'Introduction aux Notes', description: 'Découvrez les 7 notes de la gamme', contentBody: '# Les Notes de Musique\n\nLa musique occidentale utilise 7 notes principales:\n\n## Do - Ré - Mi - Fa - Sol - La - Si\n\n### La Gamme Majeure\nLa gamme majeure de Do est la plus simple à apprendre car elle ne contient ni dièse (#) ni bémol (b).\n\n### Exercice Pratique\nJouez les notes dans l\'ordre:\n1. Do (C) - La note fondamentale\n2. Ré (D) - Un ton au-dessus\n3. Mi (E) - Deux tons au-dessus\n4. Fa (F) - Deux tons et demi\n5. Sol (G) - Trois tons et demi\n6. La (A) - Quatre tons et demi\n7. Si (B) - Cinq tons et demi\n8. Do (C) - L\'octave', orderIndex: 1, estimatedMinutes: 15, xpReward: 50 },
  { id: 'm2', skillId: '1', contentType: 'quiz', title: 'Quiz: Les Notes', description: 'Testez vos connaissances', orderIndex: 2, estimatedMinutes: 10, xpReward: 30, quizData: { questions: [{ question: 'Combien y a-t-il de notes dans la gamme majeure?', options: ['5', '6', '7', '8'], correct: 2 }, { question: 'Quelle note vient après Do?', options: ['Ré', 'Mi', 'Fa', 'Sol'], correct: 0 }] } },
  { id: 'm3', skillId: '1', contentType: 'lesson', title: 'Les Gammes Majeures', description: 'Comprendre la structure des gammes', contentBody: '# Les Gammes Majeures\n\n## Structure: Ton - Ton - 1/2 Ton - Ton - Ton - Ton - 1/2 Ton', orderIndex: 3, estimatedMinutes: 20, xpReward: 60 },
  { id: 'm4', skillId: '1', contentType: 'exercise', title: 'Pratique des Gammes', description: 'Jouez la gamme de Do majeur 5 fois', contentBody: '## Exercice: Gamme de Do Majeur\n\n1. Jouez la gamme ascendante lentement\n2. Jouez la gamme descendante\n3. Répétez 5 fois', orderIndex: 4, estimatedMinutes: 20, xpReward: 75 },
  { id: 'm5', skillId: '1', contentType: 'lesson', title: 'Le Rythme et la Mesure', description: 'Apprendre les bases du rythme', contentBody: '# Le Rythme\n\n| Figure | Durée |\n|--------|-------|\n| Ronde | 4 temps |\n| Blanche | 2 temps |\n| Noire | 1 temps |', orderIndex: 5, estimatedMinutes: 25, xpReward: 70 },

  // Photography content
  { id: 'p1', skillId: '2', contentType: 'lesson', title: 'La Règle des Tiers', description: 'Comprendre la composition de base', contentBody: '# La Règle des Tiers\n\nDivisez votre image en 9 parties égales et placez les éléments sur les intersections.', orderIndex: 1, estimatedMinutes: 15, xpReward: 50 },
  { id: 'p2', skillId: '2', contentType: 'exercise', title: 'Défi Photo: Règle des Tiers', description: 'Prenez 5 photos utilisant la règle des tiers', contentBody: '## Défi Photo\n\nPrenez 5 photos:\n- 1 paysage\n- 1 portrait\n- 1 objet\n- 1 animal\n- 1 architecture', orderIndex: 2, estimatedMinutes: 45, xpReward: 80 },
  { id: 'p3', skillId: '2', contentType: 'lesson', title: 'La Lumière Naturelle', description: 'Maîtriser l\'éclairage', contentBody: '# La Lumière Naturelle\n\n## L\'Heure Dorée: 1h après lever, 1h avant coucher', orderIndex: 3, estimatedMinutes: 20, xpReward: 60 },
  { id: 'p4', skillId: '2', contentType: 'quiz', title: 'Quiz: Composition Photo', description: 'Testez vos connaissances', orderIndex: 4, estimatedMinutes: 10, xpReward: 30, quizData: { questions: [{ question: 'Où placer le sujet selon la règle des tiers?', options: ['Au centre', 'Sur les intersections', 'N\'importe où'], correct: 1 }] } },
  { id: 'p5', skillId: '2', contentType: 'resource', title: 'Logiciels de Retouche', description: 'Comparatif des logiciels', resourceUrl: 'https://www.adobe.com/products/photoshop.html', orderIndex: 5, estimatedMinutes: 10, xpReward: 20 },

  // Fitness content
  { id: 'f1', skillId: '3', contentType: 'lesson', title: 'Les Bases de la Musculation', description: 'Les 5 mouvements fondamentaux', contentBody: '# Les 5 Mouvements: Squat, Deadlift, Bench Press, Overhead Press, Row', orderIndex: 1, estimatedMinutes: 20, xpReward: 60 },
  { id: 'f2', skillId: '3', contentType: 'exercise', title: 'Séance Full Body', description: 'Entraînement complet du corps', contentBody: '## Full Body - 3 tours\n1. Squats: 15 reps\n2. Push-ups: 10 reps\n3. Lunges: 10 reps\n4. Planche: 30 sec', orderIndex: 2, estimatedMinutes: 30, xpReward: 70 },
  { id: 'f3', skillId: '3', contentType: 'lesson', title: 'La Nutrition Sportive', description: 'Alimentation pour la performance', contentBody: '# Nutrition: Protéines, Glucides, Lipides', orderIndex: 3, estimatedMinutes: 15, xpReward: 50 },
  { id: 'f4', skillId: '3', contentType: 'exercise', title: 'Cardio HIIT', description: 'Entraînement par intervalles', contentBody: '## HIIT - 20 Minutes\n30 sec effort / 30 sec repos', orderIndex: 4, estimatedMinutes: 20, xpReward: 60 },
  { id: 'f5', skillId: '3', contentType: 'resource', title: 'Vidéos d\'Exercices', description: 'Démonstrations en vidéo', videoUrl: 'https://youtube.com', orderIndex: 5, estimatedMinutes: 10, xpReward: 20 },

  // Programming content
  { id: 'c1', skillId: '4', contentType: 'lesson', title: 'Variables et Types', description: 'Comprendre les bases des variables', contentBody: '# Variables et Types\n\n## Concepts clés\n- Variables\n- Types primitifs\n- Conversion de type\n\n### Exercice\nDéclarez 3 variables: un nombre, une chaîne et un booléen.', orderIndex: 1, estimatedMinutes: 20, xpReward: 60 },
  { id: 'c2', skillId: '4', contentType: 'quiz', title: 'Quiz: Fondamentaux', description: 'Testez vos bases en programmation', orderIndex: 2, estimatedMinutes: 15, xpReward: 40, quizData: { questions: [{ question: 'Quel mot-clé déclare une constante en JavaScript?', options: ['var', 'let', 'const'], correct: 2 }, { question: 'Quel type représente vrai/faux?', options: ['string', 'boolean', 'number'], correct: 1 }] } },
  { id: 'c3', skillId: '4', contentType: 'lesson', title: 'Conditions et Boucles', description: 'if/else et boucles de répétition', contentBody: '# Conditions et Boucles\n\n## Conditions\nUtilisez `if/else` pour contrôler le flux.\n\n## Boucles\n`for` et `while` permettent de répéter des actions.', orderIndex: 3, estimatedMinutes: 25, xpReward: 70 },
  { id: 'c4', skillId: '4', contentType: 'exercise', title: 'Mini Kata', description: 'Résoudre un petit problème algorithmique', contentBody: '## Exercice\n\nCréez une fonction qui retourne les nombres pairs de 1 à 20.', orderIndex: 4, estimatedMinutes: 30, xpReward: 75 },
  { id: 'c5', skillId: '4', contentType: 'resource', title: 'Ressource JavaScript', description: 'Documentation officielle MDN', resourceUrl: 'https://developer.mozilla.org/fr/docs/Web/JavaScript', orderIndex: 5, estimatedMinutes: 10, xpReward: 20 },
];

/**
 * Fetch all available skills from the catalog
 */
export async function fetchSkillsCatalog(): Promise<SkillCatalogItem[]> {
  try {
    const { data, error } = await supabase
      .from('skills_catalog')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error || !data) {
      console.log('Using local skills catalog');
      return LOCAL_SKILLS_CATALOG;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      icon: item.icon,
      color: item.color,
      difficultyLevel: item.difficulty_level || 'beginner',
      estimatedHours: item.estimated_hours || 20,
      category: item.category || 'General',
      isActive: item.is_active ?? true,
    }));
  } catch (error) {
    console.error('Error fetching skills catalog:', error);
    return LOCAL_SKILLS_CATALOG;
  }
}

/**
 * Fetch learning content for a specific skill
 */
export async function fetchLearningContent(skillId: string): Promise<LearningContent[]> {
  try {
    const { data, error } = await supabase
      .from('learning_content')
      .select('*')
      .eq('skill_id', skillId)
      .eq('is_active', true)
      .order('order_index');

    if (error || !data) {
      // Return local content for this skill
      return LOCAL_LEARNING_CONTENT.filter(c => c.skillId === skillId);
    }

    return data.map((item: any) => ({
      id: item.id,
      skillId: item.skill_id,
      contentType: item.content_type as 'lesson' | 'exercise' | 'quiz' | 'resource',
      title: item.title,
      description: item.description || '',
      contentBody: item.content_body,
      orderIndex: item.order_index,
      estimatedMinutes: item.estimated_minutes || 15,
      xpReward: item.xp_reward || 50,
      quizData: item.quiz_data,
      resourceUrl: item.resource_url,
      videoUrl: item.video_url,
    }));
  } catch (error) {
    console.error('Error fetching learning content:', error);
    return LOCAL_LEARNING_CONTENT.filter(c => c.skillId === skillId);
  }
}

/**
 * Get a specific skill by ID
 */
export async function getSkillById(skillId: string): Promise<SkillCatalogItem | null> {
  const catalog = await fetchSkillsCatalog();
  return catalog.find(s => s.id === skillId) || null;
}

/**
 * Get all content for a specific skill including quizzes
 */
export async function getSkillContent(skillId: string): Promise<{
  lessons: LearningContent[];
  exercises: LearningContent[];
  quizzes: LearningContent[];
  resources: LearningContent[];
}> {
  const content = await fetchLearningContent(skillId);

  return {
    lessons: content.filter(c => c.contentType === 'lesson'),
    exercises: content.filter(c => c.contentType === 'exercise'),
    quizzes: content.filter(c => c.contentType === 'quiz'),
    resources: content.filter(c => c.contentType === 'resource'),
  };
}

/**
 * Convert a catalog skill to a user Skill object with tasks from content
 */
export function catalogSkillToSkill(catalogItem: SkillCatalogItem, content: LearningContent[]): Skill {
  const tasks: Task[] = content.map((c, index) => ({
    id: c.id,
    title: c.title,
    duration: `${c.estimatedMinutes} min`,
    xp: c.xpReward,
    completed: false,
  }));

  // If no content, create default tasks
  if (tasks.length === 0) {
    for (let i = 1; i <= 5; i++) {
      tasks.push({
        id: `${catalogItem.id}-task-${i}`,
        title: `Leçon ${i}: Introduction`,
        duration: '20 min',
        xp: 50,
        completed: false,
      });
    }
  }

  return {
    id: catalogItem.id,
    name: catalogItem.name,
    icon: catalogItem.icon,
    color: catalogItem.color,
    progress: 0,
    level: 1,
    xp: 0,
    maxXp: 1000,
    streak: 0,
    tasks,
  };
}

/**
 * Search skills by name or category
 */
export async function searchSkills(query: string): Promise<SkillCatalogItem[]> {
  const catalog = await fetchSkillsCatalog();
  const lowerQuery = query.toLowerCase();

  return catalog.filter(skill =>
    skill.name.toLowerCase().includes(lowerQuery) ||
    skill.category.toLowerCase().includes(lowerQuery) ||
    skill.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get skills by category
 */
export async function getSkillsByCategory(category: string): Promise<SkillCatalogItem[]> {
  const catalog = await fetchSkillsCatalog();

  if (category === 'all') {
    return catalog;
  }

  return catalog.filter(skill => skill.category === category);
}

/**
 * Get all unique categories
 */
export async function getAllCategories(): Promise<string[]> {
  const catalog = await fetchSkillsCatalog();
  const categories = new Set(catalog.map(s => s.category));
  return Array.from(categories).sort();
}

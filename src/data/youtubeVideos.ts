/**
 * YouTube Video Links Configuration
 * 
 * Map task IDs to YouTube video IDs
 * Format: taskId -> youtubeVideoId
 * 
 * To add/update a video:
 * 1. Find the YouTube video you want
 * 2. Get the video ID from the URL: youtube.com/watch?v=VIDEO_ID_HERE
 * 3. Add entry: 'taskId': 'VIDEO_ID_HERE'
 * 
 * Example: youtube.com/watch?v=dQw4w9WgXcQ
 * Task: 'm1': 'dQw4w9WgXcQ'
 */

export const youtubeVideoMap: Record<string, string> = {
  // Music (Musique)
  'm1': '-_NuZMiXx3o', // Pratiquer les gammes
  'm2': '4w2icYjruEY', // Apprendre un nouveau morceau
  'm3': 'p9qynMmBz30', // Exercices de rythme
  'm4': 'rgaTLrZGlk0', // Théorie musicale
  'm5': 'yl9DHcASqMc', // Improvisation

  // Photography (Photographie)
  'p1': 'tQ9gPQAk8xY', // Prendre 10 photos de paysage
  'p2': '0mczz27i19w', // Retouche photo
  'p3': 'VUg33pNa5zE', // Étudier la composition
  'p4': 'U_GlZVM_d4w', // Portrait en lumière naturelle
  'p5': 'xdfOo4yh6c0', // Analyser les photos des maîtres

  // Fitness (Fitness)
  'f1': 'zibJBrpA8pw', // Cardio 30 minutes
  'f2': 'rq_X1KMHeGE', // Musculation haut du corps
  'f3': '2IcWJobNDck', // Yoga & stretching
  'f4': '_kGESn8ArrU', // Course 5km
  'f5': 'pJp08smdcFk', // Exercices abdominaux

  // Programming (Programmation)
  'c1': 'ghCbURMWBD8', // Variables et types de base
  'c2': 'HQ3dCWjfRZ4', // Structures conditionnelles
  'c3': 'v-K-4KuA8mQ', // Boucles et itérations
  'c4': 'sgJt64iTOYM', // Fonctions et modularité
  'c5': 'z3xc45QQz7c', // Résoudre un mini-exercice
};

/**
 * Get YouTube URL from video ID
 * @param videoId - The YouTube video ID
 * @returns Full YouTube URL
 */
export function getYoutubeUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Get video URL for a specific task
 * @param taskId - The task ID (e.g., 'm1', 'p2')
 * @returns YouTube URL if video ID exists, undefined otherwise
 */
export function getVideoUrlForTask(taskId: string): string | undefined {
  const videoId = youtubeVideoMap[taskId];
  return videoId && videoId.trim() ? getYoutubeUrl(videoId) : undefined;
}

/**
 * Get search query fallback URL (if no specific video)
 * @param query - Search query (e.g., task title)
 * @returns YouTube search URL
 */
export function getYoutubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

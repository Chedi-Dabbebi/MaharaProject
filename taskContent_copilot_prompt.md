# Copilot Agent Prompt — Task Content Layer


This file defines the full content layer and asks you to implement it.


## Full content — implement exactly as described below

### MUSIQUE

**m1 — Pratiquer les gammes** (20 min, 50 XP)
- prompt: `"Joue chaque gamme 3× montante et descendante, lentement et sans fautes"`
- item 1: `"Gamme de Do majeur — C D E F G A B"`
- item 2: `"Gamme de La mineur naturel — A B C D E F G"`

**m2 — Apprendre un nouveau morceau** (30 min, 75 XP)
- prompt: `"Apprends les 8 premières mesures — mélodie d'abord, accompagnement ensuite"`
- item 1: `"Doigté de la mélodie principale (main droite)"`
- item 2: `"Accord d'accompagnement de base (main gauche)"`

**m3 — Exercices de rythme** (15 min, 40 XP)
- prompt: `"Tape chaque pattern avec le métronome à 80 BPM, 10 répétitions sans erreur"`
- item 1: `"Pattern 1 : noires + croches — ♩ ♩ ♪♪ ♩"`
- item 2: `"Pattern 2 : syncope basique — ♩ ♪♩♪ ♩"`

**m4 — Théorie musicale** (25 min, 60 XP)
- prompt: `"Lis chaque notion, puis recopie-la de mémoire sur papier"`
- item 1: `"Les intervalles : 2nde, tierce, quinte — définition + exemple sur clavier"`
- item 2: `"Construction d'un accord majeur et mineur à partir d'une fondamentale"`

**m5 — Improvisation** (20 min, 50 XP)
- prompt: `"Improvise 2 minutes sur la gamme pentatonique — répète et varie une phrase de 4 notes"`
- item 1: `"Pentatonique de La mineur — A C D E G"`
- item 2: `"Phrase de départ à varier : A – C – E – A"`

---

### PHOTOGRAPHIE

**p1 — Prendre 10 photos de paysage** (45 min, 80 XP)
- prompt: `"Applique un principe de composition différent pour chaque série de 10 photos"`
- item 1: `"Règle des tiers : placer la ligne d'horizon sur le tiers supérieur ou inférieur"`
- item 2: `"Ligne directrice naturelle : chemin, clôture, rivière menant vers le sujet"`

**p2 — Retouche photo** (30 min, 60 XP)
- prompt: `"Édite 2 photos en suivant ce workflow précis, dans cet ordre"`
- item 1: `"Corriger l'exposition (±1 EV) puis la balance des blancs (température + teinte)"`
- item 2: `"Ajuster le contraste (courbes ou tons) puis la netteté (masque flou, radius 0.8)"`

**p3 — Étudier la composition** (20 min, 50 XP)
- prompt: `"Étudie chaque règle, puis sors faire 3 photos qui l'appliquent"`
- item 1: `"Espace négatif : isoler un sujet sur un fond épuré pour créer du silence visuel"`
- item 2: `"Cadrage naturel : utiliser une arche, fenêtre ou branches pour encadrer le sujet"`

**p4 — Portrait en lumière naturelle** (40 min, 70 XP)
- prompt: `"Fais 2 séries de 5 portraits avec une source de lumière naturelle unique"`
- item 1: `"Lumière latérale : fenêtre à 45° sur le côté du visage, fond sombre"`
- item 2: `"Contre-jour doux : sujet entre toi et la fenêtre, exposer sur le visage"`

**p5 — Analyser les photos des maîtres** (25 min, 55 XP)
- prompt: `"Analyse chaque photo : note le cadrage, la lumière, l'émotion et ce que tu retiens"`
- item 1: `"Henri Cartier-Bresson — 'L'instant décisif' : timing, spontanéité, géométrie discrète"`
- item 2: `"Ansel Adams — gestion des tons et zones : gamme complète du noir pur au blanc pur"`

---

### FITNESS

**f1 — Cardio 30 minutes** (30 min, 60 XP)
- prompt: `"Maintiens ta fréquence cardiaque entre 65–75% de ta FC max pendant toute la séance"`
- item 1: `"Footing continu 30 min à allure conversation (zone 2 — tu peux parler)"`
- item 2: `"Alternative : vélo ou rameur à la même intensité si pas de piste disponible"`

**f2 — Musculation haut du corps** (45 min, 80 XP)
- prompt: `"3 séries de chaque exercice, repos 60 secondes entre les séries"`
- item 1: `"Pompes : 3×12 reps (ou 3×8 si débutant) — corps aligné, coudes à 45°"`
- item 2: `"Rowing : 3×10 reps avec élastique ou haltères — omoplates serrées en fin de mouvement"`

**f3 — Yoga & stretching** (20 min, 40 XP)
- prompt: `"Enchaîne les 2 séquences sans pause, 5 respirations profondes par posture"`
- item 1: `"Salutation au soleil A — 5 cycles complets (chien tête en bas → planche → cobra)"`
- item 2: `"Étirements ischio-jambiers + ouverture des hanches — 2 minutes par côté"`

**f4 — Course 5km** (35 min, 70 XP)
- prompt: `"Cours en négatif : la 2ème moitié doit être plus rapide que la 1ère"`
- item 1: `"Km 1–2 : échauffement à allure lente et régulière (RPE 4/10)"`
- item 2: `"Km 3–5 : allure cible maintenue sans baisse — accélère progressivement"`

**f5 — Exercices abdominaux** (15 min, 35 XP)
- prompt: `"3 circuits complets, sans repos entre les exercices à l'intérieur d'un circuit"`
- item 1: `"Planche 30s + crunch 15 reps — gainage et flexion contrôlée"`
- item 2: `"Relevé de jambes 12 reps + mountain climbers 20 reps — bas du ventre + cardio"`

---

### PROGRAMMATION

**c1 — Variables et types de base** (15 min, 45 XP)
- prompt: `"Écris le code, exécute-le, puis modifie les valeurs pour observer les différences"`
- item 1: `"Déclare 3 variables : une string, un number, un boolean — affiche-les avec console.log"`
- item 2: `"Observe le type de chaque variable avec typeof — note ce qui est implicite vs explicite"`

**c2 — Structures conditionnelles** (30 min, 75 XP)
- prompt: `"Implémente chaque cas sans regarder la solution, teste avec au moins 3 entrées"`
- item 1: `"if/else : prend un nombre en entrée, affiche 'pair' ou 'impair'"`
- item 2: `"switch : prend un chiffre 1–7 en entrée, affiche le jour de la semaine correspondant"`

**c3 — Boucles et itérations** (25 min, 60 XP)
- prompt: `"Implémente les 2 exercices sans utiliser .forEach, .map ou méthodes de tableau"`
- item 1: `"for : affiche les carrés de 1 à 10 (1, 4, 9, 16 ... 100)"`
- item 2: `"while : jeu de devinette — générer un nombre aléatoire 1–20, boucler jusqu'à trouver"`

**c4 — Fonctions et modularité** (20 min, 50 XP)
- prompt: `"Écris chaque fonction, teste-la avec 3 entrées différentes, vérifie les edge cases"`
- item 1: `"Fonction pure : calcule l'aire d'un rectangle (longueur, largeur) — retourne un number"`
- item 2: `"Fonction avec callback : prend un tableau et une fonction, applique-la sur chaque élément"`

**c5 — Résoudre un mini-exercice** (20 min, 50 XP)
- prompt: `"Résous les 2 exercices en moins de 20 minutes au total, sans aide extérieure"`
- item 1: `"Inverser une chaîne de caractères sans utiliser .reverse() ou .split().reverse()"`
- item 2: `"Trouver la valeur maximale dans un tableau de nombres sans utiliser Math.max()"`

---

## Implementation instructions

1. Create `src/data/taskContent.ts` with the full `TASK_CONTENT` record typed as `Record<string, TaskContent>`.
2. Export `TASK_CONTENT` as a named export.
3. Export `TaskContent` interface as a named export.
4. Add a helper function:

```typescript
export function getTaskContent(taskId: string): TaskContent | null {
  return TASK_CONTENT[taskId] ?? null;
}
```

5. In the task detail screen (or wherever a single task is rendered), consume it like this:

```typescript
import { getTaskContent } from '@/data/taskContent';

const content = getTaskContent(task.id);
// content?.prompt → show as subtitle/instruction
// content?.items[0] and content?.items[1] → show as two practice item cards
```

6. If `getTaskContent` returns `null` (unknown task ID), render a fallback UI — do not crash.

---

## UI rendering contract (for the task screen)

```
┌─────────────────────────────────────┐
│  [Task title]            [XP badge] │
│  [Duration label]                   │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 📋 content.prompt             │  │
│  └───────────────────────────────┘  │
│                                     │
│  Practice items                     │
│  ┌───────────────────────────────┐  │
│  │ ① content.items[0]            │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ ② content.items[1]            │  │
│  └───────────────────────────────┘  │
│                                     │
│  [ Mark as complete ]               │
└─────────────────────────────────────┘
```

- `prompt` card: slightly elevated, accent left border, font-size 14, color secondary
- `items` cards: numbered ① ②, standard card style, font-size 14
- "Mark as complete" button: full width, primary color, disabled if already completed
- No interactive chord diagrams, no video, no audio — content is text only for this version

---

## Constraints

- TypeScript strict mode — no `any`
- No external libraries for this file — pure data + types
- All strings in French (as written above — do not translate)
- Do not modify `src/data/skills.ts` — task IDs must match exactly: m1–m5, p1–p5, f1–f5, c1–c5
- Tuple type `[string, string]` must be enforced — not `string[]`

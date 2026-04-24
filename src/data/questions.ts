import type { QuizQuestion, QuizSkill, QuizDifficulty } from '../types/quiz';

/**
 * Static storage containing exactly 5 questions per task.
 * 20 tasks * 5 questions = 100 questions total.
 */
export const quizQuestions: QuizQuestion[] = [
  // ==========================================
  // MUSIQUE
  // ==========================================
  // m1 - Pratiquer les gammes (facile)
  {
    id: 'q_m1_1', taskId: 'm1', skill: 'music', difficulty: 'facile',
    text: 'Quelle est la première note de la gamme de Do majeur ?',
    choices: ['Ré', 'Fa', 'Do', 'Mi'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_m1_2', taskId: 'm1', skill: 'music', difficulty: 'facile',
    text: 'Combien de notes différentes contient une gamme diatonique majeure classique ?',
    choices: ['5', '6', '7', '8'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_m1_3', taskId: 'm1', skill: 'music', difficulty: 'facile',
    text: 'Laquelle de ces gammes est la mineure relative de Do majeur ?',
    choices: ['Sol majeur', 'La mineur', 'Mi mineur', 'Fa majeur'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m1_4', taskId: 'm1', skill: 'music', difficulty: 'facile',
    text: 'Parmi ces séries de notes, laquelle correspond à la gamme de Do majeur ?',
    choices: ['Do Ré Mi Fa# Sol La Si', 'Do Ré Mi Fa Sol La Si', 'Do Réb Mi Fa Sol Lab Si', 'Do Ré Mi Fa Sol La Sib'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m1_5', taskId: 'm1', skill: 'music', difficulty: 'facile',
    text: 'À quoi sert principalement la pratique des gammes ?',
    choices: ['À régler le volume de l\'instrument', 'À assimiler les structures, développer la technique et l\'oreille', 'À modifier le tempo', 'À accorder l\'instrument'],
    correctAnswerIndex: 1,
  },

  // m2 - Apprendre un nouveau morceau (moyen)
  {
    id: 'q_m2_1', taskId: 'm2', skill: 'music', difficulty: 'moyen',
    text: 'Dans un morceau classique au piano, quel rôle joue souvent la main gauche ?',
    choices: ['La mélodie principale', 'Les effets sonores de percussion', 'Le rythme et l\'accompagnement harmonique', 'Elle ne joue pas au début'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_m2_2', taskId: 'm2', skill: 'music', difficulty: 'moyen',
    text: 'Que signifie "déchiffrer" un morceau ?',
    choices: ['Le lire et le jouer pour la toute première fois', 'Le transposer dans une autre tonalité', 'Le jouer entièrement de mémoire', 'Le jouer au double de sa vitesse'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_m2_3', taskId: 'm2', skill: 'music', difficulty: 'moyen',
    text: 'Quelle est la méthode recommandée pour apprendre un nouveau passage (ex: 8 mesures) ?',
    choices: ['Jouer à la vitesse finale immédiatement', 'Travailler mains séparées lentement puis assembler', 'Apprendre uniquement la main droite', 'Mémoriser visuellement sans jouer'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m2_4', taskId: 'm2', skill: 'music', difficulty: 'moyen',
    text: 'Qu\'indique le doigté inscrit sur une partition ?',
    choices: ['L\'intensité d\'attaque de la note', 'Le numéro du doigt recommandé pour appuyer sur la touche', 'La durée du silence', 'L\'utilisation de la pédale'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m2_5', taskId: 'm2', skill: 'music', difficulty: 'moyen',
    text: 'Lorsqu\'on bute systématiquement sur un passage complexe, que faut-il faire ?',
    choices: ['L\'isoler, le ralentir et le répéter en boucle', 'Recommencer le morceau depuis le tout début', 'Jouer plus fort pour compenser', 'Ignorer l\'erreur et continuer'],
    correctAnswerIndex: 0,
  },

  // m3 - Exercices de rythme (moyen)
  {
    id: 'q_m3_1', taskId: 'm3', skill: 'music', difficulty: 'moyen',
    text: 'Dans une mesure en 4/4, quelle est la durée d\'une noire ?',
    choices: ['Un demi temps', 'Un temps', 'Deux temps', 'Quatre temps'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m3_2', taskId: 'm3', skill: 'music', difficulty: 'moyen',
    text: 'Qu\'est-ce qu\'une syncope rythmique ?',
    choices: ['Un arrêt soudain et définitif de la musique', 'Le déplacement de l\'accent tonique sur un temps faible', 'Une accélération progressive du tempo', 'Le fait de jouer hors tempo'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m3_3', taskId: 'm3', skill: 'music', difficulty: 'moyen',
    text: 'Combien de croches valent exactement une noire ?',
    choices: ['Une seule', 'Deux croches', 'Trois croches', 'Quatre croches'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m3_4', taskId: 'm3', skill: 'music', difficulty: 'moyen',
    text: 'Si le métronome est réglé sur 80 BPM, cela signifie qu\'il émet :',
    choices: ['80 battements (noires) par minute', '80 battements par seconde', '80 mesures complètes par minute', 'Un rythme très rapide (presto)'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_m3_5', taskId: 'm3', skill: 'music', difficulty: 'moyen',
    text: 'Pour stabiliser un rythme irrégulier pendant l\'apprentissage, quel est le meilleur outil ?',
    choices: ['Un accordeur chromatique', 'Un métronome', 'Une pédale de sustain', 'Un diapason'],
    correctAnswerIndex: 1,
  },

  // m4 - Théorie musicale (difficile)
  {
    id: 'q_m4_1', taskId: 'm4', skill: 'music', difficulty: 'difficile',
    text: 'De quelles notes précises se compose l\'accord parfait de Do Majeur ?',
    choices: ['Do, Ré, Mi', 'Do, Mi, Sol', 'Do, Mib, Sol', 'Do, Fa, Sol'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m4_2', taskId: 'm4', skill: 'music', difficulty: 'difficile',
    text: 'Fondamentalement, qu\'est-ce qui différencie un accord parfait majeur d\'un accord parfait mineur ?',
    choices: ['La quinte (juste vs diminuée)', 'La fondamentale', 'La nature de la tierce (majeure vs mineure)', 'L\'ajout de l\'octave'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_m4_3', taskId: 'm4', skill: 'music', difficulty: 'difficile',
    text: 'Quel est l\'intervalle naturel entre la note Do et la note Sol ?',
    choices: ['Une seconde', 'Une tierce', 'Une quarte juste', 'Une quinte juste'],
    correctAnswerIndex: 3,
  },
  {
    id: 'q_m4_4', taskId: 'm4', skill: 'music', difficulty: 'difficile',
    text: 'Combien de demi-tons séparent la fondamentale de sa tierce mineure ?',
    choices: ['2 demi-tons', '3 demi-tons', '4 demi-tons', '5 demi-tons'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m4_5', taskId: 'm4', skill: 'music', difficulty: 'difficile',
    text: 'Si on construit une tierce majeure (4 demi-tons) au-dessus de la note Fa, quelle note obtient-on ?',
    choices: ['Sol', 'La', 'Si bémol', 'Do'],
    correctAnswerIndex: 1,
  },

  // m5 - Improvisation (difficile)
  {
    id: 'q_m5_1', taskId: 'm5', skill: 'music', difficulty: 'difficile',
    text: 'Quelles sont les 5 notes composant la gamme pentatonique de La mineur ?',
    choices: ['La, Si, Do, Ré, Mi', 'La, Do, Ré, Mi, Sol', 'La, Do, Mi, Sol, Si', 'La, Do, Ré, Fa, Sol'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m5_2', taskId: 'm5', skill: 'music', difficulty: 'difficile',
    text: 'Pourquoi la gamme pentatonique est-elle idéale pour s\'initier à l\'improvisation ?',
    choices: ['Parce qu\'elle évite les demi-tons et les intervalles naturellement dissonants', 'Parce qu\'elle contient les 12 notes du clavier', 'Parce qu\'on ne joue que sur les touches noires', 'Parce qu\'elle permet de jouer très vite'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_m5_3', taskId: 'm5', skill: 'music', difficulty: 'difficile',
    text: 'Qu\'appelle-t-on un "motif" ou une "phrase" lors d\'une improvisation ?',
    choices: ['Un accord plaqué de 4 notes', 'Une courte idée mélodique destinée à être répétée ou variée', 'Un changement brusque de tempo', 'Un changement d\'instrument en plein solo'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m5_4', taskId: 'm5', skill: 'music', difficulty: 'difficile',
    text: 'Pour varier une phrase musicale sans en changer les notes, quel paramètre peut-on modifier ?',
    choices: ['Le doigté (cela change le son)', 'La clé de sol sur la partition', 'Le rythme, l\'articulation et l\'emplacement des silences', 'L\'armure (les dièses à la clé)'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_m5_5', taskId: 'm5', skill: 'music', difficulty: 'difficile',
    text: 'Au-delà de la technique pure, l\'improvisation consiste avant tout à...',
    choices: ['Lire une partition extrêmement vite', 'Jouer le maximum de notes par seconde', 'Écouter l\'harmonie et construire une mélodie spontanée', 'Respecter des règles théoriques strictes et immuables'],
    correctAnswerIndex: 2,
  },

  // ==========================================
  // PHOTOGRAPHIE
  // ==========================================
  // p1 - Prendre 10 photos de paysage (facile)
  {
    id: 'q_p1_1', taskId: 'p1', skill: 'photography', difficulty: 'facile',
    text: 'Qu\'est-ce que la fameuse "règle des tiers" en photographie ?',
    choices: ['Diviser l\'image par une grille 3x3 et placer les éléments clés sur les lignes ou intersections', 'Prendre exactement 3 photos du même sujet', 'Couper le sujet principal en trois parties égales', 'N\'utiliser que trois couleurs dominantes'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_p1_2', taskId: 'p1', skill: 'photography', difficulty: 'facile',
    text: 'Si vous photographiez un paysage marin, où est-il conseillé de placer l\'horizon selon la règle des tiers ?',
    choices: ['Au centre exact de la photo', 'Sur la ligne de tiers inférieure ou supérieure', 'En diagonale depuis le coin', 'Peu importe, le centre est toujours idéal'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p1_3', taskId: 'p1', skill: 'photography', difficulty: 'facile',
    text: 'Quel est l\'objectif visuel principal d\'une "ligne directrice" (comme un chemin ou une clôture) ?',
    choices: ['Couper brutalement la photo en deux', 'Guider naturellement l\'œil du spectateur vers le sujet principal', 'Rendre la photographie plus lumineuse', 'Ajouter du bruit numérique à l\'image'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p1_4', taskId: 'p1', skill: 'photography', difficulty: 'facile',
    text: 'Lequel de ces éléments naturels fait généralement une excellente ligne directrice ?',
    choices: ['Une rivière serpentant vers les montagnes', 'Le soleil au zénith', 'Un oiseau en plein vol traversant l\'image', 'Un nuage isolé dans un ciel bleu'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_p1_5', taskId: 'p1', skill: 'photography', difficulty: 'facile',
    text: 'Globalement, la règle des tiers est utilisée pour rendre une image...',
    choices: ['Plus floue et mystérieuse', 'Parfaitement symétrique de chaque côté', 'Plus dynamique, équilibrée et agréable à l\'œil', 'Systématiquement plus sombre'],
    correctAnswerIndex: 2,
  },

  // p2 - Retouche photo (moyen)
  {
    id: 'q_p2_1', taskId: 'p2', skill: 'photography', difficulty: 'moyen',
    text: 'En retouche photo, que modifie principalement le paramètre "Exposition" ?',
    choices: ['La couleur globale de l\'image', 'La clarté et luminosité globale de la photo', 'Le flou d\'arrière-plan (Bokeh)', 'La netteté des contours'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p2_2', taskId: 'p2', skill: 'photography', difficulty: 'moyen',
    text: 'Quel réglage permet de corriger une image trop "jaune" ou trop "bleue" ?',
    choices: ['L\'outil de netteté', 'Le contraste', 'La balance des blancs (Température/Teinte)', 'La vibrance'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_p2_3', taskId: 'p2', skill: 'photography', difficulty: 'moyen',
    text: 'Que signifie visuellement le fait d\'augmenter le contraste d\'une photo ?',
    choices: ['Assombrir toute l\'image uniformément', 'Rendre les tons sombres plus profonds et les tons clairs plus lumineux', 'Mélanger toutes les teintes pour obtenir du gris', 'Effacer ou flouter l\'arrière-plan'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p2_4', taskId: 'p2', skill: 'photography', difficulty: 'moyen',
    text: 'Quel outil logiciel utilise-t-on couramment pour accentuer les micro-détails (netteté) ?',
    choices: ['L\'outil "Pot de peinture"', 'La gomme magique', 'Le Masque flou (Unsharp Mask) ou outil de netteté', 'Le tampon de duplication'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_p2_5', taskId: 'p2', skill: 'photography', difficulty: 'moyen',
    text: 'Pour un workflow de retouche propre et logique, quel est l\'ordre généralement recommandé ?',
    choices: ['Netteté > Balance des blancs > Exposition globale', 'Correction d\'exposition > Balance des blancs > Contraste', 'Ajout de contraste > Netteté maximale > Réglage d\'exposition', 'Balance des blancs > Netteté > Contraste'],
    correctAnswerIndex: 1,
  },

  // p3 - Étudier la composition (facile)
  {
    id: 'q_p3_1', taskId: 'p3', skill: 'photography', difficulty: 'facile',
    text: 'En composition photographique, qu\'appelle-t-on "l\'espace négatif" ?',
    choices: ['Une photo volontairement sous-exposée (sombre)', 'Une zone vide, épurée ou unie entourant le sujet principal', 'L\'effet de flou de mouvement sur un sujet rapide', 'Une photographie développée en noir et blanc'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p3_2', taskId: 'p3', skill: 'photography', difficulty: 'facile',
    text: 'Quel est l\'impact psychologique ou visuel de l\'espace négatif ?',
    choices: ['Il isole le sujet et crée une sensation de calme ou de "silence visuel"', 'Il rend la lecture de la photo très complexe', 'Il permet de réduire le poids du fichier numérique', 'Il sert uniquement à cacher les défauts de l\'objectif'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_p3_3', taskId: 'p3', skill: 'photography', difficulty: 'facile',
    text: 'Qu\'est-ce que la technique du "cadrage naturel" (framing) ?',
    choices: ['Prendre exclusivement des photos dans une forêt', 'Utiliser des éléments du décor (arche, branches, fenêtre) pour encadrer le sujet dans l\'image', 'Recadrer la photo a posteriori sur un logiciel', 'Ne jamais utiliser de flash artificiel'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p3_4', taskId: 'p3', skill: 'photography', difficulty: 'facile',
    text: 'Laquelle de ces situations illustre parfaitement un cadrage naturel ?',
    choices: ['Photographier un oiseau seul dans le ciel', 'Photographier une personne visible à travers l\'encadrement d\'une porte', 'Zoomer au maximum sur le visage du sujet', 'Placer le sujet exactement au centre'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p3_5', taskId: 'p3', skill: 'photography', difficulty: 'facile',
    text: 'Pourquoi intégrer volontairement des branches d\'arbre floues au premier plan d\'un paysage ?',
    choices: ['Pour donner l\'illusion que l\'objectif est sale', 'Pour cacher le véritable sujet de la photo', 'Pour encadrer le sujet lointain et donner une sensation de profondeur (3D)', 'Uniquement pour éclaircir les bords de l\'image'],
    correctAnswerIndex: 2,
  },

  // p4 - Portrait en lumière naturelle (difficile)
  {
    id: 'q_p4_1', taskId: 'p4', skill: 'photography', difficulty: 'difficile',
    text: 'Quel effet visuel produit une "lumière latérale" (venant de côté) sur un visage ?',
    choices: ['Elle efface totalement les reliefs et les rides', 'Elle accentue les textures, crée du volume et des ombres marquées', 'Elle provoque systématiquement l\'effet "yeux rouges"', 'Elle silhouette intégralement la personne'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p4_2', taskId: 'p4', skill: 'photography', difficulty: 'difficile',
    text: 'Comment positionner le modèle pour réaliser un portrait en "contre-jour" ?',
    choices: ['La lumière éclaire le dos du photographe', 'Le modèle est placé entre le photographe et la source de lumière (ex: une fenêtre)', 'On place le modèle dans une pièce sans aucune lumière', 'Le modèle doit regarder directement le soleil'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p4_3', taskId: 'p4', skill: 'photography', difficulty: 'difficile',
    text: 'Lors d\'un contre-jour, si l\'appareil expose automatiquement en fonction de la lumière vive de l\'arrière-plan, comment apparaîtra le visage ?',
    choices: ['En silhouette sombre ou sous-exposé', 'Parfaitement éclairé et net', 'Totalement blanc (surexposé)', 'Flou à cause du mouvement'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_p4_4', taskId: 'p4', skill: 'photography', difficulty: 'difficile',
    text: 'En contre-jour, comment s\'assurer que le visage du modèle soit correctement visible sans utiliser de flash ?',
    choices: ['Fermer le diaphragme au maximum', 'Forcer l\'exposition sur le visage (ce qui brûlera/surexposera l\'arrière-plan)', 'Baisser la sensibilité ISO au minimum', 'Mettre la balance des blancs sur le mode tungstène'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p4_5', taskId: 'p4', skill: 'photography', difficulty: 'difficile',
    text: 'Quelle condition météorologique produit naturellement la lumière la plus douce, diffuse et flatteuse pour un portrait en extérieur ?',
    choices: ['Un soleil éclatant en plein milieu de la journée', 'Un ciel nuageux ou très couvert qui agit comme une boîte à lumière géante', 'La nuit sous l\'éclairage direct d\'un lampadaire', 'Un lever de soleil avec le soleil dans les yeux du modèle'],
    correctAnswerIndex: 1,
  },

  // p5 - Analyser les photos des maîtres (moyen)
  {
    id: 'q_p5_1', taskId: 'p5', skill: 'photography', difficulty: 'moyen',
    text: 'À quel célèbre photographe français associe-t-on le concept majeur de "L\'instant décisif" ?',
    choices: ['Ansel Adams', 'Henri Cartier-Bresson', 'Robert Capa', 'Sebastião Salgado'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p5_2', taskId: 'p5', skill: 'photography', difficulty: 'moyen',
    text: 'Que désigne "l\'instant décisif" en photographie de rue ou de reportage ?',
    choices: ['Le moment précis où la batterie de l\'appareil se décharge', 'Le moment de changer d\'objectif avant une scène', 'L\'unique fraction de seconde où l\'action en cours et la composition géométrique s\'alignent parfaitement', 'Le processus de retouche finale dans la chambre noire'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_p5_3', taskId: 'p5', skill: 'photography', difficulty: 'moyen',
    text: 'Le maître de la photographie Ansel Adams est mondialement célèbre pour ses œuvres concernant :',
    choices: ['Des portraits de mode en studio', 'De grandioses paysages naturels américains en noir et blanc', 'La photographie sous-marine colorée', 'Le photojournalisme de guerre'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p5_4', taskId: 'p5', skill: 'photography', difficulty: 'moyen',
    text: 'Qu\'est-ce que le célèbre "Zone System" développé par Ansel Adams ?',
    choices: ['Une technique scientifique pour visualiser, exposer et développer l\'image afin d\'obtenir une gamme parfaite du noir pur au blanc pur', 'Une règle de composition divisant le viseur en 9 zones égales', 'Une marque spécifique de pellicules photographiques couleur', 'Une loi interdisant la retouche de l\'image après la prise de vue'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_p5_5', taskId: 'p5', skill: 'photography', difficulty: 'moyen',
    text: 'L\'analyse du travail d\'Henri Cartier-Bresson souligne son approche basée sur...',
    choices: ['Le recadrage systématique et intensif lors du tirage', 'L\'observation discrète, la spontanéité et un sens inné de la géométrie', 'L\'utilisation de temps de pose extrêmement longs', 'L\'installation de dispositifs d\'éclairage complexes dans la rue'],
    correctAnswerIndex: 1,
  },

  // ==========================================
  // FITNESS
  // ==========================================
  // f1 - Cardio 30 minutes (facile)
  {
    id: 'q_f1_1', taskId: 'f1', skill: 'fitness', difficulty: 'facile',
    text: 'Comment définit-on la "Zone 2" de fréquence cardiaque lors d\'un entraînement d\'endurance ?',
    choices: ['Un sprint maximal où le cœur est à 100%', 'Un effort modéré (65-75% FC max) permettant de tenir une conversation sans trop d\'essoufflement', 'Une phase de repos total', 'Un effort très intense où l\'on doit s\'arrêter toutes les 2 minutes'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f1_2', taskId: 'f1', skill: 'fitness', difficulty: 'facile',
    text: 'Quel est le bénéfice principal d\'un entraînement long en Zone 2 ?',
    choices: ['Développer une masse musculaire impressionnante', 'Améliorer l\'endurance fondamentale et optimiser l\'utilisation des graisses comme énergie', 'Développer la force explosive et la vitesse', 'Éviter totalement de transpirer'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f1_3', taskId: 'f1', skill: 'fitness', difficulty: 'facile',
    text: 'Lequel de ces entraînements correspond à un effort cardio continu en Zone 2 ?',
    choices: ['Soulever le poids le plus lourd possible une seule fois', 'Faire un footing ininterrompu de 30 minutes à allure modérée', 'Maintenir un étirement statique pendant 10 minutes', 'Enchaîner 10 pompes très rapidement puis s\'asseoir'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f1_4', taskId: 'f1', skill: 'fitness', difficulty: 'facile',
    text: 'Pendant mon footing, je réalise que je suis incapable de parler sans devoir m\'arrêter pour haleter. Que cela signifie-t-il ?',
    choices: ['Je suis exactement dans la bonne zone cardio', 'Je suis au-dessus de la Zone 2 (l\'intensité est trop élevée)', 'Je suis en dessous de la Zone 2', 'Le chronomètre ne fonctionne pas'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f1_5', taskId: 'f1', skill: 'fitness', difficulty: 'facile',
    text: 'Si courir vous est impossible, quelle alternative offre des bénéfices cardio similaires à même intensité ?',
    choices: ['S\'allonger sur un tapis de sol', 'Faire du vélo stationnaire ou du rameur à un rythme constant', 'Soulever de gros haltères pendant 3 minutes', 'Faire une séance de méditation guidée'],
    correctAnswerIndex: 1,
  },

  // f2 - Musculation haut du corps (moyen)
  {
    id: 'q_f2_1', taskId: 'f2', skill: 'fitness', difficulty: 'moyen',
    text: 'Pour éviter les blessures lors des pompes, comment le corps doit-il être aligné ?',
    choices: ['Le bassin doit pointer le plus haut possible vers le plafond', 'La tête doit être jetée en arrière et le bas du dos cambré', 'La tête, le bassin et les chevilles doivent former une ligne droite et gainée', 'Les genoux doivent toujours toucher le ventre'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_f2_2', taskId: 'f2', skill: 'fitness', difficulty: 'moyen',
    text: 'Où les coudes doivent-ils idéalement pointer lors de la descente d\'une pompe classique ?',
    choices: ['Ils doivent être écartés à 90° (alignés avec les épaules)', 'Ils doivent être orientés à environ 45° par rapport au buste', 'Ils doivent pointer strictement vers l\'avant', 'Ils doivent toucher les oreilles'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f2_3', taskId: 'f2', skill: 'fitness', difficulty: 'moyen',
    text: 'Quel est le groupe musculaire principalement ciblé par l\'exercice du tirage horizontal (Rowing) ?',
    choices: ['Les muscles pectoraux', 'La ceinture abdominale', 'Les muscles du dos (dorsaux et rhomboïdes)', 'Les mollets'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_f2_4', taskId: 'f2', skill: 'fitness', difficulty: 'moyen',
    text: 'Lors de la phase de contraction d\'un rowing (tirage), quel détail technique est essentiel ?',
    choices: ['Arrondir volontairement le haut du dos', 'Serrer fortement les omoplates l\'une vers l\'autre', 'Lâcher la charge d\'un coup sec', 'Garder les bras totalement tendus'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f2_5', taskId: 'f2', skill: 'fitness', difficulty: 'moyen',
    text: 'En musculation (hypertrophie/force), pourquoi respecte-t-on un temps de repos de 60 à 90 secondes entre les séries ?',
    choices: ['Pour que le corps redevienne totalement froid', 'Pour permettre la resynthèse partielle de l\'ATP et conserver l\'intensité pour la série suivante', 'Pour avoir le temps de regarder son téléphone', 'C\'est une perte de temps, il faut tout enchaîner'],
    correctAnswerIndex: 1,
  },

  // f3 - Yoga & stretching (facile)
  {
    id: 'q_f3_1', taskId: 'f3', skill: 'fitness', difficulty: 'facile',
    text: 'Comment nomme-t-on la célèbre série dynamique de postures de base en yoga ?',
    choices: ['La Salutation au Soleil (Surya Namaskar)', 'La Danse de la Lune', 'Le Pont Martial', 'La Marche de l\'Ours'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_f3_2', taskId: 'f3', skill: 'fitness', difficulty: 'facile',
    text: 'Laquelle de ces postures emblématiques fait partie de la Salutation au Soleil ?',
    choices: ['Le Chien Tête en Bas (Adho Mukha Svanasana)', 'L\'Oiseau de Feu', 'La Prise du Papillon', 'Le Grand Écart facial'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_f3_3', taskId: 'f3', skill: 'fitness', difficulty: 'facile',
    text: 'Lors du maintien d\'une posture d\'étirement, sur quoi l\'attention doit-elle se focaliser ?',
    choices: ['Sur la douleur aiguë pour aller plus loin', 'Sur des cycles de respiration lents, continus et profonds', 'Sur le fait de bloquer sa respiration (apnée)', 'Sur la vitesse d\'exécution'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f3_4', taskId: 'f3', skill: 'fitness', difficulty: 'facile',
    text: 'Où se situent les muscles "ischio-jambiers", souvent ciblés en stretching ?',
    choices: ['De chaque côté du cou', 'À l\'arrière de la cuisse', 'Sur la paroi abdominale', 'Dans la loge de l\'avant-bras'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f3_5', taskId: 'f3', skill: 'fitness', difficulty: 'facile',
    text: 'Pour assouplir le muscle sans risquer de déchirure, combien de temps maintient-on généralement un étirement statique ?',
    choices: ['1 à 2 secondes', 'Entre 30 secondes et 2 minutes', 'Moins d\'une demi-seconde (en donnant des à-coups)', 'Plus de 30 minutes ininterrompues'],
    correctAnswerIndex: 1,
  },

  // f4 - Course 5km (difficile)
  {
    id: 'q_f4_1', taskId: 'f4', skill: 'fitness', difficulty: 'difficile',
    text: 'En course à pied, que signifie la stratégie du "negative split" (course en négatif) ?',
    choices: ['Courir la distance en reculant', 'Réaliser la seconde moitié de la course à une allure plus rapide que la première', 'Abandonner la course avant la fin', 'Partir à un rythme de sprint puis finir en marchant'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f4_2', taskId: 'f4', skill: 'fitness', difficulty: 'difficile',
    text: 'Lors des deux premiers kilomètres, une perception d\'effort RPE 4/10 signifie que l\'allure doit être :',
    choices: ['Perçue comme un effort maximal insoutenable', 'Contrôlée, aisée et permettant de s\'échauffer', 'La plus rapide possible pour prendre de l\'avance', 'Tellement lente qu\'il s\'agit de marche à pied'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f4_3', taskId: 'f4', skill: 'fitness', difficulty: 'difficile',
    text: 'Physiologiquement, pourquoi un départ prudent sur un 5km est-il souvent la meilleure stratégie ?',
    choices: ['Pour laisser gagner les adversaires', 'Pour éviter l\'accumulation précoce d\'acide lactique et préserver le glycogène pour la fin', 'Parce qu\'il faut s\'arrêter au milieu', 'Cette stratégie est fausse, on devrait toujours sprinter au départ'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f4_4', taskId: 'f4', skill: 'fitness', difficulty: 'difficile',
    text: 'Si le plan exige un "negative split", quand devez-vous stabiliser votre allure cible la plus exigeante ?',
    choices: ['Dès les premières secondes de la course', 'Dans la deuxième moitié de l\'effort (kilomètres 3 à 5)', 'Seulement pendant les 10 derniers mètres', 'Lors des entraînements uniquement, pas le jour J'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f4_5', taskId: 'f4', skill: 'fitness', difficulty: 'difficile',
    text: 'Lorsque la fatigue survient en fin de 5km, sur quel élément technique est-il crucial de se concentrer ?',
    choices: ['Allonger la foulée au maximum jusqu\'à bondir', 'Maintenir la cadence (fréquence de pas) et relâcher le haut du corps', 'Regarder ses pieds pour ne pas tomber', 'Bloquer sa respiration pour mobiliser le tronc'],
    correctAnswerIndex: 1,
  },

  // f5 - Exercices abdominaux (moyen)
  {
    id: 'q_f5_1', taskId: 'f5', skill: 'fitness', difficulty: 'moyen',
    text: 'Quel est l\'exercice isométrique fondamental consistant à maintenir le corps horizontal en appui sur les avant-bras ?',
    choices: ['Le Crunch', 'La Planche (Gainage ventral)', 'Le Soulevé de bassin', 'Le Vacuum'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f5_2', taskId: 'f5', skill: 'fitness', difficulty: 'moyen',
    text: 'Pour un gainage efficace (Planche), quel est le point d\'attention critique ?',
    choices: ['Laisser le bas du dos se cambrer vers le sol', 'Rétroverser légèrement le bassin et contracter fortement les abdominaux', 'Regarder le plafond en tirant sur la nuque', 'Plier les genoux pour toucher le sol'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f5_3', taskId: 'f5', skill: 'fitness', difficulty: 'moyen',
    text: 'Lors de l\'exécution de relevés de buste (Crunch), quelle est l\'erreur blessante la plus commune ?',
    choices: ['Tirer violemment sur sa nuque avec ses mains pour s\'aider à monter', 'Contracter volontairement les muscles abdominaux', 'Expirer lors de la montée', 'Garder les pieds bien ancrés au sol'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_f5_4', taskId: 'f5', skill: 'fitness', difficulty: 'moyen',
    text: 'L\'exercice dit des "Mountain climbers" (mouvement d\'escalade au sol) a la particularité de...',
    choices: ['Travailler les biceps en isolation totale', 'Solliciter le gainage abdominal tout en créant une forte demande cardiovasculaire', 'Détendre la colonne vertébrale', 'Isoler spécifiquement le muscle du mollet'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f5_5', taskId: 'f5', skill: 'fitness', difficulty: 'moyen',
    text: 'Bien que les abdominaux travaillent ensemble, le "relevé de jambes couché" sollicite plus intensément...',
    choices: ['La partie basse du grand droit de l\'abdomen', 'Les muscles grands pectoraux', 'La ceinture scapulaire (épaules)', 'Les muscles fessiers en isolation'],
    correctAnswerIndex: 0,
  },

  // ==========================================
  // PROGRAMMATION
  // ==========================================
  // c1 - Variables et types de base (facile)
  {
    id: 'q_c1_1', taskId: 'c1', skill: 'programming', difficulty: 'facile',
    text: 'Si une variable contient la valeur `"Bonjour"`, à quel type primitif JavaScript appartient-elle ?',
    choices: ['number (Nombre)', 'boolean (Booléen)', 'string (Chaîne de caractères)', 'object (Objet)'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_c1_2', taskId: 'c1', skill: 'programming', difficulty: 'facile',
    text: 'Quel opérateur JavaScript permet de renvoyer le type d\'une variable sous forme de chaîne ?',
    choices: ['typeOf()', 'typeof', 'instanceOf', 'classType'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c1_3', taskId: 'c1', skill: 'programming', difficulty: 'facile',
    text: 'Quelles sont les deux seules valeurs littérales possibles pour le type "boolean" ?',
    choices: ['1 et 2', 'true et false', '"yes" et "no"', 'null et undefined'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c1_4', taskId: 'c1', skill: 'programming', difficulty: 'facile',
    text: 'En JavaScript moderne (ES6+), quel mot-clé de déclaration de variable n\'est PLUS recommandé à cause de ses défauts de portée (scope) ?',
    choices: ['let', 'const', 'var', 'int'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_c1_5', taskId: 'c1', skill: 'programming', difficulty: 'facile',
    text: 'Si le code exécute `let x = 10;`, que retournera l\'expression `typeof x` ?',
    choices: ['"string"', '"number"', '"boolean"', '"10"'],
    correctAnswerIndex: 1,
  },

  // c2 - Structures conditionnelles (moyen)
  {
    id: 'q_c2_1', taskId: 'c2', skill: 'programming', difficulty: 'moyen',
    text: 'Quelle expression mathématique permet de vérifier si un nombre entier "x" est pair ?',
    choices: ['x / 2 === 0', 'x % 2 === 0', 'x * 2 === 1', 'x === 2'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c2_2', taskId: 'c2', skill: 'programming', difficulty: 'moyen',
    text: 'Dans l\'instruction `if (condition) { ... }`, la condition entre parenthèses sera implicitement convertie en :',
    choices: ['Une chaîne de caractères (String)', 'Un nombre entier (Integer)', 'Un booléen (Boolean)', 'Un tableau (Array)'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_c2_3', taskId: 'c2', skill: 'programming', difficulty: 'moyen',
    text: 'Quel mot-clé accompagne un "if" pour définir le bloc de code à exécuter si la condition est évaluée à faux ?',
    choices: ['otherwise', 'then', 'else', 'catch'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_c2_4', taskId: 'c2', skill: 'programming', difficulty: 'moyen',
    text: 'Quel est l\'avantage structurel d\'une instruction "switch" par rapport à une longue série de "if / else if" ?',
    choices: ['Le code s\'exécute beaucoup plus rapidement en machine', 'Elle offre une syntaxe plus propre et lisible pour tester de multiples égalités strictes sur une même variable', 'Elle permet d\'évaluer des conditions d\'inégalité complexe (>, <)', 'Elle évite de déclarer des variables'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c2_5', taskId: 'c2', skill: 'programming', difficulty: 'moyen',
    text: 'Dans un bloc "switch", quel mot-clé est nécessaire à la fin d\'un "case" pour empêcher l\'exécution des cas suivants ?',
    choices: ['stop', 'exit', 'break', 'return'],
    correctAnswerIndex: 2,
  },

  // c3 - Boucles et itérations (moyen)
  {
    id: 'q_c3_1', taskId: 'c3', skill: 'programming', difficulty: 'moyen',
    text: 'Quelles sont, dans l\'ordre, les trois instructions contenues dans l\'en-tête d\'une boucle "for" classique ?',
    choices: ['Initialisation, Condition de maintien, Incrémentation/Mise à jour', 'Condition, Exécution, Retour', 'Déclaration de la fonction, Test, Arrêt d\'urgence', 'Début, Index, Longueur'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_c3_2', taskId: 'c3', skill: 'programming', difficulty: 'moyen',
    text: 'Dans quel scénario la boucle "while" est-elle généralement privilégiée par rapport à la boucle "for" ?',
    choices: ['Lorsqu\'on veut que le code s\'exécute plus vite', 'Lorsqu\'on ne connaît pas à l\'avance le nombre exact d\'itérations nécessaires', 'Lorsqu\'on veut itérer sur les éléments d\'un tableau', 'La boucle while n\'existe plus en JavaScript moderne'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c3_3', taskId: 'c3', skill: 'programming', difficulty: 'moyen',
    text: 'Quel est le risque critique si la condition d\'une boucle "while" ne devient jamais fausse au fil des itérations ?',
    choices: ['Le compilateur supprimera la boucle', 'La création d\'une boucle infinie entraînant le blocage (freeze) du programme', 'La variable d\'itération redeviendra négative', 'L\'apparition d\'une erreur de syntaxe'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c3_4', taskId: 'c3', skill: 'programming', difficulty: 'moyen',
    text: 'Dans l\'instruction `for (let i = 1; i <= 10; i++)`, combien de fois le bloc de code sera-t-il exécuté ?',
    choices: ['9 fois', '10 fois', '11 fois', '0 fois'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c3_5', taskId: 'c3', skill: 'programming', difficulty: 'moyen',
    text: 'Lors de l\'exécution d\'une itération (dans un for ou while), quel mot-clé permet d\'interrompre définitivement la boucle ?',
    choices: ['break', 'continue', 'stop', 'halt'],
    correctAnswerIndex: 0,
  },

  // c4 - Fonctions et modularité (difficile)
  {
    id: 'q_c4_1', taskId: 'c4', skill: 'programming', difficulty: 'difficile',
    text: 'Dans le paradigme fonctionnel, qu\'est-ce qui caractérise une "fonction pure" ?',
    choices: ['Une fonction qui ne prend aucun paramètre', 'Une fonction qui retourne toujours le même résultat pour les mêmes arguments, et qui ne produit aucun effet de bord', 'Une fonction écrite exclusivement sur une seule ligne', 'Une fonction fournie par défaut par le langage'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c4_2', taskId: 'c4', skill: 'programming', difficulty: 'difficile',
    text: 'Qu\'est-ce qu\'une fonction de rappel (communément appelée "callback") ?',
    choices: ['Une instruction d\'annulation d\'erreur', 'Une fonction qui s\'appelle elle-même (récursivité)', 'Une fonction qui est passée en tant qu\'argument à une autre fonction pour être exécutée ultérieurement', 'Une variable globale servant de compteur'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_c4_3', taskId: 'c4', skill: 'programming', difficulty: 'difficile',
    text: 'Si vous définissez `function calculAire(L, l) { return L * l; }`, quelle valeur est retournée par `calculAire(5, 4)` ?',
    choices: ['9', '18', '20', 'undefined'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_c4_4', taskId: 'c4', skill: 'programming', difficulty: 'difficile',
    text: 'Que fait la méthode `.map()` lorsqu\'elle est appelée sur un tableau avec une fonction callback en argument ?',
    choices: ['Elle efface le tableau', 'Elle crée un nouveau tableau en appelant la fonction de rappel sur chaque élément du tableau source', 'Elle ajoute un élément à la fin du tableau', 'Elle trie le tableau par ordre croissant'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c4_5', taskId: 'c4', skill: 'programming', difficulty: 'difficile',
    text: 'Lorsqu\'une fonction effectue un calcul, quel mot-clé est obligatoire pour transmettre le résultat calculé au code qui l\'a appelée ?',
    choices: ['yield', 'print', 'export', 'return'],
    correctAnswerIndex: 3,
  },

  // c5 - Résoudre un mini-exercice (difficile)
  {
    id: 'q_c5_1', taskId: 'c5', skill: 'programming', difficulty: 'difficile',
    text: 'Si l\'on doit inverser une chaîne de caractères algorithmiquement (sans méthode native), quelle approche logique utiliser ?',
    choices: ['Boucler du début à la fin et remplacer chaque lettre par la précédente', 'Parcourir la chaîne à l\'envers (du dernier index à l\'index 0) et concaténer chaque caractère dans une nouvelle variable', 'Transformer la chaîne en nombre puis la lire à l\'envers', 'Utiliser une instruction switch sur chaque voyelle'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c5_2', taskId: 'c5', skill: 'programming', difficulty: 'difficile',
    text: 'Pour trouver manuellement la valeur maximale dans un tableau de nombres, l\'approche classique consiste à :',
    choices: ['Initialiser une variable "max" au premier élément, puis parcourir le reste : si on trouve un élément supérieur, on met à jour "max"', 'Additionner tous les éléments du tableau et diviser par la longueur', 'Prendre systématiquement le dernier élément du tableau', 'Convertir le tableau en chaîne de caractères'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_c5_3', taskId: 'c5', skill: 'programming', difficulty: 'difficile',
    text: 'Lors de la recherche d\'un maximum, que se passe-t-il si le tableau ne contient que des nombres négatifs et que vous initialisez "max = 0" ?',
    choices: ['Le code plante (Crash)', 'Le programme retournera faussement 0 comme maximum', 'Le programme comprendra automatiquement et renverra le bon nombre négatif', 'Le tableau devient positif'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c5_4', taskId: 'c5', skill: 'programming', difficulty: 'difficile',
    text: 'En notation Big O, quelle est la complexité temporelle classique d\'une boucle parcourant tous les N éléments d\'un tableau une seule fois ?',
    choices: ['O(1)', 'O(n)', 'O(n^2)', 'O(log n)'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c5_5', taskId: 'c5', skill: 'programming', difficulty: 'difficile',
    text: 'Dans un langage indexé à partir de zéro comme le JavaScript, quel est l\'index du dernier caractère d\'une chaîne "str" ?',
    choices: ['str.length', '0', 'str.length - 1', 'str.length + 1'],
    correctAnswerIndex: 2,
  },
];

/**
 * Retrieves all questions associated with a specific task identifier.
 * @param taskId The identifier of the task (e.g. 'm1', 'p2')
 */
export function getQuestionsByTaskId(taskId: string): QuizQuestion[] {
  return quizQuestions.filter((q) => q.taskId === taskId);
}

/**
 * Retrieves all questions matching a specific skill and difficulty.
 * @param skill The skill category
 * @param difficulty The difficulty level
 */
export function getQuestionsBySkillAndDifficulty(skill: QuizSkill, difficulty: QuizDifficulty): QuizQuestion[] {
  return quizQuestions.filter((q) => q.skill === skill && q.difficulty === difficulty);
}

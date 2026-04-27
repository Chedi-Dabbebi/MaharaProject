import type { QuizQuestion } from '../types/quiz';

export const quizQuestions: QuizQuestion[] = [
  // ==========================================
  // MUSIC
  // ==========================================
  // m1 - Practice scales (easy)
  {
    id: 'q_m1_1', taskId: 'm1', skill: 'music', difficulty: 'facile',
    text: 'What is the first note of the C major scale?',
    choices: ['D', 'F', 'C', 'E'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_m1_2', taskId: 'm1', skill: 'music', difficulty: 'facile',
    text: 'How many different notes are in a classic major diatonic scale?',
    choices: ['5', '6', '7', '8'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_m1_3', taskId: 'm1', skill: 'music', difficulty: 'facile',
    text: 'Which of these scales is the relative minor of C major?',
    choices: ['G major', 'A minor', 'E minor', 'F major'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m1_4', taskId: 'm1', skill: 'music', difficulty: 'facile',
    text: 'Which of these note series corresponds to the C major scale?',
    choices: ['C D E F# G A B', 'C D E F G A B', 'C Db E F G Ab B', 'C D E F G A Bb'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m1_5', taskId: 'm1', skill: 'music', difficulty: 'facile',
    text: 'What is the primary purpose of practicing scales?',
    choices: ['To adjust the instrument volume', 'To internalize structures, develop technique and ear', 'To change the tempo', 'To tune the instrument'],
    correctAnswerIndex: 1,
  },

  // m2 - Learn a new piece (medium)
  {
    id: 'q_m2_1', taskId: 'm2', skill: 'music', difficulty: 'moyen',
    text: 'In a classical piano piece, what role does the left hand often play?',
    choices: ['The main melody', 'Percussive sound effects', 'Rhythm and harmonic accompaniment', 'It doesn\'t play at first'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_m2_2', taskId: 'm2', skill: 'music', difficulty: 'moyen',
    text: 'What does "sight-reading" a piece mean?',
    choices: ['Reading and playing it for the very first time', 'Transposing it to another key', 'Playing it entirely from memory', 'Playing it at double speed'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_m2_3', taskId: 'm2', skill: 'music', difficulty: 'moyen',
    text: 'What is the recommended method for learning a new passage (e.g., 8 measures)?',
    choices: ['Play at final speed immediately', 'Work hands separately slowly then assemble', 'Learn only the right hand', 'Memorize visually without playing'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m2_4', taskId: 'm2', skill: 'music', difficulty: 'moyen',
    text: 'What does the fingering written on a score indicate?',
    choices: ['The note attack intensity', 'The recommended finger number to press the key', 'The silence duration', 'The pedal usage'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m2_5', taskId: 'm2', skill: 'music', difficulty: 'moyen',
    text: 'When systematically struggling with a complex passage, what should you do?',
    choices: ['Isolate it, slow it down and repeat it in a loop', 'Restart the piece from the very beginning', 'Play louder to compensate', 'Ignore the error and continue'],
    correctAnswerIndex: 0,
  },

  // m3 - Rhythm exercises (medium)
  {
    id: 'q_m3_1', taskId: 'm3', skill: 'music', difficulty: 'moyen',
    text: 'In a 4/4 measure, what is the duration of a quarter note?',
    choices: ['Half a beat', 'One beat', 'Two beats', 'Four beats'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m3_2', taskId: 'm3', skill: 'music', difficulty: 'moyen',
    text: 'What is a rhythmic syncopation?',
    choices: ['A sudden and permanent stop of the music', 'Shifting the tonic accent to a weak beat', 'A progressive tempo acceleration', 'Playing off-tempo'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m3_3', taskId: 'm3', skill: 'music', difficulty: 'moyen',
    text: 'How many eighth notes are equal to one quarter note?',
    choices: ['Only one', 'Two eighth notes', 'Three eighth notes', 'Four eighth notes'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m3_4', taskId: 'm3', skill: 'music', difficulty: 'moyen',
    text: 'If the metronome is set to 80 BPM, it means it emits:',
    choices: ['80 beats (quarter notes) per minute', '80 beats per second', '80 full measures per minute', 'A very fast rhythm (presto)'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_m3_5', taskId: 'm3', skill: 'music', difficulty: 'moyen',
    text: 'To stabilize an irregular rhythm during learning, what is the best tool?',
    choices: ['A chromatic tuner', 'A metronome', 'A sustain pedal', 'A tuning fork'],
    correctAnswerIndex: 1,
  },

  // m4 - Music theory (hard)
  {
    id: 'q_m4_1', taskId: 'm4', skill: 'music', difficulty: 'difficile',
    text: 'What specific notes compose the C Major triad?',
    choices: ['C, D, E', 'C, E, G', 'C, Eb, G', 'C, F, G'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m4_2', taskId: 'm4', skill: 'music', difficulty: 'difficile',
    text: 'Fundamentally, what differentiates a major triad from a minor triad?',
    choices: ['The fifth (perfect vs diminished)', 'The root note', 'The nature of the third (major vs minor)', 'Adding the octave'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_m4_3', taskId: 'm4', skill: 'music', difficulty: 'difficile',
    text: 'What is the natural interval between C and G?',
    choices: ['A second', 'A third', 'A perfect fourth', 'A perfect fifth'],
    correctAnswerIndex: 3,
  },
  {
    id: 'q_m4_4', taskId: 'm4', skill: 'music', difficulty: 'difficile',
    text: 'How many semitones separate the root from its minor third?',
    choices: ['2 semitones', '3 semitones', '4 semitones', '5 semitones'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m4_5', taskId: 'm4', skill: 'music', difficulty: 'difficile',
    text: 'If you build a major third (4 semitones) above F, what note do you get?',
    choices: ['G', 'A', 'Bb', 'C'],
    correctAnswerIndex: 1,
  },

  // m5 - Improvisation (hard)
  {
    id: 'q_m5_1', taskId: 'm5', skill: 'music', difficulty: 'difficile',
    text: 'What are the 5 notes composing the A minor pentatonic scale?',
    choices: ['A, B, C, D, E', 'A, C, D, E, G', 'A, C, E, G, B', 'A, C, D, F, G'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m5_2', taskId: 'm5', skill: 'music', difficulty: 'difficile',
    text: 'Why is the pentatonic scale ideal for starting improvisation?',
    choices: ['Because it avoids semitones and naturally dissonant intervals', 'Because it contains all 12 notes of the keyboard', 'Because you only play on black keys', 'Because it allows you to play very fast'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_m5_3', taskId: 'm5', skill: 'music', difficulty: 'difficile',
    text: 'What is a "motif" or "phrase" in improvisation?',
    choices: ['A 4-note block chord', 'A short melodic idea intended to be repeated or varied', 'A sudden tempo change', 'Changing instruments mid-solo'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_m5_4', taskId: 'm5', skill: 'music', difficulty: 'difficile',
    text: 'To vary a musical phrase without changing the notes, what parameter can you modify?',
    choices: ['Fingering (it changes the sound)', 'The G clef on the score', 'Rhythm, articulation, and silence placement', 'The key signature (sharps at the beginning)'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_m5_5', taskId: 'm5', skill: 'music', difficulty: 'difficile',
    text: 'Beyond pure technique, improvisation primarily consists of...',
    choices: ['Reading a score extremely fast', 'Playing the maximum notes per second', 'Listening to the harmony and building a spontaneous melody', 'Following strict and immutable theoretical rules'],
    correctAnswerIndex: 2,
  },

  // ==========================================
  // PHOTOGRAPHY
  // ==========================================
  // p1 - Take 10 landscape photos (easy)
  {
    id: 'q_p1_1', taskId: 'p1', skill: 'photography', difficulty: 'facile',
    text: 'What is the famous "rule of thirds" in photography?',
    choices: ['Divide the image by a 3x3 grid and place key elements on lines or intersections', 'Take exactly 3 photos of the same subject', 'Cut the main subject into three equal parts', 'Use only three dominant colors'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_p1_2', taskId: 'p1', skill: 'photography', difficulty: 'facile',
    text: 'If you photograph a seascape, where is it recommended to place the horizon according to the rule of thirds?',
    choices: ['Exactly in the center of the photo', 'On the bottom or top third line', 'Diagonally from the corner', 'Doesn\'t matter, the center is always ideal'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p1_3', taskId: 'p1', skill: 'photography', difficulty: 'facile',
    text: 'What is the main visual objective of a "leading line" (like a path or fence)?',
    choices: ['To brutally cut the photo in half', 'To naturally guide the viewer\'s eye towards the main subject', 'To make the photograph brighter', 'To add digital noise to the image'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p1_4', taskId: 'p1', skill: 'photography', difficulty: 'facile',
    text: 'Which of these natural elements usually makes an excellent leading line?',
    choices: ['A river winding towards mountains', 'The sun at its zenith', 'A bird in mid-flight crossing the image', 'An isolated cloud in a blue sky'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_p1_5', taskId: 'p1', skill: 'photography', difficulty: 'facile',
    text: 'Overall, the rule of thirds is used to make an image...',
    choices: ['More blurry and mysterious', 'Perfectly symmetrical on each side', 'More dynamic, balanced and pleasing to the eye', 'Systematically darker'],
    correctAnswerIndex: 2,
  },

  // p2 - Photo editing (medium)
  {
    id: 'q_p2_1', taskId: 'p2', skill: 'photography', difficulty: 'moyen',
    text: 'In photo editing, what does the "Exposure" parameter primarily modify?',
    choices: ['The overall color of the image', 'The overall clarity and brightness of the photo', 'Background blur (Bokeh)', 'Edge sharpness'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p2_2', taskId: 'p2', skill: 'photography', difficulty: 'moyen',
    text: 'Which setting allows correcting an image that is too "yellow" or too "blue"?',
    choices: ['The sharpness tool', 'Contrast', 'White Balance (Temperature/Tint)', 'Vibrance'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_p2_3', taskId: 'p2', skill: 'photography', difficulty: 'moyen',
    text: 'What does increasing the contrast of a photo visually mean?',
    choices: ['Darkening the whole image uniformly', 'Making dark tones deeper and light tones brighter', 'Mixing all tints to get gray', 'Erasing or blurring the background'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p2_4', taskId: 'p2', skill: 'photography', difficulty: 'moyen',
    text: 'Which software tool is commonly used to accentuate micro-details (sharpness)?',
    choices: ['The "Paint bucket" tool', 'Magic eraser', 'Unsharp Mask or sharpness tool', 'Clone stamp'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_p2_5', taskId: 'p2', skill: 'photography', difficulty: 'moyen',
    text: 'For a clean and logical editing workflow, what is the generally recommended order?',
    choices: ['Sharpness > White Balance > Global Exposure', 'Exposure Correction > White Balance > Contrast', 'Add Contrast > Max Sharpness > Exposure Adjustment', 'White Balance > Sharpness > Contrast'],
    correctAnswerIndex: 1,
  },

  // p3 - Study composition (easy)
  {
    id: 'q_p3_1', taskId: 'p3', skill: 'photography', difficulty: 'facile',
    text: 'In photographic composition, what is "negative space"?',
    choices: ['A intentionally underexposed (dark) photo', 'An empty, clean or solid area surrounding the main subject', 'The motion blur effect on a fast subject', 'A photograph developed in black and white'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p3_2', taskId: 'p3', skill: 'photography', difficulty: 'facile',
    text: 'What is the psychological or visual impact of negative space?',
    choices: ['It isolates the subject and creates a sense of calm or "visual silence"', 'It makes the photo very complex to read', 'It reduces the digital file size', 'It only serves to hide lens defects'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_p3_3', taskId: 'p3', skill: 'photography', difficulty: 'facile',
    text: 'What is the "natural framing" technique?',
    choices: ['Taking photos exclusively in a forest', 'Using elements of the scenery (arch, branches, window) to frame the subject in the image', 'Cropping the photo later in software', 'Never using artificial flash'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p3_4', taskId: 'p3', skill: 'photography', difficulty: 'facile',
    text: 'Which of these situations perfectly illustrates natural framing?',
    choices: ['Photographing a bird alone in the sky', 'Photographing a person visible through a door frame', 'Zooming in maximum on the subject\'s face', 'Placing the subject exactly in the center'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p3_5', taskId: 'p3', skill: 'photography', difficulty: 'facile',
    text: 'Why intentionally include blurry tree branches in the foreground of a landscape?',
    choices: ['To give the illusion that the lens is dirty', 'To hide the real subject of the photo', 'To frame the distant subject and give a sense of depth (3D)', 'Only to brighten the edges of the image'],
    correctAnswerIndex: 2,
  },

  // p4 - Natural light portrait (hard)
  {
    id: 'q_p4_1', taskId: 'p4', skill: 'photography', difficulty: 'difficile',
    text: 'What visual effect does "side light" produce on a face?',
    choices: ['It completely erases features and wrinkles', 'It accentuates textures, creates volume and marked shadows', 'It systematically causes the "red eye" effect', 'It fully silhouettes the person'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p4_2', taskId: 'p4', skill: 'photography', difficulty: 'difficile',
    text: 'How should you position the model for a "backlit" portrait?',
    choices: ['The light shines on the photographer\'s back', 'The model is placed between the photographer and the light source (e.g., a window)', 'The model is placed in a room without any light', 'The model must look directly at the sun'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p4_3', taskId: 'p4', skill: 'photography', difficulty: 'difficile',
    text: 'In backlighting, if the camera exposes automatically based on the bright background light, how will the face appear?',
    choices: ['As a dark silhouette or underexposed', 'Perfectly lit and sharp', 'Totally white (overexposed)', 'Blurry because of movement'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_p4_4', taskId: 'p4', skill: 'photography', difficulty: 'difficile',
    text: 'In backlighting, how can you ensure the model\'s face is correctly visible without using a flash?',
    choices: ['Close the aperture to the maximum', 'Force exposure on the face (which will burn/overexpose the background)', 'Lower ISO sensitivity to minimum', 'Set white balance to tungsten mode'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p4_5', taskId: 'p4', skill: 'photography', difficulty: 'difficile',
    text: 'Which weather condition naturally produces the softest, most diffuse and flattering light for an outdoor portrait?',
    choices: ['Bright sun in the middle of the day', 'A cloudy or very overcast sky that acts like a giant softbox', 'At night under direct streetlight', 'A sunrise with the sun in the model\'s eyes'],
    correctAnswerIndex: 1,
  },

  // p5 - Analyze master photographers (medium)
  {
    id: 'q_p5_1', taskId: 'p5', skill: 'photography', difficulty: 'moyen',
    text: 'Which famous French photographer is associated with the major concept of "The Decisive Moment"?',
    choices: ['Ansel Adams', 'Henri Cartier-Bresson', 'Robert Capa', 'Sebastião Salgado'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p5_2', taskId: 'p5', skill: 'photography', difficulty: 'moyen',
    text: 'What does "the decisive moment" mean in street or documentary photography?',
    choices: ['The precise moment the camera battery dies', 'The moment to change lenses before a scene', 'The unique fraction of a second where the ongoing action and geometric composition align perfectly', 'The final editing process in the darkroom'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_p5_3', taskId: 'p5', skill: 'photography', difficulty: 'moyen',
    text: 'The master photographer Ansel Adams is world-famous for his works concerning:',
    choices: ['Studio fashion portraits', 'Grand American natural landscapes in black and white', 'Colorful underwater photography', 'War photojournalism'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_p5_4', taskId: 'p5', skill: 'photography', difficulty: 'moyen',
    text: 'What is the famous "Zone System" developed by Ansel Adams?',
    choices: ['A scientific technique for visualizing, exposing and developing the image to obtain a perfect range from pure black to pure white', 'A composition rule dividing the viewfinder into 9 equal zones', 'A specific brand of color film', 'A law prohibiting image editing after the shot'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_p5_5', taskId: 'p5', skill: 'photography', difficulty: 'moyen',
    text: 'Analyzing Henri Cartier-Bresson\'s work highlights his approach based on...',
    choices: ['Systematic and intensive cropping during printing', 'Quiet observation, spontaneity and an innate sense of geometry', 'Using extremely long exposure times', 'Setting up complex lighting rigs in the street'],
    correctAnswerIndex: 1,
  },

  // ==========================================
  // FITNESS
  // ==========================================
  // f1 - 30-minute cardio (easy)
  {
    id: 'q_f1_1', taskId: 'f1', skill: 'fitness', difficulty: 'facile',
    text: 'How is "Zone 2" heart rate defined during endurance training?',
    choices: ['A maximal sprint where the heart is at 100%', 'A moderate effort (65-75% max HR) allowing to hold a conversation without too much breathlessness', 'A phase of total rest', 'A very intense effort where one must stop every 2 minutes'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f1_2', taskId: 'f1', skill: 'fitness', difficulty: 'facile',
    text: 'What is the main benefit of long Zone 2 training?',
    choices: ['Developing impressive muscle mass', 'Improving fundamental endurance and optimizing fat use as energy', 'Developing explosive strength and speed', 'Avoiding sweating altogether'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f1_3', taskId: 'f1', skill: 'fitness', difficulty: 'facile',
    text: 'Which of these workouts corresponds to continuous cardio effort in Zone 2?',
    choices: ['Lifting the heaviest weight possible once', 'Doing an uninterrupted 30-minute jog at a moderate pace', 'Maintaining a static stretch for 10 minutes', 'Doing 10 push-ups very quickly then sitting down'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f1_4', taskId: 'f1', skill: 'fitness', difficulty: 'facile',
    text: 'During my jog, I realize I am unable to talk without having to stop to gasp. What does this mean?',
    choices: ['I am exactly in the right cardio zone', 'I am above Zone 2 (the intensity is too high)', 'I am below Zone 2', 'The stopwatch is not working'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f1_5', taskId: 'f1', skill: 'fitness', difficulty: 'facile',
    text: 'If running is impossible for you, what alternative offers similar cardio benefits at the same intensity?',
    choices: ['Lying on a floor mat', 'Doing stationary cycling or rowing at a steady pace', 'Lifting big dumbbells for 3 minutes', 'Doing a guided meditation session'],
    correctAnswerIndex: 1,
  },

  // f2 - Upper body strength (medium)
  {
    id: 'q_f2_1', taskId: 'f2', skill: 'fitness', difficulty: 'moyen',
    text: 'To avoid injury during push-ups, how should the body be aligned?',
    choices: ['The pelvis should point as high as possible towards the ceiling', 'The head should be thrown back and the lower back arched', 'The head, pelvis and ankles should form a straight and braced line', 'The knees should always touch the belly'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_f2_2', taskId: 'f2', skill: 'fitness', difficulty: 'moyen',
    text: 'Where should the elbows ideally point during the descent of a classic push-up?',
    choices: ['They should be flared out at 90° (aligned with shoulders)', 'They should be oriented at about 45° relative to the torso', 'They should point strictly forward', 'They should touch the ears'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f2_3', taskId: 'f2', skill: 'fitness', difficulty: 'moyen',
    text: 'Which muscle group is primarily targeted by the horizontal row (Rowing) exercise?',
    choices: ['Pectoral muscles', 'Abdominal belt', 'Back muscles (lats and rhomboids)', 'Calves'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_f2_4', taskId: 'f2', skill: 'fitness', difficulty: 'moyen',
    text: 'During the contraction phase of a row (pull), what technical detail is essential?',
    choices: ['Intentionally rounding the upper back', 'Strongly squeezing the shoulder blades together', 'Dropping the weight suddenly', 'Keeping arms totally straight'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f2_5', taskId: 'f2', skill: 'fitness', difficulty: 'moyen',
    text: 'In weight training (hypertrophy/strength), why do we respect a rest time of 60 to 90 seconds between sets?',
    choices: ['So the body becomes totally cold again', 'To allow partial ATP resynthesis and maintain intensity for the next set', 'To have time to look at one\'s phone', 'It\'s a waste of time, you have to chain everything'],
    correctAnswerIndex: 1,
  },

  // f3 - Yoga & stretching (easy)
  {
    id: 'q_f3_1', taskId: 'f3', skill: 'fitness', difficulty: 'facile',
    text: 'What is the famous dynamic series of basic yoga poses called?',
    choices: ['Sun Salutation (Surya Namaskar)', 'Moon Dance', 'Martial Bridge', 'Bear Walk'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_f3_2', taskId: 'f3', skill: 'fitness', difficulty: 'facile',
    text: 'Which of these iconic poses is part of the Sun Salutation?',
    choices: ['Downward-Facing Dog (Adho Mukha Svanasana)', 'Firebird', 'Butterfly Catch', 'Side Split'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_f3_3', taskId: 'f3', skill: 'fitness', difficulty: 'facile',
    text: 'While maintaining a stretching pose, what should focus be on?',
    choices: ['On sharp pain to go further', 'On slow, continuous and deep breathing cycles', 'On holding breath (apnea)', 'On speed of execution'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f3_4', taskId: 'f3', skill: 'fitness', difficulty: 'facile',
    text: 'Where are the "hamstrings" located, often targeted in stretching?',
    choices: ['On each side of the neck', 'At the back of the thigh', 'On the abdominal wall', 'In the forearm compartment'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f3_5', taskId: 'f3', skill: 'fitness', difficulty: 'facile',
    text: 'To loosen the muscle without risk of tearing, how long is a static stretch generally held?',
    choices: ['1 to 2 seconds', 'Between 30 seconds and 2 minutes', 'Less than half a second (with bouncing)', 'More than 30 minutes uninterrupted'],
    correctAnswerIndex: 1,
  },

  // f4 - 5km Run (hard)
  {
    id: 'q_f4_1', taskId: 'f4', skill: 'fitness', difficulty: 'difficile',
    text: 'In running, what does the "negative split" strategy mean?',
    choices: ['Running the distance backwards', 'Performing the second half of the run at a faster pace than the first', 'Abandoning the run before the end', 'Starting at a sprint pace then finishing by walking'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f4_2', taskId: 'f4', skill: 'fitness', difficulty: 'difficile',
    text: 'During the first two kilometers, a perception of effort RPE 4/10 means the pace should be:',
    choices: ['Perceived as an unsustainable maximal effort', 'Controlled, easy and allowing to warm up', 'As fast as possible to get ahead', 'So slow that it is walking'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f4_3', taskId: 'f4', skill: 'fitness', difficulty: 'difficile',
    text: 'Physiologically, why is a cautious start on a 5km often the best strategy?',
    choices: ['To let opponents win', 'To avoid early lactic acid accumulation and preserve glycogen for the end', 'Because you have to stop in the middle', 'This strategy is wrong, you should always sprint at the start'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f4_4', taskId: 'f4', skill: 'fitness', difficulty: 'difficile',
    text: 'If the plan requires a "negative split", when should you stabilize your most demanding target pace?',
    choices: ['From the first seconds of the run', 'In the second half of the effort (kilometers 3 to 5)', 'Only during the last 10 meters', 'During training only, not on race day'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f4_5', taskId: 'f4', skill: 'fitness', difficulty: 'difficile',
    text: 'When fatigue occurs at the end of a 5km, what technical element is crucial to focus on?',
    choices: ['Lengthening the stride to the maximum until bounding', 'Maintaining cadence (step frequency) and relaxing the upper body', 'Looking at your feet so as not to fall', 'Holding breath to mobilize the trunk'],
    correctAnswerIndex: 1,
  },

  // f5 - Abdominal exercises (medium)
  {
    id: 'q_f5_1', taskId: 'f5', skill: 'fitness', difficulty: 'moyen',
    text: 'What is the fundamental isometric exercise of maintaining the body horizontal supported on the forearms?',
    choices: ['The Crunch', 'The Plank', 'Pelvic Lift', 'The Vacuum'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f5_2', taskId: 'f5', skill: 'fitness', difficulty: 'moyen',
    text: 'For an effective Plank, what is the critical attention point?',
    choices: ['Letting the lower back arch towards the floor', 'Slightly tucking the pelvis and strongly contracting the abdominals', 'Looking at the ceiling while pulling on the neck', 'Bending knees to touch the floor'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f5_3', taskId: 'f5', skill: 'fitness', difficulty: 'moyen',
    text: 'When performing Crunches, what is the most common injurious error?',
    choices: ['Violently pulling on your neck with your hands to help you up', 'Voluntarily contracting abdominal muscles', 'Exhaling on the way up', 'Keeping feet well anchored to the floor'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_f5_4', taskId: 'f5', skill: 'fitness', difficulty: 'moyen',
    text: 'The "Mountain climbers" exercise has the characteristic of...',
    choices: ['Working biceps in total isolation', 'Engaging abdominal core while creating a strong cardiovascular demand', 'Relaxing the spine', 'Specifically isolating the calf muscle'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_f5_5', taskId: 'f5', skill: 'fitness', difficulty: 'moyen',
    text: 'Although the abdominals work together, the "lying leg raise" more intensely solicits...',
    choices: ['The lower part of the rectus abdominis', 'The pectoralis major muscles', 'The shoulder girdle (shoulders)', 'The gluteal muscles in isolation'],
    correctAnswerIndex: 0,
  },

  // ==========================================
  // PROGRAMMING
  // ==========================================
  // c1 - Variables and basic types (easy)
  {
    id: 'q_c1_1', taskId: 'c1', skill: 'programming', difficulty: 'facile',
    text: 'If a variable contains the value `"Hello"`, which JavaScript primitive type does it belong to?',
    choices: ['number', 'boolean', 'string', 'object'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_c1_2', taskId: 'c1', skill: 'programming', difficulty: 'facile',
    text: 'Which JavaScript operator returns the type of a variable as a string?',
    choices: ['typeOf()', 'typeof', 'instanceOf', 'classType'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c1_3', taskId: 'c1', skill: 'programming', difficulty: 'facile',
    text: 'What are the only two possible literal values for the "boolean" type?',
    choices: ['1 and 2', 'true and false', '"yes" and "no"', 'null and undefined'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c1_4', taskId: 'c1', skill: 'programming', difficulty: 'facile',
    text: 'In modern JavaScript (ES6+), which variable declaration keyword is NO LONGER recommended due to scope issues?',
    choices: ['let', 'const', 'var', 'int'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_c1_5', taskId: 'c1', skill: 'programming', difficulty: 'facile',
    text: 'If the code executes `let x = 10;`, what will the expression `typeof x` return?',
    choices: ['"string"', '"number"', '"boolean"', '"10"'],
    correctAnswerIndex: 1,
  },

  // c2 - Conditional structures (medium)
  {
    id: 'q_c2_1', taskId: 'c2', skill: 'programming', difficulty: 'moyen',
    text: 'Which mathematical expression allows checking if an integer "x" is even?',
    choices: ['x / 2 === 0', 'x % 2 === 0', 'x * 2 === 1', 'x === 2'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c2_2', taskId: 'c2', skill: 'programming', difficulty: 'moyen',
    text: 'In the instruction `if (condition) { ... }`, the condition in parentheses will be implicitly converted to:',
    choices: ['A String', 'An Integer', 'A Boolean', 'An Array'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_c2_3', taskId: 'c2', skill: 'programming', difficulty: 'moyen',
    text: 'Which keyword accompanies an "if" to define the block of code to execute if the condition evaluates to false?',
    choices: ['otherwise', 'then', 'else', 'catch'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_c2_4', taskId: 'c2', skill: 'programming', difficulty: 'moyen',
    text: 'What is the structural advantage of a "switch" statement compared to a long series of "if / else if"?',
    choices: ['The code executes much faster in machine', 'It offers a cleaner and more readable syntax for testing multiple strict equalities on the same variable', 'It allows evaluating complex inequality conditions (>, <)', 'It avoids declaring variables'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c2_5', taskId: 'c2', skill: 'programming', difficulty: 'moyen',
    text: 'In a "switch" block, which keyword is necessary at the end of a "case" to prevent execution of subsequent cases?',
    choices: ['stop', 'exit', 'break', 'return'],
    correctAnswerIndex: 2,
  },

  // c3 - Loops and iterations (medium)
  {
    id: 'q_c3_1', taskId: 'c3', skill: 'programming', difficulty: 'moyen',
    text: 'What are, in order, the three instructions contained in a classic "for" loop header?',
    choices: ['Initialization, Condition, Increment/Update', 'Condition, Execution, Return', 'Function declaration, Test, Emergency stop', 'Start, Index, Length'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_c3_2', taskId: 'c3', skill: 'programming', difficulty: 'moyen',
    text: 'In which scenario is a "while" loop generally preferred over a "for" loop?',
    choices: ['When you want the code to run faster', 'When you don\'t know the exact number of iterations needed in advance', 'When you want to iterate over array elements', 'The while loop no longer exists in modern JavaScript'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c3_3', taskId: 'c3', skill: 'programming', difficulty: 'moyen',
    text: 'What is the critical risk if a "while" loop condition never becomes false over iterations?',
    choices: ['The compiler will delete the loop', 'Creation of an infinite loop leading to program freeze', 'The iteration variable will become negative again', 'A syntax error appears'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c3_4', taskId: 'c3', skill: 'programming', difficulty: 'moyen',
    text: 'In the instruction `for (let i = 1; i <= 10; i++)`, how many times will the block of code be executed?',
    choices: ['9 times', '10 times', '11 times', '0 times'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c3_5', taskId: 'c3', skill: 'programming', difficulty: 'moyen',
    text: 'During execution of an iteration, which keyword allows definitively interrupting the loop?',
    choices: ['break', 'continue', 'stop', 'halt'],
    correctAnswerIndex: 0,
  },

  // c4 - Functions and modularity (hard)
  {
    id: 'q_c4_1', taskId: 'c4', skill: 'programming', difficulty: 'difficile',
    text: 'In the functional paradigm, what characterizes a "pure function"?',
    choices: ['A function that takes no parameters', 'A function that always returns the same result for the same arguments, and produces no side effects', 'A function written exclusively on one line', 'A function provided by default by the language'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c4_2', taskId: 'c4', skill: 'programming', difficulty: 'difficile',
    text: 'What is a callback function?',
    choices: ['An error cancellation instruction', 'A function that calls itself (recursion)', 'A function passed as an argument to another function to be executed later', 'A global variable serving as a counter'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_c4_3', taskId: 'c4', skill: 'programming', difficulty: 'difficile',
    text: 'If you define `function calculateArea(L, l) { return L * l; }`, what value is returned by `calculateArea(5, 4)`?',
    choices: ['9', '18', '20', 'undefined'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q_c4_4', taskId: 'c4', skill: 'programming', difficulty: 'difficile',
    text: 'What does the `.map()` method do when called on an array with a callback function?',
    choices: ['It erases the array', 'It creates a new array by calling the callback function on each element of the source array', 'It adds an element to the end of the array', 'It sorts the array in ascending order'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c4_5', taskId: 'c4', skill: 'programming', difficulty: 'difficile',
    text: 'When a function performs a calculation, which keyword is mandatory to transmit the result back to the code that called it?',
    choices: ['yield', 'print', 'export', 'return'],
    correctAnswerIndex: 3,
  },

  // c5 - Solve mini-exercise (hard)
  {
    id: 'q_c5_1', taskId: 'c5', skill: 'programming', difficulty: 'difficile',
    text: 'If you must reverse a string algorithmically (without native methods), what logical approach to use?',
    choices: ['Loop from start to end and replace each letter with the previous one', 'Traverse the string backwards (from last index to index 0) and concatenate each character into a new variable', 'Transform the string into a number then read it backwards', 'Use a switch statement on each vowel'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c5_2', taskId: 'c5', skill: 'programming', difficulty: 'difficile',
    text: 'To manually find the maximum value in an array of numbers, the classic approach is to:',
    choices: ['Initialize a "max" variable to the first element, then traverse the rest: if a greater element is found, update "max"', 'Add all elements of the array and divide by length', 'Systematically take the last element of the array', 'Convert the array to a string'],
    correctAnswerIndex: 0,
  },
  {
    id: 'q_c5_3', taskId: 'c5', skill: 'programming', difficulty: 'difficile',
    text: 'When searching for a maximum, what happens if the array only contains negative numbers and you initialize "max = 0"?',
    choices: ['The code crashes', 'The program will falsely return 0 as maximum', 'The program will automatically understand and return the correct negative number', 'The array becomes positive'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c5_4', taskId: 'c5', skill: 'programming', difficulty: 'difficile',
    text: 'In Big O notation, what is the classic time complexity of a loop traversing all N elements of an array once?',
    choices: ['O(1)', 'O(n)', 'O(n^2)', 'O(log n)'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q_c5_5', taskId: 'c5', skill: 'programming', difficulty: 'difficile',
    text: 'In a zero-indexed language like JavaScript, what is the index of the last character of a string "str"?',
    choices: ['str.length', '0', 'str.length - 1', 'str.length + 1'],
    correctAnswerIndex: 2,
  },
];

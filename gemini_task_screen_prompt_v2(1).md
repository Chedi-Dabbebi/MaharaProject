# Gemini Pro Prompt — Task Session Screen Implementation

## Before writing any code

Read the following files first and extract what you need from them:
- The existing skills data file — find where tasks are defined (title, duration, xp, id)
- The existing task content file — find the function that returns prompt + items for a given task id
- The active session context — find how to mark a task as complete and read session state
- The navigation types file — find the param list type and how other screens receive route params
- One or two existing screens — understand the StyleSheet patterns and component structure already in use

Do not assume any function name, type name, or import path. Read the codebase and use what is already there.

---

## What to build

This is shown when a user clicks a task inside session. the task menu gets bigger and i dont want it to be a new screen 
if the user clicks the task again it collapses

---

## Layout (top to bottom, strict order)

### Block 1 — Task header card
A rounded card containing:
- Task title, large and bold
- Duration with a small clock icon to its left
- XP reward as an accent-colored pill, aligned to the right

### Block 2 — Session controls row
Two elements side by side:

**Left (takes most of the width) — controls bar:**
- Left side: a countdown timer in monospace font, counting down from the task duration in MM:SS
- Right side: two buttons
  - A pause/resume toggle — icon only (two bars when running, triangle when paused)
  - A validate button — small, checkmark icon + the word "Valider"

**Right (small fixed width ~52px) — YouTube shortcut:**
- Same height as the controls bar
- A red YouTube-style play icon centered
- A small label below: "Tutoriel"
- On press: open `https://www.youtube.com/results?search_query=` + the task title URL-encoded, using the React Native linking API

### Block 3 — Content card (fills remaining space)
Three sections with thin dividers between them:

**Section A**
- Uppercase muted label: "DESCRIPTION"
- The task's instruction text below it (the `prompt` field from the task content)

**Section B**
- Uppercase muted label: "À FAIRE"
- Two items displayed with numbered badges ① ② on the left and text on the right
- Content comes from the two items in the task content data

**Section C**
- A checkbox and the label "Marquer comme terminé"
- Tapping it marks the task as complete using whatever method the session context exposes for that
- If already complete: checkbox appears checked and the row is visually muted

---

## Timer behavior

- Counts down from task duration (in minutes) converted to seconds
- Built with a ref and interval — clear the interval on unmount and when paused
- When it reaches zero, auto-trigger task completion if not already done
- Pause button stops the interval; resume restarts it

---

## Navigation

- This screen receives at minimum: the task id, the active plan id, and the active session run id as route params
- Look at how other screens declare and consume route params and follow the same pattern exactly
- Back navigation uses the standard go-back method from the navigation object — do not reset the session stack

---

## Data

- Task metadata (title, duration, xp): find it from the skills data using the task id from params
- Task content (prompt, items): find it using the task content lookup — if it returns nothing, show a simple fallback card with the text "Contenu non disponible pour cette tâche" instead of crashing
- Session actions: find the relevant method in the session context by reading it — do not guess

---


## Constraints

- No hardcoded colors — use only what the existing theme/StyleSheet patterns already use
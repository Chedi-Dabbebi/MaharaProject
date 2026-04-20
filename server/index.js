const express = require('express');

const app = express();
app.use(express.json());

const port = process.env.PORT || 8787;
const openAiKey = process.env.OPENAI_API_KEY || '';
const openAiModel = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

function parseMinutes(duration) {
  const normalized = String(duration || '').toLowerCase();
  const hourMatch = normalized.match(/(\d+)\s*h/);
  const minMatch = normalized.match(/(\d+)\s*min/);
  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const mins = minMatch ? Number(minMatch[1]) : 0;
  const direct = !hours && !mins ? Number(normalized.replace(/\D/g, '')) : 0;
  return hours * 60 + mins + (Number.isFinite(direct) ? direct : 0);
}

function buildFallbackPlan(payload) {
  const baseSessions = payload.difficulty === 'facile' ? 3 : payload.difficulty === 'moyen' ? 5 : 7;
  const sortedTasks = [...(payload.tasks || [])].sort((a, b) => Number(a.completed) - Number(b.completed));
  const recommended = sortedTasks.slice(0, Math.min(baseSessions, sortedTasks.length));
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const sessions = Array.from({ length: baseSessions }).map((_, index) => {
    const task = recommended[index % recommended.length];
    return {
      dayLabel: weekDays[index % weekDays.length],
      taskId: task.id,
      taskTitle: task.title,
      duration: task.duration,
      xp: task.xp,
    };
  });
  const totalMinutes = recommended.reduce((sum, task) => sum + parseMinutes(task.duration), 0);
  const weeklyTime = totalMinutes > 0 ? `${Math.floor(totalMinutes / 60)}h${String(totalMinutes % 60).padStart(2, '0')}` : '3h00';

  return {
    skillId: payload.skillId,
    difficulty: payload.difficulty,
    sessionsPerWeek: baseSessions,
    weeklyTime,
    recommendedTaskIds: recommended.map((task) => task.id),
    sessions,
    summary: `Plan ${payload.difficulty} pour ${payload.skillName}: ${baseSessions} seances.`,
    source: 'fallback',
  };
}

function validatePlan(plan, payload) {
  if (!plan || typeof plan !== 'object') return false;
  if (typeof plan.sessionsPerWeek !== 'number' || plan.sessionsPerWeek <= 0) return false;
  if (!Array.isArray(plan.recommendedTaskIds)) return false;
  const knownTaskIds = new Set((payload.tasks || []).map((task) => task.id));
  return plan.recommendedTaskIds.every((id) => knownTaskIds.has(id));
}

async function generateWithOpenAI(payload) {
  if (!openAiKey) return null;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAiKey}`,
    },
    body: JSON.stringify({
      model: openAiModel,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You generate weekly skill plans. Return ONLY JSON with keys: skillId,difficulty,sessionsPerWeek,weeklyTime,recommendedTaskIds,sessions,summary. sessions is an array of {dayLabel,taskId,taskTitle,duration,xp}.',
        },
        {
          role: 'user',
          content: JSON.stringify(payload),
        },
      ],
    }),
  });

  if (!response.ok) return null;
  const json = await response.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

app.post('/generate-plan', async (req, res) => {
  const payload = req.body || {};
  if (!payload.skillId || !payload.difficulty || !Array.isArray(payload.tasks)) {
    return res.status(400).json({ error: 'invalid_payload' });
  }

  const aiPlan = await generateWithOpenAI(payload);
  const safePlan = validatePlan(aiPlan, payload)
    ? { ...aiPlan, source: 'ai' }
    : buildFallbackPlan(payload);

  return res.json(safePlan);
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`AI plan API listening on http://localhost:${port}`);
});

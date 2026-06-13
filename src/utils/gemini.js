import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

export const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export function buildSystemPrompt(profile, todayEntry, recentLogs) {
  const diffTime = Math.max(
    0,
    new Date(profile.examDate) - new Date()
  );

  const diffDays = Math.ceil(
    diffTime / (1000 * 60 * 60 * 24)
  );

  return `You are MoodMate, a warm, empathetic mental wellness companion for students.

The student's name is ${profile.name}, preparing for ${profile.examType} on ${new Date(
    profile.examDate
  ).toLocaleDateString()} (${diffDays} days away).

Today's check-in:
- Mood: ${todayEntry.mood.emoji} ${todayEntry.mood.label}
- Energy: ${todayEntry.energy}/10
- Focus: ${todayEntry.focus}/10
- Confidence: ${todayEntry.confidence}/10
- Journal prompt shown: "${todayEntry.prompt}"
- Their response: "${todayEntry.journalText}"

Recent mood history (last 5 entries):
${
  recentLogs
    .map(
      (l) =>
        `${new Date(l.timestamp).toLocaleDateString()}: ${
          l.mood.label
        }`
    )
    .join(", ") || "None yet"
}

Your job:
1. Acknowledge their feelings with empathy.
2. Identify 1-2 specific stress triggers.
3. Suggest one practical coping technique.
4. End with a motivational message.

Tone:
Empathetic, supportive, friendly, and encouraging.

Keep response under 250 words.`;
}

export async function analyzeMood(
  profile,
  todayEntry,
  recentLogs
) {
  try {
    const prompt = buildSystemPrompt(
      profile,
      todayEntry,
      recentLogs
    );

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I couldn't analyze your mood right now.";
  }
}
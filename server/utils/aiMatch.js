/**
 * AI matching engine.
 * If ANTHROPIC_API_KEY is set, real resume/job analysis is run through
 * Claude. If not, it falls back to a deterministic rule-based matcher —
 * so the app always works, with or without an API key.
 */

function normalizeSkills(skills = []) {
  return skills.map((s) => s.trim().toLowerCase()).filter(Boolean);
}

function ruleBasedMatch(candidateSkills, jobSkills) {
  const cand = new Set(normalizeSkills(candidateSkills));
  const job = normalizeSkills(jobSkills);

  const matched = job.filter((s) => cand.has(s));
  const missing = job.filter((s) => !cand.has(s));
  const score = job.length === 0 ? 0 : Math.round((matched.length / job.length) * 100);

  let verdict = "Low Match";
  if (score >= 80) verdict = "Highly Recommended";
  else if (score >= 50) verdict = "Good Match";
  else if (score >= 25) verdict = "Partial Match";

  return { score, matchedSkills: matched, missingSkills: missing, verdict };
}

async function aiPoweredMatch(candidateSkills, jobSkills, resumeText = "") {
  const prompt = `You are a resume-to-job matching engine for a recruitment platform.
Candidate skills: ${candidateSkills.join(", ") || "none listed"}
${resumeText ? `Candidate resume excerpt: ${resumeText.slice(0, 1500)}` : ""}
Job required skills: ${jobSkills.join(", ")}

Return ONLY a JSON object, no other text, in this exact shape:
{"score": <0-100 integer>, "matchedSkills": [...], "missingSkills": [...], "verdict": "<Highly Recommended|Good Match|Partial Match|Low Match>"}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`AI API error: ${response.status}`);
  const data = await response.json();
  const text = (data.content || []).map((c) => c.text || "").join("");
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

async function analyzeMatch(candidateSkills, jobSkills, resumeText = "") {
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await aiPoweredMatch(candidateSkills, jobSkills, resumeText);
    } catch (err) {
      console.warn("AI match failed, falling back to rule-based:", err.message);
      return ruleBasedMatch(candidateSkills, jobSkills);
    }
  }
  return ruleBasedMatch(candidateSkills, jobSkills);
}

async function rankCandidates(candidates, jobSkills) {
  const results = [];
  for (const c of candidates) {
    const match = await analyzeMatch(c.skills || [], jobSkills, c.resumeText || "");
    results.push({ candidate: c, ...match });
  }
  return results.sort((a, b) => b.score - a.score);
}

function resumeSuggestions(missingSkills) {
  if (!missingSkills.length) {
    return ["Your skills already cover this role well. Add measurable project achievements to stand out further."];
  }
  return [
    `Consider learning: ${missingSkills.slice(0, 3).join(", ")}.`,
    "Add measurable achievements (e.g. 'improved X by Y%') to your project descriptions.",
    "Keep your resume to 1-2 pages and highlight the most relevant experience first.",
  ];
}

module.exports = { analyzeMatch, rankCandidates, resumeSuggestions };

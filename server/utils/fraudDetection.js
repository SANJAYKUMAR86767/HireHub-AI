/**
 * Fraud / spam job-posting detector.
 * If ANTHROPIC_API_KEY is set, the posting is screened by Claude for a
 * nuanced risk assessment. If not, a deterministic rule-based scanner runs
 * instead — so job creation never breaks and always gets a risk score.
 */

const SPAM_PHRASES = [
  "no experience needed",
  "work from home earn",
  "earn $$$",
  "earn money fast",
  "guaranteed income",
  "quick money",
  "easy money",
  "registration fee",
  "processing fee",
  "pay a fee",
  "send money",
  "investment required",
  "click here",
  "act now",
  "limited seats",
  "wire transfer",
  "gift card",
  "whatsapp only",
  "telegram only",
  "unlimited earning",
  "be your own boss",
  "urgent hiring",
  "100% online no interview",
];

const SUSPICIOUS_CONTACT_PATTERNS = [
  /\bwhatsapp\b/i,
  /\btelegram\b/i,
  /\bt\.me\//i,
  /\bbit\.ly\//i,
  /\btinyurl\.com\//i,
];

function ruleBasedScan({ title = "", description = "", company = "", salaryMin, salaryMax }) {
  const flags = [];
  const text = `${title} ${description}`.toLowerCase();

  SPAM_PHRASES.forEach((phrase) => {
    if (text.includes(phrase)) flags.push(`Suspicious phrase: "${phrase}"`);
  });

  SUSPICIOUS_CONTACT_PATTERNS.forEach((re) => {
    if (re.test(description)) flags.push("Off-platform contact / link detected");
  });

  // excessive punctuation / shouting
  if (/(!!!|\?\?\?)/.test(description)) flags.push("Excessive punctuation (urgency bait)");
  const capsWords = (title.match(/\b[A-Z]{4,}\b/g) || []).length;
  if (capsWords >= 2) flags.push("Excessive capitalization in title");

  // unrealistic / vague salary
  if (salaryMin && salaryMax) {
    if (salaryMax > 0 && salaryMin > 0 && salaryMax / salaryMin >= 10) {
      flags.push("Unrealistic salary range spread");
    }
  }
  if (/\$\s?\d{4,}\s?\/\s?(day|week)/i.test(description)) {
    flags.push("Unrealistically high daily/weekly pay claim");
  }

  // very short / low-effort description
  if (description.trim().length < 40) flags.push("Description too short / low effort");

  // company name missing or generic
  if (!company || /^(n\/?a|company|test)$/i.test(company.trim())) {
    flags.push("Missing or generic company name");
  }

  // asks candidate to pay
  if (/\b(pay|deposit|transfer)\b.{0,20}\b(before|to start|to begin|upfront)\b/i.test(description)) {
    flags.push("Requests upfront payment from candidate");
  }

  let score = Math.min(100, flags.length * 18);
  let level = "low";
  if (score >= 55) level = "high";
  else if (score >= 25) level = "medium";

  return { score, level, flags };
}

async function aiScan(job) {
  const prompt = `You are a fraud/spam detector for a job board. Assess the following job posting and decide if it looks like a scam, spam, or low-quality/fraudulent listing (e.g. pyramid schemes, upfront-fee scams, fake work-from-home offers, unrealistic pay, vague descriptions).

Title: ${job.title}
Company: ${job.company}
Salary range: ${job.salaryMin || "n/a"} - ${job.salaryMax || "n/a"}
Description: ${(job.description || "").slice(0, 2000)}

Return ONLY a JSON object, no other text, in this exact shape:
{"score": <0-100 integer risk score, higher = more suspicious>, "level": "<low|medium|high>", "flags": ["short reason 1", "short reason 2"]}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`AI API error: ${response.status}`);
  const data = await response.json();
  const text = (data.content || []).map((c) => c.text || "").join("");
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

async function assessJobRisk(job) {
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const result = await aiScan(job);
      return {
        riskScore: result.score,
        riskLevel: result.level,
        riskFlags: result.flags || [],
      };
    } catch {
      // fall through to rule-based
    }
  }
  const result = ruleBasedScan(job);
  return { riskScore: result.score, riskLevel: result.level, riskFlags: result.flags };
}

module.exports = { assessJobRisk, ruleBasedScan };

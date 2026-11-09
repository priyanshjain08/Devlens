// aiService.js
//
// Sends source code to the configured AI provider and returns a
// structured code-analysis object. The AI provider is swappable via
// the AI_PROVIDER environment variable — nothing outside this file
// needs to know which provider is in use.

const RESPONSE_SCHEMA_NOTE = `
Respond with ONLY a single JSON object (no markdown fences, no prose
before or after it) matching exactly this shape:

{
  "title": string,                 // short 3-6 word name for what this code does
  "overallScore": number,          // 0-100, holistic quality score
  "categoryScores": {
    "quality": number,             // 0-100
    "security": number,            // 0-100
    "performance": number,         // 0-100
    "maintainability": number,     // 0-100
    "complexity": number           // 0-100 (100 = well-managed complexity, not "very complex")
  },
  "summary": string,               // 2-4 sentence plain-language overview
  "issues": [
    {
      "severity": "critical" | "high" | "medium" | "low" | "info",
      "category": "bug" | "security" | "performance" | "quality" | "maintainability" | "best-practice",
      "title": string,
      "description": string,
      "line": number | null,       // best-guess line number, or null if not localized
      "explanation": string,       // why this matters
      "suggestedFix": string       // concrete suggestion, can include short code
    }
  ],
  "positives": [string],           // things the code does well
  "explanation": {
    "overview": string,            // what the code does, in plain language
    "mainComponents": [string],    // key functions/classes/sections
    "programFlow": string,         // how execution proceeds
    "confusingSections": [string]  // parts a beginner might find unclear, or [] if none
  }
}

Rules:
- If you are not confident an issue is real, phrase it as a potential
  concern in "description"/"explanation" rather than stating it as fact,
  but still classify its severity honestly.
- "issues" may be an empty array if you find nothing notable.
- Every score is an integer from 0 to 100.
- Do not wrap the JSON in markdown code fences.
- Do not include any text outside the JSON object.
`.trim();

function buildSystemPrompt() {
  return [
    'You are the analysis engine behind DevLens, a code review tool used by',
    'developers and students. You perform careful, honest static analysis of',
    'submitted source code: bugs, security issues, performance issues, code',
    'quality, complexity, and maintainability. You explain findings clearly',
    'enough for a student to learn from them. You are conservative about',
    'claiming certainty — when unsure, you say so. You never claim code is',
    'guaranteed secure or bug-free.',
    '',
    RESPONSE_SCHEMA_NOTE
  ].join('\n');
}

function buildUserPrompt(code, language) {
  const numberedCode = code
    .split('\n')
    .map((line, i) => `${i + 1}| ${line}`)
    .join('\n');

  return [
    `Language: ${language}`,
    '',
    'Analyze the following source code. Line numbers are shown as a',
    '"N| " prefix for your reference only — they are not part of the code.',
    '',
    '```',
    numberedCode,
    '```'
  ].join('\n');
}

function extractJson(rawText) {
  let text = rawText.trim();

  // Strip markdown code fences if the model added them anyway.
  if (text.startsWith('```')) {
    text = text.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    // Fall back to grabbing the first {...} block in the response.
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch (err2) {
        // fall through
      }
    }
    throw new Error('AI response was not valid JSON');
  }
}

function clampScore(value) {
  const n = Math.round(Number(value));
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function normalizeResult(parsed) {
  const categoryScores = parsed.categoryScores || {};

  return {
    title: String(parsed.title || 'Untitled analysis').slice(0, 120),
    overallScore: clampScore(parsed.overallScore),
    categoryScores: {
      quality: clampScore(categoryScores.quality),
      security: clampScore(categoryScores.security),
      performance: clampScore(categoryScores.performance),
      maintainability: clampScore(categoryScores.maintainability),
      complexity: clampScore(categoryScores.complexity)
    },
    summary: String(parsed.summary || ''),
    issues: Array.isArray(parsed.issues)
      ? parsed.issues.map((issue) => ({
          severity: ['critical', 'high', 'medium', 'low', 'info'].includes(issue.severity)
            ? issue.severity
            : 'info',
          category: issue.category || 'quality',
          title: String(issue.title || 'Issue'),
          description: String(issue.description || ''),
          line: Number.isInteger(issue.line) ? issue.line : null,
          explanation: String(issue.explanation || ''),
          suggestedFix: String(issue.suggestedFix || '')
        }))
      : [],
    positives: Array.isArray(parsed.positives) ? parsed.positives.map(String) : [],
    explanation: {
      overview: String(parsed?.explanation?.overview || ''),
      mainComponents: Array.isArray(parsed?.explanation?.mainComponents)
        ? parsed.explanation.mainComponents.map(String)
        : [],
      programFlow: String(parsed?.explanation?.programFlow || ''),
      confusingSections: Array.isArray(parsed?.explanation?.confusingSections)
        ? parsed.explanation.confusingSections.map(String)
        : []
    }
  };
}

async function callAnthropic(code, language) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set on the server');
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: buildUserPrompt(code, language) }]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  const textBlock = (data.content || []).find((b) => b.type === 'text');
  if (!textBlock) throw new Error('Anthropic response contained no text content');

  return { rawText: textBlock.text, model };
}

async function callOpenAI(code, language) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set on the server');
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(code, language) }
      ]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenAI response contained no text content');

  return { rawText: text, model };
}

/**
 * Analyze source code and return a normalized, structured result.
 * @param {string} code
 * @param {string} language
 * @returns {Promise<{result: object, provider: string, model: string}>}
 */
async function analyzeCode(code, language) {
  const provider = (process.env.AI_PROVIDER || 'anthropic').toLowerCase();

  let rawText;
  let model;

  if (provider === 'openai') {
    ({ rawText, model } = await callOpenAI(code, language));
  } else {
    ({ rawText, model } = await callAnthropic(code, language));
  }

  const parsed = extractJson(rawText);
  const result = normalizeResult(parsed);

  return { result, provider, model };
}

module.exports = { analyzeCode };

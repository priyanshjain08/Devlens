const express = require('express');
const pool = require('../config/db');
const { analyzeCode } = require('../services/aiService');
const { SUPPORTED_LANGUAGE_IDS } = require('../utils/languages');

const router = express.Router();

const MAX_CODE_LENGTH = Number(process.env.MAX_CODE_LENGTH || 20000);

router.post('/', async (req, res, next) => {
  try {
    const { code, language, clientId } = req.body || {};

    if (typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide some code to analyze.' });
    }
    if (code.length > MAX_CODE_LENGTH) {
      return res
        .status(400)
        .json({ error: `Code is too long. Limit is ${MAX_CODE_LENGTH} characters.` });
    }
    if (!SUPPORTED_LANGUAGE_IDS.includes(language)) {
      return res.status(400).json({ error: 'Unsupported or missing language.' });
    }
    if (typeof clientId !== 'string' || clientId.length < 8) {
      return res.status(400).json({ error: 'Missing client identifier.' });
    }

    const { result, provider, model } = await analyzeCode(code, language);

    const insertResult = await pool.query(
      `INSERT INTO analyses
        (client_id, language, code, code_char_count, title, overall_score,
         category_scores, summary, issues, positives, explanation, ai_provider, ai_model)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING id, created_at`,
      [
        clientId,
        language,
        code,
        code.length,
        result.title,
        result.overallScore,
        JSON.stringify(result.categoryScores),
        result.summary,
        JSON.stringify(result.issues),
        JSON.stringify(result.positives),
        JSON.stringify(result.explanation),
        provider,
        model
      ]
    );

    const row = insertResult.rows[0];

    res.status(201).json({
      id: row.id,
      createdAt: row.created_at,
      language,
      aiProvider: provider,
      aiModel: model,
      ...result
    });
  } catch (err) {
    // AI/network failures shouldn't look like our fault to the client,
    // but should be logged with full detail for the developer.
    if (err.message && (err.message.includes('API error') || err.message.includes('API_KEY'))) {
      err.status = 502;
      err.message = 'The AI analysis service is unavailable right now. Please try again shortly.';
    } else if (err.message && err.message.includes('not valid JSON')) {
      err.status = 502;
      err.message = 'The AI returned an unexpected response. Please try again.';
    }
    next(err);
  }
});

module.exports = router;

const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /api/history?clientId=xxx — lightweight list for the sidebar/history page
router.get('/', async (req, res, next) => {
  try {
    const { clientId } = req.query;
    if (typeof clientId !== 'string' || clientId.length < 8) {
      return res.status(400).json({ error: 'Missing client identifier.' });
    }

    const { rows } = await pool.query(
      `SELECT id, language, title, overall_score, summary, created_at
       FROM analyses
       WHERE client_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [clientId]
    );

    res.json(
      rows.map((r) => ({
        id: r.id,
        language: r.language,
        title: r.title,
        overallScore: r.overall_score,
        summary: r.summary,
        createdAt: r.created_at
      }))
    );
  } catch (err) {
    next(err);
  }
});

// GET /api/history/:id?clientId=xxx — full stored analysis
router.get('/:id', async (req, res, next) => {
  try {
    const { clientId } = req.query;
    const { id } = req.params;
    if (typeof clientId !== 'string' || clientId.length < 8) {
      return res.status(400).json({ error: 'Missing client identifier.' });
    }

    const { rows } = await pool.query(`SELECT * FROM analyses WHERE id = $1 AND client_id = $2`, [
      id,
      clientId
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found.' });
    }

    const r = rows[0];
    res.json({
      id: r.id,
      language: r.language,
      code: r.code,
      title: r.title,
      overallScore: r.overall_score,
      categoryScores: r.category_scores,
      summary: r.summary,
      issues: r.issues,
      positives: r.positives,
      explanation: r.explanation,
      aiProvider: r.ai_provider,
      aiModel: r.ai_model,
      createdAt: r.created_at
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

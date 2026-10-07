require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const analyzeRouter = require('./routes/analyze');
const historyRouter = require('./routes/history');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { SUPPORTED_LANGUAGES } = require('./utils/languages');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
  })
);
app.use(express.json({ limit: '1mb' }));

// The AI call is the expensive/abuse-prone part of this API, so rate-limit it.
const analyzeLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 30),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many analysis requests. Please wait a bit and try again.' }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/languages', (req, res) => {
  res.json(SUPPORTED_LANGUAGES);
});

app.use('/api/analyze', analyzeLimiter, analyzeRouter);
app.use('/api/history', historyRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`DevLens API listening on http://localhost:${PORT}`);
  console.log(`AI provider: ${process.env.AI_PROVIDER || 'anthropic'}`);
});

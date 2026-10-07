// Central error handler. Keeps error shapes consistent for the frontend
// and avoids leaking internals (stack traces, API keys, etc.) to clients.

function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message =
    status === 500 ? 'Something went wrong on the server. Please try again.' : err.message;

  res.status(status).json({ error: message });
}

module.exports = { notFoundHandler, errorHandler };

const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'content-type': 'application/json' },
    ...options
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return body;
}

export function analyzeCode({ code, language, clientId }) {
  return request('/analyze', {
    method: 'POST',
    body: JSON.stringify({ code, language, clientId })
  });
}

export function fetchHistory(clientId) {
  return request(`/history?clientId=${encodeURIComponent(clientId)}`);
}

export function fetchAnalysis(id, clientId) {
  return request(`/history/${id}?clientId=${encodeURIComponent(clientId)}`);
}

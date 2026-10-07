import { useState } from 'react';

const KEY = 'devlens_client_id';

function generateId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `dl-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// DevLens has no login — history is tied to a random id stored in this
// browser's localStorage, so each device keeps its own analysis history.
export default function useClientId() {
  const [clientId] = useState(() => {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(KEY, id);
    }
    return id;
  });

  return clientId;
}

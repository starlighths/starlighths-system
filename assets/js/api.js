// API client for Portal Jekyll frontend
// Uses cookie-based sessions (credentials: 'include') and supports SSE subscription
const ApiClient = (() => {
  const meta = document.querySelector('meta[name="api-base"]');
  const BASE = (meta && meta.content) ? meta.content.replace(/\/\/+$/, '') : 'https://api.example.com';
  const USER_KEY = 'portal_user_info';

  // Session-first approach: prefer cookie/session; keep user info in localStorage for UI state
  function setUser(u) { if (u) localStorage.setItem(USER_KEY, JSON.stringify(u)); else localStorage.removeItem(USER_KEY); }
  function getUser() { const x = localStorage.getItem(USER_KEY); return x ? JSON.parse(x) : null; }

  async function request(path, opts = {}) {
    const url = `${BASE}${path}`;
    const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    const res = await fetch(url, Object.assign({ headers, credentials: 'include' }, opts));
    if (!res.ok) {
      const text = await res.text();
      const err = new Error(`${res.status} ${res.statusText}: ${text}`);
      err.status = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }

  // Auth: expects POST /auth/login to set HttpOnly session cookie and return user info
  async function login(id, password) {
    const body = JSON.stringify({ id, password });
    // try primary endpoint
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body, credentials: 'include'
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} ${res.statusText}: ${text}`);
    }
    const data = await res.json().catch(()=>null);
    if (data && data.user) setUser(data.user);
    return data;
  }

  async function logout() {
    try { await fetch(`${BASE}/auth/logout`, { method: 'POST', credentials: 'include' }); } catch(e){}
    setUser(null);
  }

  // SSE subscription
  function subscribeToItemEvents(onEvent) {
    const url = `${BASE}/items/stream`;
    const ev = new EventSource(url);
    ev.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        onEvent && onEvent(data);
      } catch (err) { console.error('SSE parse error', err); }
    };
    ev.onerror = (err) => { console.warn('SSE error', err); };
    return ev;
  }

  // Validation helpers
  function isTeacherId(id) { return /^[A-Za-z]{2,4}$/.test(id); }
  function isStudentId(id) { return /^s\d{8}$/.test(id); }

  return {
    listItems: () => request('/items'),
    getItem: (id) => request(`/items/${encodeURIComponent(id)}`),
    createItem: (data) => request('/items', { method: 'POST', body: JSON.stringify(data) }),
    updateItem: (id, data) => request(`/items/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteItem: (id) => request(`/items/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    login, logout, getUser, setUser, isTeacherId, isStudentId, subscribeToItemEvents
  };
})();
import React, { useEffect, useState } from 'react';

export default function EcaDashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/eca/activities', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setActivities(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="eca-dashboard">Loading activities…</div>;
  if (error) return <div className="eca-dashboard">Error: {error}</div>;

  return (
    <div className="eca-dashboard">
      <h1>ECA Dashboard</h1>
      <ul>
        {activities.map(a => (
          <li key={a.id}>
            <strong>{a.title}</strong> — {a.category} — {a.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

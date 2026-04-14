import React, { useEffect, useState } from 'react';

export default function EcaDashboard() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch('/eca/activities')
      .then(r => r.json())
      .then(setActivities)
      .catch(console.error);
  }, []);

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

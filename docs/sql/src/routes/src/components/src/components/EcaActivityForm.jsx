import React, { useState } from 'react';

export default function EcaActivityForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('sports');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/eca/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, description, category })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTitle(''); setDescription(''); setCategory('sports');
      if (onCreated) onCreated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="eca-activity-form">
      <label>
        Title:
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </label>

      <label>
        Description:
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </label>

      <label>
        Category:
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="sports">Sports</option>
          <option value="arts">Arts</option>
          <option value="academic">Academic</option>
          <option value="service">Service</option>
        </select>
      </label>

      {error && <div className="form-error">Error: {error}</div>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating…' : 'Create Activity'}
      </button>
    </form>
  );
}

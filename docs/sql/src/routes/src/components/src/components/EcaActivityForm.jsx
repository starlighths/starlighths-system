import React, { useState } from 'react';

export default function EcaActivityForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('sports');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/eca/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, category })
    });
    if (res.ok) {
      const data = await res.json();
      setTitle(''); setDescription('');
      if (onCreated) onCreated(data);
    } else {
      console.error('Failed to create activity');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Title: <input value={title} onChange={e => setTitle(e.target.value)} required /></label>
      <label>Description: <textarea value={description} onChange={e => setDescription(e.target.value)} /></label>
      <label>Category:
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="sports">Sports</option>
          <option value="arts">Arts</option>
          <option value="academic">Academic</option>
          <option value="service">Service</option>
        </select>
      </label>
      <button type="submit">Create Activity</button>
    </form>
  );
}

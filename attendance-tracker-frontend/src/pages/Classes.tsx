import { useEffect, useState } from 'react';
import { classesApi } from '../api/api';
import { Link } from 'react-router-dom';
import './Pages.css';

export default function Classes() {
  const [classes, setClasses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await classesApi.getAll();
      setClasses(data);
    } catch (error) {
      console.error('Failed to load classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await classesApi.create(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      loadClasses();
    } catch (error) {
      console.error('Failed to create class:', error);
      alert('Failed to create class');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      await classesApi.delete(id);
      loadClasses();
    } catch (error) {
      console.error('Failed to delete class:', error);
      alert('Failed to delete class');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Classes</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Class'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Create New Class</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Class Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., CS 101 - Introduction to Programming"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional class description"
                rows={3}
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Class</button>
          </form>
        </div>
      )}

      <div className="table-container">
        {classes.length === 0 ? (
          <p className="empty-state">No classes yet. Create your first class to get started!</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map(cls => (
                <tr key={cls.id}>
                  <td><strong>{cls.name}</strong></td>
                  <td>{cls.description || '-'}</td>
                  <td>{new Date(cls.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <Link to={`/classes/${cls.id}`} className="btn btn-sm">View</Link>
                    <button onClick={() => handleDelete(cls.id)} className="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { eventsApi, classesApi } from '../api/api';
import { Link } from 'react-router-dom';
import './Pages.css';

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    class_id: '',
    name: '',
    event_date: '',
    expires_at: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, classesData] = await Promise.all([
        eventsApi.getAll(),
        classesApi.getAll()
      ]);
      setEvents(eventsData);
      setClasses(classesData);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = {
        class_id: parseInt(formData.class_id),
        name: formData.name,
        event_date: formData.event_date,
        expires_at: formData.expires_at || undefined
      };
      await eventsApi.create(eventData);
      setFormData({ class_id: '', name: '', event_date: '', expires_at: '' });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsApi.delete(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Events</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Event'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Create New Event</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Class *</label>
              <select
                value={formData.class_id}
                onChange={e => setFormData({ ...formData, class_id: e.target.value })}
                required
              >
                <option value="">Select a class...</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Event Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Lecture 5, Lab 3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Event Date & Time *</label>
                <input
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>QR Code Expires At (Optional)</label>
                <input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={e => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Create Event</button>
          </form>
        </div>
      )}

      <div className="table-container">
        {events.length === 0 ? (
          <p className="empty-state">No events yet. Create your first event to get started!</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Class</th>
                <th>Date</th>
                <th>QR Expires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td><strong>{event.name}</strong></td>
                  <td>{event.class_name}</td>
                  <td>{new Date(event.event_date).toLocaleString()}</td>
                  <td>
                    {event.expires_at
                      ? new Date(event.expires_at).toLocaleString()
                      : 'Never'}
                  </td>
                  <td className="actions">
                    <Link to={`/events/${event.id}`} className="btn btn-sm">View QR</Link>
                    <button onClick={() => handleDelete(event.id)} className="btn btn-sm btn-danger">
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

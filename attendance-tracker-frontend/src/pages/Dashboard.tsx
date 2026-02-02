import { useEffect, useState } from 'react';
import { classesApi, eventsApi } from '../api/api';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [classesData, eventsData] = await Promise.all([
        classesApi.getAll(),
        eventsApi.getAll()
      ]);
      setClasses(classesData);
      setRecentEvents(eventsData.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Total Classes</h2>
          <div className="stat-number">{classes.length}</div>
          <Link to="/classes" className="card-link">Manage Classes →</Link>
        </div>

        <div className="dashboard-card">
          <h2>Recent Events</h2>
          <div className="stat-number">{recentEvents.length}</div>
          <Link to="/events" className="card-link">View All Events →</Link>
        </div>

        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/classes/new" className="btn btn-primary">Create Class</Link>
            <Link to="/students/new" className="btn btn-primary">Add Student</Link>
            <Link to="/events/new" className="btn btn-primary">Create Event</Link>
          </div>
        </div>
      </div>

      <div className="recent-events-section">
        <h2>Recent Events</h2>
        {recentEvents.length === 0 ? (
          <p>No events yet. <Link to="/events/new">Create your first event</Link></p>
        ) : (
          <div className="events-list">
            {recentEvents.map(event => (
              <div key={event.id} className="event-item">
                <div>
                  <h3>{event.name}</h3>
                  <p className="event-meta">
                    {event.class_name} • {new Date(event.event_date).toLocaleDateString()}
                  </p>
                </div>
                <Link to={`/events/${event.id}`} className="btn btn-sm">View</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { studentsApi } from '../api/api';
import './Pages.css';

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gtid: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await studentsApi.create(formData);
      setFormData({ first_name: '', last_name: '', email: '', gtid: '' });
      setShowForm(false);
      loadStudents();
    } catch (error) {
      console.error('Failed to create student:', error);
      alert('Failed to create student. Email or GTID might already exist.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await studentsApi.delete(id);
      loadStudents();
    } catch (error) {
      console.error('Failed to delete student:', error);
      alert('Failed to delete student');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Students</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Add New Student</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  placeholder="John"
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="form-group">
                <label>GTID *</label>
                <input
                  type="text"
                  value={formData.gtid}
                  onChange={e => setFormData({ ...formData, gtid: e.target.value })}
                  required
                  placeholder="GT123456"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Add Student</button>
          </form>
        </div>
      )}

      <div className="table-container">
        {students.length === 0 ? (
          <p className="empty-state">No students yet. Add your first student to get started!</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>GTID</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td><strong>{student.first_name} {student.last_name}</strong></td>
                  <td>{student.email}</td>
                  <td>{student.gtid}</td>
                  <td>{new Date(student.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <button onClick={() => handleDelete(student.id)} className="btn btn-sm btn-danger">
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

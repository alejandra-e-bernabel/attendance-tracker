import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { classesApi, studentsApi, eventsApi, attendanceApi } from '../api/api';
import './Pages.css';

export default function ClassDetail() {
  const { id } = useParams();
  const [classData, setClassData] = useState<any>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const classId = parseInt(id!);
      const [cls, enrolled, all, evts, sts] = await Promise.all([
        classesApi.getById(classId),
        classesApi.getStudents(classId),
        studentsApi.getAll(),
        eventsApi.getByClassId(classId),
        attendanceApi.getClassStats(classId)
      ]);
      setClassData(cls);
      setEnrolledStudents(enrolled);
      setAllStudents(all);
      setEvents(evts);
      setStats(sts);
    } catch (error) {
      console.error('Failed to load class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (studentId: number) => {
    try {
      await classesApi.addStudent(parseInt(id!), studentId);
      loadData();
      setShowAddStudent(false);
    } catch (error) {
      console.error('Failed to add student:', error);
      alert('Failed to add student');
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!confirm('Remove this student from the class?')) return;
    try {
      await classesApi.removeStudent(parseInt(id!), studentId);
      loadData();
    } catch (error) {
      console.error('Failed to remove student:', error);
      alert('Failed to remove student');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!classData) return <div className="error">Class not found</div>;

  const unenrolledStudents = allStudents.filter(
    s => !enrolledStudents.some(es => es.id === s.id)
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>{classData.name}</h1>
          {classData.description && <p className="subtitle">{classData.description}</p>}
        </div>
      </div>

      <div className="section">
        <h2>Attendance Statistics</h2>
        {stats.length === 0 ? (
          <p>No students enrolled yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>GTID</th>
                <th>Events Attended</th>
                <th>Total Events</th>
                <th>Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat: any) => {
                const rate = stat.total_events > 0
                  ? ((stat.events_attended / stat.total_events) * 100).toFixed(1)
                  : '0';
                return (
                  <tr key={stat.id}>
                    <td><strong>{stat.first_name} {stat.last_name}</strong></td>
                    <td>{stat.email}</td>
                    <td>{stat.gtid}</td>
                    <td>{stat.events_attended}</td>
                    <td>{stat.total_events}</td>
                    <td>
                      <span className={`badge ${parseFloat(rate) >= 75 ? 'badge-success' : 'badge-warning'}`}>
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Enrolled Students ({enrolledStudents.length})</h2>
          <button className="btn btn-primary" onClick={() => setShowAddStudent(!showAddStudent)}>
            {showAddStudent ? 'Cancel' : 'Add Student'}
          </button>
        </div>

        {showAddStudent && unenrolledStudents.length > 0 && (
          <div className="student-select">
            <select onChange={e => handleAddStudent(parseInt(e.target.value))} defaultValue="">
              <option value="" disabled>Select a student to add...</option>
              {unenrolledStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name} ({student.gtid})
                </option>
              ))}
            </select>
          </div>
        )}

        {showAddStudent && unenrolledStudents.length === 0 && (
          <p>All students are already enrolled in this class.</p>
        )}

        <div className="students-grid">
          {enrolledStudents.map(student => (
            <div key={student.id} className="student-card">
              <div>
                <h3>{student.first_name} {student.last_name}</h3>
                <p>{student.email}</p>
                <p className="gtid">{student.gtid}</p>
              </div>
              <button
                onClick={() => handleRemoveStudent(student.id)}
                className="btn btn-sm btn-danger"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Events ({events.length})</h2>
        {events.length === 0 ? (
          <p>No events for this class yet.</p>
        ) : (
          <div className="events-list">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div>
                  <h3>{event.name}</h3>
                  <p>{new Date(event.event_date).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

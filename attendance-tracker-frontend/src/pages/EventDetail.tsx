import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { eventsApi, attendanceApi } from '../api/api';
import './Pages.css';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const eventId = parseInt(id!);
      const [eventData, qr, att] = await Promise.all([
        eventsApi.getById(eventId),
        eventsApi.getQrCode(eventId),
        attendanceApi.getByEvent(eventId)
      ]);
      setEvent(eventData);
      setQrData(qr);
      setAttendance(att);
    } catch (error) {
      console.error('Failed to load event data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!event) return <div className="error">Event not found</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>{event.name}</h1>
          <p className="subtitle">{event.class_name} • {new Date(event.event_date).toLocaleString()}</p>
        </div>
      </div>

      <div className="event-detail-grid">
        <div className="qr-section">
          <div className="qr-card">
            <h2>QR Code for Check-In</h2>
            {qrData && (
              <>
                <div className="qr-code-display">
                  <img src={qrData.qr_code} alt="QR Code" />
                </div>
                <p className="qr-token">Token: {qrData.qr_token}</p>
                {event.expires_at && (
                  <p className="qr-expires">
                    Expires: {new Date(event.expires_at).toLocaleString()}
                  </p>
                )}
                <p className="qr-instructions">
                  Students can scan this QR code to check in to this event.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="attendance-section">
          <h2>Attendance ({attendance.length})</h2>
          {attendance.length === 0 ? (
            <p className="empty-state">No check-ins yet.</p>
          ) : (
            <div className="attendance-list">
              {attendance.map((record: any) => (
                <div key={record.id} className="attendance-card">
                  <div>
                    <h3>{record.student_first_name} {record.student_last_name}</h3>
                    <p>{record.student_email}</p>
                    <p className="gtid">{record.student_gtid}</p>
                  </div>
                  <div className="check-in-time">
                    {new Date(record.check_in_time).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

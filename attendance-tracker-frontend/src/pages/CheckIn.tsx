import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { attendanceApi, studentsApi } from '../api/api';
import './Pages.css';

export default function CheckIn() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [manualToken, setManualToken] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (scannerActive && selectedStudent) {
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: 250 },
        false
      );

      scanner.render(
        (decodedText) => {
          handleCheckIn(decodedText);
          scanner?.clear();
          setScannerActive(false);
        },
        () => {
          // Ignore scanning errors
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [scannerActive, selectedStudent]);

  const loadStudents = async () => {
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  const handleCheckIn = async (qrToken: string) => {
    if (!selectedStudent) {
      setMessage({ type: 'error', text: 'Please select a student first' });
      return;
    }

    try {
      const result = await attendanceApi.checkIn({
        qr_token: qrToken,
        student_id: parseInt(selectedStudent)
      });

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({
          type: 'success',
          text: `Successfully checked in to ${result.event_name}!`
        });
        setManualToken('');
      }
    } catch (error: any) {
      const errorMsg = error?.error || 'Failed to check in. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    }

    setTimeout(() => setMessage(null), 5000);
  };

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualToken.trim()) {
      handleCheckIn(manualToken.trim());
    }
  };

  return (
    <div className="page-container">
      <h1>Student Check-In</h1>

      <div className="checkin-container">
        <div className="form-card">
          <h2>Select Student</h2>
          <div className="form-group">
            <label>Student *</label>
            <select
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              required
            >
              <option value="">Choose your name...</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name} ({student.gtid})
                </option>
              ))}
            </select>
          </div>

          {message && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          {selectedStudent && (
            <>
              <div className="checkin-methods">
                <h3>Method 1: Scan QR Code</h3>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setScannerActive(!scannerActive)}
                >
                  {scannerActive ? 'Stop Scanner' : 'Start QR Scanner'}
                </button>

                {scannerActive && (
                  <div id="qr-reader" style={{ marginTop: '1rem' }}></div>
                )}

                <h3 style={{ marginTop: '2rem' }}>Method 2: Enter Code Manually</h3>
                <form onSubmit={handleManualCheckIn}>
                  <div className="form-group">
                    <input
                      type="text"
                      value={manualToken}
                      onChange={e => setManualToken(e.target.value)}
                      placeholder="Enter QR token manually"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Check In
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

        <div className="checkin-info">
          <h2>How to Check In</h2>
          <ol>
            <li>Select your name from the dropdown above</li>
            <li>Either:
              <ul>
                <li>Click "Start QR Scanner" and scan the QR code displayed by your professor</li>
                <li>Or manually enter the QR token if the camera is not available</li>
              </ul>
            </li>
            <li>You'll see a confirmation message when check-in is successful</li>
          </ol>

          <div className="info-box">
            <h3>Need Help?</h3>
            <p>If you don't see your name in the list, contact your professor to be added to the class.</p>
            <p>Make sure to check in during class time as QR codes may expire.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

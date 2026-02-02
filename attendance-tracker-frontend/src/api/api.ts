const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:3001/api';

// Classes API
export const classesApi = {
  getAll: () => fetch(`${API_BASE_URL}/classes`).then(res => res.json()),
  getById: (id: number) => fetch(`${API_BASE_URL}/classes/${id}`).then(res => res.json()),
  create: (data: { name: string; description?: string }) =>
    fetch(`${API_BASE_URL}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  update: (id: number, data: { name: string; description?: string }) =>
    fetch(`${API_BASE_URL}/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  delete: (id: number) =>
    fetch(`${API_BASE_URL}/classes/${id}`, { method: 'DELETE' }).then(res => res.json()),
  getStudents: (id: number) =>
    fetch(`${API_BASE_URL}/classes/${id}/students`).then(res => res.json()),
  addStudent: (classId: number, studentId: number) =>
    fetch(`${API_BASE_URL}/classes/${classId}/students/${studentId}`, {
      method: 'POST'
    }).then(res => res.json()),
  removeStudent: (classId: number, studentId: number) =>
    fetch(`${API_BASE_URL}/classes/${classId}/students/${studentId}`, {
      method: 'DELETE'
    }).then(res => res.json())
};

// Students API
export const studentsApi = {
  getAll: () => fetch(`${API_BASE_URL}/students`).then(res => res.json()),
  getById: (id: number) => fetch(`${API_BASE_URL}/students/${id}`).then(res => res.json()),
  create: (data: { first_name: string; last_name: string; email: string; gtid: string }) =>
    fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  update: (id: number, data: { first_name: string; last_name: string; email: string; gtid: string }) =>
    fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  delete: (id: number) =>
    fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' }).then(res => res.json())
};

// Events API
export const eventsApi = {
  getAll: () => fetch(`${API_BASE_URL}/events`).then(res => res.json()),
  getById: (id: number) => fetch(`${API_BASE_URL}/events/${id}`).then(res => res.json()),
  getByClassId: (classId: number) =>
    fetch(`${API_BASE_URL}/events/class/${classId}`).then(res => res.json()),
  create: (data: { class_id: number; name: string; event_date: string; expires_at?: string }) =>
    fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  update: (id: number, data: { name: string; event_date: string; expires_at?: string }) =>
    fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  delete: (id: number) =>
    fetch(`${API_BASE_URL}/events/${id}`, { method: 'DELETE' }).then(res => res.json()),
  getQrCode: (id: number) =>
    fetch(`${API_BASE_URL}/events/${id}/qr`).then(res => res.json())
};

// Attendance API
export const attendanceApi = {
  checkIn: (data: { qr_token: string; student_id: number }) =>
    fetch(`${API_BASE_URL}/attendance/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
  getByEvent: (eventId: number) =>
    fetch(`${API_BASE_URL}/attendance/event/${eventId}`).then(res => res.json()),
  getByStudent: (studentId: number) =>
    fetch(`${API_BASE_URL}/attendance/student/${studentId}`).then(res => res.json()),
  getClassStats: (classId: number) =>
    fetch(`${API_BASE_URL}/attendance/class/${classId}/stats`).then(res => res.json())
};

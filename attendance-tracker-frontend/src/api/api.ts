const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function for authenticated fetch
const authFetch = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }).then(res => res.json());
};

// Classes API
export const classesApi = {
  getAll: () => authFetch(`${API_BASE_URL}/classes`),
  getById: (id: number) => authFetch(`${API_BASE_URL}/classes/${id}`),
  create: (data: { name: string; description?: string }) =>
    authFetch(`${API_BASE_URL}/classes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }),
  update: (id: number, data: { name: string; description?: string }) =>
    authFetch(`${API_BASE_URL}/classes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }),
  delete: (id: number) =>
    authFetch(`${API_BASE_URL}/classes/${id}`, { method: 'DELETE' }),
  getStudents: (id: number) =>
    authFetch(`${API_BASE_URL}/classes/${id}/students`),
  addStudent: (classId: number, studentId: number) =>
    authFetch(`${API_BASE_URL}/classes/${classId}/students/${studentId}`, {
      method: 'POST'
    }),
  removeStudent: (classId: number, studentId: number) =>
    authFetch(`${API_BASE_URL}/classes/${classId}/students/${studentId}`, {
      method: 'DELETE'
    })
};

// Students API
export const studentsApi = {
  getAll: () => authFetch(`${API_BASE_URL}/students`),
  getById: (id: number) => authFetch(`${API_BASE_URL}/students/${id}`),
  create: (data: { first_name: string; last_name: string; email: string; gtid: string }) =>
    authFetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }),
  update: (id: number, data: { first_name: string; last_name: string; email: string; gtid: string }) =>
    authFetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }),
  delete: (id: number) =>
    authFetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' })
};

// Events API
export const eventsApi = {
  getAll: () => authFetch(`${API_BASE_URL}/events`),
  getById: (id: number) => authFetch(`${API_BASE_URL}/events/${id}`),
  getByClassId: (classId: number) =>
    authFetch(`${API_BASE_URL}/events/class/${classId}`),
  create: (data: { class_id: number; name: string; event_date: string; expires_at?: string }) =>
    authFetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }),
  update: (id: number, data: { name: string; event_date: string; expires_at?: string }) =>
    authFetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }),
  delete: (id: number) =>
    authFetch(`${API_BASE_URL}/events/${id}`, { method: 'DELETE' }),
  getQrCode: (id: number) =>
    authFetch(`${API_BASE_URL}/events/${id}/qr`)
};

// Attendance API
export const attendanceApi = {
  checkIn: (data: { qr_token: string; student_id: number }) =>
    authFetch(`${API_BASE_URL}/attendance/checkin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }),
  getByEvent: (eventId: number) =>
    authFetch(`${API_BASE_URL}/attendance/event/${eventId}`),
  getByStudent: (studentId: number) =>
    authFetch(`${API_BASE_URL}/attendance/student/${studentId}`),
  getClassStats: (classId: number) =>
    authFetch(`${API_BASE_URL}/attendance/class/${classId}/stats`)
};

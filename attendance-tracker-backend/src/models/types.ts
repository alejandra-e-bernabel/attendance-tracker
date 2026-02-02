export interface Class {
  id?: number;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Student {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  gtid: string;
  created_at?: string;
}

export interface Event {
  id?: number;
  class_id: number;
  name: string;
  event_date: string;
  qr_token?: string;
  expires_at?: string;
  created_at?: string;
}

export interface Attendance {
  id?: number;
  event_id: number;
  student_id: number;
  check_in_time?: string;
}

export interface ClassStudent {
  class_id: number;
  student_id: number;
  enrolled_at?: string;
}

export interface AttendanceRecord extends Attendance {
  student_first_name: string;
  student_last_name: string;
  student_email: string;
  student_gtid: string;
}

export interface EventWithClass extends Event {
  class_name: string;
}

export type UserRole = 'student' | 'teacher' | 'admin' | 'parent' | 'observer';

export interface User {
  uid: number;
  display_name: string;
  short_display_name: string;
  email: string;
  primary_email?: string;
  school_id?: number;
  role: UserRole;
  created?: number;
  updated?: number;
}

export interface ListUsersParams {
  section_id?: number | string;
  course_id?: number | string;
  limit?: number;
  offset?: number;
}

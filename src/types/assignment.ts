export interface Assignment {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  points?: number;
  due_date?: number;
  due_date_abs?: number;
  created?: number;
  updated?: number;
}

export interface ListAssignmentsParams {
  course_id?: number | string;
  section_id?: number | string;
  limit?: number;
  offset?: number;
}

export interface CreateAssignmentInput {
  title: string;
  description?: string;
  points?: number;
  due_date?: number;
  due_date_abs?: number;
}

export interface UpdateAssignmentInput {
  title?: string;
  description?: string;
  points?: number;
  due_date?: number;
  due_date_abs?: number;
}

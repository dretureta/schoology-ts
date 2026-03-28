export interface Submission {
  id: number;
  assignment_id: number;
  user_id: number;
  submitted?: number;
  submitted_date?: number;
  status?: 'draft' | 'submitted' | 'graded';
  grade_id?: number;
  created?: number;
  updated?: number;
}

export interface ListSubmissionsParams {
  assignment_id?: number | string;
  course_id?: number | string;
  user_id?: number | string;
  limit?: number;
  offset?: number;
}

export interface CreateSubmissionInput {
  assignment_id: number | string;
  user_id?: number | string;
  submitted_date?: number;
}

export interface UpdateSubmissionInput {
  submitted_date?: number;
}

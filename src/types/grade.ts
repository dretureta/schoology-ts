export interface Grade {
  id: number;
  assignment_id: number;
  user_id: number;
  points?: number;
  percentage?: number;
  letter_grade?: string;
  comment?: string;
  created?: number;
  updated?: number;
}

export interface ListGradesParams {
  assignment_id?: number | string;
  course_id?: number | string;
  section_id?: number | string;
  user_id?: number | string;
  limit?: number;
  offset?: number;
}

export interface CreateGradeInput {
  assignment_id: number | string;
  user_id: number | string;
  points?: number;
  letter_grade?: string;
  comment?: string;
}

export interface UpdateGradeInput {
  points?: number;
  letter_grade?: string;
  comment?: string;
}

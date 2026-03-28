export interface Course {
  id: number;
  title: string;
  description?: string;
  code?: string;
  section_ids?: number[];
  admin_ids?: number[];
  created?: number;
  updated?: number;
}

export interface ListCoursesParams {
  department_id?: number | string;
  limit?: number;
  offset?: number;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
  code?: string;
  section_ids?: number[];
  admin_ids?: number[];
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  code?: string;
}

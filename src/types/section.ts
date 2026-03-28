export interface Section {
  id: number;
  course_id: number;
  name: string;
  code?: string;
  access_code?: string;
  created?: number;
  updated?: number;
}

export interface ListSectionsParams {
  course_id?: number | string;
  limit?: number;
  offset?: number;
}

export interface CreateSectionInput {
  course_id: number | string;
  name: string;
  code?: string;
  access_code?: string;
}

export interface UpdateSectionInput {
  name?: string;
  code?: string;
}

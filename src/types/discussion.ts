export interface Discussion {
  id: number;
  section_id: number;
  title: string;
  body?: string;
  author_id?: number;
  created?: number;
  updated?: number;
}

export interface ListDiscussionsParams {
  section_id?: number | string;
  limit?: number;
  offset?: number;
}

export interface CreateDiscussionInput {
  title: string;
  body?: string;
}

export interface UpdateDiscussionInput {
  title?: string;
  body?: string;
}

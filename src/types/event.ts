export interface Event {
  id: number;
  title: string;
  description?: string;
  all_day?: boolean;
  start_date?: number;
  end_date?: number;
  course_id?: number;
  section_id?: number;
  created?: number;
  updated?: number;
}

export interface ListEventsParams {
  course_id?: number | string;
  section_id?: number | string;
  user_id?: number | string;
  limit?: number;
  offset?: number;
}

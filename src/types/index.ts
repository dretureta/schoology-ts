export interface SchoologyListResponse<T> {
  data: T[];
  links: {
    next?: string;
    prev?: string;
  };
  total?: number;
}

export interface SchoologyLinks {
  next?: string;
  prev?: string;
}

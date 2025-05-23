export type FetchResult<T> = {
  status: number | null;
  message: string | null;
  error: string | null;
  data: T | null;
};

export type ApiResponse<T> = {
  message: string;
  data: T;
  error?: string;
};

export type PaginatedApiResponse<T> = {
  message: string;
  pagination: Pagination;
  data: T;
  error?: string;
};

export type Pagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

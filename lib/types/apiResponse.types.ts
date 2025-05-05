export type FetchResult<T> = {
  data: T | null;
  error: string | null;
  status: number | null;
};

export type ApiResponse<T> = {
  message: string;
  data: T;
};

export type PaginatedApiResponse<T> = {
  message: string;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  data: T;
};

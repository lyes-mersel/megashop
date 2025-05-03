export type ApiResponse<T> = {
  message: string;
  data: T;
};

export type PaginatedApiResponse<T> = {
  message: string;
  data: T;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};

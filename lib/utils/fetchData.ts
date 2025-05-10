import {
  ApiResponse,
  FetchResult,
  PaginatedApiResponse,
} from "@/lib/types/apiResponse.types";

// This function fetches data from an API and returns a structured response
export const fetchDataFromAPI = async <T>(
  url: string,
  options?: RequestInit
): Promise<FetchResult<T>> => {
  try {
    const res = await fetch(url, options);
    const status = res.status;
    const json: ApiResponse<T> = await res.json();

    if (!res.ok) {
      return {
        status,
        message: null,
        error: `${
          json.message || json.error || res.statusText
        } (Error ${status})`,
        data: null,
      };
    }

    return {
      status,
      message: json.message,
      error: null,
      data: json.data,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      status: null,
      message: null,
      error: `Network error: ${errorMessage}`,
      data: null,
    };
  }
};

// This function fetches paginated data from an API and returns a structured response
export const fetchPaginatedDataFromAPI = async <T>(
  url: string,
  options?: RequestInit
): Promise<FetchResult<PaginatedApiResponse<T>>> => {
  try {
    const res = await fetch(url, options);
    const status = res.status;
    const json: PaginatedApiResponse<T> = await res.json();

    if (!res.ok) {
      return {
        status,
        message: null,
        data: null,
        error: `${
          json.message || json.error || res.statusText
        } (Error ${status})`,
      };
    }

    return {
      status,
      message: json.message,
      error: null,
      data: json,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      status: null,
      message: null,
      error: `Network error: ${errorMessage}`,
      data: null,
    };
  }
};

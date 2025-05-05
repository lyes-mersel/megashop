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

    if (!res.ok) {
      const errorText = await res.text();
      return {
        data: null,
        error: `Error ${status}: ${errorText || res.statusText}`,
        status,
      };
    }

    const json: ApiResponse<T> = await res.json();
    return {
      data: json.data,
      error: null,
      status,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      data: null,
      error: `Network error: ${errorMessage}`,
      status: null,
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

    if (!res.ok) {
      const errorText = await res.text();
      return {
        data: null,
        error: `Error ${status}: ${errorText || res.statusText}`,
        status,
      };
    }

    const json: PaginatedApiResponse<T> = await res.json();
    return {
      data: json,
      error: null,
      status,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      data: null,
      error: `Network error: ${errorMessage}`,
      status: null,
    };
  }
};

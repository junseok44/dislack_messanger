import { ERROR_MESSAGES } from "@/constants/errorMessages";

const BASE_URL = process.env.REACT_APP_API_URL;

export class ApiError extends Error {
  statusCode: number;
  errorCode: number;

  constructor(statusCode: number, errorCode: number, msg?: string) {
    const message =
      msg ||
      ERROR_MESSAGES[errorCode] ||
      `알 수 없는 오류가 발생했습니다. 에러코드: ${errorCode} 스테이터스코드: ${statusCode}`;

    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

const fetcher = async (
  url: string,
  method: string,
  params?: any,
  body?: any
) => {
  try {
    const response = await fetch(BASE_URL + url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      ...(body && { body: JSON.stringify(body) }),
      credentials: "include",
    });

    if (!response.ok) {
      let errorResponse;
      try {
        errorResponse = await response.json();
      } catch (e) {
        throw new ApiError(response.status, 1010);
      }
      throw new ApiError(response.status, errorResponse.errorCode || 1010);
    }

    return response.json();
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    } else {
      if (err instanceof Error) {
        throw new ApiError(500, 1010, err.message);
      }
      throw new ApiError(500, 1010);
    }
  }
};

export const api = {
  get: (url: string, params: any) => fetcher(url, "GET", params),
  post: (url: string, body: any) => fetcher(url, "POST", null, body),
  patch: (url: string, body: any) => fetcher(url, "PATCH", null, body),
  delete: (url: string) => fetcher(url, "DELETE"),
};

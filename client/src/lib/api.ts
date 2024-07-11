import { ERROR_MESSAGES } from "@/constants/errorMessages";
import axios, { AxiosError } from "axios";

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
    const response = await axios({
      url: BASE_URL + url,
      method,
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...params,
      withCredentials: true,
    });

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        // 서버가 응답했지만, 상태 코드가 200번대가 아닌 경우
        let errorResponse = err.response.data;
        throw new ApiError(
          err.response.status,
          errorResponse.errorCode || 1010
        );
      } else if (err.request) {
        throw new ApiError(500, 1010, "서버로부터 응답이 없습니다.");
      } else {
        throw new ApiError(500, 1010, err.message);
      }
    } else {
      throw new ApiError(500, 1010, "예상치못한 에러가 발생했습니다.");
    }
  }
};

export const api = {
  get: (url: string, params: any) => fetcher(url, "GET", params),
  post: (url: string, body: any) => fetcher(url, "POST", null, body),
  patch: (url: string, body: any) => fetcher(url, "PATCH", null, body),
  delete: (url: string) => fetcher(url, "DELETE"),
};

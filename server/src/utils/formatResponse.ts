import { ERROR_CODES } from "../constants/errorCode";

export const formatErrorResponse = (
  errorCode: (typeof ERROR_CODES)[keyof typeof ERROR_CODES] = 1003,
  errorMessage: string = "서버 내부 오류입니다."
) => {
  return {
    errorCode,
    errorMessage,
  };
};

export const formatSuccessResponse = (
  message: string = "성공적으로 처리되었습니다.",
  payload: any = null
) => {
  return {
    message,
    ...(payload && {
      data: payload,
    }),
  };
};


import { StatusCode } from "../typescript/type";
import { HttpError } from "../typescript/classes";

const messageList: Record<StatusCode, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  500: "Server error",
};

const HttpExeption = (status: StatusCode, message?: string): HttpError => {
  const errorMessage = message || messageList[status] || "Unknown error";
  const error = new HttpError(errorMessage);
  error.status = status;
  return error;
};

export default HttpExeption;

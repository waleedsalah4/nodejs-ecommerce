class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; //errors that i can predict

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;

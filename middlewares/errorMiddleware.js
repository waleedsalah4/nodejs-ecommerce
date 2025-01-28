import ApiError from "../utils/apiError.js";

const sendErrorDev = (err, req, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    errorType: "error",
  });

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    // Operational, trusted error: send message to the client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        statusCode: err.statusCode,
        message: err.message,
        errorType: "error",
      });
      // Programming or other unknown error: don't leak error details
    }

    // 1) Log the error to the console
    console.error("Error", err);

    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
      errorType: "error",
    });
  }
};

const handleJWTError = () =>
  new ApiError("Invalid token! Please log in again.", 401);
const handleJWTExpiredError = () =>
  new ApiError("Your token has expired! please log in again.", 401);

export const globalError = (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "JsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleJWTExpiredError();
    sendErrorProd(err, req, res);
  }
};

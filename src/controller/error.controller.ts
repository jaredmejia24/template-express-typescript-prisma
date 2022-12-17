import { ErrorRequestHandler } from "express";
import * as dotenv from "dotenv";

import { AppError } from "../utils/appError";

dotenv.config();

const sendErrorDev: ErrorRequestHandler = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
  });
};

const sendErrorProd: ErrorRequestHandler = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message || "Something went wrong!",
  });
};

const tokenExpiredError = () => {
  return new AppError("Session expired", 403);
};

const tokenInvalidSignatureError = () => {
  return new AppError("Session invalid", 403);
};

const UniqueConstraintError = () => {
  return new AppError("Email already exists", 400);
};

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  // Set default values for original error obj
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "fail";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res, next);
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };
    err.message = error.message || "Something went wrong!";

    if (error.name === "TokenExpiredError") err = tokenExpiredError();
    else if (error.name === "JsonWebTokenError")
      err = tokenInvalidSignatureError();
    else if (error.code === "P2002") err = UniqueConstraintError();
    sendErrorProd(err, req, res, next);
  }
};

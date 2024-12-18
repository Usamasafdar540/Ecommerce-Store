const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;

  let response = {
    title: "Unknown Error",
    message: err.message,
    stackTrace: err.stack,
  };

  switch (statusCode) {
    case 400:
      if (
        err instanceof multer.MulterError && 
        err.code === "LIMIT_UNEXPECTED_FILE"
      ) {
        response.title = "Unexpected Field";
      } else {
        response.title = "Validation Failed";
      }
      break;
    case 404:
      response.title = "Not Found";
      break;
    case 409:
      response.title = "Already Exists";
      break;
    case 500:
      response.title = "Server Error";
      break;
    case 11000:
      response.title = "Already Exists in Database";
      break;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;

const errorCodes = {
  badRequest: 400,
  notFound: 404,
  validationError: 400,
  ValidationError: 400,
  authError: 401,
};

export const notFound = (request, response, next) => {
  response.status(404).json({
    error: {
      status: 404,
      name: 'NotFound',
      message: 'Not Found',
    },
  });
  next();
};

export const errorHandler = (error, request, response, next) => {
  const status = errorCodes[error.name] || error.status || 500;

  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  response.status(status).json({
    error: {
      status,
      name: error.name || 'Error',
      message: error.message || 'Error',
    },
  });
  next();
};

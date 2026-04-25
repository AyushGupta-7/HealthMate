// const errorHandler = (err, req, res, next) => {
//   let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   let message = err.message;

//   // Mongoose duplicate key
//   if (err.code === 11000) {
//     statusCode = 400;
//     message = 'Duplicate field value entered';
//   }

//   // Mongoose validation error
//   if (err.name === 'ValidationError') {
//     statusCode = 400;
//     message = Object.values(err.errors).map(val => val.message).join(', ');
//   }

//   // Mongoose Cast error (invalid ObjectId)
//   if (err.name === 'CastError') {
//     statusCode = 404;
//     message = 'Resource not found';
//   }

//   res.status(statusCode).json({
//     success: false,
//     message,
//     stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//   });
// };

// export default errorHandler;

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
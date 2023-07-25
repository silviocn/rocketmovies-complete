// App error is used to threat all errors from the client side, when the client gives a mistaken or invalid information

class AppError {
  message;
  statusCode;

  // every class has a constructor method, which is loaded when the class is used
  // if status code is not informed, default is 400 (Bad Request)
  constructor(message, statusCode = 400) { // every time someone uses this class, you will return message and status code
    this.message = message;
    this.statusCode = statusCode;
  } 
}

module.exports = AppError;
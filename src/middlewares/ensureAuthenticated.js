const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization; // accessing just the user token inside 'authorization'

  if(!authHeader){
    throw new AppError("JWT token not given", 401);
  }

  const [, token] = authHeader.split(" "); // divides the header in two parts, separated where the is a space
  // and the second part it's called token

  try { // to verify if it's an invalid token
    const {sub: user_id } = verify(token, authConfig.jwt.secret); // sub is property to create a 'nickname'

    request.user = {
      id: Number(user_id),
    };

    return next(); // so if everything it's ok, go to next function and here the middleware ends

  } catch {
    throw new AppError("Invalid JWT token", 401);
  };

}

module.exports = ensureAuthenticated;
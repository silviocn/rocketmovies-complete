const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs"); // importing to compare password encrypted
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken"); // importing sign method from jsonwebtoken

class SessionsController {
  async create (request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first();
    //using knex to access user table from database and locate the email from the request. first is to
    // always get the first email found, and remember the pattern is to have just one email for each user

    if(!user){
      throw new AppError("Incorrect e-mail or password", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if(!passwordMatched){
      throw new AppError("Incorrect e-mail or password", 401); // using same message to increase difficulty 
      // for someone to discover e-mails or passwords 
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, { // where is {} empty you can put payload properties
      subject: String(user.id), // String to transform to text the user id (called parse)
      expiresIn
    })


    return response.json({ user, token });
  }
}

module.exports = SessionsController;
/**
 * index - GET to list many registers
 * show - GET to show one specific register
 * create - POST to create a specific register
 * update - PUT to update a specific register
 * delete - DELETE to remove/delete a specific register
 */

const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    const database = await sqliteConnection();
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]) // the "?" is to save place to [email]

    if (checkUserExists) {
      throw new AppError("E-mail already being used");
    }

    const hashedPassword = await hash(password, 8); // number 8 is the complexity factor (SALT)

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    return response.status(201).json();
    
    /* 
    The lines below are used only didactically, to explain the subject matter and available options
    if (!name){
      throw new AppError ("Name is mandatory")
    }

    response.status(201).json({ name, email, password })
    // response.status(201).json({ name, email, password }) it's going to show the status and it's meaning "Created" accordingly to HTTP Codes
  */
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    // const { id } = request.params; it has been changed after creation of ensureAuthenticated and now uses bellow
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if(!user) {
      throw new AppError("Couldn't find user.");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("E-mail already being used.");
    }

    user.name = name ?? user.name; // The double "?" is used to say that if not informed, name will use the user name already taken before
    user.email = email ?? user.email;

    if(password && !old_password) {
      throw new AppError("You must type your old password to change the password");
    }

    if (password && old_password){
      const checkOldPassword = await compare(old_password, user.password); // Use the "user".password because you already have it in db

      if(!checkOldPassword) {
        throw new AppError("The old password doesn't match.")
      }

      user.password = await hash(password, 8);

    }

    await database.run(`
      UPDATE users SET 
      name = ?, 
      email = ?,
      password = ?, 
      updated_at = DATETIME('now') 
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]     
      );

      return response.json();
  }
}

module.exports = UsersController;
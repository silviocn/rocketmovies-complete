const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
  async update (request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;

    const diskStorage = new DiskStorage();

    const user = await knex("users").where({ id: user_id }).first(); // need to put "id:" to search in ID column the user id

    if(!user){
      throw new AppError("Only authenticated users allowed", 401);
    }

    if(user.avatar){
      await diskStorage.deleteFile(user.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFilename);
    user.avatar = filename;

    await knex ("users").update(user).where( {id: user_id});

    return response.json(user);
  }
}

module.exports = UserAvatarController;
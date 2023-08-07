const knex = require("../database/knex");

class TagsController {
  async index(request, response) {
    const user_id = request.user.id;

    const tags = await knex ("tags")
      .where({ user_id })
      .groupBy("name") // used to group tags if there are more than one repeated 

    return response.json(tags);
  }
}

module.exports = TagsController;
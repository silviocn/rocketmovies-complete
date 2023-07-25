const knex = require("../database/knex");

class NotesController {
  async create (request, response){
    const { title, description, tags, links } = request.body;
    const user_id = request.user.id;
    
    const [note_id] = await knex("notes").insert({ // here, it will get the note ID to link with links and tags
      title,
      description,
      user_id
    });
    
    const linksInsert = links.map(link => { // create the link/url with the note id already created
      return {
        note_id,
        url: link, // changing from link to URL
      }
    });
    await knex("links").insert(linksInsert); // insert the info in linksInsert into table, in field link
    
    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    });

    await knex("tags").insert(tagsInsert);

    return response.json();
  }

  async show(request, response){ // to show one specific note according to the id typed by user
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first(); // show only the first note with id typed
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");
    const links = await knex("links").where({ note_id: id }).orderBy("created_at");

    return response.json({
      ...note, // returns (shows) all the info of this note
      tags,
      links
    });
  }

  async delete(request, response){
    const { id } = request.params;

    await knex("notes").where({ id }).delete();

    return response.json();
    
  }

  async index(request, response){
    const { title, tags } = request.query;

    const user_id = request.user.id;

    let notes;
    
    if(tags) {
      const filterTags = tags.split(',').map(tag => tag.trim());
      
      notes = await knex("tags").whereIn("name", filterTags) // whereIn is going to search the tags typed in the tags recorded
   
    } else {
      notes = await knex("notes")
      .where({ user_id })
      .whereLike("title", `%${title}%`) // whereLike("title", `%${title}%`) added to make easier the search by user when looking for some word in the title
      .orderBy("title");
    
    }

    const userTags = await knex("tags").where({ user_id });
    const notesWithTags = notes.map( note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      }
    })
    return response.json(notesWithTags);
  }
}
module.exports = NotesController;
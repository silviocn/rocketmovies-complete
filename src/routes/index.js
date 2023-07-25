const { Router } = require("express")

const usersRouter = require("./users.routes");
const notesRouter = require("./notes.routes");
const tagsRouter = require("./tags.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router(); // Here it's explicit which are the routes, just see below (use /users) (2)

routes.use("/users", usersRouter); // If you have to use /users, then go to usersRouter (CTRL + click) (3)
routes.use("/notes", notesRouter);
routes.use("/tags", tagsRouter);
routes.use("/sessions", sessionsRouter);

module.exports = routes;
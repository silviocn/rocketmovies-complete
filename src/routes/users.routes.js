const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UsersController = require("../controllers/UsersController"); // As it is a class, I need to instantiate in the memory using new - see below
const UserAvatarController = require ("../controllers/UserAvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController(); // instantiating
const userAvatarController = new UserAvatarController();

/* function myMiddleware (request, response, next) {
  if (!request.body.isAdmin) { // accessing the info about admin or not
    return response.json({ message: "user unauthorized"});
  }

  next (); // used to show next step after the function, in this case, goes to usersController.create (below)
} */

/* usersRoutes.post("/", (request, response) => { // when you click on usersRouter it comes here to get the info (4)
  const { name, email, password } = request.body
  response.json({ name, email, password })
}) */

// usersRoutes.post("/", usersController.create);
usersRoutes.post("/", /*myMiddleware,*/ usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update); // no need to pass id because you get it from ensureAuthenticated
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update); // patch is used to 
// update one specific info/document 

module.exports = usersRoutes; // exporting document
require("express-async-errors");
// const database = require("./database/sqlite"); - before creating migrations this code would be used, but now uses below on line 3
const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

const cors = require("cors");
const express = require("express"); // importing all express content
const routes = require("./routes") // When you don't make the file explicit, by default it will get index.js

/* app.get("/message/:id/:user", (request, response) => { // the usage of "/" is the address you want to access, in this case, the root of the api
  // const { id, user } = request.params; -> You can use this as it repeats bellow twice, then down there it would be just {id} and {user}

  response.send(`
    The ID number is ${request.params.id}.
    The user is ${request.params.user}
  `) // to see this message you have to go to the browser and type localhost:3333
})

app.get("/users", (request, response) => {
  const { page, limit } = request.query;

  response.send(`
  The page is ${page} and the user is ${limit}
  `)
}) */
migrationsRun();

const app = express(); // initializing express
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes); // It's going to tell the program to use theses routes (click on CTRL + routes to see the routes) (1)

app.use(( error, request, response, next ) => { // always have to use this pattern: error/request/response/next even though not using all

  if (error instanceof AppError) { // this will check if it's an error from the client (some wrong data introduced by user)
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.error(error); // if you get an error when running application, here you can get the error and try to solve it

  return response.status(500).json({ // if not an error from user, then it will return message of server error
    status: "error",
    message: "Internal server error",
  })



});

/* app.post("/users", (request, response) => {
  const { name, email, password } = request.body
  response.json({ name, email, password })
}) */

const PORT = 3333; // telling the express where/how to communicate 
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`)); // Awaiting for requisition
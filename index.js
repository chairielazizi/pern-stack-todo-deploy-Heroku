const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// deploy on heroku
const PORT = process.env.PORT || 5000;
const path = require("path");

// process.env.PORT
// process.env.NODE_ENV => production or undefined

// POINT TO BUILD FOLDER
// point by absolute path
// app.use(express.static(path.join(__dirname, "client/build"))); // serve static from a dir that we specified

// point by relative path
// app.use("/",express.static("client/build"));
app.use(express.static("client/build"));

if (process.env.NODE_ENV === "production") {
  // server static content
  // npm run build -- contain all static content of react
  app.use(express.static(path.join(__dirname, "client/build"))); // serve static from a dir that we specified
}

console.log(__dirname);
console.log(path.join(__dirname, "client/build"));

//middleware
app.use(cors());
app.use(express.json()); // req.body

//ROUTES

// create a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    // console.log(req.body);

    // res.json(newTodo);
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// get All todo
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json(todo.rows[0]);
    // console.log(req.params);
  } catch (error) {
    console.error(error.message);
  }
});

// update  a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    res.json("Todo was updated");
  } catch (error) {
    console.error(error.message);
  }
});

// delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json("Todo was deleted");
  } catch (error) {
    console.error(error.message);
  }
});

// routes that not exist
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});

const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
//in order to create unique user id
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;
//import file where we store notes
const storedNotes = require("./db/db.json");
console.log(storedNotes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);
//get the notes stored and send as response in json
app.get("/api/notes", (req, res) => {
  const notesData = fs.readFileSync("./db/db.json", "utf8");
  let notes = JSON.parse(notesData);
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const notesData = fs.readFileSync("./db/db.json", "utf8");
  const notes = JSON.parse(notesData);

  //generates a new note with unique id
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  //new note is pushed
  notes.push(newNote);

  //update stored notes
  fs.writeFileSync("db/db.json", JSON.stringify(notes));

  //send the new note back as response json
  res.json(newNote);
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
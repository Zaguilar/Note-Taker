const express = require('express');
const path = require('path');
const notes = require('./db/db.json');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// will read the db.json file
app.get('/api/notes', (req, res) => {
  res.json(notes);
});
// will save new not on request body, adding it to json and return new note to client
app.post('/api/notes', (req, res) => {
  req.body.id = notes.length;
  const newNote = req.body;
  notes.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, '/db/db.json'),
    JSON.stringify(notes, null, 2)
  );
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  //remove the appropriate note
  const deleteIndex = req.params.id;
  notes.splice(deleteIndex, 1);

  //assign noteids for deletion
  for(let i = 0; i < notes.length; i++){
    console.log(notes[i]);
    notes[i].id = i;
    console.log(notes[i]);
  }

  fs.writeFileSync(
    path.join(__dirname, '/db/db.json'), 
    JSON.stringify(notes, null, 2)
  );
  //update the db.json file
  res.json(req.body);
});

// routes for html
// returns notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});
// returns index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
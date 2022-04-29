const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');


notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});


notes.get('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((db) => db.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});


notes.delete('/notes/:id', (req, res) => {
  const noteId = req.params.tip_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {

      const result = json.filter((db) => db.id !== noteId);


      writeToFile('./db/db.json', result);

 
      res.json(`Item ${noteId} has been deleted`);
    });
});


notes.post('/notes', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
     title,
     text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

module.exports = notes;

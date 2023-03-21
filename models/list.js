const mongoose = require('mongoose');

const phonebookSchema = new mongoose.Schema({
    name: String,
    phone: String
  });


const Phonebook = mongoose.model('Phonebook', phonebookSchema);

module.exports = Phonebook;
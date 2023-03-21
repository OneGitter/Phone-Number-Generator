const express = require('express');
const path = require('path');
const port = 8000;

const db = require('./config/mongoose');
const PhonebookEntry = require('./models/list');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('assets'));

let arr = [
  {
    name: 'Hello',
    phone: '12345'
  }
];


// Serve HTML form for generating phonebook entries
app.get('/', (req, res) => {
  res.render('index',{
    title: "Phone Number Generator",
    phone_list: arr
});
});

// Generate phonebook entries and store in MongoDB
app.post('/generate', (req, res) => {
  const count = req.body.count;
  PhonebookEntry.find({}).then(entries => {
    const len = entries.length;
    const list = generatePhonebook(count,len);

    PhonebookEntry.insertMany(list)
    .then(() => res.render('index',{
      title: "Phone Number Generator",
      phone_list: list
    }))
    .catch(err => console.error(err));

  })
});

// Retrieve phonebook entries from MongoDB and display them in a table
app.get('/phonebook', (req, res) => {
  PhonebookEntry.find()
    .then(entries => {
      res.render('phonebook',{
        title: 'Phone Book',
        phone_list: entries
      })
    })
    .catch(err => console.error(err));
});

app.post('/delete', (req, res) => {
  PhonebookEntry.deleteMany({})
    .then(() => res.redirect('/phonebook'))
    .catch(err => console.error(err));
});


// Generate random phonebook entries
function generatePhonebook(count,length) {
  const phonebookEntries = [];
  let n = Number(count) + Number(length);
  for (let i = Number(length); i < n; i++) {
    const name = `Number ${i+1}`;
    const phone = `555-${Math.floor(Math.random()*900+100)}-${Math.floor(Math.random()*9000+1000)}`;
    phonebookEntries.push({ name, phone });
  }
  return phonebookEntries;
}


// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));

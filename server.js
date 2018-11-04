const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const notes = require('./routes/api/notes');

const app = express();

const db = require('./config/keys').mongoURI;

mongoose.connect(db)
.then(()=> console.log('MongoDB connected'))
.catch(error => console.log(error))

app.get('/', (req, res) => res.send('hello!!'));

app.use('/api/users', users);
app.use('/api/notes', notes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
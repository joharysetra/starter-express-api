// Use dotenv to read .env vars into Node
require('dotenv').config();
// Imports dependencies and set up http server
const  express = require('express');
const  { urlencoded, json } = require('body-parser');
const  app = express();
const main = require('./routes');
const webhook = require('./routes/api');

// Parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// Parse application/json
app.use(json());

app.use('/',main);
app.use('/api',webhook);

app.listen(process.env.PORT || 3000)
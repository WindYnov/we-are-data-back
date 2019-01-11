const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const opts = {useNewUrlParser: true};
const routes = require('./API/routes/compagniesPath');

const app = express();
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://users:db012345@ds155294.mlab.com:55294/dbwinynov', opts)
    .then(() => console.log("Connection Success"))
    .catch(() => console.log("Connection Error"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes(app);
app.listen(port);

console.log('Your first node api is running on port: ' + port);

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const opts = {useNewUrlParser: true};
const routes = require('./src/routes/company.route');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://user:db012345@ds159624.mlab.com:59624/db_windynov', opts)
    .then(() => console.log("Connection Success"))
    .catch(() => console.log("Connection Error"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes(app);
app.listen(port);

console.log('Your first node api is running on port: ' + port);

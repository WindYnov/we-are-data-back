const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const opts = {useNewUrlParser: true};
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config');

const indexRouter = require('./routes/route_verify_and_auth_companies');
const companiesRouter = require('./routes/route_companies');
const salesRouter = require('./routes/route_sales');
const clientsRouter = require('./routes/route_clients');

const app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI, opts)
	.then(() => console.log("Connection Success"))
	.catch(() => console.log("Connection Error"));

app.use('/', indexRouter);
app.use('/companies', companiesRouter);
app.use('/client', clientsRouter);
app.use('/sale', salesRouter);

module.exports = app;

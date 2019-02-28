const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const opts = {useNewUrlParser: true};

const verify = require('./routes/route_verify_and_auth_companies');
const companies = require('./routes/route_companies');
const sales = require('./routes/route_sales');
const clients = require('./routes/route_clients');

const config = require('./config');

const cors = require('cors');

const app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI, opts)
	.then(() => console.log("Connection Success"))
	.catch(() => console.log("Connection Error"));

app.use('/companies', verify);
app.use('/companies', companies);
app.use('/sales', sales);
app.use('/clients', clients);

app.listen(config.PORT,() => console.log(`Server started on port ${config.PORT}`));
module.exports = app;

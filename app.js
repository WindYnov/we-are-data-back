const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');


const server = restify.createServer();

//Middleware

server.use(restify.plugins.bodyParser());

server.listen(config.PORT, () => {
	mongoose.set('useFindAndModify', false);
	mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true})
		.then(() => console.log("Connect successfully"))
		.catch(() => console.log("Connect failed"));
});

const db = mongoose.connection;

db.on('error', err => console.log(err));
db.once('open', () => {
	require('./routes/route_companies')(server);
	require('./routes/route_verify_and_auth_companies')(server);
	console.log(`Server started on port ${config.PORT}`);
});
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const config = require('../config');
const opts = {useNewUrlParser: true};

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI, opts)
	.then(() => console.log("Connection Success"))
	.catch(() => console.log("Connection Error"));

const clientSchema = new mongoose.Schema({
	idCompany: {
		type: String,
		trim: true,
		required: true
	},
	name: {
		type: String,
		trim: true,
		required: true
	},
	secteur: {
		type: String,
		trim: true,
		required: true
	},
	siret: {
		type: String,
		trim: true,
		required: true
	},
	phone: {
		type: String,
		trim: true,
		required: true
	}
});

clientSchema.plugin(timestamp);

module.exports = mongoose.model('client', clientSchema);
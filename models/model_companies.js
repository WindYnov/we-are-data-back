const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const config = require('../config');
const opts = {useNewUrlParser: true};

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI, opts)
	.then(() => console.log("Connection Success"))
	.catch(() => console.log("Connection Error"));

const companiesSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	firstname: {
		type: String,
		trim: true,
		required: true
	},
	societe: {
		type: String,
		trim: true,
		required: true
	},
	siret: {
		type: String,
		trim: true,
		required: true
	},
	email: {
		type: String,
		trim: true,
		required: true
	},
	phone: {
		type: String,
		trim: true,
		required: true
	},
	password: {
		type: String,
		trim: true
	},
	keepInformed: {
		type: Boolean
	},
	levelup: {
		type: String,
		default: "v1"
	},
	yourToken: {
		type: String,
	}
});

companiesSchema.plugin(timestamp);

module.exports = mongoose.model('companies', companiesSchema);
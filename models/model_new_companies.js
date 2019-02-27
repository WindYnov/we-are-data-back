const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const config = require('../config');
const opts = {useNewUrlParser: true};

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI, opts)
	.then(() => console.log("Connection Success"))
	.catch(() => console.log("Connection Error"));

const new_companySchema = new mongoose.Schema({
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
		trim: true,
		required: true
	},
	keepInformed: {
		type: Boolean
	},
	levelup: {
		type: String,
		default: "v2"
	},
	yourToken: {
		type: String,
	}
});

new_companySchema.plugin(timestamp);

module.exports = mongoose.model('new_company', new_companySchema);
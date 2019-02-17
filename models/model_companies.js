const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

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
const companies = mongoose.model('companies', companiesSchema);
module.exports = companies;
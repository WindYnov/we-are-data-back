const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

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
const new_company = mongoose.model('new_company', new_companySchema);
module.exports = new_company;
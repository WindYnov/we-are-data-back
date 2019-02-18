const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

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
const client = mongoose.model('client', clientSchema);
module.exports = client;
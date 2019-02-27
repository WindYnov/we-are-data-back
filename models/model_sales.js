const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const config = require('../config');
const opts = {useNewUrlParser: true};

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI, opts)
	.then(() => console.log("Connection Success"))
	.catch(() => console.log("Connection Error"));

const salesSchema = new mongoose.Schema({
	idClient: {
		type: String,
		trim: true,
		required: true
	},
	dateFacture: {
		type: date,
		trim: true,
		required: true
	},
	productName: {
		type: String,
		trim: true,
		required: true
	},
	totalHt: {
		type: Number,
		trim: true,
		required: true
	},
	tauxTva: {
		type: Number,
		trim: true,
		required: true
	},
	qteVendue: {
		type: Number,
		trim: true,
		required: true
	},
	productsType: {
		type: String,
		trim: true,
		required: true
	},
	activityArea: {
		type: String,
		trim: true,
		required: true
	}
});

salesSchema.plugin(timestamp);

module.exports = mongoose.model('sales', salesSchema);
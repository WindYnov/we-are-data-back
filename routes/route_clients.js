const errors = require('restify-errors');
const new_company = require('../models/model_new_comapnies');
const client = require('../models/model_clients');

module.exports = server => {
	
	// Get clients
	
	server.get('/clients/all', async (req, res, next) => {
		try {
			const clients = await client.find({});
			res.send({clients});
			next();
		} catch (err) {
			return next(new errors.InvalidContentError(err));
		}
	});
	
	// Get Single client
	
	server.get('/client/:id', async (req, res, next) => {
		try {
			const client = await client.findById(req.params.id);
			res.send(client);
			next();
		} catch (err) {
			return next(new errors.ResourceNotFoundError(`There is no client with your request parameter`));
		}
	});
	
	// Add client
	
	server.post('/client/register', async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			return next(new errors.InvalidContentError("Expects 'application/json'"));
		}
		const {idCompany, name, secteur, siret, phone} = req.body;
		const client = new client({
			idCompany, name, secteur, siret, phone
		});
		try {
			const client = await client.save();
			res.send(client);
			next();
		} catch (err) {
			return next(new errors.InternalError(err.message));
		}
	});
	
	// Update client
	
	server.put('/client/update/:id', async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			return next(new errors.InvalidContentError("Expects 'application/json'"));
		}
		try {
			const yourClient = await client.findById({_id: req.params.id});
			const updateClient = await client.findOneAndUpdate({_id: yourClient._id}, req.body);
			const client = await client.findById(updateClient.id);
			res.send(client);
			next();
		} catch (err) {
			console.log(err);
			return next(new errors.ResourceNotFoundError(`There is no client with your request parameter`));
		}
	});
	
	//Delete Companies
	
	server.del('/client/delete/:id', async (req, res, next) => {
		try {
			const yourClient = await client.findById({_id: req.params.id});
			const deleteClient = await client.findOneAndRemove({_id: yourClient._id});
			res.send(deleteClient);
			return next(`Client deleted successfully`);
		} catch (err) {
			return next(new errors.ResourceNotFoundError(`There is no client for deleted with your request parameter`));
		}
	});
};
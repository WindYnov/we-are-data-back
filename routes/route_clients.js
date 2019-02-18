const errors = require('restify-errors');
const new_company = require('../models/model_new_companies');
const client = require('../models/model_clients');
const check_auth = require('../check_auth');

module.exports = server => {
	
	// Get clients
	
	server.get('/clients/all', check_auth, async (req, res, next) => {
		try {
			const clients = await client.find({idCompany: req.companyId});
			res.send({clients});
			next();
		} catch (err) {
			return next(new errors.InvalidContentError(err));
		}
	});
	
	// Get Single client
	
	server.get('/client/:id', check_auth, async (req, res, next) => {
		try {
			const yourclient = await client.findById(req.params.id);
			res.send(yourclient);
			next();
		} catch (err) {
			return next(new errors.ResourceNotFoundError(`There is no client with your request parameter`));
		}
	});
	
	// Add client
	
	server.post('/client/register', check_auth, async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			return next(new errors.InvalidContentError("Expects 'application/json'"));
		}
		const {idCompany = req.companyId, name = req.body, secteur = req.body, siret = req.body, phone = req.body} = req.body;
		const yourclient = new client({
			idCompany,
			name,
			secteur,
			siret,
			phone
		});
		try {
			const newclient = await yourclient.save();
			res.send(newclient);
			next();
		} catch (err) {
			return next(new errors.InternalError(err.message));
		}
	});
	
	// Update client
	
	server.put('/client/update/:id', check_auth, async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			return next(new errors.InvalidContentError("Expects 'application/json'"));
		}
		try {
			const yourClient = await client.findById({_id: req.params.id});
			const updateClient = await client.findOneAndUpdate({_id: yourClient._id}, req.body);
			const thisclient = await client.findById(updateClient.id);
			res.send(thisclient);
			next();
		} catch (err) {
			console.log(err);
			return next(new errors.ResourceNotFoundError(`There is no client with your request parameter`));
		}
	});
	
	//Delete Companies
	
	server.del('/client/delete/:id', check_auth, async (req, res, next) => {
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
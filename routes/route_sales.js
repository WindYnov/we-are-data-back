const errors = require('restify-errors');
const new_company = require('../models/model_new_companies');
const sale = require('../models/model_clients');
const check_auth = require('../check_auth');

module.exports = server => {
	
	// Get sales
	
	server.get('/sales/all', check_auth, async (req, res, next) => {
		try {
			const {idClient} = req.body;
			const sales = await sale.find({idClient: req.body});
			res.send({sales});
			next();
		} catch (err) {
			return next(new errors.InvalidContentError(err));
		}
	});
	
	// Get Single sale
	
	server.get('/sale/:id', check_auth, async (req, res, next) => {
		try {
			const sale = await sale.findById(req.params.id);
			res.send(sale);
			next();
		} catch (err) {
			return next(new errors.ResourceNotFoundError(`There is no sale with your request parameter`));
		}
	});
	
	// Add sale
	
	server.post('/sale/register', check_auth, async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			return next(new errors.InvalidContentError("Expects 'application/json'"));
		}
		const {idClient, dateFacture, productName, totalHt, tauxTva, qteVendue, productsType, activityArea} = req.body;
		const sale = new sale({
			idClient, dateFacture, productName, totalHt, tauxTva, qteVendue, productsType, activityArea
		});
		try {
			const sale = await sale.save();
			res.send(sale);
			next();
		} catch (err) {
			return next(new errors.InternalError(err.message));
		}
	});
	
	// Update sale
	
	server.put('/sale/update/:id', check_auth, async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			return next(new errors.InvalidContentError("Expects 'application/json'"));
		}
		try {
			const yourSale = await sale.findById({_id: req.params.id});
			const updateSale = await sale.findOneAndUpdate({_id: yourSale._id}, req.body);
			const sale = await sale.findById(updateSale.id);
			res.send(sale);
			next();
		} catch (err) {
			console.log(err);
			return next(new errors.ResourceNotFoundError(`There is no sale with your request parameter`));
		}
	});
	
	//Delete Companies
	
	server.del('/sale/delete/:id', check_auth, async (req, res, next) => {
		try {
			const yourSale = await sale.findById({_id: req.params.id});
			const deleteSale = await sale.findOneAndRemove({_id: yourSale._id});
			res.send(deleteSale);
			return next(`Sale deleted successfully`);
		} catch (err) {
			return next(new errors.ResourceNotFoundError(`There is no sale for deleted with your request parameter`));
		}
	});
};
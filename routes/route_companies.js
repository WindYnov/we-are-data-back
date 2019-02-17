const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const company = require('../models/model_companies');
const new_company = require('../models/model_new_comapnies');


module.exports = server => {
	
	// Get Companies
	
	server.get('/companies/all', async (req, res, next) => {
		try {
			const your_v1company = await company.find({});
			const your_v2company = await new_company.find({});
			res.send({your_v1company, your_v2company});
			next();
		} catch (err) {
			return next(new errors.InvalidContentError(err));
		}
	});
	
	// Get Single Company
	
	server.get('/companies/:id', async (req, res, next) => {
		try {
			const your_v1company = await company.findById(req.params.id);
			const your_v2company = await new_company.findById(req.params.id);
			res.send(your_v1company || your_v2company);
			next();
		} catch (err) {
			return next(new errors.ResourceNotFoundError(`There is no customer with your request parameter`));
		}
	});
	
	// Add Company V1
	
	server.post('/companies/register', async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			return next(new errors.InvalidContentError("Expects 'application/json'"));
		}
		const {name, firstname, societe, siret, email, phone, keepInformed} = req.body;
		const yourcompany = new company({
			name,
			firstname,
			societe,
			siret,
			email,
			phone,
			keepInformed
		});
		try {
			const newcompany = await yourcompany.save();
			res.send(newcompany);
			next();
		} catch (err) {
			return next(new errors.InternalError(err.message));
		}
	});
	
	// Add Company V2
	
	server.post('/companies/new/register', async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			return next(new errors.InvalidContentError("Expects 'application/json'"));
		}
		const {name, firstname, societe, siret, email, phone, password, keepInformed} = req.body;
		const yourcompany = new new_company({
			name,
			firstname,
			societe,
			siret,
			email,
			phone,
			password,
			keepInformed
		});
		bcrypt.genSalt(10, (errors, salt) => {
			bcrypt.hash(yourcompany.password, salt, async (err, hash) => {
				
				// Hash Password
				yourcompany.password = hash;
				// Save Company
				try {
					const newcompany = await yourcompany.save();
					res.send(newcompany);
					next();
				} catch (err) {
					return next(new errors.InternalError(err.message));
				}
			});
		});
	});
	
	// Update Company
	
	server.put('/companies/update/:id', async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			return next(new errors.InvalidContentError("Expects 'application/json'"));
		}
		try {
			const data1 = await company.findById({_id: req.params.id});
			const data2 = await new_company.findById({_id: req.params.id});
			if (data1) {
				const updatecompany = await company.findOneAndUpdate({_id: data1._id}, req.body);
				const yourcompany = await company.findById(updatecompany.id);
				
				bcrypt.genSalt(10, (errors, salt) => {
					bcrypt.hash(yourcompany.password, salt, async (err, hash) => {
						
						// Hash Password
						yourcompany.password = hash;
						// Save Company
						try {
							const updatedcompany = await yourcompany.save();
							res.send(updatedcompany);
							next();
						} catch (err) {
							return next(new errors.InternalError(err.message));
						}
					});
				});
			} else if (data2) {
				const updatecompany = await new_company.findOneAndUpdate({_id: data2._id}, req.body);
				const yourcompany = await new_company.findById(updatecompany.id);
				
				bcrypt.genSalt(10, (errors, salt) => {
					bcrypt.hash(yourcompany.password, salt, async (err, hash) => {
						
						// Hash Password
						yourcompany.password = hash;
						// Save Company
						try {
							const updatedcompany = await yourcompany.save();
							res.send(updatedcompany);
							next();
						} catch (err) {
							return next(new errors.InternalError(err.message));
						}
					});
				});
			} else {
				return next(new errors.ResourceNotFoundError(`There is no data to update for this company`));
			}
		} catch (err) {
			console.log(err);
			return next(new errors.ResourceNotFoundError(`There is no customer with your request parameter`));
		}
	});
	
	//Delete Companies
	
	server.del('/companies/delete/:id', async (req, res, next) => {
		try {
			const data1 = await company.findById({_id: req.params.id});
			const data2 = await new_company.findById({_id: req.params.id});
			if (data1) {
				const deletecompany = await company.findOneAndRemove({_id: data1._id});
				res.send(deletecompany);
				return next(`Company deleted successfully`);
			} else if (data2) {
				const deletecompany = await new_company.findOneAndRemove({_id: data2._id});
				res.send(deletecompany);
				return next(`Company deleted successfully`);
			} else {
				return next(new errors.ResourceNotFoundError(`There is no data to deleted for this company`));
			}
		} catch (err) {
			return next(new errors.ResourceNotFoundError(`There is no customer for deleted with your request parameter`));
		}
	});
};
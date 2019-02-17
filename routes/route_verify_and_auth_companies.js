const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verif = require('../verification');
const config = require('../config');
const model_company = require('../models/model_companies');

module.exports = server => {
	
	// Verify companies
	
	server.post('/companies/verify', async (req, res, next) => {
		try {
			const {email} = req.body;
			// Verify and create or not password
			const company = await verif.verify(email);
			console.log(company);
			if (!company.password) {
				res.send({verified: true, alreadyRegistered: false});
			}
			res.send({verified: true, alreadyRegistered: true});
		} catch (err) {
			// No match company
			console.log(err);
			return next(new errors.UnauthorizedError(err))
		}
	});
	
	server.post('/companies/finalised', async (req, res, next) => {
		try {
			const {email, password} = req.body;
			// Verify and update password
			let company = await verif.verify(email);
			if (!company.password) {
				const updatecompany = await model_company.findOneAndUpdate({_id: company._id}, req.body);
				const yourcompany = await model_company.findById(updatecompany.id);
				bcrypt.hash(yourcompany.password, 10, async (err, hash) => {
						yourcompany.password = hash;
						// Save Company
						try {
							company = await yourcompany.save();
							const token = jwt.sign(
								{
									emailToToken: company.email,
									idToToken: company._id
								},
								config.JWT_SECRET,
								{
									expiresIn: "1h"
								});
							return res.send({
								message: "Finalisation of registration success",
								token: token
							});
						} catch (err) {
							return next(new errors.InternalError(err.message));
						}
					});
			}
		} catch (err) {
			console.log(err);
			return next(new errors.UnauthorizedError(err))
		}
	});
};
const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verif = require('../verification');
const config = require('../config');
const model_company = require('../models/model_companies');
const model_new_company = require('../models/model_new_companies');

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
				const yourcompany = await model_company.findById(updatecompany._id);
				bcrypt.hash(yourcompany.password, 10, async (err, hash) => {
					if (err) {
						console.log(err);
						return res.send({message: "Finalisation of registration fail", err})
					}
						yourcompany.password = hash;
						// Save Company
						try {
							company = await yourcompany.save();
							const token = jwt.sign({
									emailToToken: company.email,
									idToToken: company._id
								},
								config.JWT_SECRET,
								{
									expiresIn: "1h"
								});
							const newUpdateCompany = await model_company.findOneAndUpdate({
								_id: company._id,
								yourToken: token
							});
							return res.send({
								message: "Finalisation of registration success",
								token: token
							});
						} catch (err) {
							return next(new errors.InternalError(err.message));
						}
					});
			} else {
				return res.send({
					email: "valid",
					password: "already exist",
					message: "The password of the account already exists, connected to your account"
				});
			}
		} catch (err) {
			console.log(err);
			return next(new errors.UnauthorizedError(err))
		}
	});
	
	server.post('/companies/login', async (req, res, next) => {
		try {
			let company = await verif.verify(req.body.email);
			bcrypt.compare(req.body.password, company.password, async (err, resul) => {
				if (err) {
					return next(res.send({
						auth: false,
						message: "Errors encountered. Authentication fail, verify email or password"
					}));
				}
				if (resul) {
					if (company.levelup === "v1") {
						company = await model_company.findById(company._id);
						const token = jwt.sign({
								emailToToken: company.email,
								idToToken: company._id
							},
							config.JWT_SECRET,
							{
								expiresIn: "1h"
							});
						company = await model_company.findOneAndUpdate({
							_id: company._id,
							yourToken: token
						});
						return next(res.send({
							auth: true,
							token: token,
							message: "Authentication success"
						}));
					}
					if (company.levelup === "v2") {
						company = await model_new_company.findById(company._id);
						const token = jwt.sign({
								emailToToken: company.email,
								idToToken: company._id
							},
							config.JWT_SECRET,
							{
								expiresIn: "1h"
							});
						company = await model_new_company.findOneAndUpdate({
							_id: company._id,
							yourToken: token
						});
						return next(res.send({
							auth: true,
							token: token,
							message: "Authentication success"
						}));
					}
					return next(res.send({
						auth: false,
						message: "Errors encountered. Level of company not register contact support"
					}));
				}
				return next(res.send({
					auth: false,
					message: "Errors encountered. Authentication fail, verify email or password"
				}));
			})
			
		} catch (err) {
			console.log(err);
			return next(res.send({
				auth: false,
				message: "Authentication fail, verify email or password",
				err: err
			}));
		}
	});
};
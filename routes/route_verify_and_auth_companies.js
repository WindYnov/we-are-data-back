const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verif = require('../verification');
const config = require('../config');
const model_company = require('../models/model_companies');
const model_new_company = require('../models/model_new_companies');

	
	// Verify companies
	
	router.post('/verify', async (req, res, next) => {
		try {
			const {email} = req.body;
			// Verify and create or not password
			const company = await verif.verify(email);
			if (!company.password) {
				res.status(200).send({verified: true, alreadyRegistered: false});
			}
			res.status(200).send({verified: true, alreadyRegistered: true});
		} catch (err) {
			// No match company
			res.status(500);
			return next({message: "Email not found in data base", err});
		}
	});
	
	router.post('/finalised', async (req, res, next) => {
		try {
			const {email, password} = req.body;
			// Verify and update password
			let company = await verif.verify(email);
			if (!company.password) {
				const updatecompany = await model_company.findOneAndUpdate({_id: company._id}, req.body);
				const yourcompany = await model_company.findById(updatecompany._id);
				bcrypt.hash(yourcompany.password, 10, async (err, hash) => {
					if (err) {
						res.status(500).send({message: "Finalisation of registration fail", err});
						return next();
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
							return res.status(200).send({
								message: "Finalisation of registration success",
								token: token
							});
						} catch (err) {
							res.status(500);
							return next({message: err});
						}
					});
			} else {
				return res.status(200).send({
					email: "valid",
					password: "already exist",
					message: "The password of the account already exists, connected to your account"
				});
			}
		} catch (err) {
			res.status(500);
			return next({message: err});
		}
	});
	
	router.post('/login', async (req, res, next) => {
		try {
			let company = await verif.verify(req.body.email);
			bcrypt.compare(req.body.password, company.password, async (err, resul) => {
				if (err) {
					res.status(500);
					return next({
						auth: false,
						message: "Errors encountered. Authentication fail, verify email or password"
					});
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
						res.status(200);
						return next({
							auth: true,
							token: token,
							message: "Authentication success"
						});
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
						res.status(200);
						return next({
							auth: true,
							token: token,
							message: "Authentication success"
						});
					}
					res.status(500);
					return next({
						auth: false,
						message: "Errors encountered. Level of company not register contact support"
					});
				}
				res.status(500);
				return next({
					auth: false,
					message: "Errors encountered. Authentication fail, verify email or password"
				});
			})
			
		} catch (err) {
			res.status(500);
			return next({
				auth: false,
				message: "Authentication fail, verify email or password",
				err
			});
		}
	});

module.exports = router;
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
			// Verify and create or not password
			const company = await verif.verify(req.body.email);
			if (!company.password) {
				res.status(200);
				res.send({verified: true, alreadyRegistered: false});
				next();
			} else {
				res.status(200);
				res.send({verified: true, alreadyRegistered: true});
				next();
			}
		} catch (err) {
			// No match company
			res.status(500);
			res.send({message: "Email not found in data base", err});
			return next();
		}
	});
	
	router.post('/finalised', async (req, res, next) => {
		try{
		const company = await verif.verify(req.body.email);
		if (company) {
			if (!company.password) {
				bcrypt.hash(req.body.password, 10, async (err, hash) => {
					if (err) {
						res.status(500);
						res.send({
							password: "Not enter",
							message: "Finalisation of registration fail, Enter a good password please",
							err
						});
						next();
					} else {
						const update = await model_company.findOneAndUpdate({_id: company._id}, {password: hash});
						try {
							const token = jwt.sign({
									emailToToken: company.email,
									idToToken: company._id
								},
								config.JWT_SECRET,
								{
									expiresIn: "1h"
								});
							const newUpdate = await model_company.findOneAndUpdate(
								{_id: company._id},
								{yourToken: token}
							);
							res.status(200);
							res.send({
								finalised: true,
								message: "Password Create Success, Finalisation of registration success",
								token: token
							});
							next();
						} catch (err) {
							res.status(500);
							res.send({
								finalised: false,
								message: "Finalisation of registration fail, encountered problem",
								err
							});
							return next();
						}
					}
				});
			} else {
				res.status(500);
				res.send({
					password: "Already exist",
					message: "Can't finalised your registration, password already exist in your account, Please Login to your account"
				});
				next();
			}
			
		} else {
			res.status(200);
			res.send({
				email: "Not Found",
				message: "Data not found, finalised fail"
			});
			next();
		}
	}catch {
			res.status(500);
			res.send({
				email: "Not Found",
				message: "Data not found, finalised fail, check the data enter"
			});
			return next();
}

	});
	
	router.post('/login', async (req, res, next) => {
		try {
			let company = await verif.verify(req.body.email);
			if (company) {
			bcrypt.compare(req.body.password, company.password, async (err, resul) => {
				if (err) {
					res.status(500);
					res.send({
						auth: false,
						message: "Errors encountered. Authentication fail, verify email or password"
					});
					next();
				}
				else if (resul) {
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
						res.send({
							auth: true,
							token: token,
							message: "Authentication success"
						});
						next();
					}
					else if (company.levelup === "v2") {
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
						res.send({
							auth: true,
							token: token,
							message: "Authentication success"
						});
						next();
					} else{
						res.status(500);
						res.send({
							auth: false,
							message: "Errors encountered. Level of company not register contact support"
						});
						next();
					}
					
				} else{
					res.status(500);
					res.send({
						auth: false,
						message: "Errors encountered. Authentication fail, verify email or password"
					});
					next();
				}
				
			})
			} else {
				res.status(500);
				res.send({
					auth: false,
					message: "Errors encountered. Authentication fail, verify email or password"
				});
				next();
			}
		} catch (err) {
			res.status(500);
			res.send({
				auth: false,
				message: "Authentication fail, verify email or password",
				err
			});
			return next();
		}
	});

module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const company = require('../models/model_companies');
const new_company = require('../models/model_new_companies');
const check_auth = require('../check_auth');
	
	// Get Companies
	
	router.get('/all', check_auth, async (req, res, next) => {
		try {
			const your_v1company = await company.find({});
			const your_v2company = await new_company.find({});
			res.status(200).send({your_v1company, your_v2company});
			next();
		} catch (err) {
			res.status(500);
			return next({message: "Request error!", err});
		}
	});
	
	// Get Single Company
	
	router.get('/:id', check_auth, async (req, res, next) => {
		try {
			const your_v1company = await company.findById(req.params.id);
			const your_v2company = await new_company.findById(req.params.id);
			res.status(200).send(your_v1company || your_v2company);
			next();
		} catch (err) {
			res.status(500);
			return next("There is no customer with your request parameter");
		}
	});
	
	// Add Company V1
	
	router.post('/register', async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			res.status(500).send("Expects 'application/json");
			return next();
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
			res.status(200).send(newcompany);
			next();
		} catch (err) {
			res.status(500);
			return next({message: err});
		}
	});
	
	// Add Company V2
	
	router.post('/new/register', async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			res.status(500).send("Expects 'application/json'");
			return next();
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
					res.status(200).send(newcompany);
					next();
				} catch (err) {
					res.status(500);
					return next({message: err});
				}
			});
		});
	});
	
	// Update Company
	
	router.put('/update/:id', check_auth, async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			res.status(500).send("Expects 'application/json'");
			return next();
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
							res.status(200).send(updatedcompany);
							next();
						} catch (err) {
							res.status(500);
							return next({message: err});
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
							res.status(200).send(updatedcompany);
							next();
						} catch (err) {
							res.status(500);
							return next({message: err});
						}
					});
				});
			} else {
				res.status(500).send({message: `There is no data to update for this company`});
			}
		} catch (err) {
			res.status(500);
			return next({message: `There is no customer with your request parameter`, err});
		}
	});
	
	//Delete Companies
	
	router.delete('/delete/:id', check_auth, async (req, res, next) => {
		try {
			const data1 = await company.findById({_id: req.params.id});
			const data2 = await new_company.findById({_id: req.params.id});
			if (data1) {
				const deletecompany = await company.findOneAndRemove({_id: data1._id});
				res.status(200).send(deletecompany);
				return next(`Company deleted successfully`);
			} else if (data2) {
				const deletecompany = await new_company.findOneAndRemove({_id: data2._id});
				res.status(200).send(deletecompany);
				return next(`Company deleted successfully`);
			} else {
				res.status(500).send(`There is no data to deleted for this company`);
			}
		} catch (err) {
			res.status(500);
			next({message: `There is no customer for deleted with your request parameter`, err});
		}
	});
	
	module.exports = router;
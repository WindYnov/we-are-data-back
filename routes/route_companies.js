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
			res.status(200);
			res.send({your_v1company, your_v2company});
			next();
		} catch (err) {
			res.status(500);
			res.send({message: "Request error!", err});
			return next();
		}
	});
	
	// Get Single Company
	
	router.get('/:id', check_auth, async (req, res, next) => {
		try {
			const your_v1company = await company.findById(req.params.id);
			const your_v2company = await new_company.findById(req.params.id);
			res.status(200);
			res.send(your_v1company || your_v2company);
			next();
		} catch (err) {
			res.status(500);
			res.send("There is no customer with your request parameter");
			return next();
		}
	});
	
	// Add Company V1
	
	router.post('/register', async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			res.status(500);
			res.send("Expects 'application/json");
			next();
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
			res.status(200);
			res.send(newcompany);
			next();
		} catch (err) {
			res.status(500);
			res.send({error: err});
			return next();
		}
	});
	
	// Add Company V2
	
	router.post('/new/register', async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			res.status(500);
			res.send("Expects 'application/json'");
			next();
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
					res.status(200);
					res.send(newcompany);
					next();
				} catch (err) {
					res.status(500);
					res.send({error: err});
					return next();
				}
			});
		});
	});
	
	// Update Company
	
	router.put('/update/:id', check_auth, async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			res.status(500);
			res.send("Expects 'application/json'");
			next();
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
							res.send({error: err});
							return next();
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
							res.status(200);
							res.send(updatedcompany);
							next();
						} catch (err) {
							res.status(500);
							res.send({error: err});
							return next();
						}
					});
				});
			} else {
				res.status(500);
				res.send({message: `There is no data to update for this company`});
				next();
			}
		} catch (err) {
			res.status(500);
			res.send({message: `There is no customer with your request parameter`, err});
			return next();
		}
	});
	
	//Delete Companies
	
	router.delete('/delete/:id', check_auth, async (req, res, next) => {
		try {
			const data1 = await company.findById({_id: req.params.id});
			const data2 = await new_company.findById({_id: req.params.id});
			if (data1) {
				const deletecompany = await company.findOneAndRemove({_id: data1._id});
				res.status(200);
				res.send({message: `Company deleted successfully`, deletecompany});
				next();
			} else if (data2) {
				const deletecompany = await new_company.findOneAndRemove({_id: data2._id});
				res.status(200);
				res.send({message: `Company deleted successfully`, deletecompany});
				next();
			} else {
				res.status(500);
				res.send(`There is no data to deleted for this company`);
				next();
			}
		} catch (err) {
			res.status(500);
			res.send({message: `There is no customer for deleted with your request parameter`, err});
			return next();
		}
	});
	
	module.exports = router;
const express = require('express');
const router = express.Router();
const client = require('../models/model_clients');
const check_auth = require('../check_auth');

	
	// Get clients
	
	router.get('/all', check_auth, async (req, res, next) => {
		try {
			const clients = await client.find({idCompany: req.companyId});
			res.status(200);
			res.send({clients});
			next();
		} catch (err) {
			res.status(500);
			res.send({error: err});
			return next();
		}
	});
	
	// Get Single client
	
	router.get('/:id', check_auth, async (req, res, next) => {
		try {
			const yourclient = await client.findById(req.params.id);
			res.status(200);
			res.send(yourclient);
			next();
		} catch (err) {
			res.status(500);
			res.send({message: `There is no client with your request parameter`, err});
			return next();
		}
	});
	
	// Add client
	
	router.post('/register', check_auth, async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			res.status(500);
			res.send("Expects 'application/json'");
			next();
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
			res.status(200);
			res.send(newclient);
			next();
		} catch (err) {
			res.status(500);
			res.send({error: err});
			return next();
		}
	});
	
	// Update client
	
	router.put('/update/:id', check_auth, async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			res.status(500);
			res.send("Expects 'application/json'");
			next();
		}
		try {
			const yourClient = await client.findById({_id: req.params.id});
			const updateClient = await client.findOneAndUpdate({_id: yourClient._id}, req.body);
			const thisclient = await client.findById(updateClient.id);
			res.status(200).send(thisclient);
			next();
		} catch (err) {
			res.status(500);
			res.send({message: `There is no client with your request parameter`, err});
			return next();
		}
	});
	
	//Delete Companies
	
	router.delete('/delete/:id', check_auth, async (req, res, next) => {
		try {
			const yourClient = await client.findById({_id: req.params.id});
			const deleteClient = await client.findOneAndRemove({_id: yourClient._id});
			res.status(200);
			res.send({message: `Client deleted successfully`, deleteClient});
			next();
		} catch (err) {
			res.status(500);
			res.send({message: `There is no client for deleted with your request parameter`, err});
			return next();
		}
	});

module.exports = router;
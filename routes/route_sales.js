const express = require('express');
const router = express.Router();
const new_company = require('../models/model_new_companies');
const sale = require('../models/model_clients');
const check_auth = require('../check_auth');

	
	// Get sales
	
	router.get('/all', check_auth, async (req, res, next) => {
		try {
			const {idClient} = req.body;
			const sales = await sale.find({idClient: req.body});
			res.status(200).send({sales});
			next();
		} catch (err) {
			res.status(500);
			return next({message: err});
		}
	});
	
	// Get Single sale
	
	router.get('/:id', check_auth, async (req, res, next) => {
		try {
			const sale = await sale.findById(req.params.id);
			res.status(200).send(sale);
			next();
		} catch (err) {
			res.status(500);
			return next({message: `There is no sale with your request parameter`, err});
		}
	});
	
	// Add sale
	
	router.post('/register', check_auth, async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			res.status(500).send("Expects 'application/json'");
			return next();
		}
		const {idClient, dateFacture, productName, totalHt, tauxTva, qteVendue, productsType, activityArea} = req.body;
		const sale = new sale({
			idClient, dateFacture, productName, totalHt, tauxTva, qteVendue, productsType, activityArea
		});
		try {
			const sale = await sale.save();
			res.status(200).send(sale);
			next();
		} catch (err) {
			res.status(500);
			return next({message: err});
		}
	});
	
	// Update sale
	
	router.put('/update/:id', check_auth, async (req, res, next) => {
		// Check for JSON
		if (!req.is('application/json')) {
			return next(new errors.InvalidContentError("Expects 'application/json'"));
		}
		try {
			const yourSale = await sale.findById({_id: req.params.id});
			const updateSale = await sale.findOneAndUpdate({_id: yourSale._id}, req.body);
			const sale = await sale.findById(updateSale.id);
			res.status(200).send(sale);
			next();
		} catch (err) {
			res.status(500);
			return next({message:`There is no sale with your request parameter`, err});
		}
	});
	
	//Delete Companies
	
	router.delete('/delete/:id', check_auth, async (req, res, next) => {
		try {
			const yourSale = await sale.findById({_id: req.params.id});
			const deleteSale = await sale.findOneAndRemove({_id: yourSale._id});
			res.status(200).send(deleteSale);
			next(`Sale deleted successfully`);
		} catch (err) {
			res.status(500);
			return next({message: `There is no sale for deleted with your request parameter`, err});
		}
	});

module.exports = router;